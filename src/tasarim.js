import React, { useState, useEffect, useRef } from "react";

// Sabitler
const UYGULAMA_ADI = "HUKUK FAK ÇALIŞMA";
const mainColor = "#7c3aed";
const errorColor = "#ef4444";
const correctColor = "#22c55e";
const bgGradient = "linear-gradient(135deg, #181824 0%, #233356 100%)";
const cardShadow = "0 4px 32px 0 rgba(49, 69, 130, 0.10), 0 1.5px 6px 0 rgba(49, 69, 130, 0.06)";
const DERSLER = [
  { ad: "Hukuka Giriş", konular: ["Genel", "Kavramlar", "Kaynaklar"] },
  { ad: "Borçlar Genel", konular: ["Genel Hükümler", "Sözleşmeler"] },
  { ad: "Borçlar Özel", konular: ["Satım", "Kira", "Bağışlama"] },
  { ad: "Ceza Genel", konular: ["Kusur", "Kast", "Taksir"] },
  { ad: "Ceza Özel", konular: ["Kasten Öldürme", "Hırsızlık"] },
];
const KARMA_SECENEK = { ad: "Karma Quiz (Tüm Dersler)", konular: [] };
const SORU_SAYILARI = [5, 10, 20, 50];
const SHEET_API = "https://api.sheetbest.com/sheets/23bc6d7b-d5a0-4068-b3b5-dedb85343aae";
const KAYIT_API = "https://api.sheetbest.com/sheets/f97d1aac-7203-4748-a4d4-c5b452b61a94";

// Yardımcı Fonksiyonlar
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

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^\w]+/g, "-");
}

// StatsBar Component
function StatsBar({ dogru, yanlis, toplam, bonus }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 18, margin: "14px 0 2px 0" }}>
      <div style={{ color: correctColor, fontWeight: 700, fontSize: 14, background: "#22c55e22", borderRadius: 7, padding: "2px 13px" }}>
        ✔ Doğru: {dogru}
      </div>
      <div style={{ color: errorColor, fontWeight: 700, fontSize: 14, background: "#ef444422", borderRadius: 7, padding: "2px 13px" }}>
        ✖ Yanlış: {yanlis}
      </div>
      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, background: "#7c3aed33", borderRadius: 7, padding: "2px 13px" }}>
        Toplam: {toplam}
      </div>
      {bonus !== undefined && (
        <div style={{ color: "#ffe100", fontWeight: 700, fontSize: 14, background: "#ffe10022", borderRadius: 7, padding: "2px 13px" }}>
          ⚡ Bonus: {bonus}
        </div>
      )}
    </div>
  );
}

// Ana Component
export default function Tasarim() {
  // HOOKS EN ÜSTTE
  const [ad, setAd] = useState("");
  const [tel, setTel] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [ders, setDers] = useState(DERSLER[0].ad);
  const [konu, setKonu] = useState("");
  const [user, setUser] = useState(getUser());
  const [soruSayisi, setSoruSayisi] = useState(null);
  const [zamanSiniri, setZamanSiniri] = useState(false); // isteğe bağlı
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [bitti, setBitti] = useState(false);
  const [istatistik, setIstatistik] = useState({ dogru: 0, yanlis: 0, bonus: 0 });
  const [passed, setPassed] = useState([]); // pas geçenler
  const [sure, setSure] = useState(0);
  const [sureAktif, setSureAktif] = useState(false);
  const sureRef = useRef();
  const [bonusTimer, setBonusTimer] = useState(null);
  const [view, setView] = useState("giris");

  // Admin panel açılımı (local şifre ile - güvenli olmayan basic mod)
  const [admin, setAdmin] = useState(false);
  const [karma, setKarma] = useState(false);

  // ADMİN GİRİŞ
  const ADMIN_KULLANICI = "PEZEBERK"; // DEĞİŞEBİLİR
  const ADMIN_SIFRE = "3535"; // DEĞİŞEBİLİR

  // Kullanıcı giriş ve yönetimi
  const telValid = isTelefonValid(tel);
  const adValid = ad.trim().length > 1;

  useEffect(() => {
    function handleKey(e) {
      if (view === "quiz") {
        if ("1234".includes(e.key)) setSelected(Number(e.key) - 1);
        if (["a", "b", "c", "d"].includes(e.key)) setSelected("abcd".indexOf(e.key));
        if (e.key === " " || e.key === "Enter") {
          if (!checked && selected !== null) handleCheck();
          else if (checked && current < questions.length - 1) handleNext();
        }
        if (e.key === "p") handlePass();
        if (e.key === "q") setBitti(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, checked, selected, current, questions, bitti]);

  // Soru çekme işlemi
  useEffect(() => {
    if (view === "quiz" && user && soruSayisi) {
      fetch(SHEET_API)
        .then(res => res.json())
        .then(data => {
          let filtered = data;
          if (!karma) filtered = data.filter(s =>
            (s.Ders || "").trim().toLowerCase() === user.ders.trim().toLowerCase()
          );
          if (konu) filtered = filtered.filter(s => (s.Konu || "").trim().toLowerCase() === konu.trim().toLowerCase());
          const secili = shuffle(filtered).slice(0, soruSayisi);
          setQuestions(secili);
          setOriginalQuestions(secili);
          setCurrent(0); setIstatistik({ dogru: 0, yanlis: 0, bonus: 0 });
          setBitti(false); setPassed([]); setChecked(false); setSelected(null);
          setSure(0); setSureAktif(zamanSiniri);
          setBonusTimer(null);
        });
    }
  }, [view, user, soruSayisi, karma, konu]);

  // Süreyi başlat
  useEffect(() => {
    if (sureAktif) {
      sureRef.current = setInterval(() => setSure(s => s + 1), 1000);
      return () => clearInterval(sureRef.current);
    }
  }, [sureAktif]);

  // Süre bittiğinde otomatik check veya bitir
  useEffect(() => {
    if (zamanSiniri && sureAktif && sure >= soruSayisi * 40) {
      setBitti(true);
      setSureAktif(false);
    }
  }, [sure, zamanSiniri, soruSayisi]);

  // Kullanıcı kaydını gönder
  useEffect(() => {
    if (bitti && !admin) {
      fetch(KAYIT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad: user.ad,
          telefon: user.tel,
          tarih: new Date().toLocaleString("tr-TR"),
          ders: user.ders,
          dogru: istatistik.dogru,
          yanlis: istatistik.yanlis,
          toplamSoru: questions.length,
          cevaplanan: current + (checked ? 1 : 0),
          sure: sure
        })
      });
    }
  }, [bitti]);

  // --- QUIZ YÖNETİM FONKSİYONLARI ---
  function handleCheck() {
    setChecked(true);
    if (bonusTimer && bonusTimer < 10) setIstatistik(ist => ({ ...ist, bonus: ist.bonus + 1 }));
    setIstatistik(ist =>
      selected === Number(questions[current].DogruCevap)
        ? { ...ist, dogru: ist.dogru + 1 }
        : { ...ist, yanlis: ist.yanlis + 1 }
    );
  }

  function handleNext() {
    setCurrent(c => c + 1);
    setSelected(null);
    setChecked(false);
    setBonusTimer(0);
  }

  function handlePass() {
    if (!passed.includes(current)) setPassed(p => [...p, current]);
    handleNext();
  }

  // GİRİŞ EKRANI
  if (view === "giris") {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: bgGradient, fontFamily: "Inter, sans-serif"
      }}>
        <form onSubmit={e => {
          e.preventDefault();
          if (adValid && telValid) {
            setUser({ ad: ad.trim(), tel: tel.trim(), ders, avatar });
            saveUser({ ad: ad.trim(), tel: tel.trim(), ders, avatar });
            setView("soruSayisi");
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
              border: isTelefonValid(tel) || tel === "" ? "none" : "2px solid #ef4444",
              width: "90%", marginBottom: 10, fontSize: 17, outline: "none", letterSpacing: 2
            }}
            type="tel"
            maxLength={13}
            pattern="^5\d{2} \d{3} \d{2} \d{2}$"
            required
          /><br />
          <div style={{ color: "#ef4444", height: 18, fontSize: 13, marginBottom: 6 }}>
            {!isTelefonValid(tel) && tel.length > 0 && "Lütfen telefonunuzu 5XX XXX XX XX şeklinde girin"}
          </div>
          <div style={{ margin: "10px 0" }}>
            <span style={{ color: "#fff", fontWeight: 500 }}>Avatar:</span>{" "}
            <input type="file" accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = evt => setAvatar(evt.target.result);
                reader.readAsDataURL(file);
              }} />
            {avatar && <img src={avatar} alt="avatar" style={{ width: 38, height: 38, borderRadius: "50%", marginTop: 4, border: "2px solid #fff" }} />}
          </div>
          <select value={ders} onChange={e => { setDers(e.target.value); setKarma(e.target.value === KARMA_SECENEK.ad); }} style={{
            padding: "10px 14px", borderRadius: 8, width: "95%", fontSize: 16,
            marginBottom: 12, border: "none", outline: "none", background: "#fff"
          }}>
            {[...DERSLER.map(d => d.ad), KARMA_SECENEK.ad].map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>
          {ders !== KARMA_SECENEK.ad && (
            <select value={konu} onChange={e => setKonu(e.target.value)} style={{
              padding: "8px 10px", borderRadius: 8, width: "95%", fontSize: 15,
              marginBottom: 13, border: "none", outline: "none", background: "#fff"
            }}>
              <option value="">Tüm Konular</option>
              {(DERSLER.find(d => d.ad === ders)?.konular || []).map((k, i) => (
                <option key={i} value={k}>{k}</option>
              ))}
            </select>
          )}
          <div style={{ margin: "9px 0", color: "#fff" }}>
            <label>
              <input type="checkbox" checked={zamanSiniri} onChange={e => setZamanSiniri(e.target.checked)} />
              &nbsp; Zaman Sınırı Olsun (isteğe bağlı)
            </label>
          </div>
          <button type="submit"
            style={{
              background: mainColor, color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 22px", fontWeight: 700, fontSize: 17,
              cursor: adValid && isTelefonValid(tel) ? "pointer" : "not-allowed",
              boxShadow: "0 2px 8px #7c3aed22"
            }}
            disabled={!(adValid && isTelefonValid(tel))}
          >Devam Et</button>
        </form>
      </div>
    );
  }

  // SORU SAYISI SEÇİMİ
  if (view === "soruSayisi") {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: bgGradient, fontFamily: "Inter, sans-serif"
      }}>
        <div style={{
          background: "#fff2", borderRadius: 18, boxShadow: cardShadow,
          padding: 36, minWidth: 330, textAlign: "center"
        }}>
          <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 21, marginBottom: 22 }}>
            Kaç Soru Çözeceksiniz?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
            {SORU_SAYILARI.map(n => (
              <button
                key={n}
                onClick={() => { setSoruSayisi(n); setView("quiz"); }}
                style={{
                  width: 180, fontSize: 19, fontWeight: 700, color: "#fff", background: mainColor,
                  border: "none", borderRadius: 10, padding: "12px 0", marginBottom: 0, boxShadow: "0 1px 8px #7c3aed33", cursor: "pointer"
                }}>
                {n} Soru
              </button>
            ))}
          </div>
          <button onClick={() => { setUser(null); saveUser(null); setView("giris"); }} style={{
            marginTop: 22, background: "#fff1", color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer"
          }}>Geri Dön</button>
        </div>
      </div>
    );
  }

  // === QUIZ EKRANI ===
  if (view === "quiz" && questions.length) {
    const q = questions[current];

    // Kısa cevap mı?
    const kisaCevapli = q.KisaCevap && q.KisaCevap.trim() !== "";

    return (
      <div style={{
        minHeight: "100vh", background: bgGradient, fontFamily: "Inter, sans-serif", color: "#fff"
      }}>
        <div style={{ maxWidth: 540, margin: "0 auto", padding: "48px 12px 24px", minHeight: "100vh" }}>
          {/* Başlık ve Kullanıcı */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 26 }}>{UYGULAMA_ADI}</div>
            <div style={{
              fontWeight: 700, fontSize: 15, background: "#fff2", padding: "7px 14px", borderRadius: 8, display: "flex", alignItems: "center"
            }}>
              {user.avatar && <img src={user.avatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: "50%", marginRight: 7 }} />}
              {user.ad}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{user.ders}</div>
            <div style={{ fontWeight: 500, fontSize: 14, opacity: .7 }}>
              {konu ? "Konu: " + konu : karma ? "Karma Quiz" : ""}
            </div>
          </div>
          <StatsBar dogru={istatistik.dogru} yanlis={istatistik.yanlis} toplam={questions.length} bonus={istatistik.bonus} />
          {/* Progress Bar */}
          <div style={{
            width: "100%", height: 8, background: "#393a50", borderRadius: 8, overflow: "hidden", marginBottom: 14
          }}>
            <div style={{
              width: `${Math.round(((current + 1) / questions.length) * 100)}%`, height: "100%",
              background: mainColor, borderRadius: 8, transition: "width 0.5s cubic-bezier(.5,1,.5,1)"
            }} />
          </div>
          {/* Soru Kartı */}
          <div style={{
            background: "#fff2", padding: 30, borderRadius: 22, boxShadow: cardShadow, marginBottom: 22,
            minHeight: 170, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1.5px solid #393a50"
          }}>
            <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 20, color: "#fff" }}>{q.Soru}</div>
            {/* Çoktan Seçmeli veya Kısa Cevap */}
            {kisaCevapli ? (
              <input
                type="text"
                value={selected || ""}
                onChange={e => setSelected(e.target.value)}
                disabled={checked}
                placeholder="Kısa cevabınızı girin"
                style={{
                  fontSize: 17, borderRadius: 8, border: "1.5px solid #393a50",
                  padding: "12px 14px", width: "100%", marginBottom: 8,
                  outline: "none", background: "#f9f9fb"
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !checked) handleCheck();
                }}
              />
            ) : (
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
                              ? 2.5px solid correctColor
                              : 2.5px solid errorColor
                            : 2.5px solid mainColor
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
            )}
            {/* Butonlar */}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {!checked && (
                <button
                  onClick={handlePass}
                  style={{
                    flex: 1, padding: 13, background: "#374151", color: "#fff",
                    border: "none", borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: "pointer"
                  }}
                >
                  Pas Geç
                </button>
              )}
              {!checked && (
                <button
                  onClick={handleCheck}
                  disabled={selected === null || selected === ""}
                  style={{
                    flex: 1, padding: 14, background: mainColor, color: "#fff",
                    border: "none", borderRadius: 11, fontWeight: 700, fontSize: 16,
                    boxShadow: "0 4px 15px #7c3aed18", cursor: selected === null || selected === "" ? "not-allowed" : "pointer"
                  }}
                >
                  Kontrol Et
                </button>
              )}
              <button
                onClick={() => setBitti(true)}
                style={{
                  flex: 1, padding: 14, background: errorColor, color: "#fff",
                  border: "none", borderRadius: 11, fontWeight: 700, fontSize: 16,
                  boxShadow: "0 4px 12px #ef4444aa", cursor: "pointer"
                }}
              >
                Bitir
              </button>
              {checked && current !== questions.length - 1 && (
                <button
                  onClick={handleNext}
                  style={{
                    flex: 1, padding: 14, background: correctColor, color: "#fff",
                    border: "none", borderRadius: 11, fontWeight: 700, fontSize: 16,
                    boxShadow: "0 4px 12px #22c55e33", cursor: "pointer"
                  }}
                >
                  Sonraki Soru
                </button>
              )}
            </div>
            {/* Cevap Geri Bildirim */}
            {checked && (
              <div
                style={{
                  marginTop: 14, padding: 13, borderRadius: 10,
                  background:
                    (selected === Number(q.DogruCevap))
                      ? "#24fbb325"
                      : "#ff7b8c24",
                  color:
                    (selected === Number(q.DogruCevap))
                      ? correctColor
                      : errorColor,
                  fontWeight: 700, fontSize: 16, minHeight: 32,
                  boxShadow:
                    (selected === Number(q.DogruCevap))
                      ? "0 0 8px #22c55e66"
                      : "0 0 8px #ef444466"
                }}
              >
                {selected === Number(q.DogruCevap) ? "Doğru Cevap!" : "Yanlış Cevap!"}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

  // ... (YENİ Fonksiyonlar buraya ekle)
}
