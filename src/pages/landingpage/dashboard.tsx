import dynamic from "next/dynamic";

const DashboardClient = dynamic(() => import("@/components/DashboardUser"), {
  ssr: false,
});

export default function DashboardPage() {
  return <DashboardClient />;
}
