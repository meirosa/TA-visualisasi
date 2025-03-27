import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message); // ✅ Hindari `data` yang tidak digunakan

      // Cek apakah user adalah admin
      const { data: userRole, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .single();

      if (roleError) throw new Error("Gagal mendapatkan role!");

      if (userRole?.role === "admin") {
        router.push("/admin/dashboard"); // ✅ Redirect admin
      } else {
        setError("Anda bukan admin!");
        await supabase.auth.signOut();
      }
    } catch (err: unknown) {
      // ✅ Ganti `any` dengan `unknown`
      if (err instanceof Error) {
        setError(err.message); // ✅ Pastikan `err` bertipe `Error`
      } else {
        setError("Terjadi kesalahan!");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Login Admin
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Login
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
