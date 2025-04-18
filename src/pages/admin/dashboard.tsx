import AdminLayout from "@/components/AdminLayout";
import DashboardStats from "@/components/DashboardStats";

export default function Dashboard() {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Tambahkan komponen DashboardStats di sini */}
      <div className="mt-4">
        <DashboardStats />
      </div>
    </AdminLayout>
  );
}
