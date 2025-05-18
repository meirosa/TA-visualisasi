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
      const { data: floodData, error: floodError } = await supabase
        .from("data")
        .select("kecamatan, history_banjir, tahun");

      if (floodError) {
        console.error("Error fetching flood data:", floodError);
        return;
      }

      if (floodData) {
        const uniqueKecamatan = new Set(floodData.map((row) => row.kecamatan));
        setJumlahKecamatan(uniqueKecamatan.size);

        const totalBanjir = floodData.reduce(
          (sum, row) => sum + (row.history_banjir ?? 0),
          0
        );
        setJumlahBanjir(totalBanjir);
      }

      const { data: rainfallData, error: rainfallError } = await supabase
        .from("data")
        .select("tahun, curah_hujan")
        .gte("tahun", 2019)
        .lte("tahun", 2023)
        .order("tahun", { ascending: true });

      if (rainfallError) {
        console.error("Error fetching rainfall data:", rainfallError);
        return;
      }

      if (rainfallData) {
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
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <main className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
          {/* Jumlah Kecamatan */}
          <div className="border rounded-md shadow-sm p-4 bg-white">
            <h2 className="text-base font-medium">Jumlah Kecamatan</h2>
            <p className="text-xl font-bold">{jumlahKecamatan} Kecamatan</p>
          </div>

          {/* Jumlah Kejadian Banjir */}
          <div className="border rounded-md shadow-sm p-4 bg-white">
            <h2 className="text-base font-medium">Jumlah Kejadian Banjir</h2>
            <p className="text-xl font-bold">{jumlahBanjir} Kejadian</p>
          </div>

          {/* Grafik Curah Hujan */}
          <div className="border rounded-md shadow-sm p-4 bg-white col-span-1 md:col-span-2">
            <h2 className="text-base font-medium">
              Rata-rata Curah Hujan (mm/tahun)
            </h2>
            <div className="h-56 mt-4">
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
