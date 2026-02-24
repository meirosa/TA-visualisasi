export default function SOP() {
  return (
    <section
      id="sop"
      className="relative min-h-screen flex items-center px-6 py-28"
      style={{
        backgroundImage: "url('/images/sop.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gelap supaya teks kebaca */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-7xl w-full mx-auto">
        {/* 
          =========================
          BLOK TEKS KIRI
          =========================
        */}
        <div className="max-w-3xl pl-1 -ml-16 mb-10 text-left">
          {/* 
            mb-4  → jarak antara JUDUL dan TEKS SUMBER
            whitespace-nowrap → supaya judul tidak turun ke baris bawah
          */}
          <h2 className="text-5xl font-bold text-white mb-4 whitespace-nowrap">
            Standar Operasional Penanggulangan Banjir
          </h2>

          {/*
            mb-8 → jarak antara TEKS SUMBER dan DESKRIPSI
            kalau mau lebih renggang: mb-10 / mb-12
          */}
          <p className="text-lg text-gray-900 mb-6">
            Sumber: Badan Nasional Penanggulangan Bencana (BNPB)
          </p>

          {/*
            mb-4 → jarak bawah PARAGRAF TERAKHIR
            ini yang mempengaruhi jarak ke VIDEO (bersama mb-20 di parent)
          */}
          <p className="text-lg text-white mb-3">
            Video berikut berisi penjelasan mengenai prosedur penanganan banjir
            sesuai standar BNPB. Informasi ini ditampilkan sebagai bahan edukasi
            dan peningkatan kewaspadaan masyarakat.
          </p>
        </div>

        {/*
          =========================
          VIDEO
          =========================
          mb-20 di BLOK TEKS ATAS
          → ini yang ngatur jarak TEKS ke VIDEO
          kalau mau lebih jauh: ganti mb-20 ke mb-24 / mb-32
        */}
        <div className="w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/iR5eQNKRSi0"
            title="Video SOP Penanganan Banjir BNPB"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
