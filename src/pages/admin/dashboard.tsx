import AdminLayout from "@/components/AdminLayout";
import DashboardStats from "@/components/DashboardAdmin";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="h-[75vh] flex flex-col">

        {/* Tambahkan komponen DashboardStats di sini */}
        <div className="mt-4">
          <DashboardStats />
        </div>
      </div>
    </AdminLayout>
  );
}
