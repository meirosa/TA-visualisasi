import AdminLayout from "@/components/AdminLayout";
import DashboardStats from "@/components/DashboardStats";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-white text-black p-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        {/* Tambahkan komponen DashboardStats di sini */}
        <div className="mt-4">
          <DashboardStats />
        </div>
      </div>
    </AdminLayout>
  );
}
