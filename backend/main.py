from fastapi import FastAPI
from mamdani import run_mamdani
from sugeno import run_sugeno
from tsukamoto import run_tsukamoto

app = FastAPI()

@app.post("/fuzzy")
def run_fuzzy(data: dict):
    m_val, m_cat = run_mamdani(data)
    s_val, s_cat = run_sugeno(data)
    t_val, t_cat = run_tsukamoto(data)

    return {
        "mamdani": {
            "crisp": m_val,
            "kategori": m_cat
        },
        "sugeno": {
            "crisp": s_val,
            "kategori": s_cat
        },
        "tsukamoto": {
            "crisp": t_val,
            "kategori": t_cat
        }
    }
