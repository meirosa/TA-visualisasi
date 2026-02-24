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

export default function DashboardAdmin() {
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
      // kecamatan
      const { data: kec } = await supabase
        .from("kecamatan")
        .select("id_kecamatan, nama");

      setKecamatanList(kec as Kecamatan[]);

      // data banjir
      const { data } = await supabase
        .from("data")
        .select("tahun, id_kecamatan, history_banjir");

      if (!data) return;

      const typed = data as DataRow[];
      setRows(typed);

      // periode
      const yearList = Array.from(new Set(typed.map((d) => d.tahun))).sort();
      setYears(yearList);
      setSelectedYear(yearList[0]);
      setPeriodeText(`${yearList[0]} – ${yearList[yearList.length - 1]}`);

      // jumlah kecamatan yang DIPAKAI
      const uniqueKecamatan = new Set(typed.map((d) => d.id_kecamatan));
      setTotalKecamatan(uniqueKecamatan.size);

      // total kejadian banjir (SEMUA TAHUN)
      const total = typed.reduce((sum, d) => sum + (d.history_banjir ?? 0), 0);

      setTotalBanjir(total);

      // kejadian per tahun
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

    // TAMPILKAN SEMUA KECAMATAN
    setBanjirPerKecamatan(
      kecamatanList
        .filter((k) => (countMap[k.id_kecamatan] ?? 0) > 0)
        .map((k) => ({
          name: k.nama,
          total: countMap[k.id_kecamatan],
        })),
    );
  }, [rows, selectedYear, kecamatanList]);

  /* ================= UI ================= */
  return (
    <section className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <Card title="Periode">
            <p className="text-lg font-semibold">{periodeText}</p>
            <ResponsiveContainer width="100%" height={50}>
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
