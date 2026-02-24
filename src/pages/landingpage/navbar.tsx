import Image from "next/image";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full bg-[#07263B] px-10 py-4 flex items-center justify-between z-50 shadow-md">
      {/* KIRI */}
      <div className="flex items-center space-x-4">
        <Image
          src="/images/icon.png"
          alt="FuzzyFlood Icon"
          width={48}
          height={48}
          className="object-contain"
        />

        <div className="leading-tight">
          <h1 className="text-white text-2xl font-bold">FuzzyFlood</h1>
          <p className="text-[#1292C9] text-sm">
            Flood Vulnerability Visualization System
          </p>
        </div>
      </div>

      {/* KANAN */}
      <div className="flex items-center space-x-12 text-medium">
        <a href="#home" className="text-white hover:underline">
          Home
        </a>
        <a href="#about" className="text-white hover:underline">
          About Us
        </a>
        <a href="#sop" className="text-white hover:underline">
          SOP
        </a>
        <a href="#dashboard" className="text-white hover:underline">
          Dashboard
        </a>
        <a href="#peta" className="text-white hover:underline">
          Peta
        </a>

        <button
          onClick={() => router.push("/admin/signin")}
          className="bg-white text-[#07263B] px-12 py-1 rounded-md font-semibold shadow hover:bg-gray-100 transition"
        >
          Sign In
        </button>
      </div>
    </nav>
  );
}
