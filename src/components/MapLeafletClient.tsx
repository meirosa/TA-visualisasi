"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import type { Layer, PathOptions } from "leaflet";

// =====================
// FIX LEAFLET RESIZE (ANTI KEPOTONG)
function FixLeafletResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
}

// =====================
// INTERFACES
// =====================
interface FuzzyData {
  kecamatan: string;
  kategori: string | null;
  crisp_value: number | null;
  kepadatan: number;
  curah_hujan: number;
  history_banjir: number;
  taman_drainase: number;
}

interface Damkar {
  id_damkar: number;
  nama: string;
  alamat: string;
  telepon: string;
  latitude: number;
  longitude: number;
}

interface Props {
  tahun: number;
  metode: "mamdani" | "sugeno" | "tsukamoto";
  showDamkar: boolean;
  showFuzzy: boolean;
  showBaseMap?: boolean;
}

// 🔴 PROPS GEOJSON
interface FeatureProps {
  kecamatan?: string;
  KECAMATAN?: string;
  WADMKC?: string;
  NAMOBJ?: string;
  [key: string]: string | number | undefined;
}

// =====================
// ICON DAMKAR
const damkarIcon = new L.Icon({
  iconUrl: "/pointmap.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// =====================
export default function MapLeafletClient({
  tahun,
  metode,
  showDamkar,
  showFuzzy,
  showBaseMap,
}: Props) {
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry> | null>(
    null,
  );
  const [fuzzyData, setFuzzyData] = useState<FuzzyData[]>([]);
  const [damkar, setDamkar] = useState<Damkar[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // =====================
  // HELPERS
  const normalize = (s?: string | number) =>
    String(s ?? "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");

  const formatRibuan = (n?: number) =>
    n === undefined ? "-" : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const getColor = (kategori?: string | null) => {
    const k = normalize(kategori ?? "");
    if (k === "tinggi") return "#e74c3c";
    if (k === "sedang") return "#f1c40f";
    if (k === "rendah") return "#2ecc71";
    return "#bdc3c7";
  };

  // =====================
  // FETCH DATA
  useEffect(() => {
    fetch("/sby.geojson")
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error("GeoJSON load error:", err));
  }, []);

  useEffect(() => {
    fetch(`/api/leaflet?tahun=${tahun}&metode=${metode}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFuzzyData(data);
        else setFuzzyData([]);
      })
      .catch((err) => console.error("FuzzyData load error:", err));
  }, [tahun, metode]);

  useEffect(() => {
    fetch("/api/damkar")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDamkar(data);
        else setDamkar([]);
      })
      .catch((err) => console.error("Damkar load error:", err));
  }, []);

  // =====================
  // STYLE FEATURE
  const styleFeature = (feature?: Feature<Geometry>): PathOptions => {
    const props = feature?.properties as FeatureProps;
    const nama =
      props?.kecamatan ??
      props?.KECAMATAN ??
      props?.WADMKC ??
      props?.NAMOBJ ??
      "";

    const match = fuzzyData.find((d) => {
      const n1 = normalize(d.kecamatan);
      const n2 = normalize(nama);
      return n1 === n2 || n1.includes(n2) || n2.includes(n1);
    });

    return {
      fillColor: getColor(match?.kategori),
      weight: 1,
      color: "black",
      fillOpacity: 0.7,
    };
  };

  // =====================
  // POPUP + TOOLTIP
  const onEachFeature = (feature: Feature, layer: Layer) => {
    const props = feature.properties as FeatureProps;
    const nama =
      props.kecamatan ?? props.KECAMATAN ?? props.WADMKC ?? props.NAMOBJ ?? "-";

    const match = fuzzyData.find((d) => {
      const n1 = normalize(d.kecamatan);
      const n2 = normalize(nama);
      return n1 === n2 || n1.includes(n2) || n2.includes(n1);
    });

    const popupContent = `
      <div style="min-width:160px">
        <b>${nama}</b><br/>
        Kepadatan: ${formatRibuan(match?.kepadatan)}<br/>
        Curah Hujan: ${match?.curah_hujan ?? "-"}<br/>
        History Banjir: ${match?.history_banjir ?? "-"}<br/>
        Taman & Drainase: ${match?.taman_drainase ?? "-"}<br/>
        Crisp Value: ${match?.crisp_value ?? "-"}<br/>
        Kategori: ${match?.kategori ?? "-"}
      </div>
    `;
    layer.bindPopup(popupContent);

    layer.bindTooltip(
      L.tooltip({
        permanent: true,
        direction: "center",
        className: "label-no-bg",
      }).setContent(nama),
    );
  };

  if (!geoData) return <p>Loading map...</p>;

  return (
    <div ref={mapRef}>
      <MapContainer
        center={[-7.2575, 112.7521]}
        zoom={11}
        style={{ height: "100vh", width: "100%" }}
      >
        <FixLeafletResize />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {showFuzzy && geoData && fuzzyData.length > 0 && (
          <GeoJSON
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}

        {showDamkar &&
          damkar.map((d) => (
            <Marker
              key={d.id_damkar}
              position={[d.latitude, d.longitude]}
              icon={damkarIcon}
            >
              <Popup>
                <b>{d.nama}</b>
                <br />
                {d.alamat}
                <br />
                Telp: {d.telepon}
              </Popup>
            </Marker>
          ))}

        {showBaseMap && !showFuzzy && !showDamkar && (
          <GeoJSON
            data={geoData}
            style={{
              fillColor: "#ecf0f1",
              color: "#bdc3c7",
              weight: 1,
              fillOpacity: 0.5,
            }}
          />
        )}
      </MapContainer>

      <style>{`
        .label-no-bg {
          background: none !important;
          border: none !important;
          box-shadow: none !important;
          font-weight: bold;
          color: black;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
