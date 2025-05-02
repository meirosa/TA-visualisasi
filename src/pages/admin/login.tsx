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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      // Cek apakah user adalah admin
      const { data: userRole, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .single();

      if (roleError) throw new Error("Gagal mendapatkan role!");

      if (userRole?.role === "admin") {
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
  <div className="min-h-screen flex items-center justify-center bg-[#F7F4E9]">
    <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#46969B]">
        Login Admin
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border-2 border-[#46969B] rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#46969B] focus:border-[#46969B]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border-2 border-[#46969B] rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#46969B] focus:border-[#46969B]"
          required
        />
        <button
          type="submit"
          className={`w-full bg-[#46969B] text-[#F7F4E9] py-3 rounded-md shadow-md hover:bg-[#57B4BA] transition-colors duration-300 ${loading && "opacity-50 cursor-not-allowed"}`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <button
        onClick={() => router.push("/")}
        className="w-full mt-4 text-gray-600 underline text-sm"
      >
        Kembali ke Landing Page
      </button>
    </div>
  </div>
);
}