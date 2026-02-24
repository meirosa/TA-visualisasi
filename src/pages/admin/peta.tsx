import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/utils/supabase";

// ================= DYNAMIC IMPORT =================
const MapLeaflet = dynamic(() => import("@/components/MapLeafletClient"), {
  ssr: false,
});

// ================= TYPE =================
type LayerState = {
  peta: boolean;
  damkar: boolean;
};

type FuzzyState = {
  mamdani: boolean;
  sugeno: boolean;
  tsukamoto: boolean;
};

// ================= PAGE =================
export default function PetaPage() {
  const [tahun, setTahun] = useState<string>("");
  const [listTahun, setListTahun] = useState<number[]>([]);

  const [layer, setLayer] = useState<LayerState>({
    peta: true,
    damkar: false,
  });

  const [fuzzy, setFuzzy] = useState<FuzzyState>({
    mamdani: true,
    sugeno: true,
    tsukamoto: true,
  });

  // ================= FETCH TAHUN =================
  useEffect(() => {
    const fetchTahun = async () => {
      const { data, error } = await supabase
        .from("data")
        .select("tahun")
        .order("tahun", { ascending: true });

      if (error || !data) {
        console.error("Gagal mengambil tahun:", error);
        return;
      }

      const tahunUnik = Array.from(new Set(data.map((d) => d.tahun)));
      setListTahun(tahunUnik);
    };

    fetchTahun();
  }, []);

  // ================= HANDLER =================
  const toggleLayer = (key: keyof LayerState) => {
    setLayer((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFuzzy = (key: keyof FuzzyState) => {
    setFuzzy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ================= UI =================
  return (
    <AdminLayout>
      {/* ===== FILTER ===== */}
      <div
        style={{
          background: "#07263B",
          padding: 16,
          borderRadius: 8,
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "center",
          color: "#fff",
        }}
      >
        {/* Tahun */}
        <span>Tahun:</span>
        <select
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          style={{
            background: "#07263B",
            color: "#fff",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #fff",
          }}
        >
          <option value="" disabled>
            Pilih Tahun
          </option>
          {listTahun.map((thn) => (
            <option key={thn} value={thn}>
              {thn}
            </option>
          ))}
        </select>

        {/* Layer */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={layer.peta}
              onChange={() => toggleLayer("peta")}
            />{" "}
            Peta
          </label>

          <label style={{ marginLeft: 12 }}>
            <input
              type="checkbox"
              checked={layer.damkar}
              onChange={() => toggleLayer("damkar")}
            />{" "}
            Damkar
          </label>
        </div>

        {/* Fuzzy */}
        <div>
          <span style={{ marginRight: 8 }}>Fuzzy:</span>

          <label>
            <input
              type="checkbox"
              checked={fuzzy.mamdani}
              onChange={() => toggleFuzzy("mamdani")}
            />{" "}
            Mamdani
          </label>

          <label style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={fuzzy.sugeno}
              onChange={() => toggleFuzzy("sugeno")}
            />{" "}
            Sugeno
          </label>

          <label style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={fuzzy.tsukamoto}
              onChange={() => toggleFuzzy("tsukamoto")}
            />{" "}
            Tsukamoto
          </label>
        </div>
      </div>

      {/* ===== MAP RESULT ===== */}
      {tahun && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {fuzzy.mamdani && (
            <MapCard
              title="Fuzzy Mamdani"
              tahun={Number(tahun)}
              metode="mamdani"
              layer={layer}
            />
          )}

          {fuzzy.sugeno && (
            <MapCard
              title="Fuzzy Sugeno"
              tahun={Number(tahun)}
              metode="sugeno"
              layer={layer}
            />
          )}

          {fuzzy.tsukamoto && (
            <MapCard
              title="Fuzzy Tsukamoto"
              tahun={Number(tahun)}
              metode="tsukamoto"
              layer={layer}
            />
          )}
        </div>
      )}
    </AdminLayout>
  );
}

// ================= MAP CARD =================
function MapCard({
  title,
  tahun,
  metode,
  layer,
}: {
  title: string;
  tahun: number;
  metode: "mamdani" | "sugeno" | "tsukamoto";
  layer: LayerState;
}) {
  // Tentukan logika layer untuk MapLeaflet
  const showFuzzy = layer.peta; // Peta dicentang → tampilkan polygon fuzzy
  const showDamkar = layer.damkar; // Damkar dicentang → tampilkan marker damkar
  const showBaseMap = !layer.peta && !layer.damkar; // keduanya mati → tampilkan peta polos

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
      }}
    >
      <h3 style={{ textAlign: "center", color: "#07263B" }}>{title}</h3>

      <div
        style={{
          height: 320,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <MapLeaflet
          tahun={tahun}
          metode={metode}
          showDamkar={showDamkar}
          showFuzzy={showFuzzy}
          showBaseMap={showBaseMap}
        />
      </div>
    </div>
  );
}
