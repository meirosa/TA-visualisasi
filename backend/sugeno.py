# ===============================
# FUZZY SUGENO ORDO NOL
# ===============================

def trapmf(x, a, b, c, d):
    if x <= a or x >= d:
        return 0
    elif a < x <= b:
        return (x - a) / (b - a) if b != a else 1
    elif b < x <= c:
        return 1
    elif c < x < d:
        return (d - x) / (d - c)
    return 0


def fuzzifikasi(data):
    return {
        "curah_hujan": {
            "Rendah": trapmf(data["curah_hujan"],131.7,131.7,150,170),
            "Sedang": trapmf(data["curah_hujan"],160,175,190,205),
            "Tinggi": trapmf(data["curah_hujan"],195,205,217.2,217.2)
        },
        "history_banjir": {
            "Rendah": trapmf(data["history_banjir"],0,0,1.5,2.5),
            "Sedang": trapmf(data["history_banjir"],1.5,2.5,2.5,3.5),
            "Tinggi": trapmf(data["history_banjir"],2.5,3.5,5,5)
        },
        "kepadatan_penduduk": {
            "Rendah": trapmf(data["kepadatan_penduduk"],41289,41289,60000,100000),
            "Sedang": trapmf(data["kepadatan_penduduk"],90000,120000,160000,190000),
            "Tinggi": trapmf(data["kepadatan_penduduk"],170000,200000,239272,239272)
        },
        "taman_drainase": {
            "Rendah": trapmf(data["taman_drainase"],6,6,20,35),
            "Sedang": trapmf(data["taman_drainase"],30,40,55,65),
            "Tinggi": trapmf(data["taman_drainase"],60,65,76,76)
        }
    }


# ===============================
# RULE BASE
# ===============================
rules_sugeno = [
    (["Tinggi","Tinggi","-","Rendah"], "Tinggi"),
    (["Tinggi","-","Tinggi","Rendah"], "Tinggi"),
    (["Tinggi","Tinggi","Tinggi","-"], "Tinggi"),
    (["Sedang","Tinggi","-","Rendah"], "Sedang"),
    (["Sedang","Sedang","-","-"], "Sedang"),
    (["Tinggi","Sedang","-","-"], "Sedang"),
    (["-","Sedang","Tinggi","-"], "Sedang"),
    (["-","-","-","Tinggi"], "Rendah"),
    (["Rendah","Rendah","-","-"], "Rendah"),
    (["Rendah","-","-","-"], "Rendah"),
]

output_crisp = {
    "Rendah": 20,
    "Sedang": 50,
    "Tinggi": 80
}


# ===============================
# MAIN FUNCTION
# ===============================
def run_sugeno(data: dict):
    fuzz = fuzzifikasi(data)

    numerator = 0
    denominator = 0

    for rule, label in rules_sugeno:
        alpha = []

        if rule[0] != "-":
            alpha.append(fuzz["curah_hujan"][rule[0]])
        if rule[1] != "-":
            alpha.append(fuzz["history_banjir"][rule[1]])
        if rule[2] != "-":
            alpha.append(fuzz["kepadatan_penduduk"][rule[2]])
        if rule[3] != "-":
            alpha.append(fuzz["taman_drainase"][rule[3]])

        if alpha:
            firing = min(alpha)
            numerator += firing * output_crisp[label]
            denominator += firing

    z = numerator / denominator if denominator != 0 else 20

    if z < 40:
        kategori = "Rendah"
    elif z < 70:
        kategori = "Sedang"
    else:
        kategori = "Tinggi"

    return round(z, 3), kategori
