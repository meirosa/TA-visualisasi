import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ LOGIN SUPABASE
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw new Error(loginError.message);

      // 2️⃣ CEK ROLE ADMIN
      const { data: userRole, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .single();

      if (roleError) throw new Error("Gagal mendapatkan role user");

      // 3️⃣ VALIDASI ADMIN
      if (userRole?.role === "admin") {
        // 🔥 INI YANG KEMARIN HILANG
        localStorage.setItem("adminEmail", email);

        router.push("/admin/dashboard");
      } else {
        setError("Anda bukan admin!");
        await supabase.auth.signOut();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: "url('/images/login.png')" }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-md px-4">
        <h1 className="text-white text-3xl font-bold text-center mb-8">
          Selamat Datang, Admin!
        </h1>

        {/* BOX */}
        <div className="bg-[#00000026] rounded-lg p-6">
          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-md bg-red-500/20 border border-red-400 text-red-200 text-sm px-3 py-2 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div className="space-y-1">
              <label className="block text-white text-sm">Email</label>
              <input
                type="email"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/85 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1292C9]"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="block text-white text-sm">Password</label>
              <input
                type="password"
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/85 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1292C9]"
                required
              />
            </div>

            {/* INFO */}
            <p className="text-xs text-gray-200">
              Tidak memiliki akses? Hubungi Administrator
            </p>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#1292C9] text-white py-3 rounded-md font-semibold hover:bg-[#0f7fb0] transition ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* BACK */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-200 underline"
            >
              Kembali ke Landing Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
