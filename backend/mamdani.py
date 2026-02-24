# ======================================================
# IMPORT
# ======================================================
import numpy as np
import skfuzzy as fuzz
import skfuzzy.control as ctrl

# ======================================================
# DEFINISI VARIABEL FUZZY
# ======================================================
curah_hujan = ctrl.Antecedent(np.arange(131.7, 217.3+0.1, 0.1), "curah_hujan")
history_banjir = ctrl.Antecedent(np.arange(0, 6+0.1, 0.1), "history_banjir")
kepadatan_penduduk = ctrl.Antecedent(np.arange(41289, 239273+1, 1), "kepadatan_penduduk")
taman_drainase = ctrl.Antecedent(np.arange(6, 77+1, 1), "taman_drainase")
kategori = ctrl.Consequent(np.arange(0, 101, 1), "kategori")

# ======================================================
# MEMBERSHIP FUNCTION
# ======================================================
curah_hujan["Rendah"] = fuzz.trapmf(curah_hujan.universe, [131.7, 131.7, 150, 170])
curah_hujan["Sedang"] = fuzz.trapmf(curah_hujan.universe, [160, 175, 190, 205])
curah_hujan["Tinggi"] = fuzz.trapmf(curah_hujan.universe, [195, 205, 217.2, 217.2])

history_banjir["Rendah"] = fuzz.trapmf(history_banjir.universe, [0, 0, 1, 2])
history_banjir["Sedang"] = fuzz.trapmf(history_banjir.universe, [1.5, 2, 3, 3.5])
history_banjir["Tinggi"] = fuzz.trapmf(history_banjir.universe, [3, 4, 5, 5])

kepadatan_penduduk["Rendah"] = fuzz.trapmf(kepadatan_penduduk.universe, [41289, 41289, 60000, 100000])
kepadatan_penduduk["Sedang"] = fuzz.trapmf(kepadatan_penduduk.universe, [90000, 120000, 160000, 190000])
kepadatan_penduduk["Tinggi"] = fuzz.trapmf(kepadatan_penduduk.universe, [170000, 200000, 239272, 239272])

taman_drainase["Rendah"] = fuzz.trapmf(taman_drainase.universe, [6,6,20,35])
taman_drainase["Sedang"] = fuzz.trapmf(taman_drainase.universe, [30,40,55,65])
taman_drainase["Tinggi"] = fuzz.trapmf(taman_drainase.universe, [60,65,76,76])

kategori["Rendah"] = fuzz.trapmf(kategori.universe, [0,0,30,45])
kategori["Sedang"] = fuzz.trapmf(kategori.universe, [40,50,65,80])
kategori["Tinggi"] = fuzz.trapmf(kategori.universe, [70,85,100,100])

# ======================================================
# RULE BASE
# ======================================================
rules = [
    ctrl.Rule(history_banjir["Tinggi"] & curah_hujan["Tinggi"] & taman_drainase["Rendah"], kategori["Tinggi"]),
    ctrl.Rule(history_banjir["Tinggi"] & kepadatan_penduduk["Tinggi"] & taman_drainase["Rendah"], kategori["Tinggi"]),
    ctrl.Rule(history_banjir["Tinggi"] & curah_hujan["Tinggi"] & kepadatan_penduduk["Tinggi"], kategori["Tinggi"]),
    ctrl.Rule(history_banjir["Sedang"] & curah_hujan["Tinggi"] & taman_drainase["Rendah"], kategori["Sedang"]),
    ctrl.Rule(history_banjir["Sedang"] & curah_hujan["Sedang"], kategori["Sedang"]),
    ctrl.Rule(history_banjir["Tinggi"] & curah_hujan["Sedang"], kategori["Sedang"]),
    ctrl.Rule(curah_hujan["Sedang"] & kepadatan_penduduk["Tinggi"], kategori["Sedang"]),
    ctrl.Rule(taman_drainase["Tinggi"], kategori["Rendah"]),
    ctrl.Rule(history_banjir["Rendah"] & curah_hujan["Rendah"], kategori["Rendah"]),
    ctrl.Rule(history_banjir["Rendah"], kategori["Rendah"]),
]

system = ctrl.ControlSystem(rules)

# ======================================================
# FUNGSI YANG DIPANGGIL API
# ======================================================
# ======================================================
# IMPORT
# ======================================================
import numpy as np
import skfuzzy as fuzz
import skfuzzy.control as ctrl

# ======================================================
# DEFINISI VARIABEL FUZZY
# ======================================================
curah_hujan = ctrl.Antecedent(np.arange(131.7, 217.3+0.1, 0.1), "curah_hujan")
history_banjir = ctrl.Antecedent(np.arange(0, 6+0.1, 0.1), "history_banjir")
kepadatan_penduduk = ctrl.Antecedent(np.arange(41289, 239273+1, 1), "kepadatan_penduduk")
taman_drainase = ctrl.Antecedent(np.arange(6, 77+1, 1), "taman_drainase")
kategori = ctrl.Consequent(np.arange(0, 101, 1), "kategori")

# ======================================================
# MEMBERSHIP FUNCTION
# ======================================================
curah_hujan["Rendah"] = fuzz.trapmf(curah_hujan.universe, [131.7, 131.7, 150, 170])
curah_hujan["Sedang"] = fuzz.trapmf(curah_hujan.universe, [160, 175, 190, 205])
curah_hujan["Tinggi"] = fuzz.trapmf(curah_hujan.universe, [195, 205, 217.2, 217.2])

history_banjir["Rendah"] = fuzz.trapmf(history_banjir.universe, [0, 0, 1, 2])
history_banjir["Sedang"] = fuzz.trapmf(history_banjir.universe, [1.5, 2, 3, 3.5])
history_banjir["Tinggi"] = fuzz.trapmf(history_banjir.universe, [3, 4, 5, 5])

kepadatan_penduduk["Rendah"] = fuzz.trapmf(kepadatan_penduduk.universe, [41289, 41289, 60000, 100000])
kepadatan_penduduk["Sedang"] = fuzz.trapmf(kepadatan_penduduk.universe, [90000, 120000, 160000, 190000])
kepadatan_penduduk["Tinggi"] = fuzz.trapmf(kepadatan_penduduk.universe, [170000, 200000, 239272, 239272])

taman_drainase["Rendah"] = fuzz.trapmf(taman_drainase.universe, [6,6,20,35])
taman_drainase["Sedang"] = fuzz.trapmf(taman_drainase.universe, [30,40,55,65])
taman_drainase["Tinggi"] = fuzz.trapmf(taman_drainase.universe, [60,65,76,76])

kategori["Rendah"] = fuzz.trapmf(kategori.universe, [0,0,30,45])
kategori["Sedang"] = fuzz.trapmf(kategori.universe, [40,50,65,80])
kategori["Tinggi"] = fuzz.trapmf(kategori.universe, [70,85,100,100])

# ======================================================
# RULE BASE
# ======================================================
rules = [
    ctrl.Rule(history_banjir["Tinggi"] & curah_hujan["Tinggi"] & taman_drainase["Rendah"], kategori["Tinggi"]),
    ctrl.Rule(history_banjir["Tinggi"] & kepadatan_penduduk["Tinggi"] & taman_drainase["Rendah"], kategori["Tinggi"]),
    ctrl.Rule(history_banjir["Tinggi"] & curah_hujan["Tinggi"] & kepadatan_penduduk["Tinggi"], kategori["Tinggi"]),
    ctrl.Rule(history_banjir["Sedang"] & curah_hujan["Tinggi"] & taman_drainase["Rendah"], kategori["Sedang"]),
    ctrl.Rule(history_banjir["Sedang"] & curah_hujan["Sedang"], kategori["Sedang"]),
    ctrl.Rule(history_banjir["Tinggi"] & curah_hujan["Sedang"], kategori["Sedang"]),
    ctrl.Rule(curah_hujan["Sedang"] & kepadatan_penduduk["Tinggi"], kategori["Sedang"]),
    ctrl.Rule(taman_drainase["Tinggi"], kategori["Rendah"]),
    ctrl.Rule(history_banjir["Rendah"] & curah_hujan["Rendah"], kategori["Rendah"]),
    ctrl.Rule(history_banjir["Rendah"], kategori["Rendah"]),
]

system = ctrl.ControlSystem(rules)

# ======================================================
# FUNGSI YANG DIPANGGIL API
# ======================================================
def run_mamdani(data: dict):
    sim = ctrl.ControlSystemSimulation(system)

    sim.input["curah_hujan"] = data["curah_hujan"]
    sim.input["history_banjir"] = data["history_banjir"]
    sim.input["kepadatan_penduduk"] = data["kepadatan_penduduk"]
    sim.input["taman_drainase"] = data["taman_drainase"]

    try:
        sim.compute()
        nilai = float(round(sim.output["kategori"], 3))
    except:
        nilai = 20.0

    if nilai < 40:
        label = "Rendah"
    elif nilai < 70:
        label = "Sedang"
    else:
        label = "Tinggi"

    return nilai, label
