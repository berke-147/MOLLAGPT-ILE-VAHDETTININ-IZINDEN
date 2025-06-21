import React, { useEffect, useState } from "react";

const UYGULAMA_ADI = "HUKUK FAK ÇALIŞMA";
const mainColor = "#7c3aed";
const errorColor = "#ef4444";
const correctColor = "#22c55e";
const bgGradient = "linear-gradient(135deg, #181824 0%, #233356 100%)";
const cardShadow = "0 4px 32px 0 rgba(49, 69, 130, 0.10), 0 1.5px 6px 0 rgba(49, 69, 130, 0.06)";

const DERSLER = [
  "Hukuka Giriş", "Borçlar Genel", "Borçlar Özel", "Ceza Genel", "Ceza Özel",
  "Milletler Arası Hukuk", "İdare Hukuku", "Türk Hukuk Tarihi", "Anayasa Hukuku",
  "Roma Hukuku", "Aile Hukuku", "Medeni Hukuk"
];

// --- SENİN GÜNCEL SHEETBEST API LINKLERİN ---
const SHEET_API = "https://api.sheetbest.com/sheets/23bc6d7b-d5a0-4068-b3b5-dedb85343aae"; // Soru havuzu
const KAYIT_API = "https://api.sheetbest.com/sheets/f97d1aac-7203-4748-a4d4-c5b452b61a94";  // Kayıtlar

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function saveUser(u) {
  window.localStorage.setItem("hukuk-calisma-user", JSON.stringify(u));
}
function getUser() {
  try {
    return JSON.parse(window.localStorage.getItem("hukuk-calisma-user")) || null;
  } catch {
    return null;
  }
}
function formatTelefon(num) {
  let raw = num.replace(/\D/g, "");
  if (raw.startsWith("05")) raw = raw.slice(1);
  if (!raw.startsWith("5")) raw = "5" + raw.replace(/^5*/, "");
  let formatted = raw.slice(0, 3);
  if (raw.length > 3) formatted += " " + raw.slice(3, 6);
  if (raw.length > 6) formatted += " " + raw.slice(6, 8);
  if (raw.length > 8) formatted += " " + raw.slice(8, 10);
  return formatted;
}
function isTelefonValid(num) {
  return /^5\d{2} \d{3} \d{2} \d{2}$/.test(num.trim());
}

export default function Tasarim() {
  // Giriş state
  const [ad, setAd] = useState("");
  const [tel, setTel] = useState("");
  const [ders, setDers] = useState(DERSLER[0]);
  const [user, setUser] = useState(getUser());
  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [bitti, setBitti] = useState(false);
  const [istatistik, setIstatistik] = useState({ dogru: 0, yanlis: 0 });

  // Soruları çek (ve derse göre filtrele)
  useEffect(() => {
    if (!user) return;
    fetch(SHEET_API)
      .then(res => res.json())
      .then(data => {
        // HATALI/FAZLA BOŞLUK vb. varsa toleranslı eşleştirme:
        const filtered = data.filter(s =>
          (s.Ders || "").trim().toLowerCase() === user.ders.trim().toLowerCase()
        );
        setQuestions(shuffle(filtered));
      });
  }, [user]);

  // Kayıt işlemi (quiz bitince)
  useEffect(() => {
    if (bitti) {
      fetch(KAYIT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad: user.ad,
          telefon: user.tel,
          tarih: new Date().toLocaleString("tr-TR"),
          ders: user.ders,
          dogru: istatistik.dogru,
          yanlis: istatistik.yanlis
        })
      });
    }
    // eslint-disable-next-line
  }, [bitti]);

  // Giriş ekranı
  if (!user) {
    const telValid = isTelefonValid(tel);
    const adValid = ad.trim().length > 1;
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: bgGradient, fontFamily: "Inter, sans-serif"
      }}>
        <form onSubmit={e => {
          e.preventDefault();
          if (adValid && telValid) {
            setUser({ ad: ad.trim(), tel: tel.trim(), ders });
            saveUser({ ad: ad.trim(), tel: tel.trim(), ders });
          }
        }} style={{
          background: "#fff2", borderRadius: 18, boxShadow: cardShadow,
          padding: 36, minWidth: 330, textAlign: "center"
        }}>
          <h1 style={{ fontWeight: 900, fontSize: 26, marginBottom: 12, color: "#fff", letterSpacing: 1.1 }}>{UYGULAMA_ADI}</h1>
          <h2 style={{ fontWeight: 700, fontSize: 21, marginBottom: 18, color: "#fff" }}>Quiz Giriş</h2>
          <input
            placeholder="Adınız"
            value={ad}
            onChange={e => setAd(e.target.value)}
            style={{
              padding: "10px 16px", borderRadius: 8, border: "none",
              width: "90%", marginBottom: 13, fontSize: 17, outline: "none"
            }}
            required
          /><br />
          <input
            placeholder="Telefon Numaranız (5XX XXX XX XX)"
            value={tel}
            onChange={e => setTel(formatTelefon(e.target.value))}
            style={{
              padding: "10px 16px", borderRadius: 8,
              border: telValid || tel === "" ? "none" : "2px solid #ef4444",
              width: "90%", marginBottom: 10, fontSize: 17, outline: "none", letterSpacing: 2
            }}
            type="tel"
            maxLength={13}
            pattern="^5\d{2} \d{3} \d{2} \d{2}$"
            required
          /><br />
          <div style={{ color: "#ef4444", height: 18, fontSize: 13, marginBottom: 6 }}>
            {!telValid && tel.length > 0 && "Lütfen telefonunuzu 5XX XXX XX XX şeklinde girin"}
          </div>
          <select value={ders} onChange={e => setDers(e.target.value)} style={{
            padding: "10px 14px", borderRadius: 8, width: "95%", fontSize: 16,
            marginBottom: 19, border: "none", outline: "none", background: "#fff"
          }}>
            {DERSLER.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select><br />
          <button type="submit"
            style={{
              background: mainColor, color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 22px", fontWeight: 700, fontSize: 17,
              cursor: adValid && telValid ? "pointer" : "not-allowed",
              boxShadow: "0 2px 8px #7c3aed22"
            }}
            disabled={!(adValid && telValid)}
          >Başla</button>
        </form>
      </div>
    );
  }

  // Sorular hazır mı?
  if (!questions.length) return <div className="loading">Yükleniyor...</div>;

  const q = questions[current];

  // Quiz bitti ekranı
  if (bitti) {
    return (
      <div style={{
        minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", color: "#fff"
      }}>
        <h2 style={{ fontSize: 32, marginTop: 12 }}>Quiz Bitti!</h2>
        <div style={{ fontWeight: 600, fontSize: 19, margin: "18px 0" }}>
          <span style={{ color: correctColor }}>Doğru: {istatistik.dogru}</span> / <span style={{ color: errorColor }}>Yanlış: {istatistik.yanlis}</span>
        </div>
        <button onClick={() => {
          setCurrent(0); setBitti(false); setSelected(null); setChecked(false);
          setQuestions(shuffle(questions)); setIstatistik({ dogru: 0, yanlis: 0 });
        }} style={{
          background: mainColor, color: "#fff", border: "none", borderRadius: 8,
          padding: "10px 22px", fontWeight: 700, fontSize: 18, marginTop: 8, cursor: "pointer"
        }}>Tekrar Dene</button>
        <button onClick={() => { setUser(null); saveUser(null); }} style={{
          background: "#fff1", color: "#fff", border: "none", borderRadius: 8,
          padding: "8px 20px", fontWeight: 600, fontSize: 15, marginTop: 16, cursor: "pointer"
        }}>Çıkış Yap</button>
      </div>
    );
  }

  // Progress bar
  const progress = Math.round(((current + 1) / questions.length) * 100);

  // Quiz ana ekranı
  return (
    <div style={{
      minHeight: "100vh", background: bgGradient, padding: 0, margin: 0,
      fontFamily: "Inter, sans-serif", color: "#fff"
    }}>
      <div style={{
        maxWidth: 520, margin: "0 auto", padding: "50px 12px 24px", minHeight: "100vh"
      }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 1, marginBottom: 18, textAlign: "center" }}>
          {UYGULAMA_ADI}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{user.ders}</div>
          <div style={{
            fontWeight: 700, fontSize: 15, background: "#fff2", padding: "7px 14px", borderRadius: 8
          }}>
            <span role="img" aria-label="user">👤</span> {user.ad}
          </div>
        </div>
        {/* Progress Bar */}
        <div style={{
          width: "100%", height: 8, background: "#393a50", borderRadius: 8, overflow: "hidden", marginBottom: 16
        }}>
          <div style={{
            width: `${progress}%`, height: "100%", background: mainColor, borderRadius: 8,
            transition: "width 0.5s cubic-bezier(.5,1,.5,1)"
          }} />
        </div>
        {/* Soru Kartı */}
        <div style={{
          background: "#fff2", padding: 30, borderRadius: 22, boxShadow: cardShadow, marginBottom: 22,
          minHeight: 170, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1.5px solid #393a50"
        }}>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 20, color: "#fff" }}>{q.Soru}</div>
          <div style={{ display: "grid", gap: 14, marginBottom: 5 }}>
            {[q.A, q.B, q.C, q.D].map((opt, i) => (
              <button key={i}
                onClick={() => !checked && setSelected(i)}
                disabled={checked}
                style={{
                  textAlign: "left", padding: "14px 18px", borderRadius: 13, fontSize: 16,
                  border:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? `2.5px solid ${correctColor}`
                          : `2.5px solid ${errorColor}`
                        : `2.5px solid ${mainColor}`
                      : "1.5px solid #393a50",
                  background:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? "#24fbb315"
                          : "#ff7b8c18"
                        : "#bdbbf61c"
                      : "#242944bb",
                  color: "#fff", fontWeight: selected === i ? 700 : 500, transition: "all 0.13s",
                  boxShadow:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? "0 0 9px #24fbb377"
                          : "0 0 9px #ff7b8c44"
                        : "0 0 6px #7c3aed33"
                      : "",
                  cursor: checked ? "default" : "pointer", outline: "none"
                }}
                onMouseOver={e => {
                  if (!checked && selected !== i)
                    e.currentTarget.style.background = "#7c3aed1a";
                }}
                onMouseOut={e => {
                  if (!checked && selected !== i)
                    e.currentTarget.style.background = "#242944bb";
                }}
              >
                <span style={{ opacity: 0.5, fontWeight: 700 }}>
                  {"ABCD"[i]}){" "}
                </span>
                {opt}
              </button>
            ))}
          </div>
          {!checked ? (
            <button
              onClick={() => {
                setChecked(true);
                setIstatistik(ist =>
                  selected === Number(q.DogruCevap)
                    ? { ...ist, dogru: ist.dogru + 1 }
                    : { ...ist, yanlis: ist.yanlis + 1 }
                );
                if (current === questions.length - 1) setBitti(true);
              }}
              disabled={selected === null}
              style={{
                marginTop: 22, width: "100%", padding: 14, background: mainColor, color: "#fff",
                border: "none", borderRadius: 11, fontWeight: 700, fontSize: 16,
                boxShadow: "0 4px 15px #7c3aed18", cursor: selected === null ? "not-allowed" : "pointer"
              }}
            >
              Kontrol Et
            </button>
          ) : (
            <>
              <div
                style={{
                  marginTop: 18, padding: 13, borderRadius: 10,
                  background:
                    selected === Number(q.DogruCevap)
                      ? "#24fbb325"
                      : "#ff7b8c24",
                  color:
                    selected === Number(q.DogruCevap)
                      ? correctColor
                      : errorColor,
                  fontWeight: 700, fontSize: 16, minHeight: 32,
                  boxShadow:
                    selected === Number(q.DogruCevap)
                      ? "0 0 8px #22c55e66"
                      : "0 0 8px #ef444466"
                }}
              >
                {selected === Number(q.DogruCevap) ? "Doğru!" : "Yanlış!"}
                <br />
                <span style={{ fontSize: 14, color: "#fff" }}>{q.Aciklama}</span>
              </div>
              {current !== questions.length - 1 && (
                <button
                  onClick={() => {
                    setCurrent(c => c + 1);
                    setSelected(null);
                    setChecked(false);
                  }}
                  style={{
                    marginTop: 14, width: "100%", padding: 14, background: correctColor, color: "#fff",
                    border: "none", borderRadius: 11, fontWeight: 700, fontSize: 16,
                    boxShadow: "0 4px 12px #22c55e33", cursor: "pointer"
                  }}
                >
                  Sonraki Soru
                </button>
              )}
              {current === questions.length - 1 && !bitti && (
                <button
                  onClick={() => setBitti(true)}
                  style={{
                    marginTop: 14, width: "100%", padding: 14, background: errorColor, color: "#fff",
                    border: "none", borderRadius: 11, fontWeight: 700, fontSize: 16,
                    boxShadow: "0 4px 12px #ef4444aa", cursor: "pointer"
                  }}
                >
                  Bitir
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`
        .loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          color: #7c3aed;
          background: ${bgGradient};
          letter-spacing: 1.5px;
        }
      `}</style>
    </div>
  );
}
