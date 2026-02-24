// home.tsx
import Image from "next/image";

export default function Home() {
  return (
    <section
      id="home"
      className="
        min-h-screen 
        flex 
        items-center 
        px-2
        py-24
      "
      style={{
        background:
          "linear-gradient(90deg, #051E2F 12%, rgba(117,117,117,0.5) 100%)",
      }}
    >
      <div
        className="
          max-w-7xl 
          mx-auto 
          flex 
          flex-col 
          md:flex-row 
          items-center
          gap-x-20       /* 🔹 DIUBAH: bikin teks ke kiri & gambar ke kanan */
        "
      >
        {/* ================= TEKS KIRI ================= */}
        <div
          className="
            md:w-6/12       /* 🔹 DIUBAH: cukup 6/12 biar gak terlalu makan tempat */
            w-full 
            text-white 
            flex 
            flex-col 
            justify-start
            pl-0
          "
        >
          <h1 className="text-4xl font-bold leading-snug mb-8">
            Kenali <span className="text-red-600">Daerah Rawan Banjir,</span>
            <br />
            Sebelum Bencana Datang
          </h1>

          <p className="text-base mb-10">
            Aplikasi ini menghadirkan visualisasi tingkat kerentanan banjir di
            setiap wilayah Surabaya. Dengan analisis berbasis metode Fuzzy, data
            yang rumit diubah menjadi tampilan peta yang sederhana dan mudah
            dipahami. Informasi ditampilkan secara jelas agar masyarakat dapat
            mengetahui wilayah yang berisiko terdampak banjir.
          </p>

          <a
            href="#about"
            className="
              inline-block
              px-6
              py-2
              border 
              border-white 
              rounded-md 
              text-white 
              hover:bg-white 
              hover:text-black 
              transition 
              w-max
            "
          >
            Find out more
          </a>
        </div>

        {/* ================= GAMBAR KANAN ================= */}
        <div
          className="
            md:w-6/12 
            w-full 
            flex 
            justify-end     /* 🔹 PASTIIN gambar nempel kanan */
          "
        >
          <Image
            src="/images/home.png"
            alt="Hero Image"
            width={500}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
