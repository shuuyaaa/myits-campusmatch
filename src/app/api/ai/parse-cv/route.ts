import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractTextFromPdfBuffer, analyzePdfText } from "@/lib/pdf-parser";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(req: NextRequest) {
  try {
    let fileBuffer: Buffer | null = null;
    let fileName = "dokumen_cv.pdf";
    let studentPreset: string | null = null;
    let cvText = "";
    let fileSize = 0;

    const contentType = req.headers.get("content-type") || "";

    // 1. Tangani pengunggahan berkas nyata via FormData
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      fileName = (formData.get("fileName") as string) || file?.name || "dokumen_cv.pdf";
      studentPreset = formData.get("studentPreset") as string | null;
      cvText = (formData.get("cvText") as string) || "";

      if (file) {
        // Validasi Ekstensi Wajib PDF
        const isPdf =
          file.name.toLowerCase().endsWith(".pdf") ||
          file.type === "application/pdf" ||
          file.type === "application/x-pdf";

        if (!isPdf) {
          return NextResponse.json(
            {
              success: false,
              error: "Format berkas tidak valid. Sistem mewajibkan berkas dengan format PDF (.pdf).",
            },
            { status: 400 }
          );
        }

        // Validasi Ukuran Maksimal 100 MB
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            {
              success: false,
              error: `Ukuran berkas terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Batas maksimum adalah 100 MB.`,
            },
            { status: 400 }
          );
        }

        fileSize = file.size;
        fileBuffer = Buffer.from(await file.arrayBuffer());
      }
    } else {
      // Tangani JSON body biasa (mendukung pengiriman buffer base64 dan preset teks)
      const body = await req.json();
      fileName = body.fileName || "dokumen_cv.pdf";
      studentPreset = body.studentPreset || null;
      cvText = body.cvText || "";
      if (body.fileBase64) {
        fileBuffer = Buffer.from(body.fileBase64, "base64");
        fileSize = fileBuffer.length;
      }
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const hasValidKey = apiKey && apiKey !== "your-gemini-api-key-here" && apiKey.length > 10;

    let parsedResult = null;
    let engineUsed = "CampusMatch Native PDF NLP Parser";
    let extractedText = cvText;

    // 2. Jika ada berkas PDF asli, ekstrak teks dari stream PDF
    if (fileBuffer) {
      const extractedFromBuffer = extractTextFromPdfBuffer(fileBuffer);
      if (extractedFromBuffer && extractedFromBuffer.trim().length > 0) {
        extractedText = (extractedFromBuffer + " " + cvText).trim();
      }
    }

    // 3. Jika API Key Gemini aktif, coba Gemini Multimodal / Text Engine
    if (hasValidKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Anda adalah AI parser CV profesional untuk myITS CampusMatch.
Analisis berkas CV mahasiswa ini secara mendalam dan kembalikan HANYA format JSON murni tanpa pembungkus markdown/backticks:
{
  "name": "Nama Lengkap Mahasiswa sesuai dokumen",
  "nim": "NIM Mahasiswa jika ditemukan tertulis",
  "university": "Universitas Asal sesuai dokumen (contoh: Universitas Airlangga (UNAIR), Institut Teknologi Sepuluh Nopember (ITS), dll)",
  "faculty": "Fakultas sesuai dokumen",
  "department": "Departemen sesuai dokumen",
  "major": "Departemen / Program Studi",
  "semester": 5,
  "gpa": 3.72,
  "sks": 96,
  "skills": ["Skill1", "Skill2", "Skill3"],
  "softSkills": ["SoftSkill1", "SoftSkill2"],
  "interests": ["Minat1", "Minat2"],
  "achievements": [
    { "id": "ach-1", "title": "Nama Prestasi / Kompetisi", "level": "Nasional", "year": "2025", "organizer": "Penyelenggara" }
  ],
  "experiences": [
    { "id": "exp-1", "title": "Posisi / Jabatan", "organization": "Organisasi / Perusahaan / Kepanitiaan", "duration": "2024-2025", "description": "Deskripsi kontribusi" }
  ],
  "aiSummary": "Ringkasan analisis keunggulan mahasiswa dan kecocokan program rekrutmen",
  "confidenceScore": 97.5
}
Catatan: Ekstrak SEMUA pengalaman baik pengalaman kerja, magang, program proyek, kepanitiaan, maupun kegiatan organisasi dari dokumen secara lengkap.
`;

        let contents: any[] = [];
        if (fileBuffer) {
          // Multimodal PDF Direct Ingestion
          contents = [
            {
              inlineData: {
                data: fileBuffer.toString("base64"),
                mimeType: "application/pdf",
              },
            },
            prompt,
          ];
        } else if (extractedText.length > 30) {
          contents = [`${prompt}\n\nTeks CV:\n${extractedText}`];
        }

        if (contents.length > 0) {
          const result = await model.generateContent(contents);
          const responseText = result.response.text();
          const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
          parsedResult = JSON.parse(cleanedJson);
          engineUsed = "Google Gemini 1.5 Flash (Direct Multimodal API)";
        }
      } catch (geminiErr) {
        console.warn("Gemini call failed or rate limited, using native PDF NLP extractor:", geminiErr);
      }
    }

    // 4. Jika Gemini belum ada/fallback, gunakan Native PDF NLP Analyzer yang membaca teks asli PDF
    if (!parsedResult && (fileBuffer || extractedText.trim().length > 0)) {
      parsedResult = analyzePdfText(extractedText, fileName);
      engineUsed = "CampusMatch Native PDF Engine (Real PDF Text Parser)";
    }

    // 5. Preset khusus tombol sampel HANYA jika pengguna eksplisit menekan tombol sampel
    if (!parsedResult && studentPreset) {
      if (studentPreset === "aisha") {
        parsedResult = {
          name: "Aisha Putri Ramadhani",
          nim: "07211940000002",
          university: "Institut Teknologi Sepuluh Nopember (ITS)",
          faculty: "FTEIC",
          department: "Departemen Teknik Elektro",
          major: "S1 Teknik Elektro",
          semester: 5,
          gpa: 3.78,
          sks: 104,
          skills: ["FPGA", "Verilog", "Embedded Systems", "ROS", "C++", "SystemVerilog", "MATLAB", "Circuit Design"],
          softSkills: ["Scientific Writing", "Research Methodology", "Analytical Thinking", "Team Collaboration"],
          interests: ["Underwater Robotics", "VLSI Design", "Autonomous Vehicles", "Signal Processing"],
          achievements: [
            {
              id: "ach-ai-1",
              title: "Best Paper Award INAPR International Conference 2025",
              level: "Internasional",
              year: "2025",
              organizer: "IEEE Indonesia & INAPR",
            },
          ],
          experiences: [
            {
              id: "exp-ai-1",
              title: "Research Assistant FPGA & Autonomous Navigation",
              organization: "Lab Sistem Tertanam & Robotika FTEIC ITS",
              duration: "2025 - Sekarang",
              description: "Mengembangkan akselerator FPGA untuk pemrosesan sinyal sonar pada autonomous underwater robot.",
            },
          ],
          aiSummary: "Kandidat memiliki profil riset di bidang hardware FPGA dan autonomous underwater robotics.",
          confidenceScore: 98.2,
          engineUsed: "CampusMatch Presets Engine (Sampel)",
        };
      } else if (studentPreset === "haekal") {
        parsedResult = {
          name: "Praditya Haekal Islami Al Haqiqi",
          nim: "07211940000001",
          university: "Institut Teknologi Sepuluh Nopember (ITS)",
          faculty: "FTEIC",
          department: "Departemen Teknik Elektro",
          major: "Departemen Teknik Elektro",
          semester: 5,
          gpa: 3.72,
          sks: 96,
          skills: ["Python", "C++", "Arduino", "Embedded Systems", "Machine Learning", "ROS", "MATLAB", "IoT Architecture", "FreeRTOS"],
          softSkills: ["Leadership", "Public Speaking", "Team Coordination", "Critical Thinking", "Event Management"],
          interests: ["Autonomous Robotics", "Industrial IoT", "Edge AI Computing", "Power Electronics"],
          achievements: [
            {
              id: "ach-ai-1",
              title: "Juara 2 Lomba Robot Line Follower Nasional Regional Jatim",
              level: "Nasional",
              year: "2025",
              organizer: "Komunitas Robotika Jawa Timur & ITS",
            },
          ],
          experiences: [
            {
              id: "exp-ai-1",
              title: "Staff Fungsionaris Riset & Teknologi",
              organization: "HIMATEKTRO ITS (Himpunan Mahasiswa Teknik Elektro)",
              duration: "Februari 2025 - Sekarang",
              description: "Mengoordinasi workshop mikrokontroler Arduino dan IoT untuk mahasiswa baru.",
            },
          ],
          aiSummary: "Kandidat memiliki keahlian unggul dalam sistem tertanam, mikrokontroler, dan IoT industri.",
          confidenceScore: 96.8,
          engineUsed: "CampusMatch Presets Engine (Sampel)",
        };
      }
    }

    // 6. Jika masih null (misalnya file kosong atau teks kosong)
    if (!parsedResult) {
      parsedResult = analyzePdfText("", fileName);
      engineUsed = "CampusMatch Native PDF Engine (Empty/Unparsed)";
    }

    return NextResponse.json({
      success: true,
      data: parsedResult,
      meta: {
        fileName,
        fileSizeBytes: fileSize,
        fileSizeFormatted: fileSize > 0 ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB` : undefined,
        extractedCharacters: extractedText.length,
        engineUsed,
      },
    });
  } catch (err: any) {
    console.error("API error in parse-cv:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Terjadi kendala saat memproses berkas PDF CV.",
      },
      { status: 500 }
    );
  }
}
