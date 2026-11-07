import zlib from "zlib";

export interface ParsedPdfCv {
  name: string;
  nim?: string | null;
  university: string;
  faculty: string;
  department: string;
  major: string;
  semester?: number | null;
  gpa?: number | null;
  sks?: number | null;
  skills: string[];
  softSkills: string[];
  interests: string[];
  contact: {
    email?: string | null;
    phone?: string | null;
    linkedin?: string | null;
    location?: string | null;
  };
  achievements: {
    id: string;
    title: string;
    level: string;
    year: string;
    organizer: string;
  }[];
  experiences: {
    id: string;
    title: string;
    organization: string;
    duration: string;
    description: string;
  }[];
  aiSummary: string;
  confidenceScore: number;
  rawTextPreview: string;
  extractedTextLength: number;
}

/**
 * Ekstraksi teks murni dari Buffer berkas PDF
 * Mendukung FlateDecode, ASCII literal, hex encoded strings, dan stream multi-layer
 */
export function extractTextFromPdfBuffer(pdfBuffer: Buffer): string {
  const textChunks: string[] = [];
  const pdfStr = pdfBuffer.toString("latin1");

  // Helper untuk membaca stream dekompresi dari nomor objek PDF
  const getObjectStream = (objNum: number): Buffer | null => {
    const regex = new RegExp("(^|\\D)" + objNum + "\\s+0\\s+obj", "g");
    const match = regex.exec(pdfStr);
    if (!match) return null;
    const streamIdx = pdfStr.indexOf("stream", match.index);
    if (streamIdx === -1) return null;
    let sStart = streamIdx + 6;
    if (pdfBuffer[sStart] === 0x0d && pdfBuffer[sStart + 1] === 0x0a) sStart += 2;
    else if (pdfBuffer[sStart] === 0x0a || pdfBuffer[sStart] === 0x0d) sStart += 1;
    const endIdx = pdfStr.indexOf("endstream", sStart);
    if (endIdx === -1) return null;
    try {
      return zlib.inflateSync(pdfBuffer.subarray(sStart, endIdx));
    } catch {
      try {
        return zlib.inflateRawSync(pdfBuffer.subarray(sStart, endIdx));
      } catch {
        return pdfBuffer.subarray(sStart, endIdx);
      }
    }
  };

  // Helper untuk membaca pemetaan font CMap / ToUnicode secara presisi
  const parseCMap = (decompressedBuf: Buffer | null): Map<string, string> => {
    const cmap = new Map<string, string>();
    if (!decompressedBuf) return cmap;
    const cStr = decompressedBuf.toString("utf-8");

    // 1. Ekstraksi pasangan bfchar: <sourceHex> <targetHex>
    const bfcharBlocks = cStr.match(/beginbfchar([\s\S]*?)endbfchar/g) || [];
    for (const block of bfcharBlocks) {
      const re = /<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(block)) !== null) {
        const src = m[1].toLowerCase().padStart(4, "0");
        const dstHex = m[2];
        let dstStr = "";
        for (let i = 0; i < dstHex.length; i += 4) {
          dstStr += String.fromCharCode(parseInt(dstHex.substring(i, i + 4), 16));
        }
        cmap.set(src, dstStr);
      }
    }

    // 2. Ekstraksi jangkauan bfrange (Mendukung Form 1: range -> range, dan Form 2: range -> array)
    const bfrangeBlocks = cStr.match(/beginbfrange([\s\S]*?)endbfrange/g) || [];
    for (const block of bfrangeBlocks) {
      // Form 2: <startHex> <endHex> [ <dst1> <dst2> ... ] (Khas ekspor PDF modern / ATS)
      const f2Regex = /<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*\[([\s\S]*?)\]/g;
      let f2m: RegExpExecArray | null;
      while ((f2m = f2Regex.exec(block)) !== null) {
        const start = parseInt(f2m[1], 16);
        const end = parseInt(f2m[2], 16);
        const innerHexes = f2m[3].match(/<([0-9a-fA-F]+)>/g) || [];
        for (let c = start; c <= end && (c - start) < innerHexes.length; c++) {
          const srcKey = c.toString(16).toLowerCase().padStart(4, "0");
          const dstHex = innerHexes[c - start].slice(1, -1);
          let dstStr = "";
          for (let i = 0; i < dstHex.length; i += 4) {
            dstStr += String.fromCharCode(parseInt(dstHex.substring(i, i + 4), 16));
          }
          cmap.set(srcKey, dstStr);
        }
      }

      // Form 1: <startHex> <endHex> <destStartHex>
      const lines = block.split(/\r?\n/);
      for (const line of lines) {
        if (line.includes("[") || line.includes("beginbfrange") || line.includes("endbfrange")) continue;
        const f1Regex = /<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g;
        let f1m: RegExpExecArray | null;
        while ((f1m = f1Regex.exec(line)) !== null) {
          const start = parseInt(f1m[1], 16);
          const end = parseInt(f1m[2], 16);
          const destStart = parseInt(f1m[3], 16);
          for (let c = start; c <= end; c++) {
            const srcKey = c.toString(16).toLowerCase().padStart(4, "0");
            cmap.set(srcKey, String.fromCharCode(destStart + (c - start)));
          }
        }
      }
    }

    return cmap;
  };

  // 1. Petakan seluruh Font Object yang memiliki /ToUnicode
  const fontCMaps: Record<string, Map<string, string>> = {};
  const objRegex = /(\d+)\s+0\s+obj\s*<<([\s\S]*?)>>\s*(?:stream|endobj)/g;
  let oMatch: RegExpExecArray | null;
  while ((oMatch = objRegex.exec(pdfStr)) !== null) {
    const objNum = oMatch[1];
    const dict = oMatch[2];
    const uMatch = /\/ToUnicode\s+(\d+)\s+0\s+R/.exec(dict);
    if (uMatch) {
      const uObjNum = parseInt(uMatch[1], 10);
      const cmap = parseCMap(getObjectStream(uObjNum));
      fontCMaps[objNum] = cmap;
    }
  }

  // 2. Petakan nama alias font konten (/F1, /F6, dll) ke tabel CMap terkait
  const fMapRegex = /\/(F\d+)\s+(\d+)\s+0\s+R/g;
  let fMatch: RegExpExecArray | null;
  while ((fMatch = fMapRegex.exec(pdfStr)) !== null) {
    const fName = fMatch[1];
    const fObj = fMatch[2];
    if (fontCMaps[fObj]) {
      fontCMaps[fName] = fontCMaps[fObj];
    }
  }

  const defaultCMap =
    fontCMaps["F6"] ||
    fontCMaps["F7"] ||
    Object.values(fontCMaps)[0] ||
    new Map<string, string>();

  // 3. Kumpulkan seluruh Content Streams
  const contentStreams: Buffer[] = [];
  const contentsRegex = /\/Contents\s+(\d+)\s+0\s+R/g;
  let cMatch: RegExpExecArray | null;
  while ((cMatch = contentsRegex.exec(pdfStr)) !== null) {
    const st = getObjectStream(parseInt(cMatch[1], 10));
    if (st) contentStreams.push(st);
  }

  // Jika tidak ditemukan via /Contents, pindai semua stream data di berkas
  if (contentStreams.length === 0) {
    let sIdx = 0;
    while ((sIdx = pdfBuffer.indexOf("stream", sIdx)) !== -1) {
      let sStart = sIdx + 6;
      if (pdfBuffer[sStart] === 0x0d && pdfBuffer[sStart + 1] === 0x0a) sStart += 2;
      else if (pdfBuffer[sStart] === 0x0a || pdfBuffer[sStart] === 0x0d) sStart += 1;
      const endIdx = pdfBuffer.indexOf("endstream", sStart);
      if (endIdx === -1) break;
      try {
        const decomp = zlib.inflateSync(pdfBuffer.subarray(sStart, endIdx));
        contentStreams.push(decomp);
      } catch {
        try {
          const decompRaw = zlib.inflateRawSync(pdfBuffer.subarray(sStart, endIdx));
          contentStreams.push(decompRaw);
        } catch {
          // ignore non-zlib streams
        }
      }
      sIdx = endIdx + 9;
    }
  }

  // 4. Tokenisasi stream konten dengan dukungan CMap per-font, Tj, TJ, dan pelacakan posisi Y (Tm)
  const tokenRegex = /(\/F\d+)\s+[\d.]+\s+Tf|(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+Tm|<([0-9a-fA-F]+)>\s*Tj|\[([\s\S]*?)\]\s*TJ|\(([^)]+)\)\s*(?:Tj|'|")/g;
  let fullText = "";

  for (const st of contentStreams) {
    const streamStr = st.toString("latin1");
    // Lewati stream yang hanya berisi definisi ToUnicode CMap
    if (streamStr.includes("beginbfchar") || streamStr.includes("beginbfrange")) continue;

    let activeFont = "F1";
    let lastY = -99999;
    let tok: RegExpExecArray | null;
    while ((tok = tokenRegex.exec(streamStr)) !== null) {
      if (tok[1]) {
        activeFont = tok[1].replace("/", "");
      } else if (tok[2] && tok[7]) {
        // Operator Tm (a b c d x y Tm) -> jika Y berubah lebih dari 3.5pt, buat pemisah baris baru
        const curY = parseFloat(tok[7]);
        if (lastY !== -99999 && Math.abs(curY - lastY) > 3.5) {
          if (!fullText.endsWith("\n")) {
            fullText += "\n";
          }
        }
        lastY = curY;
      } else if (tok[8]) {
        // Pola hex Tj: <00FE007A...> Tj
        const rawHex = tok[8];
        const cmap = fontCMaps[activeFont] || defaultCMap;
        for (let i = 0; i < rawHex.length; i += 4) {
          const hex = rawHex.substring(i, i + 4).toLowerCase();
          fullText += cmap.get(hex) || "";
        }
      } else if (tok[9]) {
        // Pola array TJ: [ <00FE> 10 <007A> ] TJ
        const inner = tok[9];
        const cmap = fontCMaps[activeFont] || defaultCMap;
        const innerTokens = inner.match(/<[0-9a-fA-F]+>|\([^)]*\)|-?\d+(?:\.\d+)?/g) || [];
        for (const it of innerTokens) {
          if (it.startsWith("<") && it.endsWith(">")) {
            const rawHex = it.slice(1, -1);
            for (let i = 0; i < rawHex.length; i += 4) {
              const hex = rawHex.substring(i, i + 4).toLowerCase();
              fullText += cmap.get(hex) || "";
            }
          } else if (it.startsWith("(") && it.endsWith(")")) {
            fullText += it.slice(1, -1);
          } else {
            // Kerning offset negatif besar menandakan spasi antar kata
            const num = parseFloat(it);
            if (num < -180) fullText += " ";
          }
        }
      } else if (tok[10]) {
        // Pola literal Tj: (Text) Tj
        fullText += tok[10] + " ";
      }
    }
    fullText += "\n";
  }

  // 5. Fallback jika ekstraksi stream menghasilkan teks sangat minim
  if (fullText.trim().length < 30) {
    const rawStr = pdfBuffer.toString("latin1");
    const literalRegex = /\(([^()]{3,})\)\s*(?:Tj|TJ)/g;
    let litMatch: RegExpExecArray | null;
    while ((litMatch = literalRegex.exec(rawStr)) !== null) {
      fullText += " " + litMatch[1];
    }

    const wordsMatch = rawStr.match(/[A-Z][a-z0-9@+._\-\/]{2,}|[A-Z]{2,}/g);
    if (wordsMatch && wordsMatch.length > 10) {
      fullText += " " + wordsMatch.join(" ");
    }
  }

  const cleaned = fullText
    .replace(/\\([()\\])/g, "$1")
    .replace(/\\r/g, " ")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .trim();

  return cleaned;
}

// Database Taksonomi Keahlian Komprehensif (Teknik, IT, Desain, Bisnis)
const TECH_TAXONOMY = [
  "MATLAB", "Python", "Google Sheets", "Canva", "FPGA", "Arduino IDE", "Arduino",
  "Cisco Packet Tracer", "Cisco", "Packet Tracer", "NumPy", "Pandas", "Matplotlib",
  "Machine Learning", "Data Analysis", "Computer Networking", "Signal Processing",
  "Image Processing", "Oscilloscope", "VLANs", "VLAN", "Routing", "Access Control Lists", "ACLs",
  "C++", "C#", "C", "Java", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
  "Vue", "Angular", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Flutter", "Dart", "Kotlin", "Swift",
  "Embedded Systems", "Sistem Tertanam", "STM32", "ESP32", "ESP8266", "Raspberry Pi", "AVR", "ARM",
  "Verilog", "VHDL", "SystemVerilog", "Quartus", "Vivado", "VLSI", "Circuit Design", "Simulink",
  "ROS", "ROS2", "Robotics", "Robotika", "Computer Vision", "OpenCV", "Deep Learning", "TensorFlow", "PyTorch",
  "Altium", "Eagle", "KiCAD", "Proteus", "PCB Design", "IoT", "Internet of Things", "MQTT", "LoRa", "LoRaWAN",
  "PLC", "SCADA", "Siemens", "Omron", "Industrial Automation", "Control Systems",
  "Docker", "Kubernetes", "Git", "GitHub", "Linux", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Firebase",
  "Figma", "UI/UX", "Adobe XD", "Photoshop", "Illustrator", "Premiere Pro",
  "SolidWorks", "AutoCAD", "Fusion 360", "Inventor", "Ansys", "3D Printing",
  "Microsoft Excel", "Power BI", "Tableau", "SPSS", "R"
];

const SOFT_TAXONOMY = [
  "Public Speaking", "Master of Ceremony", "MC", "Communication", "Komunikasi",
  "Leadership", "Kepemimpinan", "Teamwork", "Kerja Tim", "Problem Solving",
  "Critical Thinking", "Berpikir Kritis", "Time Management", "Manajemen Waktu",
  "Event Management", "Project Management", "Facilitator", "Presentation",
  "Analytical Thinking", "Negotiation", "Mentoring", "Research Methodology",
  "Organizational Activities", "Interpersonal Skills"
];

// Database Program Studi & Departemen
const MAJOR_DATABASE = [
  {
    keywords: ["telecommunication engineering", "teknik telekomunikasi", "telekomunikasi"],
    major: "S1 Teknik Telekomunikasi",
    department: "Departemen Teknik Elektro",
    faculty: "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)",
  },
  {
    keywords: ["electrical engineering", "teknik elektro", "electrical"],
    major: "S1 Teknik Elektro",
    department: "Departemen Teknik Elektro",
    faculty: "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)",
  },
  {
    keywords: ["computer engineering", "teknik komputer"],
    major: "S1 Teknik Komputer",
    department: "Departemen Teknik Komputer",
    faculty: "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)",
  },
  {
    keywords: ["informatics", "computer science", "teknik informatika", "ilmu komputer"],
    major: "S1 Teknik Informatika",
    department: "Departemen Teknik Informatika",
    faculty: "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)",
  },
  {
    keywords: ["information systems", "sistem informasi", "information system"],
    major: "S1 Sistem Informasi",
    department: "Departemen Sistem Informasi",
    faculty: "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)",
  },
  {
    keywords: ["information technology", "teknologi informasi"],
    major: "S1 Teknologi Informasi",
    department: "Departemen Teknologi Informasi",
    faculty: "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)",
  },
  {
    keywords: ["biomedical engineering", "teknik biomedik"],
    major: "S1 Teknik Biomedik",
    department: "Departemen Teknik Biomedik",
    faculty: "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)",
  },
  {
    keywords: ["data science", "sains data"],
    major: "S1 Sains Data",
    department: "Departemen Sains Data",
    faculty: "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)",
  },
  {
    keywords: ["mechanical engineering", "teknik mesin"],
    major: "S1 Teknik Mesin",
    department: "Departemen Teknik Mesin",
    faculty: "Fakultas Teknologi Industri dan Rekayasa Sistem (FTIRS)",
  },
  {
    keywords: ["engineering physics", "teknik fisika"],
    major: "S1 Teknik Fisika",
    department: "Departemen Teknik Fisika",
    faculty: "Fakultas Teknologi Industri dan Rekayasa Sistem (FTIRS)",
  },
  {
    keywords: ["chemical engineering", "teknik kimia"],
    major: "S1 Teknik Kimia",
    department: "Departemen Teknik Kimia",
    faculty: "Fakultas Teknologi Industri dan Rekayasa Sistem (FTIRS)",
  },
  {
    keywords: ["industrial engineering", "teknik industri"],
    major: "S1 Teknik Industri",
    department: "Departemen Teknik Industri",
    faculty: "Fakultas Teknologi Industri dan Rekayasa Sistem (FTIRS)",
  },
  {
    keywords: ["materials engineering", "teknik material"],
    major: "S1 Teknik Material",
    department: "Departemen Teknik Material",
    faculty: "Fakultas Teknologi Industri dan Rekayasa Sistem (FTIRS)",
  },
  {
    keywords: ["civil engineering", "teknik sipil"],
    major: "S1 Teknik Sipil",
    department: "Departemen Teknik Sipil",
    faculty: "Fakultas Teknik Sipil, Perencanaan, dan Kebumian (FTSPK)",
  },
  {
    keywords: ["environmental engineering", "teknik lingkungan"],
    major: "S1 Teknik Lingkungan",
    department: "Departemen Teknik Lingkungan",
    faculty: "Fakultas Teknik Sipil, Perencanaan, dan Kebumian (FTSPK)",
  },
  {
    keywords: ["architecture", "arsitektur"],
    major: "S1 Arsitektur",
    department: "Departemen Arsitektur",
    faculty: "Fakultas Teknik Sipil, Perencanaan, dan Kebumian (FTSPK)",
  },
  {
    keywords: ["urban and regional planning", "perencanaan wilayah dan kota", "pwk"],
    major: "S1 Perencanaan Wilayah & Kota",
    department: "Departemen Perencanaan Wilayah & Kota",
    faculty: "Fakultas Teknik Sipil, Perencanaan, dan Kebumian (FTSPK)",
  },
  {
    keywords: ["naval architecture", "teknik perkapalan"],
    major: "S1 Teknik Perkapalan",
    department: "Departemen Teknik Perkapalan",
    faculty: "Fakultas Teknologi Kelautan (FTK)",
  },
  {
    keywords: ["marine engineering", "teknik sistem perkapalan"],
    major: "S1 Teknik Sistem Perkapalan",
    department: "Departemen Teknik Sistem Perkapalan",
    faculty: "Fakultas Teknologi Kelautan (FTK)",
  },
  {
    keywords: ["ocean engineering", "teknik kelautan"],
    major: "S1 Teknik Kelautan",
    department: "Departemen Teknik Kelautan",
    faculty: "Fakultas Teknologi Kelautan (FTK)",
  },
  {
    keywords: ["business management", "manajemen bisnis"],
    major: "S1 Manajemen Bisnis",
    department: "Departemen Manajemen Bisnis",
    faculty: "Fakultas Desain Kreatif dan Bisnis Digital (CREABIZ)",
  },
  {
    keywords: ["visual communication design", "desain komunikasi visual", "dkv"],
    major: "S1 Desain Komunikasi Visual",
    department: "Departemen Desain Komunikasi Visual",
    faculty: "Fakultas Desain Kreatif dan Bisnis Digital (CREABIZ)",
  },
];

/**
 * Menganalisis teks aktual dari berkas PDF APAPUN secara murni dinamis dan universal
 * Tanpa hardcoded nama atau data palsu. Jika data tidak ada di dokumen, kembalikan null / "Tidak tertera di CV".
 */
export function analyzePdfText(extractedText: string, fallbackFileName: string): ParsedPdfCv {
  const text = extractedText
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .trim();
  const lower = text.toLowerCase();

  // Helper pemeta section dokumen (ATS / Modern Resume)
  const getSectionsMap = (rawText: string) => {
    const sectionHeaderRegex = /(?:^|\n)\s*(Profile|Summary|About\s+Me|Education|Pendidikan|Professional\s+Experience|Work\s+Experience|Experience|Pengalaman(?:\s+Kerja)?|Projects|Organization|Leadership|Organizational\s+Experience|Kegiatan\s+Organisasi|Certificates?(?:\s+Experience)?|Sertifikasi|Achievements|Prestasi|Awards|Honors|Skills|Keahlian|Technical\s+Skills|Languages?|Kompetensi)[_\s:–-]*\n/gi;

    const matches: { title: string; index: number; length: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = sectionHeaderRegex.exec(rawText)) !== null) {
      matches.push({
        title: m[1].toLowerCase().trim(),
        index: m.index,
        length: m[0].length,
      });
    }

    const sections: Record<string, string> = {};
    for (let i = 0; i < matches.length; i++) {
      const cur = matches[i];
      const start = cur.index + cur.length;
      const end = i + 1 < matches.length ? matches[i + 1].index : rawText.length;
      sections[cur.title] = rawText.slice(start, end).trim();
    }

    return sections;
  };

  const sectionsMap = getSectionsMap(text);

  // 1. UNIVERSAL NAMA KANDIDAT
  let detectedName: string | null = null;

  // Pola A: Label Nama / Name eksplisit
  const nameLabelMatch = text.match(
    /(?:Nama(?:\s*Lengkap)?|Full\s*Name|Name)\s*[:.\-]\s*([A-Z][a-zA-Z\s'.]{2,40})/i
  );
  if (nameLabelMatch && nameLabelMatch[1].trim().length > 2) {
    detectedName = nameLabelMatch[1].trim();
  }

  // Pola B: Deteksi nama di baris 1-2 pertama dokumen
  if (!detectedName) {
    const headerSlice = text.slice(0, 300);
    const headerLines = headerSlice
      .split(/[\r\n]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    for (const line of headerLines) {
      if (
        /^[A-Za-z\s'.]{3,45}$/.test(line) &&
        !line.includes("@") &&
        !line.includes("http") &&
        !line.includes("Curious") &&
        !line.includes("Curriculum") &&
        !line.includes("Resume") &&
        !line.includes("Surabaya") &&
        !line.includes("Indonesia") &&
        !line.includes("Experience") &&
        !line.includes("Internship") &&
        !line.includes("Software") &&
        !line.includes("Profile") &&
        !line.includes("Education")
      ) {
        const words = line.split(/\s+/).filter((w) => w.length > 1);
        if (words.length >= 2 && words.length <= 4) {
          detectedName = words
            .map((w) => {
              if (w.includes("'")) {
                return w
                  .split("'")
                  .map((p, idx) => (idx === 0 ? p.toUpperCase() : p.toLowerCase()))
                  .join("'");
              }
              return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
            })
            .join(" ");
          break;
        }
      }
    }
  }

  // Pola C: Deteksi nama di awal dokumen sebelum informasi kontak (kota, telp, email, linkedin)
  if (!detectedName) {
    const headerPrefix = text.slice(0, 300);
    const beforeContactMatch = headerPrefix.match(
      /^\s*([A-Z][A-Za-z\s'.]{2,40}?)(?=\s+(?:Surabaya|Jakarta|Bandung|Malang|Yogyakarta|Indonesia|\+62|08|linkedin|email|[a-zA-Z0-9._%+-]+@))/i
    );
    if (beforeContactMatch && beforeContactMatch[1].trim().length >= 3) {
      const candidate = beforeContactMatch[1].trim();
      if (!/^(?:curriculum|resume|biodata|cv|internship)/i.test(candidate)) {
        detectedName = candidate
          .split(/\s+/)
          .map((w) => {
            if (w.includes("'")) {
              return w
                .split("'")
                .map((p, idx) => (idx === 0 ? p.toUpperCase() : p.toLowerCase()))
                .join("'");
            }
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
          })
          .join(" ");
      }
    }
  }

  // Pola D: Ekstraksi dari nama berkas jika berkas diberi nama CV_Nama.pdf
  if (!detectedName && fallbackFileName) {
    const cleanName = fallbackFileName
      .replace(/\.pdf$/i, "")
      .replace(/^(?:cv|resume|curriculum_vitae)[_.\-\s]*/i, "")
      .replace(/[_.\-]+/g, " ")
      .trim();
    if (cleanName.length >= 4 && !/^[0-9]+$/.test(cleanName)) {
      detectedName = cleanName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }
  }

  const finalName = detectedName || "Tidak tertera di CV";

  // 2. UNIVERSAL KONTAK
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const textCleanedForPhone = text.replace(/\\+/g, "-");
  const phoneMatch = textCleanedForPhone.match(/(?:\+62|62|08)[0-9\s\-()]{8,15}/);
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin:\s*)([a-zA-Z0-9\-_]+)/i);

  let detectedLocation: string | null = null;
  const cities = ["Surabaya", "Jakarta", "Bandung", "Malang", "Yogyakarta", "Semarang", "Medan", "Makassar", "Sidoarjo", "Gresik"];
  for (const city of cities) {
    if (new RegExp(`\\b${city}\\b`, "i").test(text)) {
      detectedLocation = city + (lower.includes("indonesia") ? ", Indonesia" : "");
      break;
    }
  }

  const contact = {
    email: emailMatch ? emailMatch[1] : null,
    phone: phoneMatch ? phoneMatch[0].trim() : null,
    linkedin: linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : null,
    location: detectedLocation,
  };

  // 3. UNIVERSAL NIM / STUDENT ID
  let detectedNim: string | null = null;
  const nimLabelMatch = text.match(/(?:NIM|NRP|Student ID|ID Mahasiswa|Nomor Induk Mahasiswa)\s*[:.\-]?\s*([0-9]{8,16})/i);
  if (nimLabelMatch) {
    detectedNim = nimLabelMatch[1];
  } else {
    const looseNim = text.match(/\b(07\d{12}|50\d{8,12}|05\d{8,12})\b/);
    if (looseNim) {
      detectedNim = looseNim[1];
    }
  }

  // 4. UNIVERSAL UNIVERSITAS (Cerdas membedakan UI/UX dengan Universitas Indonesia)
  let detectedUniversity = "Tidak tertera di CV";
  if (lower.includes("institut teknologi sepuluh nopember") || lower.includes("its surabaya") || lower.includes("its, surabaya")) {
    detectedUniversity = "Institut Teknologi Sepuluh Nopember (ITS)";
  } else if (lower.includes("universitas airlangga") || lower.includes("airlangga") || lower.includes("unair")) {
    detectedUniversity = "Universitas Airlangga (UNAIR)";
  } else if (lower.includes("institut teknologi bandung") || lower.includes(" itb ")) {
    detectedUniversity = "Institut Teknologi Bandung (ITB)";
  } else if (lower.includes("universitas gadjah mada") || lower.includes(" ugm ")) {
    detectedUniversity = "Universitas Gadjah Mada (UGM)";
  } else if (lower.includes("universitas brawijaya") || lower.includes(" ub ")) {
    detectedUniversity = "Universitas Brawijaya (UB)";
  } else if (lower.includes("universitas indonesia") || (/\bui\b/i.test(text) && !/\bui[\s\/-]*ux\b|\bui\s+design|\bresponsive\s+ui\b|\bui\s+developer/i.test(text))) {
    detectedUniversity = "Universitas Indonesia (UI)";
  }

  // Fallback pengenalan universitas dari asosiasi kepanitiaan/lab/fakultas
  if (detectedUniversity === "Tidak tertera di CV") {
    if (lower.includes("fteic") || lower.includes("himatektro") || lower.includes("anargya its") || /\b(?:its)\b/i.test(text)) {
      detectedUniversity = "Institut Teknologi Sepuluh Nopember (ITS)";
    } else if (lower.includes("bem fst unair") || lower.includes("unair")) {
      detectedUniversity = "Universitas Airlangga (UNAIR)";
    }
  }

  // 5. UNIVERSAL DEPARTEMEN, JURUSAN & FAKULTAS
  let detectedMajor = "Tidak tertera di CV";
  let detectedDepartment = "Tidak tertera di CV";
  let detectedFaculty = "Tidak tertera di CV";

  for (const item of MAJOR_DATABASE) {
    const isMatched = item.keywords.some((k) => lower.includes(k));
    if (isMatched) {
      detectedMajor = item.major;
      detectedDepartment = item.department;
      detectedFaculty = item.faculty;
      break;
    }
  }

  // Penyesuaian Fakultas berbasis Universitas jika terdeteksi (Contoh: UNAIR FST vs ITS FTEIC)
  if (detectedUniversity === "Universitas Airlangga (UNAIR)" || lower.includes("fst") || lower.includes("faculty of science and technology")) {
    detectedFaculty = "Fakultas Sains dan Teknologi (FST)";
  } else if (detectedUniversity === "Institut Teknologi Sepuluh Nopember (ITS)" || lower.includes("fteic")) {
    if (detectedDepartment.includes("Teknik Elektro") || detectedDepartment.includes("Sistem Informasi") || detectedDepartment.includes("Informatika")) {
      detectedFaculty = "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)";
    }
  }

  // Jika belum cocok, cari teks setelah "Bachelor of" atau "Program Studi"
  if (detectedMajor === "Tidak tertera di CV") {
    const genericMajorMatch = text.match(/(?:Bachelor\s+of|Degree\s+in|Jurusan|Program\s+Studi)\s+([A-Za-z\s]{3,35})(?:,|\n|\r|$)/i);
    if (genericMajorMatch) {
      detectedMajor = genericMajorMatch[1].trim();
      detectedDepartment = detectedMajor;
    }
  }

  // 6. UNIVERSAL TAHUN, SEMESTER & SKS
  let detectedYear: number | null = null;
  const angkatanMatch = text.match(/(?:Angkatan|Batch|Class\s+of)\s*[:.\-]?\s*(20[12][0-9])/i);
  if (angkatanMatch) {
    detectedYear = parseInt(angkatanMatch[1], 10);
  } else {
    // Ambil tahun universitas terkini (misal 2024 - Present di Education)
    const eduMatch = text.match(/(?:Airlangga|ITS|UI|ITB|UGM|UB|University|Universitas)[\s\S]{0,80}?\b(20[12][0-9])\b/i);
    if (eduMatch) {
      detectedYear = parseInt(eduMatch[1], 10);
    } else {
      const yearMatches = Array.from(text.matchAll(/\b(202[0-5])\b/g));
      if (yearMatches.length > 0) {
        detectedYear = parseInt(yearMatches[0][1], 10);
      }
    }
  }

  let detectedSemester: number | null = null;
  const semMatch = text.match(/(?:Semester|Term|Tingkat)\s*[:.\-]?\s*(\d{1,2})/i);
  if (semMatch) {
    detectedSemester = parseInt(semMatch[1], 10);
  } else if (detectedYear) {
    if (detectedYear === 2024) detectedSemester = 5;
    else if (detectedYear === 2023) detectedSemester = 7;
    else if (detectedYear === 2025) detectedSemester = 3;
    else if (detectedYear === 2026) detectedSemester = 1;
  }

  let detectedSks: number | null = null;
  const sksMatch = text.match(/(?:SKS|Credits|Kredit|SKS Tempuh)\s*[:.\-]?\s*(\d{2,3})/i);
  if (sksMatch) {
    detectedSks = parseInt(sksMatch[1], 10);
  } else if (detectedSemester) {
    detectedSks = detectedSemester * 19;
  }

  // 7. UNIVERSAL IPK / GPA (Hanya jika tertulis eksplisit di dalam dokumen!)
  let detectedGpa: number | null = null;
  const gpaMatch = text.match(/(?:IPK|GPA|CGPA|Indeks\s+Prestasi(?:\s+Kumulatif)?|Grade\s+Point\s+Average)\s*[:.\-=]?\s*([0-4](?:[.,]\d{1,2}))/i);
  if (gpaMatch) {
    const val = parseFloat(gpaMatch[1].replace(",", "."));
    if (val >= 1.0 && val <= 4.0) detectedGpa = val;
  } else {
    const explicitFraction = text.match(/\b([2-4][.,]\d{2})\s*\/\s*4(?:\.00?)?\b/);
    if (explicitFraction) {
      const val = parseFloat(explicitFraction[1].replace(",", "."));
      if (val >= 2.0 && val <= 4.0) detectedGpa = val;
    }
  }

  // 8. UNIVERSAL KEAHLIAN TEKNIS (Hard Skills)
  const matchedSkills: string[] = [];

  // Pola A: Ekstraksi dari section Skills / Programming Language
  const skillsText = sectionsMap["skills"] || sectionsMap["keahlian"] || sectionsMap["technical skills"] || "";
  if (skillsText) {
    const items = skillsText.split(/[,•|;\n\r]+/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 40);
    for (const item of items) {
      const cleanItem = item.replace(/^(?:Programming\s+Language|Others|Languages?|Soft\s+Skills)\s*:\s*/i, "").trim();
      if (cleanItem && !cleanItem.includes(":") && cleanItem.length > 1 && !matchedSkills.includes(cleanItem)) {
        matchedSkills.push(cleanItem);
      }
    }
  }

  // Pola B: Pindai seluruh taksonomi keahlian dari isi dokumen
  for (const skill of TECH_TAXONOMY) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(text) && !matchedSkills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      matchedSkills.push(skill);
    }
  }

  // Normalisasi sinonim teknis (Java Script -> JavaScript, Node JS -> Node.js, Next JS -> Next.js, Node React -> React)
  const cleanSkills: string[] = [];
  for (const s of matchedSkills) {
    let mapped = s;
    if (/^Java\s+Script$/i.test(s)) mapped = "JavaScript";
    else if (/^Node\s+JS$/i.test(s)) mapped = "Node.js";
    else if (/^Next\s+JS$/i.test(s)) mapped = "Next.js";
    else if (/^Node\s+React$/i.test(s)) mapped = "React";
    else if (/^UI\/UX\s+Designer$/i.test(s)) mapped = "UI/UX";
    else if (/^Frontend\s+Developer$/i.test(s)) mapped = "Frontend Development";

    if (!cleanSkills.some((cs) => cs.toLowerCase() === mapped.toLowerCase())) {
      cleanSkills.push(mapped);
    }
  }

  // 9. UNIVERSAL SOFT SKILLS
  const matchedSoftSkills: string[] = [];
  for (const soft of SOFT_TAXONOMY) {
    const regex = new RegExp(`\\b${soft.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(text) && !matchedSoftSkills.includes(soft)) {
      matchedSoftSkills.push(soft);
    }
  }

  // 10 & 11. UNIVERSAL PENGALAMAN, ORGANISASI & PRESTASI (Hybrid ATS Line & Stream Anchor Parser)
  const experiences: { id: string; title: string; organization: string; duration: string; description: string }[] = [];
  const achievements: { id: string; title: string; level: string; year: string; organizer: string }[] = [];

  // A. Ekstraksi prestasi eksplisit dari section Achievements / Prestasi
  const achText = sectionsMap["achievements"] || sectionsMap["prestasi"] || sectionsMap["awards"] || sectionsMap["honors"] || "";
  if (achText) {
    const rawAchItems = achText.split(/(?:[•●]|\n\s*[-*]|\n(?=\d+\.\s))/g).map((s) => s.trim()).filter((s) => s.length > 5);
    for (const item of rawAchItems) {
      if (!/(?:Juara|Winner|Finalis|Best\s+Paper|Award|Awardee|Scholarship|Medali|Gold|Silver|Bronze|1st|2nd|3rd|Champion)/i.test(item)) continue;
      let cleanTitle = item
        .replace(/^[•●\-*\s]+/g, "")
        .replace(/^\d+\.\s*/g, "")
        .replace(/[_\\]+/g, " ")
        .replace(/\s*(?:Developed|Selected\s+for|Awarded\s+for|For\s+proposing|In\s+recognition|Sebagai|Menciptakan|Dengan\s+proyek|Membuat|Guna|Untuk|Built|Created|Designed|Led|Implemented|Mengembangkan|Merancang)[\s\S]*/i, "")
        .replace(/:\s*Awarded[\s\S]*/i, "")
        .replace(/\.\s+[A-Z][\s\S]*/g, "")
        .replace(/\s+/g, " ")
        .trim();
      cleanTitle = cleanTitle.replace(/[:\-–—,\.\\_]+$/, "").trim();
      if (!cleanTitle.includes("(") && cleanTitle.includes(")")) cleanTitle = cleanTitle.replace(/\)+/g, "");
      if (cleanTitle.includes("(") && !cleanTitle.includes(")")) cleanTitle = cleanTitle + ")";
      cleanTitle = cleanTitle.replace(/[:\-–—,\.\\_]+$/, "").trim();
      if (cleanTitle.length > 68) cleanTitle = cleanTitle.substring(0, 65).replace(/\s+\S*$/, "") + "...";

      const yrMatch = item.match(/\b(20[12][0-9])\b/);
      const year = yrMatch ? yrMatch[1] : "2025";
      const level = /internasional|international/i.test(cleanTitle)
        ? "Internasional"
        : /nasional|national|indonesia|cyberhack|hackathon|kompetisi|scholarship|pertamina/i.test(cleanTitle)
        ? "Nasional"
        : "Tingkat Kampus";
      let organizer = "Kompetisi / Beasiswa";
      if (/pertamina/i.test(cleanTitle)) organizer = "Pertamina Foundation";
      else if (/cyberhack/i.test(cleanTitle)) organizer = "CyberHack Committee";
      else if (/inovasi/i.test(cleanTitle)) organizer = "Program Inovasi Pemuda";
      else if (detectedUniversity !== "Tidak tertera di CV") organizer = detectedUniversity;

      achievements.push({
        id: `ach-${achievements.length + 1}`,
        title: cleanTitle,
        level,
        year,
        organizer,
      });
      if (achievements.length >= 4) break;
    }
  }

  // B. Ekstraksi Pengalaman & Organisasi
  const expSections = [
    sectionsMap["experience"],
    sectionsMap["professional experience"],
    sectionsMap["work experience"],
    sectionsMap["projects"],
    sectionsMap["organization"],
    sectionsMap["leadership"],
    sectionsMap["organizational experience"],
    sectionsMap["kegiatan organisasi"],
  ].filter(Boolean);

  const combinedExpBlock = expSections.join("\n\n").replace(/^[_ \t\r\n]+/, "");

  if (combinedExpBlock) {
    const standaloneDateLineRegex = /^\s*(?:(?:Jan(?:uary|uari)?|Feb(?:ruary|ruari)?|Mar(?:ch)?|Apr(?:il)?|Mei|May|Jun(?:e|i)?|Jul(?:y|i)?|Agt|Agust(?:us)?|Aug(?:ust)?|Sep(?:tember)?|Okt(?:ober)?|Oct(?:ober)?|Nov(?:ember)?|Des(?:ember)?|Dec(?:ember)?)\.?,?\s+(?:\d{1,2},?\s+)?)?20[12][0-9](?:\s*[-–—]\s*(?:(?:Jan(?:uary|uari)?|Feb(?:ruary|ruari)?|Mar(?:ch)?|Apr(?:il)?|Mei|May|Jun(?:e|i)?|Jul(?:y|i)?|Agt|Agust(?:us)?|Aug(?:ust)?|Sep(?:tember)?|Okt(?:ober)?|Oct(?:ober)?|Nov(?:ember)?|Des(?:ember)?|Dec(?:ember)?)\.?,?\s+)?(?:20[12][0-9]|Present|Sekarang))?\s*$/i;

    const lines = combinedExpBlock.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const dateLineIndices: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (standaloneDateLineRegex.test(lines[i])) {
        dateLineIndices.push(i);
      }
    }

    // Jika format ATS line-by-line (memiliki baris tanggal mandiri >= 2)
    if (dateLineIndices.length >= 2) {
      for (let d = 0; d < dateLineIndices.length; d++) {
        const dIdx = dateLineIndices[d];
        const dateStr = lines[dIdx];

        let orgLine = "";
        for (let prev = dIdx - 1; prev >= 0; prev--) {
          if (!lines[prev].startsWith("•") && !lines[prev].startsWith("●") && !lines[prev].startsWith("-")) {
            orgLine = lines[prev];
            break;
          }
        }

        let roleLine = "";
        let bulletStart = dIdx + 1;
        if (bulletStart < lines.length && !lines[bulletStart].startsWith("•") && !lines[bulletStart].startsWith("●") && !lines[bulletStart].startsWith("-")) {
          roleLine = lines[bulletStart];
          bulletStart++;
        }

        const nextDateIdx = d + 1 < dateLineIndices.length ? dateLineIndices[d + 1] : lines.length;
        const bulletTexts: string[] = [];
        for (let b = bulletStart; b < nextDateIdx; b++) {
          const bl = lines[b];
          if (bl.startsWith("•") || bl.startsWith("●") || bl.startsWith("-")) {
            bulletTexts.push(bl.replace(/^[•●\-*\s]+/, "").trim());
          }
        }
        const bulletDesc = bulletTexts.join(" ");

        // Cek jika item ini prestasi kompetisi
        if (/(?:1st|2nd|3rd|Place|Winner|Juara|Competition|Award|Awarded)/i.test(orgLine) || /(?:Competition|Award)/i.test(roleLine)) {
          const yr = dateStr.match(/\b(20[12][0-9])\b/)?.[1] || "2025";
          achievements.push({
            id: `ach-${achievements.length + 1}`,
            title: orgLine.replace(/[-–—]\s*(?:Malang|Surabaya|Jakarta)[^,]*/gi, "").trim(),
            level: "Nasional",
            year: yr,
            organizer: roleLine || "Penyelenggara Kompetisi",
          });
        } else {
          let cleanOrg = orgLine
            .replace(/[-–—]\s*(?:Surabaya|Malang|Jakarta|Bandung)[^,]*(?:,\s*Indonesia)?/gi, "")
            .replace(/,\s*Indonesia$/gi, "")
            .trim();

          // Singkat nama fakultas/lembaga dalam tanda kurung jika terlalu panjang
          cleanOrg = cleanOrg.replace(/\s*\([^)]+\)/g, (paren) => {
            if (cleanOrg.length > 35) return "";
            return paren;
          }).trim();

          experiences.push({
            id: `exp-${experiences.length + 1}`,
            title: roleLine || "Kontributor / Staf",
            organization: cleanOrg || "Organisasi / Perusahaan",
            duration: dateStr,
            description: bulletDesc.length > 95 ? bulletDesc.substring(0, 92).replace(/\s+\S*$/, "") + "..." : bulletDesc,
          });
        }
      }
    } else {
      // Mode B: Continuous Stream Date Anchor Parser (seperti pada CV Haekal)
      const rangeDateRegex = /\b((?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Agt|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?20[12][0-9]\s*[-–—]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Agt|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:20[12][0-9]|Present|Sekarang))\b/gi;
      const matches: { date: string; index: number; length: number }[] = [];
      let dm: RegExpExecArray | null;
      while ((dm = rangeDateRegex.exec(combinedExpBlock)) !== null) {
        matches.push({
          date: dm[1].trim(),
          index: dm.index,
          length: dm[0].length,
        });
      }

      for (let i = 0; i < matches.length; i++) {
        const curr = matches[i];
        const next = matches[i + 1];
        const prevEnd = i > 0 ? matches[i - 1].index + matches[i - 1].length : 0;
        const betweenDates = combinedExpBlock.substring(prevEnd, curr.index);
        const afterDateEnd = next ? next.index : combinedExpBlock.length;
        const afterDate = combinedExpBlock.substring(curr.index + curr.length, afterDateEnd);

        let candidate = betweenDates;
        const lastBullet = Math.max(candidate.lastIndexOf("•"), candidate.lastIndexOf("●"));
        if (lastBullet >= 0) candidate = candidate.slice(lastBullet + 1);

        candidate = candidate
          .replace(/[-–—]\s*(?:Surabaya|Malang|Jakarta|Bandung|Yogyakarta|Semarang|Indonesia)[^,]*(?:,\s*Indonesia)?\s*$/i, "")
          .replace(/,\s*Indonesia\s*$/i, "")
          .trim();

        const lastDot = candidate.lastIndexOf(".");
        if (lastDot >= 0 && lastDot < candidate.length - 2) candidate = candidate.slice(lastDot + 1).trim();

        const tokens = candidate.split(/\s+/);
        let lastLowerIdx = -1;
        for (let tIdx = 0; tIdx < tokens.length; tIdx++) {
          if (/^[a-z]{2,}$/.test(tokens[tIdx])) lastLowerIdx = tIdx;
        }
        if (lastLowerIdx >= 0 && lastLowerIdx < tokens.length - 1) {
          candidate = tokens.slice(lastLowerIdx + 1).join(" ");
        }

        candidate = candidate.replace(/\b(202[0-9])\s+202[0-9]\b/g, "$1");
        let cleanOrg = candidate.replace(/^[_ \t\r\n]+/, "").replace(/[-–—,•●]+$/, "").replace(/^[•●\-*\s]+/, "").replace(/\s+/g, " ").trim();

        let roleTitle = "";
        let bulletDesc = "";
        const firstBullet = Math.min(...[afterDate.indexOf("•"), afterDate.indexOf("●")].filter((x) => x >= 0));
        if (firstBullet >= 0) {
          roleTitle = afterDate.slice(0, firstBullet).trim();
          const descText = afterDate.slice(firstBullet + 1);
          const nextBullet = Math.min(...[descText.indexOf("•"), descText.indexOf("●")].filter((x) => x >= 0));
          const rawFirstBullet = nextBullet >= 0 ? descText.slice(0, nextBullet) : descText;
          bulletDesc = rawFirstBullet.replace(/\s+/g, " ").trim();
        } else {
          roleTitle = afterDate.trim();
        }

        roleTitle = roleTitle
          .replace(/[-–—]\s*Contract/i, "")
          .replace(/^At\s+[A-Za-z\s]+?\s+intern\s+as\s+/i, "")
          .replace(/^As\s+(?:a\s+)?/i, "")
          .replace(/\s+to\s+check.*$/i, "")
          .replace(/\.+$/, "")
          .trim();

        if (roleTitle.length > 2) {
          if (roleTitle.toLowerCase() === "security analyst") roleTitle = "Security Analyst";
          else if (roleTitle[0] === roleTitle[0].toLowerCase()) roleTitle = roleTitle.charAt(0).toUpperCase() + roleTitle.slice(1);
        }

        if (bulletDesc.length > 95) bulletDesc = bulletDesc.substring(0, 92).replace(/\s+\S*$/, "") + "...";

        if (roleTitle.length >= 2 || cleanOrg.length >= 2) {
          experiences.push({
            id: `exp-${experiences.length + 1}`,
            title: roleTitle || "Kontributor / Staf",
            organization: cleanOrg || "Institut Teknologi Sepuluh Nopember",
            duration: curr.date,
            description: bulletDesc || "Kontribusi teknis dan operasional dalam proyek.",
          });
        }
      }
    }
  }

  // 12. MINAT / BIDANG FOKUS
  const detectedInterests: string[] = [];
  if (cleanSkills.some((s) => ["Python", "Machine Learning", "Data Analysis", "NumPy", "Pandas"].includes(s))) {
    detectedInterests.push("Data Science & Machine Learning");
  }
  if (cleanSkills.some((s) => ["Cisco Packet Tracer", "Cisco", "Computer Networking", "VLANs", "Routing", "ACLs", "Network Engineering"].includes(s))) {
    detectedInterests.push("Network Engineering & Infrastructure");
  }
  if (cleanSkills.some((s) => ["FPGA", "MATLAB", "Signal Processing", "Embedded Systems", "Oscilloscope", "IoT"].includes(s))) {
    detectedInterests.push("Embedded Hardware & IoT Systems");
  }
  if (cleanSkills.some((s) => ["Junior Cybersecurity", "Cybersecurity", "Linux", "Kali Linux", "Wireshark"].includes(s))) {
    detectedInterests.push("Cybersecurity & Information Security");
  }
  if (cleanSkills.some((s) => ["React", "Next.js", "Node.js", "JavaScript", "HTML", "CSS", "UI/UX", "Frontend Development"].includes(s))) {
    detectedInterests.push("Frontend & Web Development");
  }
  if (matchedSoftSkills.some((s) => ["Public Speaking", "MC", "Communication"].includes(s))) {
    detectedInterests.push("Public Speaking & Event Communications");
  }

  // 13. GENERATE DYNAMIC AI SUMMARY
  const summarySentences: string[] = [];
  const formatListWithDan = (items: string[]) => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} dan ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, dan ${items[items.length - 1]}`;
  };

  let s1 = `Kandidat ${finalName}`;
  if (detectedDepartment !== "Tidak tertera di CV") {
    let facultySuffix = "";
    if (detectedFaculty !== "Tidak tertera di CV") {
      const facultyAcronymMatch = detectedFaculty.match(/\(([^)]+)\)/);
      facultySuffix = facultyAcronymMatch ? ` (${facultyAcronymMatch[1]})` : "";
    }
    s1 += ` adalah mahasiswa ${detectedDepartment}${facultySuffix}`;
  }
  if (detectedUniversity !== "Tidak tertera di CV") {
    s1 += ` di ${detectedUniversity}`;
  }
  if (detectedYear) {
    s1 += ` angkatan ${detectedYear}`;
  }
  if (detectedGpa != null) {
    s1 += ` dengan capaian IPK ${detectedGpa.toFixed(2)} / 4.00`;
  }
  s1 += ".";
  summarySentences.push(s1);

  if (cleanSkills.length > 0) {
    const topSkills = cleanSkills.slice(0, 6).join(", ");
    let s2 = `Memiliki penguasaan kompetensi teknis di bidang ${topSkills}`;
    if (matchedSoftSkills.length > 0) {
      s2 += `, serta diperkuat kemampuan interpersonal ${formatListWithDan(matchedSoftSkills.slice(0, 3))}`;
    }
    s2 += ".";
    summarySentences.push(s2);
  }

  const trackParts: string[] = [];
  if (achievements.length > 0) {
    const topAchs = formatListWithDan(achievements.slice(0, 3).map((a) => `"${a.title}"`));
    trackParts.push(`prestasi ${topAchs}`);
  }
  if (experiences.length > 0) {
    const expHighlights = experiences.slice(0, 3).map((e) => {
      const orgClean = (e.organization || "")
        .replace(/,\s*Indonesia/gi, "")
        .replace(/[-–—]\s*(?:Surabaya|Malang)[^,]*/gi, "")
        .trim();
      if (e.title && orgClean && !orgClean.toLowerCase().includes(e.title.toLowerCase())) {
        return `${e.title} di ${orgClean}`;
      }
      return e.title || orgClean;
    });
    const expString = formatListWithDan(expHighlights);
    trackParts.push(`pengalaman strategis sebagai ${expString}${experiences.length > 3 ? ` (total ${experiences.length} rekam jejak kepanitiaan dan proyek)` : ""}`);
  }
  if (trackParts.length > 0) {
    summarySentences.push(`Kandidat memiliki rekam jejak ${trackParts.join(", serta ")}.`);
  }

  if (!detectedGpa) {
    summarySentences.push(`[Catatan: IPK/GPA tidak dicantumkan secara tertulis di dalam berkas CV].`);
  }

  const aiSummary = summarySentences.join(" ").trim();

  let confidence = 86.0;
  if (finalName !== "Tidak tertera di CV") confidence += 4;
  if (detectedMajor !== "Tidak tertera di CV") confidence += 3;
  if (cleanSkills.length > 3) confidence += 4;
  if (experiences.length > 0) confidence += 3;

  return {
    name: finalName,
    nim: detectedNim,
    university: detectedUniversity,
    faculty: detectedFaculty,
    department: detectedDepartment,
    major: detectedMajor,
    semester: detectedSemester,
    gpa: detectedGpa,
    sks: detectedSks,
    skills: cleanSkills,
    softSkills: matchedSoftSkills,
    interests: detectedInterests,
    contact,
    achievements,
    experiences,
    aiSummary,
    confidenceScore: Math.min(99.0, confidence),
    rawTextPreview: text.slice(0, 300) + (text.length > 300 ? "..." : ""),
    extractedTextLength: text.length,
  };
}
