import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchUser = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("email", user.email)
          .single();

        if (!error) {
          setUser(user);
          setRole(data?.role || null);
        } else {
          console.error("Gagal mendapatkan role:", error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-blue-50 relative">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#57B4BA] shadow-md py-3 px-6 flex justify-center space-x-6 z-50">
        {["home", "about", "SOP"].map((id) => (
          <button
            key={id}
            onClick={() =>
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-[#F6F0F0] font-semibold relative group px-3 py-1"
            aria-label={`Scroll ke ${id}`}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
            <span className="absolute left-0 bottom-0 w-0 group-hover:w-full h-[2px] bg-[#F6F0F0] transition-all duration-300"></span>
          </button>
        ))}
      </nav>

      {/* Section Home */}
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative"
      >
        <Image
          src="/images/banjir-background.jpg"
          alt="Banjir Background"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-30"
        />
        <h1 className="text-4xl font-bold text-blue-700 relative z-10">
          Pemetaan Banjir Kota Surabaya
        </h1>
        <p className="text-gray-700 mt-2 relative z-10">
          Visualisasi berbasis Open Map Data dengan Metode Fuzzy Mamdani
        </p>
        <div className="mt-6 flex gap-4 relative z-10">
          <button
            onClick={() => router.push("/user/peta")}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Lihat Peta (Tanpa Login)
          </button>
          {loading ? (
            <span className="px-4 py-2 bg-gray-400 text-white rounded-md animate-pulse">
              Memeriksa akun...
            </span>
          ) : user ? (
            <button
              onClick={() =>
                router.push(
                  role === "admin" ? "/admin/dashboard" : "/user/dashboard"
                )
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {role === "admin" ? "Dashboard Admin" : "Dashboard User"}
            </button>
          ) : (
            <button
              onClick={() => router.push("/admin/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Login Sebagai Admin
            </button>
          )}
        </div>
      </section>

      {/* Section About */}
      <section
        id="about"
        className="min-h-screen flex flex-col justify-center items-start px-12 md:px-24 bg-cream-100"
      >
        <div className="max-w-5xl w-full">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">
            Informasi Aplikasi
          </h2>

          <h3 className="text-xl font-semibold text-green-600 mt-6">
            Latar Belakang
          </h3>
          <p className="text-gray-700 mb-4 text-left">
            Kota Surabaya merupakan salah satu wilayah di Indonesia yang rentan
            terhadap banjir akibat curah hujan tinggi, sistem drainase yang
            belum optimal, serta kepadatan penduduk. Berdasarkan data BNPB,
            banjir masih menjadi salah satu bencana yang sering terjadi di
            Indonesia, termasuk di Surabaya, dengan dampak signifikan terhadap
            masyarakat dan infrastruktur. Oleh karena itu, diperlukan sistem
            pemetaan yang mampu memvisualisasikan tingkat kerawanan banjir untuk
            mendukung mitigasi dan pengambilan keputusan yang lebih efektif.
          </p>

          <h3 className="text-xl font-semibold text-green-600 mt-6">Tujuan</h3>
          <p className="text-gray-700 text-left">
            Website ini dikembangkan untuk menyediakan visualisasi data banjir
            berbasis Open Map Data dengan metode Fuzzy Mamdani. Dengan sistem
            ini, masyarakat dan pemerintah dapat memahami tingkat risiko banjir
            di berbagai kecamatan di Surabaya berdasarkan berbagai parameter,
            seperti curah hujan, sejarah banjir, jumlah penduduk, serta
            ketersediaan taman dan drainase.
          </p>
        </div>
      </section>

      {/* Section SOP */}
      <section
        id="SOP"
        className="min-h-screen flex flex-col justify-center items-start px-12 md:px-24 bg-blue-100"
      >
        <div className="max-w-5xl w-full">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">
            SOP Penanganan Banjir
          </h2>
          <p className="text-gray-700 mb-4 text-left">
            Banjir adalah salah satu bencana alam yang dapat terjadi kapan saja,
            terutama di daerah perkotaan yang memiliki sistem drainase kurang
            optimal. Untuk mengurangi dampak yang ditimbulkan, diperlukan
            langkah-langkah yang tepat sebelum, saat, dan setelah banjir.
            Berikut adalah prosedur standar operasional (SOP) yang dapat diikuti
            untuk meningkatkan kesiapsiagaan dalam menghadapi banjir.
          </p>

          <h3 className="text-xl font-semibold text-green-600 mt-6">
            1. Persiapan (Sebelum Banjir)
          </h3>
          <p className="text-gray-700 mb-2 text-left">
            Tahap ini bertujuan untuk meminimalkan risiko dan dampak yang dapat
            ditimbulkan oleh banjir dengan cara mempersiapkan diri dan
            lingkungan sekitar.
          </p>
          <ul className="list-disc pl-6 text-gray-700 text-left">
            <li>
              <strong>Pantau informasi dari media massa</strong> – Pastikan
              selalu mengikuti informasi terbaru dari BMKG dan BNPB mengenai
              potensi curah hujan tinggi atau peringatan dini banjir.
            </li>
            <li>
              <strong>Taruh dokumen penting di tempat yang tinggi</strong> –
              Simpan surat-surat berharga seperti sertifikat, KTP, KK, dan
              ijazah dalam plastik tahan air dan tempatkan di lokasi yang aman.
            </li>
            <li>
              <strong>Matikan sumber listrik</strong> – Jika ada indikasi banjir
              akan datang, segera matikan listrik untuk menghindari korsleting
              atau risiko tersengat arus listrik.
            </li>
            <li>
              <strong>Lari dan ikuti jalur evakuasi</strong> – Ketahui jalur
              evakuasi yang sudah ditentukan oleh pemerintah setempat dan segera
              bergerak ke tempat yang lebih tinggi.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-green-600 mt-6">
            2. Pencegahan (Jangka Panjang)
          </h3>
          <p className="text-gray-700 mb-2 text-left">
            Upaya pencegahan sangat penting untuk mengurangi risiko banjir di
            masa depan. Berikut adalah langkah-langkah yang dapat diterapkan
            dalam kehidupan sehari-hari.
          </p>
          <ul className="list-disc pl-6 text-gray-700 text-left">
            <li>
              <strong>Bersihkan sampah di sungai</strong> – Pastikan saluran air
              tidak tersumbat dengan sampah agar aliran air tetap lancar dan
              mengurangi risiko banjir.
            </li>
            <li>
              <strong>Menanam pohon untuk menambah resapan air</strong> – Akar
              pohon dapat membantu menyerap air hujan dan mengurangi potensi
              genangan air di lingkungan sekitar.
            </li>
            <li>
              <strong>Buang sampah pada tempatnya</strong> – Sampah yang
              berserakan dan masuk ke dalam drainase dapat menyebabkan
              penyumbatan yang berkontribusi terhadap terjadinya banjir.
            </li>
          </ul>

          <p className="text-gray-600 text-left mt-4">Sumber: BNPB</p>
        </div>
      </section>
    </div>
  );
}
