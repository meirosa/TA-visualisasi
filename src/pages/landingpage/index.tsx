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
        {["home", "tentang", "statistik", "edukasi", "sop"].map((id) => (
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
        className="h-screen flex flex-col items-center justify-center text-center px-6 relative"
      >
        <Image
          src="/images/banjir-background.jpg"
          alt="Banjir Background"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-30"
        />
        <h1 className="text-4xl font-bold text-blue-700 relative z-10">
          Pemetaan Banjir Surabaya
        </h1>
        <p className="text-gray-700 mt-2 relative z-10">
          Visualisasi berbasis Open Map Data dengan Metode Fuzzy
        </p>

        {/* Tombol Navigasi */}
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
    </div>
  );
}
