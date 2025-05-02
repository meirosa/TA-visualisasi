import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import {
  FaChevronDown,
  FaMapMarkerAlt,
  FaBullhorn,
  FaMap,
  FaBroadcastTower, // Tambahkan ini
  FaFileAlt, // Tambahkan ini
  FaPlug, // Tambahkan ini
  FaRoute, // Tambahkan ini
  FaRecycle, // Tambahkan ini
  FaTools, // Tambahkan ini
  FaTree, // Tambahkan ini
  FaWater, // Tambahkan ini
} from "react-icons/fa";

import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const [mapType, setMapType] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const fetchUser = async () => {
      const {} = await supabase.auth.getUser();
    };
    fetchUser();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#57B4BA] shadow-md py-3 px-10 flex justify-between items-center z-50">
        <div className="flex space-x-8">
          {["Home", "About", "SOP"].map((text) => (
            <button
              key={text}
              onClick={() => {
                setActiveSection(text.toLowerCase());
                setMapType(null);
                if (text.toLowerCase() === "sop") {
                  document
                    .getElementById("sop-content")
                    ?.scrollIntoView({ behavior: "smooth" });
                } else {
                  document
                    .getElementById(text.toLowerCase())
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`${
                activeSection === text.toLowerCase() ? "bg-[#46969B]" : ""
              } text-[#F6F0F0] font-semibold text-lg px-4 py-2 rounded-md transition duration-300`}
            >
              {text}
            </button>
          ))}

          {/* Peta Dropdown */}
          {/* Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setMapType(mapType ? null : "dropdown")}
              className="text-[#F6F0F0] font-semibold text-lg px-4 py-2 rounded-md"
            >
              Peta
              <FaChevronDown className="inline ml-1" />
            </button>

            {mapType && (
              <div className="absolute top-12 left-0 w-48 bg-white shadow-lg z-10">
                <button
                  onClick={() => {
                    router.push("/user/peta"); // 👈 arahkan ke peta.tsx
                    setMapType(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Peta Kerentanan
                </button>

                <button
                  onClick={() => {
                    router.push("/user/damkar"); // 👈 arahkan ke damkar.tsx
                    setMapType(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Peta Damkar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Login Admin */}
        <div>
          <button
            onClick={() => router.push("/admin/login")}
            className="bg-[#3A8F7A] text-white font-semibold text-lg px-6 py-2 rounded-md hover:bg-[#2C6B4F] transition duration-300"
          >
            Login sebagai Admin
          </button>
        </div>
      </nav>

      {/* Section Home */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center text-center px-6 py-24 bg-[#F7F4E9] relative"
      >
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto space-y-8 md:space-y-0 md:space-x-16">
          {/* Konten Teks */}
          <div className="flex flex-col items-start space-y-6 text-center md:text-left max-w-lg animate__animated animate__fadeIn animate__delay-1s">
            <h1 className="text-5xl font-extrabold text-[#46969B] leading-tight md:text-6xl transition duration-500 ease-in-out transform hover:scale-105">
              Peta Kerentanan Banjir Surabaya
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto md:mx-0 leading-relaxed">
              Visualisasi wilayah rawan banjir di Kota Surabaya berbasis metode
              Fuzzy Mamdani, membantu masyarakat untuk lebih siap menghadapi
              bencana banjir. Temukan informasi terperinci tentang daerah yang
              paling terdampak dan ambil tindakan preventif.
            </p>
          </div>

          {/* Gambar */}
          <div className="relative w-full max-w-md md:max-w-[600px] animate__animated animate__fadeIn animate__delay-2s">
            <Image
              src="/images/Landingpage.png"
              alt="Peta Kerentanan Banjir"
              layout="responsive"
              width={800}
              height={600}
              className="rounded-lg object-cover transition duration-500 ease-in-out transform hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Section About */}
      <section
        id="about"
        className="min-h-screen flex flex-col justify-center items-center px-6 md:px-12 bg-[#f4f4f4]"
      >
        {/* Judul Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#46969B]">
            Tentang Aplikasi
          </h2>
        </div>

        {/* Kolom Konten */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 mb-10">
          {/* Kolom Latar Belakang */}
          <div className="w-full p-6 bg-white rounded-lg shadow-xl flex flex-col justify-center items-center transform transition-all duration-300 hover:shadow-2xl hover:scale-105 animate__animated animate__fadeInUp">
            <div className="w-full bg-[#46969B] text-white text-center py-3 rounded-t-lg shadow-md mb-4 flex items-center justify-center">
              <h3 className="text-2xl font-bold">Latar Belakang</h3>
            </div>
            <div className="flex flex-col items-center mb-4">
              <FaMapMarkerAlt className="text-5xl text-[#46969B]" />
            </div>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center">
              Mengacu pada UU No. 24 Tahun 2007 tentang Penanggulangan Bencana,
              Pasal 21 tentang pembuatan peta rawan bencana, perlu dilakukan
              langkah-langkah lanjutan, seperti visualisasi pemetaan daerah
              rawan banjir di Surabaya.
            </p>
          </div>

          {/* Kolom Tujuan */}
          <div className="w-full p-6 bg-white rounded-lg shadow-xl flex flex-col justify-center items-center transform transition-all duration-300 hover:shadow-2xl hover:scale-105 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="w-full bg-[#46969B] text-white text-center py-3 rounded-t-lg shadow-md mb-4 flex items-center justify-center">
              <h3 className="text-2xl font-bold">Tujuan</h3>
            </div>
            <div className="flex flex-col items-center mb-4">
              <FaBullhorn className="text-5xl text-[#46969B]" />
            </div>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center">
              Website ini dikembangkan untuk menyediakan visualisasi data banjir
              berbasis Open Map Data dengan metode Fuzzy Mamdani, yang
              mempermudah pengguna dalam memahami risiko banjir di berbagai
              wilayah.
            </p>
          </div>

          {/* Kolom Fitur */}
          <div className="w-full p-6 bg-white rounded-lg shadow-xl flex flex-col justify-center items-center transform transition-all duration-300 hover:shadow-2xl hover:scale-105 animate__animated animate__fadeInUp animate__delay-2s">
            <div className="w-full bg-[#46969B] text-white text-center py-3 rounded-t-lg shadow-md mb-4 flex items-center justify-center">
              <h3 className="text-2xl font-bold">Fitur</h3>
            </div>
            <div className="flex flex-col items-center mb-4">
              <FaMap className="text-5xl text-[#46969B]" />
            </div>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center">
              Sistem ini menyediakan visualisasi peta kerentanan banjir di
              Surabaya berbasis kecamatan, yang memudahkan pengguna dalam
              memahami tingkat kerawanan. Selain itu, juga tersedia peta lokasi
              pos damkar untuk mendukung upaya mitigasi.
            </p>
          </div>
        </div>
      </section>

      {/* Section SOP */}
      <section
        id="SOP"
        className="flex flex-col justify-center items-center min-h-[90vh] px-4 md:px-30 bg-[#EAEAEA] pb-3"
      >
        <div
          id="sop-content"
          className="w-full max-w-7xl flex flex-col justify-center items-center text-center"
        >
          {/* Judul */}
          <h2 className="text-3xl font-bold text-[#46969B] mb-8 mt-12">
            SOP Penanganan Banjir
          </h2>

          <div className="flex space-x-10">
            {/* Kotak Persiapan */}
            <div className="w-1/2 bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-2xl font-semibold text-[#264653] mb-4">
                Persiapan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Poin 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#46969B] text-white rounded-full flex justify-center items-center mb-2">
                    <FaBroadcastTower className="text-2xl" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Pantau informasi dari media massa
                  </h4>
                  <p className="text-gray-600 text-center text-xs">
                    Pastikan selalu mengikuti perkembangan informasi terkini
                    melalui media massa agar siap menghadapi bencana.
                  </p>
                </div>
                {/* Poin 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#46969B] text-white rounded-full flex justify-center items-center mb-2">
                    <FaFileAlt className="text-2xl" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Letakkan dokumen di tempat yang tinggi
                  </h4>
                  <p className="text-gray-600 text-center text-xs">
                    Pindahkan dokumen penting ke tempat yang lebih tinggi untuk
                    mencegah kerusakan akibat banjir.
                  </p>
                </div>
                {/* Poin 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#46969B] text-white rounded-full flex justify-center items-center mb-2">
                    <FaPlug className="text-2xl" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Matikan sumber listrik dan perangkat elektronik
                  </h4>
                  <p className="text-gray-600 text-center text-xs">
                    Untuk menghindari bahaya listrik, pastikan semua perangkat
                    dimatikan sebelum banjir terjadi.
                  </p>
                </div>
                {/* Poin 4 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#46969B] text-white rounded-full flex justify-center items-center mb-2">
                    <FaRoute className="text-2xl" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Kenali jalur evakuasi dan lokasi pengungsian
                  </h4>
                  <p className="text-gray-600 text-center text-xs">
                    Pelajari jalur evakuasi yang aman dan pastikan mengetahui
                    lokasi pengungsian terdekat.
                  </p>
                </div>
              </div>
            </div>

            {/* Kotak Pencegahan */}
            <div className="w-1/2 bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-2xl font-semibold text-[#264653] mb-4">
                Pencegahan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Poin 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#46969B] text-white rounded-full flex justify-center items-center mb-2">
                    <FaRecycle className="text-2xl" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Bersihkan sampah di sungai
                  </h4>
                  <p className="text-gray-600 text-center text-xs">
                    Pastikan saluran air tetap bersih agar aliran air lancar dan
                    mencegah banjir.
                  </p>
                </div>
                {/* Poin 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#46969B] text-white rounded-full flex justify-center items-center mb-2">
                    <FaTools className="text-2xl" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Perbaiki saluran air
                  </h4>
                  <p className="text-gray-600 text-center text-xs">
                    Pastikan saluran air tidak tersumbat dan dalam kondisi baik
                    untuk mencegah banjir.
                  </p>
                </div>
                {/* Poin 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#46969B] text-white rounded-full flex justify-center items-center mb-2">
                    <FaTree className="text-2xl" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Tanam pohon di sekitar rumah
                  </h4>
                  <p className="text-gray-600 text-center text-xs">
                    Tanam pohon untuk membantu penyerapan air dan mengurangi
                    potensi banjir.
                  </p>
                </div>
                {/* Poin 4 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#46969B] text-white rounded-full flex justify-center items-center mb-2">
                    <FaWater className="text-2xl" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Bangun sumur resapan
                  </h4>
                  <p className="text-gray-600 text-center text-xs">
                    Membangun sumur resapan untuk membantu penyerapan air hujan
                    ke dalam tanah.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#57B4BA] py-4 text-center text-[#F6F0F0]">
        <p>
          &copy; 2025 Sistem Pemetaan Kerawanan Banjir. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
