"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdFlood } from "react-icons/md";

/* ================= TYPES ================= */
type DataRow = {
  tahun: number;
  id_kecamatan: number;
  history_banjir: number;
};

type Kecamatan = {
  id_kecamatan: number;
  nama: string;
};

type ChartItem = {
  name: string;
  total: number;
};

export default function DashboardUser() {
  const [rows, setRows] = useState<DataRow[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(0);

  const [periodeText, setPeriodeText] = useState("–");
  const [totalKecamatan, setTotalKecamatan] = useState(0);
  const [totalBanjir, setTotalBanjir] = useState(0);

  const [periodeChart, setPeriodeChart] = useState<ChartItem[]>([]);
  const [banjirPerKecamatan, setBanjirPerKecamatan] = useState<ChartItem[]>([]);
  const [clusterPerTahun, setClusterPerTahun] = useState<ChartItem[]>([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      // ===== KECAMATAN =====
      const { data: kec } = await supabase
        .from("kecamatan")
        .select("id_kecamatan, nama");

      if (kec) setKecamatanList(kec as Kecamatan[]);

      // ===== DATA BANJIR =====
      const { data } = await supabase
        .from("data")
        .select("tahun, id_kecamatan, history_banjir");

      if (!data) return;

      const typed = data as DataRow[];
      setRows(typed);

      // TAHUN
      const yearList = Array.from(new Set(typed.map((d) => d.tahun))).sort();
      setYears(yearList);
      setSelectedYear(yearList[0]);
      setPeriodeText(`${yearList[0]} – ${yearList[yearList.length - 1]}`);

      // TOTAL KECAMATAN
      const uniqueKecamatan = new Set(typed.map((d) => d.id_kecamatan));
      setTotalKecamatan(uniqueKecamatan.size);

      // TOTAL KEJADIAN BANJIR (SEMUA DATA history_banjir)
      const total = typed.reduce((sum, d) => sum + (d.history_banjir ?? 0), 0);
      setTotalBanjir(total);

      // CLUSTER PER TAHUN
      const byYear: Record<number, number> = {};
      typed.forEach((d) => {
        byYear[d.tahun] = (byYear[d.tahun] ?? 0) + (d.history_banjir ?? 0);
      });

      setPeriodeChart(
        Object.entries(byYear).map(([y, t]) => ({ name: y, total: t })),
      );
      setClusterPerTahun(
        Object.entries(byYear).map(([y, t]) => ({ name: y, total: t })),
      );
    };

    loadData();
  }, []);

  /* ================= PER KECAMATAN (FILTER TAHUN) ================= */
  useEffect(() => {
    if (rows.length === 0 || kecamatanList.length === 0) return;

    const filtered = rows.filter((r) => r.tahun === selectedYear);

    const countMap: Record<number, number> = {};
    filtered.forEach((r) => {
      countMap[r.id_kecamatan] =
        (countMap[r.id_kecamatan] ?? 0) + (r.history_banjir ?? 0);
    });

    // JUMLAH KEJADIAN BANJIR PER KECAMATAN
    setBanjirPerKecamatan(
      kecamatanList
        .filter((k) => (countMap[k.id_kecamatan] ?? 0) > 0)
        .map((k) => ({
          name: k.nama,
          total: countMap[k.id_kecamatan],
        })),
    );

    // ❌ TIDAK ADA setTotalBanjir DI SINI
  }, [rows, selectedYear, kecamatanList]);

  /* ================= UI ================= */
  return (
    <section
      id="dashboard"
      className="w-full min-h-screen py-10 overflow-x-hidden"
      style={{ backgroundColor: "rgba(7,38,59,0.35)" }}
    >
      <div className="w-full max-w-[95%] mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#07263B] mb-8 text-center md:text-left">
          Dashboard
        </h1>

        {/* ===== TOP ===== */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <Card title="Periode">
            <p className="text-lg font-semibold">{periodeText}</p>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={periodeChart}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Line dataKey="total" stroke="#38bdf8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Kecamatan">
            <p className="text-xl font-bold">{totalKecamatan}</p>
            <div className="flex justify-center mt-3 opacity-80">
              <FaMapMarkedAlt size={55} />
            </div>
          </Card>

          <Card title="Kejadian Banjir">
            <p className="text-xl font-bold">{totalBanjir}</p>
            <div className="flex justify-center mt-3 opacity-80">
              <MdFlood size={60} />
            </div>
          </Card>
        </div>

        {/* ===== BOTTOM ===== */}
        <div className="grid md:grid-cols-2 gap-5">
          <Card
            title="Jumlah Kejadian Banjir per Kecamatan"
            extra={
              <select
                className="text-black text-sm p-1 rounded"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={banjirPerKecamatan} barSize={10}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Cluster Banjir per Tahun">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={clusterPerTahun} barSize={14}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ================= CARD ================= */
function Card({
  title,
  extra,
  children,
}: {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0B2C3D] rounded-xl p-4 shadow text-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">{title}</h3>
        {extra}
      </div>
      {children}
    </div>
  );
}
