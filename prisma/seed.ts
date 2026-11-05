import { PrismaClient, Role, OrgType, OpportunityCategory, OpportunityStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================================
  // 1. ORGANIZATIONS
  // ============================================================

  const himatro = await prisma.organization.upsert({
    where: { slug: "himatro-its" },
    update: {},
    create: {
      name: "HIMATRO ITS",
      slug: "himatro-its",
      type: OrgType.HIMA,
      description:
        "Himpunan Mahasiswa Teknik Elektro Institut Teknologi Sepuluh Nopember. Wadah aspirasi dan pengembangan mahasiswa Teknik Elektro ITS.",
      faculty: "FTEIC",
      department: "Teknik Elektro",
      instagram: "@himatroits",
    },
  });

  const bemFteic = await prisma.organization.upsert({
    where: { slug: "bem-fteic-its" },
    update: {},
    create: {
      name: "BEM FTEIC ITS",
      slug: "bem-fteic-its",
      type: OrgType.BEM,
      description:
        "Badan Eksekutif Mahasiswa Fakultas Teknologi Elektro dan Informatika Cerdas ITS. Organisasi eksekutif tingkat fakultas yang bergerak dalam advokasi dan pengembangan mahasiswa FTEIC.",
      faculty: "FTEIC",
      instagram: "@bemfteicits",
    },
  });

  const ukmRobotika = await prisma.organization.upsert({
    where: { slug: "ukm-robotika-its" },
    update: {},
    create: {
      name: "UKM Robotika ITS (Bayucaraka)",
      slug: "ukm-robotika-its",
      type: OrgType.UKM,
      description:
        "Unit Kegiatan Mahasiswa Robotika ITS, juga dikenal sebagai Bayucaraka ITS. Bergerak di bidang robotika, UAV, UGV, dan underwater robotics. Aktif berkompetisi di tingkat nasional dan internasional.",
      website: "https://bayucaraka.its.ac.id",
      instagram: "@bayucarakaits",
    },
  });

  const ditmawa = await prisma.organization.upsert({
    where: { slug: "ditmawa-its" },
    update: {},
    create: {
      name: "Direktorat Kemahasiswaan ITS",
      slug: "ditmawa-its",
      type: OrgType.DITMAWA,
      description:
        "Direktorat Kemahasiswaan ITS bertanggung jawab atas pengelolaan beasiswa, kegiatan kemahasiswaan, dan pembinaan prestasi mahasiswa.",
      website: "https://www.its.ac.id/kemahasiswaan/",
    },
  });

  const ukmBadminton = await prisma.organization.upsert({
    where: { slug: "ukm-badminton-its" },
    update: {},
    create: {
      name: "UKM Badminton ITS",
      slug: "ukm-badminton-its",
      type: OrgType.UKM,
      description:
        "Unit Kegiatan Mahasiswa Badminton ITS. Wadah bagi mahasiswa ITS yang memiliki minat dan bakat di bidang bulutangkis.",
      instagram: "@ukmbadmintonits",
    },
  });

  const labEmbedded = await prisma.organization.upsert({
    where: { slug: "lab-embedded-robotics-its" },
    update: {},
    create: {
      name: "Lab Sistem Tertanam & Robotika",
      slug: "lab-embedded-robotics-its",
      type: OrgType.LAB,
      description:
        "Laboratorium Sistem Tertanam dan Robotika, Departemen Teknik Elektro ITS. Fokus riset pada embedded systems, FPGA, IoT, dan intelligent robotics.",
      faculty: "FTEIC",
      department: "Teknik Elektro",
    },
  });

  console.log("✅ Organizations seeded");

  // ============================================================
  // 2. DEMO USERS
  // ============================================================

  const studentHaekal = await prisma.user.upsert({
    where: { email: "student1@its.ac.id" },
    update: {},
    create: {
      nim: "07211940000001",
      email: "student1@its.ac.id",
      name: "Haekal Rizky Firmansyah",
      role: Role.STUDENT,
      department: "Teknik Elektro",
      faculty: "FTEIC",
      major: "S1 Teknik Elektro",
      semester: 3,
      gpa: 3.45,
      entryYear: 2024,
      phone: "081234567890",
      bio: "Mahasiswa Teknik Elektro semester 3 yang tertarik di bidang embedded systems dan machine learning. Aktif mengikuti kompetisi robotika tingkat nasional.",
      skills: ["Python", "Arduino", "Machine Learning", "C++"],
      interests: ["Robotics", "IoT", "Artificial Intelligence", "Embedded Systems"],
      achievements: [
        "Juara 2 Lomba Robot Line Follower Regional Jatim 2025",
        "Peserta PKM-KC Didanai 2025",
      ],
      languages: ["Bahasa Indonesia", "English"],
      profileCompleted: true,
    },
  });

  const studentAisha = await prisma.user.upsert({
    where: { email: "student2@its.ac.id" },
    update: {},
    create: {
      nim: "07211940000002",
      email: "student2@its.ac.id",
      name: "Aisha Putri Ramadhani",
      role: Role.STUDENT,
      department: "Teknik Elektro",
      faculty: "FTEIC",
      major: "S1 Teknik Elektro",
      semester: 5,
      gpa: 3.78,
      entryYear: 2022,
      phone: "081298765432",
      bio: "Passionate about FPGA design and embedded systems. Research assistant at Lab Sistem Tertanam. Interested in hardware-software co-design and underwater robotics.",
      skills: ["FPGA", "Verilog", "Embedded Systems", "ROS", "C", "SystemVerilog", "MATLAB"],
      interests: ["Hardware Design", "Underwater Robotics", "VLSI", "Signal Processing"],
      achievements: [
        "Best Paper Award INAPR Conference 2025",
        "Finalis GEMASTIK XVI Kategori Embedded Systems",
        "Asisten Laboratorium Sistem Digital",
      ],
      languages: ["Bahasa Indonesia", "English", "Japanese"],
      profileCompleted: true,
    },
  });

  const adminBudi = await prisma.user.upsert({
    where: { email: "admin@its.ac.id" },
    update: {},
    create: {
      email: "admin@its.ac.id",
      name: "Dr. Budi Santoso, S.T., M.T.",
      role: Role.ADMIN,
      department: "Teknik Elektro",
      faculty: "FTEIC",
      bio: "Dosen Departemen Teknik Elektro ITS, Pembina HIMATRO ITS. Bidang keahlian: Sistem Tenaga Listrik dan Elektronika Daya.",
      profileCompleted: true,
    },
  });

  console.log("✅ Users seeded");

  // ============================================================
  // 3. ORGANIZATION ADMIN MAPPING
  // ============================================================

  await prisma.organizationAdmin.upsert({
    where: {
      userId_organizationId: {
        userId: adminBudi.id,
        organizationId: himatro.id,
      },
    },
    update: {},
    create: {
      userId: adminBudi.id,
      organizationId: himatro.id,
    },
  });

  console.log("✅ Organization admins seeded");

  // ============================================================
  // 4. EXPERIENCES
  // ============================================================

  await prisma.experience.deleteMany({
    where: { userId: { in: [studentHaekal.id, studentAisha.id] } },
  });

  await prisma.experience.createMany({
    data: [
      {
        userId: studentHaekal.id,
        title: "Staff Departemen Riset dan Teknologi",
        organization: "HIMATRO ITS",
        duration: "1 tahun (2025-2026)",
        description:
          "Mengelola kegiatan riset dan pengembangan teknologi di HIMATRO. Mengorganisir workshop Arduino dan IoT untuk mahasiswa baru.",
      },
      {
        userId: studentHaekal.id,
        title: "Peserta Program Kreativitas Mahasiswa",
        organization: "Kemenristekdikti",
        duration: "6 bulan (2025)",
        description:
          "Mengembangkan sistem monitoring kualitas air berbasis IoT untuk tambak ikan di Sidoarjo. PKM-KC didanai.",
      },
      {
        userId: studentAisha.id,
        title: "Asisten Laboratorium Sistem Digital",
        organization: "Departemen Teknik Elektro ITS",
        duration: "1 tahun (2025-2026)",
        description:
          "Membimbing praktikum Sistem Digital, menyiapkan modul praktikum FPGA menggunakan Altera DE2-115, dan menilai laporan mahasiswa.",
      },
      {
        userId: studentAisha.id,
        title: "Research Assistant",
        organization: "Lab Sistem Tertanam & Robotika ITS",
        duration: "6 bulan (2026-sekarang)",
        description:
          "Riset pengembangan sistem navigasi otonom untuk underwater vehicle menggunakan FPGA dan sensor array.",
      },
      {
        userId: studentAisha.id,
        title: "Anggota Divisi Underwater",
        organization: "UKM Robotika ITS (Bayucaraka)",
        duration: "2 tahun (2024-2026)",
        description:
          "Desain dan implementasi sistem kontrol AUV untuk kompetisi MATE ROV internasional.",
      },
    ],
  });

  console.log("✅ Experiences seeded");

  // ============================================================
  // 5. OPPORTUNITIES (12+)
  // ============================================================

  await prisma.opportunity.upsert({
    where: { slug: "staff-himatro-dept-edukasi-2026" },
    update: {},
    create: {
      title: "Staff HIMATRO Departemen Edukasi 2026/2027",
      slug: "staff-himatro-dept-edukasi-2026",
      description:
        "Rekrutmen staff Departemen Edukasi HIMATRO ITS periode 2026/2027. Departemen Edukasi bertanggung jawab atas kegiatan akademik dan tutorial sebaya untuk mahasiswa Teknik Elektro. Tugas meliputi penyelenggaraan kelas tutorial mata kuliah, study group, dan sharing session bersama alumni.",
      category: OpportunityCategory.ORGANIZATION,
      status: OpportunityStatus.OPEN,
      organizationId: himatro.id,
      applicationStart: new Date("2026-11-01"),
      applicationEnd: new Date("2026-12-15"),
      announcementDate: new Date("2026-12-20"),
      quota: 15,
      minGpa: 3.0,
      minSemester: 2,
      maxSemester: 4,
      allowedMajors: ["S1 Teknik Elektro"],
      allowedFaculties: ["FTEIC"],
      benefits: [
        "Sertifikat Keaktifan Organisasi",
        "Pengalaman mengajar dan public speaking",
        "Networking dengan alumni",
        "Poin SKP kemahasiswaan",
      ],
      tags: ["organisasi", "edukasi", "tutorial", "akademik", "mengajar", "teknik elektro"],
      contactEmail: "edukasi@himatro.its.ac.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "staff-bem-fteic-psdm-2026" },
    update: {},
    create: {
      title: "Staff BEM FTEIC Kementerian PSDM 2026/2027",
      slug: "staff-bem-fteic-psdm-2026",
      description:
        "Badan Eksekutif Mahasiswa FTEIC ITS membuka rekrutmen staff untuk Kementerian Pengembangan Sumber Daya Mahasiswa (PSDM). Kementerian PSDM bergerak di bidang softskill development, self-improvement, dan leadership training untuk seluruh mahasiswa FTEIC.",
      category: OpportunityCategory.ORGANIZATION,
      status: OpportunityStatus.OPEN,
      organizationId: bemFteic.id,
      applicationStart: new Date("2026-10-20"),
      applicationEnd: new Date("2026-11-30"),
      announcementDate: new Date("2026-12-05"),
      quota: 20,
      minGpa: 3.0,
      minSemester: 2,
      maxSemester: 6,
      allowedFaculties: ["FTEIC"],
      benefits: [
        "Sertifikat Keaktifan BEM",
        "Leadership training",
        "Jaringan lintas departemen FTEIC",
        "Poin SKP kemahasiswaan",
      ],
      tags: ["organisasi", "BEM", "PSDM", "softskill", "leadership", "FTEIC"],
      contactEmail: "psdm@bemfteic.its.ac.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "beasiswa-keringanan-ukt-its-2026" },
    update: {},
    create: {
      title: "Beasiswa Keringanan UKT ITS Semester Genap 2026/2027",
      slug: "beasiswa-keringanan-ukt-its-2026",
      description:
        "Beasiswa keringanan Uang Kuliah Tunggal (UKT) bagi mahasiswa ITS yang mengalami kesulitan ekonomi. Program ini memberikan potongan UKT sebesar 25%-100% tergantung hasil verifikasi. Pendaftar wajib melampirkan dokumen pendukung yang valid.",
      category: OpportunityCategory.SCHOLARSHIP,
      status: OpportunityStatus.OPEN,
      organizationId: ditmawa.id,
      applicationStart: new Date("2026-11-01"),
      applicationEnd: new Date("2026-12-31"),
      announcementDate: new Date("2027-01-15"),
      minGpa: 3.25,
      requiredDocs: ["KTM", "SKTM", "Transkrip Nilai", "KRS"],
      benefits: ["Potongan UKT 25%-100%"],
      tags: ["beasiswa", "UKT", "keringanan", "ekonomi", "bantuan"],
      contactEmail: "beasiswa@its.ac.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "its-robotic-challenge-2026" },
    update: {},
    create: {
      title: "ITS Robotic Challenge 2026",
      slug: "its-robotic-challenge-2026",
      description:
        "Kompetisi robotika tingkat nasional yang diselenggarakan oleh UKM Robotika ITS. Terdapat 3 kategori: Line Follower, Roboboat, dan Autonomous Drone. Peserta dapat mendaftar secara tim (3-5 orang). Kompetisi berlangsung di Kampus ITS Sukolilo.",
      category: OpportunityCategory.COMPETITION,
      status: OpportunityStatus.UPCOMING,
      organizationId: ukmRobotika.id,
      applicationStart: new Date("2027-01-15"),
      applicationEnd: new Date("2027-02-28"),
      announcementDate: new Date("2027-03-10"),
      requiredSkills: ["Arduino", "ROS", "C++", "Embedded Systems"],
      benefits: [
        "Hadiah total Rp 30.000.000",
        "Sertifikat kompetisi nasional",
        "Networking dengan komunitas robotika Indonesia",
      ],
      tags: ["kompetisi", "robotika", "arduino", "ROS", "drone", "roboboat", "line follower"],
      contactEmail: "robochallenge@bayucaraka.its.ac.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "anggota-ukm-robotika-underwater-2026" },
    update: {},
    create: {
      title: "Anggota UKM Robotika ITS - Divisi Underwater",
      slug: "anggota-ukm-robotika-underwater-2026",
      description:
        "UKM Robotika ITS (Bayucaraka) membuka rekrutmen anggota baru untuk Divisi Underwater. Divisi ini fokus pada pengembangan Autonomous Underwater Vehicle (AUV) dan ROV untuk kompetisi MATE ROV International dan Singapore AUV Challenge. Anggota akan mempelajari desain mekanik, sistem kontrol bawah air, dan computer vision.",
      category: OpportunityCategory.UKM,
      status: OpportunityStatus.OPEN,
      organizationId: ukmRobotika.id,
      applicationStart: new Date("2026-10-01"),
      applicationEnd: new Date("2026-11-30"),
      quota: 10,
      minSemester: 1,
      maxSemester: 6,
      benefits: [
        "Pelatihan intensif robotika bawah air",
        "Kesempatan ikut kompetisi internasional",
        "Akses workshop dan peralatan lab",
        "Poin SKP kemahasiswaan",
      ],
      tags: ["UKM", "robotika", "underwater", "AUV", "ROV", "kompetisi internasional"],
      contactEmail: "underwater@bayucaraka.its.ac.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "beasiswa-bank-indonesia-2026" },
    update: {},
    create: {
      title: "Beasiswa Bank Indonesia 2026",
      slug: "beasiswa-bank-indonesia-2026",
      description:
        "Beasiswa Bank Indonesia untuk mahasiswa berprestasi di perguruan tinggi Indonesia. Beasiswa mencakup biaya pendidikan dan biaya hidup selama 1 tahun, serta kesempatan mengikuti program GenBI (Generasi Baru Indonesia) yang mencakup pelatihan leadership dan community development.",
      category: OpportunityCategory.SCHOLARSHIP,
      status: OpportunityStatus.UPCOMING,
      organizationId: ditmawa.id,
      applicationStart: new Date("2027-02-01"),
      applicationEnd: new Date("2027-03-31"),
      announcementDate: new Date("2027-05-01"),
      minGpa: 3.3,
      maxSemester: 6,
      requiredDocs: ["Transkrip Nilai", "Surat Rekomendasi Dosen", "Essay Motivasi", "CV"],
      benefits: [
        "Biaya pendidikan per semester",
        "Tunjangan biaya hidup Rp 1.000.000/bulan",
        "Keanggotaan GenBI",
        "Pelatihan leadership & networking",
      ],
      tags: ["beasiswa", "Bank Indonesia", "GenBI", "leadership", "prestasi"],
      contactEmail: "beasiswa@its.ac.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "panitia-its-expo-2026" },
    update: {},
    create: {
      title: "Panitia ITS Expo 2026",
      slug: "panitia-its-expo-2026",
      description:
        "ITS Expo 2026 adalah pameran tahunan terbesar di ITS yang menampilkan karya mahasiswa, hasil riset, dan inovasi dari seluruh departemen. Dibuka pendaftaran panitia untuk berbagai divisi: acara, publikasi, dokumentasi, logistik, sponsorship, dan dekorasi.",
      category: OpportunityCategory.COMMITTEE,
      status: OpportunityStatus.OPEN,
      organizationId: ditmawa.id,
      applicationStart: new Date("2026-10-15"),
      applicationEnd: new Date("2026-11-30"),
      announcementDate: new Date("2026-12-10"),
      quota: 100,
      minSemester: 2,
      maxSemester: 8,
      benefits: [
        "Sertifikat kepanitiaan",
        "Pengalaman event management skala besar",
        "Networking lintas departemen",
        "Poin SKP kemahasiswaan",
      ],
      tags: ["panitia", "expo", "event", "pameran", "publikasi", "dokumentasi"],
      contactEmail: "expo@its.ac.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "research-assistant-lab-embedded-2026" },
    update: {},
    create: {
      title: "Research Assistant - Lab Sistem Tertanam & Robotika",
      slug: "research-assistant-lab-embedded-2026",
      description:
        "Laboratorium Sistem Tertanam dan Robotika membuka lowongan Research Assistant untuk proyek riset 'Autonomous Navigation System for Underwater Vehicles using FPGA-based Sensor Fusion'. RA akan bekerja langsung di bawah bimbingan Dr. Budi Santoso dan tim riset lab.",
      category: OpportunityCategory.RESEARCH,
      status: OpportunityStatus.OPEN,
      organizationId: labEmbedded.id,
      applicationStart: new Date("2026-10-01"),
      applicationEnd: new Date("2026-12-15"),
      quota: 2,
      minGpa: 3.3,
      minSemester: 5,
      maxSemester: 8,
      allowedMajors: ["S1 Teknik Elektro", "S1 Teknik Komputer"],
      allowedFaculties: ["FTEIC"],
      requiredSkills: ["FPGA", "Verilog", "C"],
      requiredDocs: ["Transkrip Nilai", "CV", "Portfolio Proyek"],
      benefits: [
        "Honorarium Rp 500.000/bulan",
        "Akses penuh fasilitas lab",
        "Co-author publikasi ilmiah",
        "Bimbingan riset intensif",
      ],
      tags: ["riset", "FPGA", "embedded", "underwater", "sensor fusion", "lab", "verilog"],
      contactEmail: "lab.embedded@ee.its.ac.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "staff-bem-its-kabinet-bersatu-2026" },
    update: {},
    create: {
      title: "Staff BEM ITS Kabinet Bersatu 2026/2027",
      slug: "staff-bem-its-kabinet-bersatu-2026",
      description:
        "Badan Eksekutif Mahasiswa ITS Kabinet Bersatu membuka rekrutmen staff untuk seluruh kementerian dan biro. BEM ITS merupakan organisasi eksekutif tertinggi di tingkat institut yang bergerak dalam advokasi, pengembangan mahasiswa, dan pengabdian masyarakat.",
      category: OpportunityCategory.ORGANIZATION,
      status: OpportunityStatus.UPCOMING,
      organizationId: ditmawa.id,
      applicationStart: new Date("2027-01-10"),
      applicationEnd: new Date("2027-02-20"),
      announcementDate: new Date("2027-03-01"),
      quota: 200,
      minGpa: 3.0,
      minSemester: 2,
      maxSemester: 6,
      benefits: [
        "Sertifikat Keaktifan BEM ITS",
        "Pengalaman organisasi tingkat institut",
        "Leadership training & capacity building",
        "Networking seluruh mahasiswa ITS",
        "Poin SKP kemahasiswaan",
      ],
      tags: ["organisasi", "BEM ITS", "advokasi", "leadership", "pengabdian masyarakat"],
      contactEmail: "rekrutmen@bemits.its.ac.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "kompetisi-gemastik-xvii-2026" },
    update: {},
    create: {
      title: "Kompetisi GEMASTIK XVII 2026",
      slug: "kompetisi-gemastik-xvii-2026",
      description:
        "Pagelaran Mahasiswa Nasional Bidang Teknologi Informasi dan Komunikasi (GEMASTIK) XVII diselenggarakan oleh Puslapdik Kemdikbudristek. Kategori lomba: Pengembangan Perangkat Lunak, Data Mining, Keamanan Siber, Desain UX, IoT, dan Penulisan Ilmiah TIK. Tim terdiri dari 3 mahasiswa dengan 1 dosen pembimbing.",
      category: OpportunityCategory.COMPETITION,
      status: OpportunityStatus.OPEN,
      organizationId: ditmawa.id,
      applicationStart: new Date("2026-09-01"),
      applicationEnd: new Date("2026-12-30"),
      announcementDate: new Date("2027-03-15"),
      requiredSkills: ["Programming", "Data Science", "IoT"],
      requiredDocs: ["Proposal", "KTM", "Surat Pengantar Departemen"],
      benefits: [
        "Hadiah jutaan rupiah per kategori",
        "Sertifikat Kemenristekdikti",
        "Poin portofolio prestasi nasional",
        "Pendanaan perjalanan ke final",
      ],
      tags: ["kompetisi", "GEMASTIK", "programming", "data science", "IoT", "cyber security", "UX"],
      contactEmail: "gemastik@its.ac.id",
      externalLink: "https://gemastik.kemdikbud.go.id",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "beasiswa-djarum-plus-2026" },
    update: {},
    create: {
      title: "Beasiswa Djarum Plus 2026",
      slug: "beasiswa-djarum-plus-2026",
      description:
        "Beasiswa Djarum Beasiswa Plus untuk mahasiswa berprestasi semester 4 ke bawah. Program ini tidak hanya memberikan bantuan finansial tetapi juga program pembinaan softskill seperti Nation Building, Character Building, dan Community Empowerment selama 1 tahun.",
      category: OpportunityCategory.SCHOLARSHIP,
      status: OpportunityStatus.UPCOMING,
      organizationId: ditmawa.id,
      applicationStart: new Date("2027-03-01"),
      applicationEnd: new Date("2027-04-30"),
      announcementDate: new Date("2027-06-15"),
      minGpa: 3.2,
      maxSemester: 4,
      requiredDocs: ["Transkrip Nilai", "Surat Rekomendasi", "Essay", "CV", "Foto"],
      benefits: [
        "Bantuan biaya pendidikan Rp 1.000.000/bulan selama 1 tahun",
        "Program pembinaan Nation Building",
        "Pelatihan Character Building & Leadership",
        "Networking Beswan Djarum nasional",
        "Sertifikat Djarum Foundation",
      ],
      tags: ["beasiswa", "Djarum", "softskill", "leadership", "nation building"],
      contactEmail: "beasiswa@its.ac.id",
      externalLink: "https://djarumbeasiswaplus.org",
    },
  });

  await prisma.opportunity.upsert({
    where: { slug: "staff-himatro-dept-minat-bakat-2026" },
    update: {},
    create: {
      title: "Staff HIMATRO Departemen Minat dan Bakat 2026/2027",
      slug: "staff-himatro-dept-minat-bakat-2026",
      description:
        "Rekrutmen staff Departemen Minat dan Bakat HIMATRO ITS periode 2026/2027. Departemen Minat dan Bakat bertanggung jawab mengelola kegiatan non-akademik seperti olahraga, seni, dan pengembangan hobi mahasiswa Teknik Elektro. Program kerja meliputi turnamen internal, pentas seni, dan kegiatan outbound.",
      category: OpportunityCategory.ORGANIZATION,
      status: OpportunityStatus.OPEN,
      organizationId: himatro.id,
      applicationStart: new Date("2026-11-01"),
      applicationEnd: new Date("2026-12-15"),
      announcementDate: new Date("2026-12-20"),
      quota: 12,
      minGpa: 2.75,
      minSemester: 2,
      maxSemester: 4,
      allowedMajors: ["S1 Teknik Elektro"],
      allowedFaculties: ["FTEIC"],
      benefits: [
        "Sertifikat Keaktifan Organisasi",
        "Pengalaman event management",
        "Pengembangan minat dan bakat",
        "Poin SKP kemahasiswaan",
      ],
      tags: ["organisasi", "minat bakat", "olahraga", "seni", "teknik elektro"],
      contactEmail: "minbak@himatro.its.ac.id",
    },
  });

  console.log("✅ Opportunities seeded");

  // ============================================================
  // 6. SUMMARY
  // ============================================================

  const orgCount = await prisma.organization.count();
  const userCount = await prisma.user.count();
  const oppCount = await prisma.opportunity.count();
  const expCount = await prisma.experience.count();

  console.log("\n📊 Seed Summary:");
  console.log(`   Organizations: ${orgCount}`);
  console.log(`   Users: ${userCount}`);
  console.log(`   Opportunities: ${oppCount}`);
  console.log(`   Experiences: ${expCount}`);
  console.log("\n🎉 Database seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
