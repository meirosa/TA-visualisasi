// about.tsx
export default function About() {
  return (
    <section
      id="about"
      className="h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{
        backgroundImage: "url('/images/about.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Judul */}
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 md:mb-16 drop-shadow-lg text-center">
        Tentang Aplikasi
      </h2>

      {/* Card container */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-6xl w-full justify-center items-start">
        {/* Card 1 - Latar Belakang */}
        <div className="flex-1 flex flex-col rounded-lg shadow-lg border-2 border-[#5A6A90] overflow-hidden bg-white h-full">
          {/* Spacer agar header sedikit turun */}
          <div className="h-4 bg-white"></div>
          {/* Header */}
          <div className="bg-[#5A6A90] text-white font-bold text-xl py-4 text-center">
            Latar Belakang
          </div>
          {/* Body */}
          <div className="p-6 text-gray-700 text-sm md:text-base leading-relaxed text-center flex-1 overflow-auto">
            Mengacu pada UU No. 24 Tahun 2007 tentang Penanggulangan Bencana,
            Pasal 21 tentang pembuatan peta rawan bencana perlu dilakukan
            langkah-langkah lanjutan, seperti visualisasi peta rawan banjir di
            Surabaya.
          </div>
        </div>

        {/* Card 2 - Tujuan */}
        <div className="flex-1 flex flex-col rounded-lg shadow-lg border-2 border-[#5A6A90] overflow-hidden bg-white h-full">
          <div className="h-4 bg-white"></div>
          <div className="bg-[#5A6A90] text-white font-bold text-xl py-4 text-center">
            Tujuan
          </div>
          <div className="p-6 text-gray-700 text-sm md:text-base leading-relaxed text-center flex-1 overflow-auto">
            Website ini dikembangkan untuk menampilkan peta kerentanan banjir
            dengan perhitungan berbasis Fuzzy Inference System (berbasis data),
            memudahkan proses identifikasi wilayah berisiko, meningkatkan
            kewaspadaan masyarakat, dan membantu instansi terkait dalam
            merencanakan langkah mitigasi.
          </div>
        </div>

        {/* Card 3 - Fitur */}
        <div className="flex-1 flex flex-col rounded-lg shadow-lg border-2 border-[#5A6A90] overflow-hidden bg-white h-full">
          <div className="h-4 bg-white"></div>
          <div className="bg-[#5A6A90] text-white font-bold text-xl py-4 text-center">
            Fitur
          </div>
          <div className="p-6 text-gray-700 text-sm md:text-base leading-relaxed text-center flex-1 overflow-auto">
            Sistem ini menyediakan visualisasi peta kerentanan banjir di
            Surabaya per kecamatan, yang memudahkan warga untuk memantau tingkat
            kerentanan. Selain itu, juga tersedia peta lokasi darurat untuk
            mendukung mitigasi bencana.
          </div>
        </div>
      </div>
    </section>
  );
}
