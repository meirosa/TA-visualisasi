# backend/tsukamoto.py

# ======================================================
# FUNGSI KEANGGOTAAN TRAPESIUM
# ======================================================
def trapmf(x, a, b, c, d):
    if x <= a or x >= d:
        return 0.0
    elif b <= x <= c:
        return 1.0
    elif a < x < b:
        return (x - a) / (b - a)
    else:
        return (d - x) / (d - c)


# ======================================================
# FUZZIFIKASI
# ======================================================
def fuzzifikasi(data):
    return {
        "curah_hujan": {
            "Rendah": trapmf(data["curah_hujan"],131.7,131.7,150,170),
            "Sedang": trapmf(data["curah_hujan"],160,175,190,205),
            "Tinggi": trapmf(data["curah_hujan"],195,205,217.2,217.2),
        },
        "history_banjir": {
            "Rendah": trapmf(data["history_banjir"],0,0,1.5,2.5),
            "Sedang": trapmf(data["history_banjir"],1.5,2.5,2.5,3.5),
            "Tinggi": trapmf(data["history_banjir"],2.5,3.5,5,5),
        },
        "kepadatan_penduduk": {
            "Rendah": trapmf(data["kepadatan_penduduk"],41289,41289,60000,100000),
            "Sedang": trapmf(data["kepadatan_penduduk"],90000,120000,160000,190000),
            "Tinggi": trapmf(data["kepadatan_penduduk"],170000,200000,239272,239272),
        },
        "taman_drainase": {
            "Rendah": trapmf(data["taman_drainase"],6,6,20,35),
            "Sedang": trapmf(data["taman_drainase"],30,40,55,65),
            "Tinggi": trapmf(data["taman_drainase"],60,65,76,76),
        },
    }


# ======================================================
# FUNGSI OUTPUT LINEAR (MONOTON)
# ======================================================
def z_rendah(alpha):
    return 0 + alpha * 40

def z_sedang(alpha):
    return 40 + alpha * 30

def z_tinggi(alpha):
    return 70 + alpha * 30


# ======================================================
# INFERENSI + AGREGASI TSUKAMOTO
# ======================================================
def run_tsukamoto(data: dict):
    fuzz = fuzzifikasi(data)

    # RULE BASE
    rules = [
        (min(fuzz["history_banjir"]["Tinggi"], fuzz["curah_hujan"]["Tinggi"], fuzz["taman_drainase"]["Rendah"]), z_tinggi),
        (min(fuzz["history_banjir"]["Tinggi"], fuzz["kepadatan_penduduk"]["Tinggi"], fuzz["taman_drainase"]["Rendah"]), z_tinggi),
        (min(fuzz["history_banjir"]["Tinggi"], fuzz["curah_hujan"]["Tinggi"], fuzz["kepadatan_penduduk"]["Tinggi"]), z_tinggi),
        (min(fuzz["history_banjir"]["Sedang"], fuzz["curah_hujan"]["Tinggi"], fuzz["taman_drainase"]["Rendah"]), z_sedang),
        (min(fuzz["history_banjir"]["Sedang"], fuzz["curah_hujan"]["Sedang"]), z_sedang),
        (min(fuzz["history_banjir"]["Tinggi"], fuzz["curah_hujan"]["Sedang"]), z_sedang),
        (min(fuzz["curah_hujan"]["Sedang"], fuzz["kepadatan_penduduk"]["Tinggi"]), z_sedang),
        (fuzz["taman_drainase"]["Tinggi"], z_rendah),
        (min(fuzz["history_banjir"]["Rendah"], fuzz["curah_hujan"]["Rendah"]), z_rendah),
        (fuzz["history_banjir"]["Rendah"], z_rendah),
    ]

    numerator = 0.0
    denominator = 0.0

    for alpha, z_func in rules:
        if alpha > 0:
            z = z_func(alpha)
            numerator += alpha * z
            denominator += alpha

    crisp = round(numerator / denominator, 3) if denominator != 0 else 20

    # KATEGORI
    if crisp < 40:
        kategori = "Rendah"
    elif crisp < 70:
        kategori = "Sedang"
    else:
        kategori = "Tinggi"

    return crisp, kategori
