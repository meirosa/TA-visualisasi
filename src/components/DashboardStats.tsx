import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardStats: React.FC = () => {
  const [jumlahKecamatan, setJumlahKecamatan] = useState(0);
  const [jumlahBanjir, setJumlahBanjir] = useState(0);
  const [rainfallData, setRainfallData] = useState<
    { year: string; rain: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil tahun terbaru untuk kejadian banjir
      const { data: latestYearData, error: yearError } = await supabase
        .from("data")
        .select("tahun")
        .order("tahun", { ascending: false })
        .limit(1);

      if (yearError || !latestYearData.length) {
        console.error("Error fetching latest year:", yearError);
        return;
      }

      const latestYear = latestYearData[0].tahun;

      // Ambil data kejadian banjir hanya untuk tahun terbaru
      const { data: floodData, error: floodError } = await supabase
        .from("data")
        .select("kecamatan, history_banjir")
        .eq("tahun", latestYear);

      if (floodError) {
        console.error("Error fetching flood data:", floodError);
        return;
      }

      if (floodData) {
        // Hitung jumlah kecamatan unik
        const uniqueKecamatan = new Set(floodData.map((row) => row.kecamatan));
        setJumlahKecamatan(uniqueKecamatan.size);

        // Hitung total kejadian banjir tahun terbaru
        const totalBanjir = floodData.reduce(
          (sum, row) => sum + (row.history_banjir ?? 0),
          0
        );
        setJumlahBanjir(totalBanjir);
      }

      // Ambil data curah hujan selama 5 tahun terakhir
      const { data: rainfallData, error: rainfallError } = await supabase
        .from("data")
        .select("tahun, curah_hujan")
        .gte("tahun", latestYear - 4) // Ambil 5 tahun terakhir
        .order("tahun", { ascending: true });

      if (rainfallError) {
        console.error("Error fetching rainfall data:", rainfallError);
        return;
      }

      if (rainfallData) {
        // Hitung rata-rata curah hujan per tahun
        const groupedRainfall: {
          [key: string]: { total: number; count: number };
        } = {};
        rainfallData.forEach((row) => {
          const tahun = String(row.tahun);
          if (
            tahun &&
            row.curah_hujan !== null &&
            row.curah_hujan !== undefined
          ) {
            if (!groupedRainfall[tahun]) {
              groupedRainfall[tahun] = { total: 0, count: 0 };
            }
            groupedRainfall[tahun].total += row.curah_hujan;
            groupedRainfall[tahun].count += 1;
          }
        });

        const formattedRainfallData = Object.keys(groupedRainfall).map(
          (tahun) => ({
            year: tahun,
            rain: groupedRainfall[tahun].count
              ? parseFloat(
                  (
                    groupedRainfall[tahun].total / groupedRainfall[tahun].count
                  ).toFixed(1)
                )
              : 0,
          })
        );
        setRainfallData(formattedRainfallData);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-gray-50">
      <main className="flex-1 overflow-auto p-2 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
          {/* Jumlah Kecamatan */}
          <div className="border rounded-md shadow-sm p-2 bg-white">
            <h2 className="text-base font-medium">Jumlah Kecamatan</h2>
            <p className="text-xl font-bold">{jumlahKecamatan} Kecamatan</p>
          </div>

          {/* Jumlah Kejadian Banjir */}
          <div className="border rounded-md shadow-sm p-2 bg-white">
            <h2 className="text-base font-medium">Jumlah Kejadian Banjir</h2>
            <p className="text-xl font-bold">{jumlahBanjir} Kejadian</p>
          </div>

          {/* Grafik Curah Hujan */}
          <div className="border rounded-md shadow-sm p-2 bg-white col-span-1 md:col-span-2">
            <h2 className="text-base font-medium">
              Rata-rata Curah Hujan (mm/tahun) 
            </h2>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rainfallData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rain" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardStats;
