import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/utils/supabase";

// Import komponen Map secara dinamis agar tidak dirender di server
const MapWithNoSSR = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      return function MapComponent(
        props: React.ComponentProps<typeof mod.MapContainer>
      ) {
        return (
          <mod.MapContainer {...props} className="w-full h-full">
            <mod.TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.children}
          </mod.MapContainer>
        );
      };
    }),
  { ssr: false }
);

const MarkerNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const PopupNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

type Damkar = {
  id: number;
  nama: string;
  alamat: string;
  telepon: string;
  latitude: number;
  longitude: number;
};

export default function DamkarPage() {
  const [damkarList, setDamkarList] = useState<Damkar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("leaflet").then((L) => {
      const DefaultIcon = L.icon({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;
    });

    async function fetchDamkar() {
      const { data, error } = await supabase
        .from("damkar")
        .select("id, nama, alamat, telepon, latitude, longitude");

      if (error) {
        console.error("Error fetching damkar data:", error);
      } else if (data) {
        setDamkarList(data as Damkar[]);
      }
      setLoading(false);
    }

    fetchDamkar();
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
          Memuat data damkar...
        </div>
      </AdminLayout>
    );

  const centerPosition: [number, number] = damkarList.length
    ? [damkarList[0].longitude, damkarList[0].latitude]
    : [-7.257472, 112.75209];

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row gap-8 p-4 bg-gray-100">
        {/* Daftar Damkar */}
        <div className="bg-white rounded-lg shadow-md p-4 max-w-md max-h-[70vh] overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Daftar Damkar
          </h1>
          <ul className="list-none p-0 m-0 flex flex-col gap-4">
            {damkarList.map((damkar) => (
              <li
                key={damkar.id}
                className="border border-gray-300 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <h2 className="font-semibold text-xl mb-1 text-gray-900">
                  {damkar.nama}
                </h2>
                <p className="mb-1 text-gray-700">
                  <strong>Alamat:</strong> {damkar.alamat}
                </p>
                <p className="text-gray-700">
                  <strong>Telepon:</strong> {damkar.telepon}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Peta Damkar */}
        <div
          className="rounded-lg overflow-hidden shadow-md w-full"
          style={{ blockSize: "70vh" }} // gunakan properti logis
        >
          <MapWithNoSSR center={centerPosition} zoom={13}>
            {damkarList.map((damkar) => (
              <MarkerNoSSR
                key={damkar.id}
                position={[damkar.longitude, damkar.latitude]}
              >
                <PopupNoSSR>
                  <div>
                    <strong>{damkar.nama}</strong>
                    <br />
                    {damkar.alamat}
                    <br />
                    <span>{damkar.telepon}</span>
                  </div>
                </PopupNoSSR>
              </MarkerNoSSR>
            ))}
          </MapWithNoSSR>
        </div>
      </div>
    </AdminLayout>
  );
}
