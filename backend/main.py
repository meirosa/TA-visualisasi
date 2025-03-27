from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import skfuzzy as fuzz
import skfuzzy.control as ctrl
import logging

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

class FuzzyInput(BaseModel):
    curah_hujan: float
    history_banjir: float
    kepadatan_penduduk: float
    taman_drainase: float

# Definisi variabel fuzzy
curah_hujan = ctrl.Antecedent(np.arange(162.3, 217.3, 0.1), 'curah_hujan')
history_banjir = ctrl.Antecedent(np.arange(0, 15, 1), 'history_banjir')
kepadatan_penduduk = ctrl.Antecedent(np.arange(43345, 239273, 1000), 'kepadatan_penduduk')
taman_drainase = ctrl.Antecedent(np.arange(0, 26, 1), 'taman_drainase')
kategori = ctrl.Consequent(np.arange(0, 100, 1), 'kategori')

# Himpunan Fuzzy Trapesium
taman_drainase['Rendah'] = fuzz.trapmf(taman_drainase.universe, [0, 0, 5, 10])
taman_drainase['Sedang'] = fuzz.trapmf(taman_drainase.universe, [5, 10, 15, 20])
taman_drainase['Tinggi'] = fuzz.trapmf(taman_drainase.universe, [15, 20, 25, 25])

curah_hujan['Rendah'] = fuzz.trapmf(curah_hujan.universe, [162.3, 162.3, 175, 185])
curah_hujan['Sedang'] = fuzz.trapmf(curah_hujan.universe, [175, 185, 200, 210])
curah_hujan['Tinggi'] = fuzz.trapmf(curah_hujan.universe, [200, 210, 217.2, 217.2])

history_banjir['Rendah'] = fuzz.trapmf(history_banjir.universe, [0, 0, 4, 7])
history_banjir['Sedang'] = fuzz.trapmf(history_banjir.universe, [4, 7, 10, 13])
history_banjir['Tinggi'] = fuzz.trapmf(history_banjir.universe, [10, 13, 14, 14])

kepadatan_penduduk['Rendah'] = fuzz.trapmf(kepadatan_penduduk.universe, [43345, 43345, 100000, 150000])
kepadatan_penduduk['Sedang'] = fuzz.trapmf(kepadatan_penduduk.universe, [100000, 150000, 190000, 230000])
kepadatan_penduduk['Tinggi'] = fuzz.trapmf(kepadatan_penduduk.universe, [190000, 230000, 239272, 239272])

kategori['Rendah'] = fuzz.trapmf(kategori.universe, [0, 0, 30, 50])
kategori['Sedang'] = fuzz.trapmf(kategori.universe, [30, 50, 70, 90])
kategori['Tinggi'] = fuzz.trapmf(kategori.universe, [70, 90, 100, 100])

# Aturan Fuzzy
rules = [
    ctrl.Rule(curah_hujan['Tinggi'] & (history_banjir['Tinggi'] | kepadatan_penduduk['Tinggi'] | taman_drainase['Rendah']), kategori['Tinggi']),
    ctrl.Rule(curah_hujan['Sedang'] & history_banjir['Tinggi'] & kepadatan_penduduk['Tinggi'], kategori['Tinggi']),
    ctrl.Rule(curah_hujan['Sedang'] & (history_banjir['Sedang'] | kepadatan_penduduk['Sedang']), kategori['Sedang']),
    ctrl.Rule(history_banjir['Sedang'] & kepadatan_penduduk['Sedang'], kategori['Sedang']),
    ctrl.Rule(curah_hujan['Tinggi'] & taman_drainase['Sedang'], kategori['Sedang']),
    ctrl.Rule(curah_hujan['Sedang'] & history_banjir['Tinggi'], kategori['Sedang']),
    ctrl.Rule(curah_hujan['Tinggi'] & history_banjir['Sedang'] & kepadatan_penduduk['Sedang'], kategori['Sedang']),
    ctrl.Rule(history_banjir['Tinggi'] & taman_drainase['Sedang'], kategori['Sedang']),
    ctrl.Rule(curah_hujan['Rendah'] & (history_banjir['Rendah'] | kepadatan_penduduk['Rendah']), kategori['Rendah']),
    ctrl.Rule(history_banjir['Rendah'] & taman_drainase['Tinggi'], kategori['Rendah']),
    ctrl.Rule(curah_hujan['Sedang'] & taman_drainase['Tinggi'], kategori['Rendah']),
    ctrl.Rule(curah_hujan['Rendah'] & (history_banjir['Sedang'] | kepadatan_penduduk['Sedang']), kategori['Rendah']),
    ctrl.Rule(curah_hujan['Sedang'] & history_banjir['Rendah'] & kepadatan_penduduk['Rendah'], kategori['Rendah'])
]

kerawanan_ctrl = ctrl.ControlSystem(rules)

@app.post("/fuzzy")
async def hitung_fuzzy(data: FuzzyInput):
    kerawanan = ctrl.ControlSystemSimulation(kerawanan_ctrl)
    
    # Pastikan nilai dalam batas
    data.curah_hujan = np.clip(data.curah_hujan, 162.3, 217.2)
    data.history_banjir = np.clip(data.history_banjir, 0, 14)
    data.kepadatan_penduduk = np.clip(data.kepadatan_penduduk, 43345, 239272)
    data.taman_drainase = np.clip(data.taman_drainase, 0, 25)

    kerawanan.input['curah_hujan'] = data.curah_hujan
    kerawanan.input['history_banjir'] = data.history_banjir
    kerawanan.input['kepadatan_penduduk'] = data.kepadatan_penduduk
    kerawanan.input['taman_drainase'] = data.taman_drainase
    
    kerawanan.compute()
    hasil = kerawanan.output['kategori']
    
    if hasil < 40:
        kategori_label = "Rendah"
        cluster = 0
    elif hasil < 70:
        kategori_label = "Sedang"
        cluster = 1
    else:
        kategori_label = "Tinggi"
        cluster = 2
    
    return {"kategori": kategori_label, "centroid": round(hasil, 3), "cluster": cluster}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
