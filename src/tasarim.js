// HUKUK QUIZ UYGULAMASI ---
import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";


export default function Tasarim() {
  // HOOKLAR FONKSİYONUN İÇİNDE OLMALI!
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 800);

  // ... diğer tüm useState, useEffect, kodlar...

  // örnek olarak view switch:
  const [view, setView] = useState("giris");

 return (
  <div style={{ display: "flex", minHeight: "100vh", background: "#eef2ff" }}>
    <Sidebar
      user={user}
      view={view}
      setView={setView}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
    <div style={{
      flex: 1, marginLeft: window.innerWidth > 800 ? 220 : 0,
      minHeight: "100vh", background: "#f8fafc", boxShadow: "-2px 0 18px #0001",
      transition: "margin-left 0.2s", position: "relative"
    }}>
      {/* Sağ üst profil kutusu */}
      <div style={{
        position: "absolute", right: 20, top: 18, zIndex: 11,
        display: "flex", alignItems: "center", gap: 8
      }}>
        {user && (
          <>
            <img src={user.avatar || "https://ui-avatars.com/api/?name=" + user.ad} alt=""
              style={{ width: 38, height: 38, borderRadius: "50%", border: "2.5px solid #a78bfa" }} />
            <span style={{ fontWeight: 700 }}>{user.ad}</span>
            <button onClick={() => { setUser(null); saveUser(null); setView("giris"); }}
              style={{
                background: "#fff", color: "#a78bfa", border: "none", borderRadius: 8,
                fontWeight: 700, fontSize: 14, padding: "8px 13px", cursor: "pointer"
              }}>Çıkış</button>
          </>
        )}
      </div>
      {/* Duyuru/banner alanı */}
      <div style={{
        width: "100%", padding: "13px 0 9px 0", background: "#ede9fe",
        color: "#7c3aed", fontWeight: 700, fontSize: 15, textAlign: "center", letterSpacing: 1.2
      }}>
        🚀 Yeni: Quiz koduyla paylaş, yanlışlarından tekrar çöz, admin panelinden analiz!
      </div>
      {/* Ana view ekranları */}
      <div style={{ padding: "36px 0 0 0", minHeight: "calc(100vh - 60px)" }}>
        {view === "giris" && /* Giriş ekranı kodun */}
        {view === "quiz" && /* Quiz kodun */}
        {view === "profil" && /* Profil ekranın */}
        {view === "soruEkle" && /* Soru ekle ekranı */}
        {view === "istatistik" && /* İstatistikler ekranı */}
        {view === "yardim" && /* Yardım ekranı */}
        {view === "adminGiris" && /* Admin giriş ekranı */}
        {view === "admin" && /* Admin paneli */}
        {/* ...diğer view'ler */}
      </div>
    </div>
  </div>
);
}


const UYGULAMA_ADI = "HUKUK FAK ÇALIŞMA";
const mainColor = "#7c3aed";
const errorColor = "#ef4444";
const correctColor = "#22c55e";
const bgGradient = "linear-gradient(135deg, #181824 0%, #233356 100%)";
const cardShadow = "0 4px 32px 0 rgba(49, 69, 130, 0.10), 0 1.5px 6px 0 rgba(49, 69, 130, 0.06)";

// Geliştirilebilir: Buraya yeni dersler ve konular ekleyebilirsin!
const DERSLER = [
  { ad: "Hukuka Giriş", konular: ["Genel", "Kavramlar", "Kaynaklar"] },
  { ad: "Borçlar Genel", konular: ["Genel Hükümler", "Sözleşmeler"] },
  { ad: "Borçlar Özel", konular: ["Satım", "Kira", "Bağışlama"] },
  { ad: "Ceza Genel", konular: ["Kusur", "Kast", "Taksir"] },
  { ad: "Ceza Özel", konular: ["Kasten Öldürme", "Hırsızlık"] },
  // ... diğer dersler, konular...
];

// Karma quiz için tüm derslerden seçebilmek:
const KARMA_SECENEK = { ad: "Karma Quiz (Tüm Dersler)", konular: [] };

const SORU_SAYILARI = [5, 10, 20, 50];

const SHEET_API = "https://api.sheetbest.com/sheets/23bc6d7b-d5a0-4068-b3b5-dedb85343aae";
const KAYIT_API = "https://api.sheetbest.com/sheets/f97d1aac-7203-4748-a4d4-c5b452b61a94";

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

function StatsBar({ dogru, yanlis, toplam, bonus }) {
  return (
    <div style={{
      display: "flex", justifyContent: "center", gap: 18, margin: "14px 0 2px 0"
    }}>
      <div style={{
        color: correctColor, fontWeight: 700, fontSize: 14, letterSpacing: 0.7,
        background: "#22c55e22", borderRadius: 7, padding: "2px 13px"
      }}>✔ Doğru: {dogru}</div>
      <div style={{
        color: errorColor, fontWeight: 700, fontSize: 14, letterSpacing: 0.7,
        background: "#ef444422", borderRadius: 7, padding: "2px 13px"
      }}>✖ Yanlış: {yanlis}</div>
      <div style={{
        color: "#fff", fontWeight: 600, fontSize: 14,
        background: "#7c3aed33", borderRadius: 7, padding: "2px 13px"
      }}>Toplam: {toplam}</div>
      {bonus !== undefined && (
        <div style={{
          color: "#ffe100", fontWeight: 700, fontSize: 14, background: "#ffe10022", borderRadius: 7, padding: "2px 13px"
        }}>⚡ Bonus: {bonus}</div>
      )}
    </div>
  );
}

export default function Tasarim() {
  // PROFİL
  const [ad, setAd] = useState("");
  const [tel, setTel] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [ders, setDers] = useState(DERSLER[0].ad);
  const [konu, setKonu] = useState("");
  const [user, setUser] = useState(getUser());
  const [soruSayisi, setSoruSayisi] = useState(null);
  const [zamanSiniri, setZamanSiniri] = useState(false); // isteğe bağlı
  // SORU YÜKLEME/FİLTRE
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  // QUIZ STATE
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [bitti, setBitti] = useState(false);
  const [istatistik, setIstatistik] = useState({ dogru: 0, yanlis: 0, bonus: 0 });
  const [passed, setPassed] = useState([]); // pas geçenler
  // SÜRE
  const [sure, setSure] = useState(0);
  const [sureAktif, setSureAktif] = useState(false);
  const sureRef = useRef();
  // HIZLI BONUS
  const [bonusTimer, setBonusTimer] = useState(null);

  // MODLAR
  const [view, setView] = useState("giris"); // giriş, soruSayisi, quiz, bitis, admin, arkadas, profil, soruEkle, kodlu, tekrar, sonuc

  // SORU EKLEME MODAL
  const [yeniSoru, setYeniSoru] = useState({ Soru: "", A: "", B: "", C: "", D: "", DogruCevap: "", Aciklama: "", Ders: "", Konu: "" });
  const [showSoruModal, setShowSoruModal] = useState(false);

  // Admin panel açılımı (local şifre ile - güvenli olmayan basic mod)
  const [admin, setAdmin] = useState(false);
  // Karma quiz için: dersler toplu mu seçildi?
  const [karma, setKarma] = useState(false);

  // KISAYOL TUŞLARI
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
    // eslint-disable-next-line
  }, [view, checked, selected, current, questions, bitti]);

  // SORU ÇEKME
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
          // randomize & seçilen kadar sınırla
          const secili = shuffle(filtered).slice(0, soruSayisi);
          setQuestions(secili);
          setOriginalQuestions(secili);
          setCurrent(0); setIstatistik({ dogru: 0, yanlis: 0, bonus: 0 });
          setBitti(false); setPassed([]); setChecked(false); setSelected(null);
          setSure(0); setSureAktif(zamanSiniri);
          setBonusTimer(null);
        });
    }
    // eslint-disable-next-line
  }, [view, user, soruSayisi, karma, konu]);

  // SÜRE TUT
  useEffect(() => {
    if (sureAktif) {
      sureRef.current = setInterval(() => setSure(s => s + 1), 1000);
      return () => clearInterval(sureRef.current);
    }
  }, [sureAktif]);

  // SÜRE DOLDUĞUNDA OTOMATİK CHECK/BİTİR
  useEffect(() => {
    if (zamanSiniri && sureAktif && sure >= soruSayisi * 40) { // örnek: 40 sn/soru
      setBitti(true);
      setSureAktif(false);
    }
    // eslint-disable-next-line
  }, [sure, zamanSiniri, soruSayisi]);

  // KULLANICI KAYIT POST (quiz bitince)
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
    // eslint-disable-next-line
  }, [bitti]);

  // --- QUIZ YÖNETİM FONKSİYONLARI ---

  function handleCheck() {
    setChecked(true);
    // Hızlı yanıt bonusu
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

  // --- GİRİŞ VE PROFİL ---
  if (view === "giris") {
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
          {/* Avatar Seçimi */}
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
          {/* Konu Seçimi */}
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
          {/* Zaman Sınırı */}
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
  // === QUIZ ANA EKRAN ===
  if (view === "quiz" && questions.length) {
    const q = questions[current];

    // Soru süresi için sayaç
    const [soruSure, setSoruSure] = useState(0);
    useEffect(() => {
      if (zamanSiniri && !checked && !bitti) {
        setSoruSure(0);
        const interval = setInterval(() => setSoruSure(s => s + 1), 1000);
        return () => clearInterval(interval);
      }
    }, [current, checked, zamanSiniri, bitti]);

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
          {/* Soru süresi */}
          {zamanSiniri &&
            <div style={{ fontSize: 13, color: "#ffe100", textAlign: "right", marginBottom: 3 }}>
              Soru Süresi: {soruSure} sn / Quiz Süresi: {sure} sn
            </div>
          }
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
            )}
            {/* Butonlar */}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {/* Pas geçme */}
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
              {/* Kontrol Et */}
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
              {/* Bitir */}
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
              {/* Sonraki Soru */}
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
            {/* Cevap Geri Bildirim & Kanun Linki */}
            {checked && (
              <div
                style={{
                  marginTop: 14, padding: 13, borderRadius: 10,
                  background:
                    (selected === Number(q.DogruCevap) || (kisaCevapli && selected?.trim()?.toLowerCase() === q.KisaCevap?.trim()?.toLowerCase()))
                      ? "#24fbb325"
                      : "#ff7b8c24",
                  color:
                    (selected === Number(q.DogruCevap) || (kisaCevapli && selected?.trim()?.toLowerCase() === q.KisaCevap?.trim()?.toLowerCase()))
                      ? correctColor
                      : errorColor,
                  fontWeight: 700, fontSize: 16, minHeight: 32,
                  boxShadow:
                    (selected === Number(q.DogruCevap) || (kisaCevapli && selected?.trim()?.toLowerCase() === q.KisaCevap?.trim()?.toLowerCase()))
                      ? "0 0 8px #22c55e66"
                      : "0 0 8px #ef444466"
                }}

  // === SONUÇ & ANALİZ EKRANI ===
  if (view === "quiz" && bitti) {
    // Yanlış yapılan soruları göster ve tekrar quiz
    const yanlislar = questions
      .map((q, i) => ({
        soru: q,
        dogru: q.KisaCevap
          ? false // Kısa cevaplılarda doğru bilgisi tutulmadıysa burada karşılaştırabilirsin
          : i === Number(q.DogruCevap)
      }))
      .filter((r, i) => !r.dogru);
    
      {/* Duyuru/banner alanı */}
      <div style={{
        width: "100%", padding: "13px 0 9px 0", background: "#ede9fe",
        color: "#7c3aed", fontWeight: 700, fontSize: 15, textAlign: "center", letterSpacing: 1.2
      }}>
        🚀 Yeni: Quiz koduyla paylaş, yanlışlarından tekrar çöz, admin panelinden analiz!
      </div>
     
{/* Ana view ekranları */}
      <div style={{ padding: "36px 0 0 0", minHeight: "calc(100vh - 60px)" }}>
  {view === "giris" && <div>Giriş Ekranı</div>}
  {view === "quiz" && <div>Quiz Ekranı</div>}
  {view === "profil" && <div>Profil Ekranı</div>}
  {view === "soruEkle" && <div>Soru Ekle Ekranı</div>}
  {view === "istatistik" && <div>İstatistikler Ekranı</div>}
  {view === "yardim" && <div>Yardım Ekranı</div>}
  {view === "adminGiris" && <div>Admin Giriş Ekranı</div>}
  {view === "admin" && <div>Admin Paneli</div>}
  {/* ...diğer view'ler */}
</div>

    return (
      <div style={{
        minHeight: "100vh", background: bgGradient, fontFamily: "Inter, sans-serif", color: "#fff", padding: 0, margin: 0
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 20px" }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: 1, marginBottom: 14 }}>Quiz Bitti!</h2>
          <div style={{ fontWeight: 600, fontSize: 19, margin: "18px 0" }}>
            <span style={{ color: correctColor }}>Doğru: {istatistik.dogru}</span> / <span style={{ color: errorColor }}>Yanlış: {istatistik.yanlis}</span>
            &nbsp;|&nbsp;Bonus: <span style={{ color: "#ffe100" }}>{istatistik.bonus}</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, margin: "0 0 18px 0" }}>
            <span style={{ color: "#fff" }}>Cevaplanan Soru: {current + (checked ? 1 : 0)} / {questions.length}</span><br />
            <span style={{ color: "#ffe100" }}>Süre: {sure} sn</span>
          </div>
          {/* Yanlışlardan tekrar quiz */}
          {yanlislar.length > 0 && (
            <button onClick={() => {
              setQuestions(shuffle(yanlislar.map(y => y.soru)));
              setCurrent(0); setBitti(false); setSelected(null); setChecked(false);
              setIstatistik({ dogru: 0, yanlis: 0, bonus: 0 }); setSure(0);
            }}
              style={{
                background: "#fca311", color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 22px", fontWeight: 700, fontSize: 16, marginTop: 8, cursor: "pointer"
              }}>
              Yanlış Soruları Tekrar Çöz
            </button>
          )}
          {/* Profil/yeniden başla/çıkış */}
          <div style={{ marginTop: 18 }}>
            <button onClick={() => { setView("profil"); }}
              style={{
                background: mainColor, color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 22px", fontWeight: 700, fontSize: 16, margin: "6px", cursor: "pointer"
              }}>
              Profil & Sonuçlarım
            </button>
            <button onClick={() => { setView("soruSayisi"); setBitti(false); setIstatistik({ dogru: 0, yanlis: 0, bonus: 0 }); setSure(0); }}
              style={{
                background: "#444", color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 22px", fontWeight: 700, fontSize: 16, margin: "6px", cursor: "pointer"
              }}>
              Tekrar Quiz Çöz
            </button>
            <button onClick={() => { setUser(null); saveUser(null); setView("giris"); }}
              style={{
                background: "#fff1", color: "#fff", border: "none", borderRadius: 8,
                padding: "8px 20px", fontWeight: 600, fontSize: 15, marginTop: 6, cursor: "pointer"
              }}>
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    );
  }
  // === PROFİL & SONUÇLARIM EKRANI ===
  if (view === "profil") {
    return (
      <div style={{
        minHeight: "100vh", background: bgGradient, color: "#fff", fontFamily: "Inter, sans-serif"
      }}>
        <div style={{
          maxWidth: 500, margin: "0 auto", padding: "52px 10px 16px"
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 18 }}>
            Profil & Sonuçlarım
          </h2>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            {user.avatar && <img src={user.avatar} alt="avatar" style={{ width: 56, height: 56, borderRadius: "50%", marginRight: 16, border: "2px solid #fff" }} />}
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{user.ad}</div>
              <div style={{ fontWeight: 400, fontSize: 15, opacity: 0.85 }}>{user.tel}</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#aef" }}>{user.ders}</div>
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <span style={{
              display: "inline-block",
              fontWeight: 700, fontSize: 18, color: correctColor,
              background: "#22c55e33", borderRadius: 8, padding: "6px 15px", marginRight: 10
            }}>
              ✔ {istatistik.dogru} Doğru
            </span>
            <span style={{
              display: "inline-block",
              fontWeight: 700, fontSize: 18, color: errorColor,
              background: "#ef444422", borderRadius: 8, padding: "6px 15px"
            }}>
              ✖ {istatistik.yanlis} Yanlış
            </span>
            <span style={{
              display: "inline-block",
              fontWeight: 700, fontSize: 18, color: "#ffe100",
              background: "#ffe10033", borderRadius: 8, padding: "6px 15px", marginLeft: 10
            }}>
              ⚡ {istatistik.bonus} Bonus
            </span>
          </div>
          <button onClick={() => setView("soruEkle")}
            style={{
              background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 22px", fontWeight: 700, fontSize: 17, margin: "6px", cursor: "pointer"
            }}>
            Soru Ekle / Soru Öner
          </button>
          <button onClick={() => setView("soruSayisi")}
            style={{
              background: mainColor, color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 22px", fontWeight: 700, fontSize: 17, margin: "6px", cursor: "pointer"
            }}>
            Yeni Quiz Başlat
          </button>
          <button onClick={() => { setUser(null); saveUser(null); setView("giris"); }}
            style={{
              background: "#fff1", color: "#fff", border: "none", borderRadius: 8,
              padding: "8px 20px", fontWeight: 600, fontSize: 15, marginTop: 6, cursor: "pointer"
            }}>
            Çıkış Yap
          </button>
          {/* Quiz Koduyla Paylaş */}
          <div style={{ marginTop: 30 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Quiz Koduyla Arkadaşını Davet Et:</div>
            <input
              type="text"
              readOnly
              value={window.location.origin + window.location.pathname + "?kod=" + slugify(user.ad + Date.now())}
              style={{
                width: "90%", padding: "7px 12px", borderRadius: 7, border: "none", background: "#fff9", fontWeight: 700,
                fontSize: 15, letterSpacing: 1, marginBottom: 5
              }}
              onClick={e => e.target.select()}
            />
            <div style={{ fontSize: 12, color: "#ccc" }}>
              Bu linki arkadaşınla paylaş, o da quiz çözsün!
            </div>
          </div>
        </div>
      </div>
    );
  }
  // === BASİT ADMIN PANELİ DEMOSU ===
  if (admin) {
    // Gerçek admin için Sheet'ten kayıtları çekmek gerekir (ör: KAYIT_API'ya GET ile)
    // Burada sadece basit bir demo: Giriş yapan kişinin son quiz'leri gösteriliyor.
    return (
      <div style={{
        minHeight: "100vh", background: bgGradient, color: "#fff", fontFamily: "Inter, sans-serif", padding: 40
      }}>
        <h2 style={{ fontWeight: 900, fontSize: 28, marginBottom: 18 }}>Admin Paneli (Demo)</h2>
        <div>
          <b>Kullanıcı:</b> {user.ad} <br />
          <b>Telefon:</b> {user.tel} <br />
          <b>Quiz Başarı:</b> Doğru: {istatistik.dogru} / Yanlış: {istatistik.yanlis} / Bonus: {istatistik.bonus}
        </div>
        <div style={{ marginTop: 22 }}>
          <button onClick={() => setView("profil")}
            style={{
              background: mainColor, color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 22px", fontWeight: 700, fontSize: 17, margin: "6px", cursor: "pointer"
            }}>
            Profil Ekranına Dön
          </button>
        </div>
        <div style={{ marginTop: 28 }}>
          <b>En Çok Yanlış Yapılan Sorular</b>
          <ul>
            {/* Gerçek veriye Sheet'ten GET ile çekilerek (fetch KAYIT_API) en çok yanlış yapılan 5 soru gösterilebilir. */}
            <li>1. TBK m. 27 - Hukuka ve Ahlaka Aykırılık</li>
            <li>2. Ceza Genel - Taksir ve Kasıt Ayrımı</li>
            <li>3. Borçlar Genel - Sözleşmenin Kurulması</li>
            <li>4. Anayasa - Temel Haklar</li>
            <li>5. Ceza Özel - Hırsızlık Suçu Unsurları</li>
          </ul>
        </div>
      </div>
    );
  }
  // === ARKADAŞLA YARIŞMA EKRANI (TEMEL DEMO) ===
  if (view === "arkadas") {
    return (
      <div style={{
        minHeight: "100vh", background: bgGradient, color: "#fff", fontFamily: "Inter, sans-serif"
      }}>
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "60px 10px 16px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 16 }}>
            Arkadaşla Yarışma (Demo)
          </h2>
          <div>
            Bu demo, arkadaşına verdiğin quiz koduyla aynı anda başlayacağınız şekilde kurgulanmıştır.
            <br /><br />
            <b>Kod:</b> <span style={{ background: "#fff1", padding: "4px 10px", borderRadius: 7 }}>
              {window.location.origin + window.location.pathname + "?kod=" + slugify(user.ad + Date.now())}
            </span>
            <br /><br />
            Arkadaşın bu linkten giriş yapıp quiz başlatırsa, birlikte çözdüğünüzde sonuçları puan sıralaması olarak profil ekranında görebilirsiniz!
            <br /><br />
            (Gerçek zamanlı skor takibi için backend gerekir!)
          </div>
          <button onClick={() => setView("profil")}
            style={{
              marginTop: 26, background: "#fff1", color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 22px", fontWeight: 700, fontSize: 17, cursor: "pointer"
            }}>
            Profil Ekranına Dön
          </button>
        </div>
      </div>
    );
  }
{q.Aciklama?.split(/(TBK m\. \d+|TCK m\. \d+)/g).map((chunk, i) =>
  /^(TBK|TCK) m\. \d+$/.test(chunk) ?
    <a key={i} href={`https://www.mevzuat.gov.tr/${chunk.startsWith("TBK") ? "MevzuatMetin/1.5.6098.pdf" : "MevzuatMetin/1.5.5237.pdf"}`} target="_blank" rel="noopener noreferrer" style={{ color: "#aef", fontWeight: 700 }}>{chunk}</a>
    : chunk
)}
<a href="https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6098.pdf" target="_blank">TBK m. 27</a>
const ADMIN_KULLANICI = "berke147"; // DEĞİŞTİREBİLİRSİN!
const ADMIN_SIFRE = "hukukgpt2024"; // DEĞİŞTİREBİLİRSİN!
<button
  type="button"
  onClick={() => setView("adminGiris")}
  style={{
    background: "#374151",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 22px",
    fontWeight: 600,
    fontSize: 15,
    marginTop: 8,
    cursor: "pointer"
  }}
>
  Admin Girişi
</button>
const [adminKullanici, setAdminKullanici] = useState("");
const [adminSifre, setAdminSifre] = useState("");
const [adminHata, setAdminHata] = useState("");
// === ADMIN GİRİŞ EKRANI ===
if (view === "adminGiris") {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: bgGradient, fontFamily: "Inter, sans-serif"
    }}>
      <form onSubmit={e => {
        e.preventDefault();
        if (
          adminKullanici === ADMIN_KULLANICI &&
          adminSifre === ADMIN_SIFRE
        ) {
          setAdmin(true);
          setView("admin");
        } else {
          setAdminHata("Kullanıcı adı veya şifre yanlış!");
        }
      }}
        style={{
          background: "#fff2", borderRadius: 18, boxShadow: cardShadow,
          padding: 36, minWidth: 330, textAlign: "center"
        }}>
        <h2 style={{ fontWeight: 800, fontSize: 23, marginBottom: 14, color: "#fff" }}>Admin Girişi</h2>
        <input
          placeholder="Kullanıcı Adı"
          value={adminKullanici}
          onChange={e => setAdminKullanici(e.target.value)}
          style={{
            padding: "10px 16px", borderRadius: 8, border: "none",
            width: "90%", marginBottom: 12, fontSize: 17, outline: "none"
          }}
          autoFocus
        /><br />
        <input
          placeholder="Şifre"
          value={adminSifre}
          onChange={e => setAdminSifre(e.target.value)}
          style={{
            padding: "10px 16px", borderRadius: 8, border: "none",
            width: "90%", marginBottom: 12, fontSize: 17, outline: "none"
          }}
          type="password"
        /><br />
        <div style={{ color: "#ef4444", height: 18, fontSize: 13, marginBottom: 8 }}>
          {adminHata}
        </div>
        <button type="submit"
          style={{
            background: mainColor, color: "#fff", border: "none", borderRadius: 8,
            padding: "10px 22px", fontWeight: 700, fontSize: 17,
            cursor: "pointer", boxShadow: "0 2px 8px #7c3aed22"
          }}>
          Giriş Yap
        </button>
        <button
          type="button"
          onClick={() => setView("giris")}
          style={{
            background: "#fff1", color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 20px", fontWeight: 600, fontSize: 15, marginLeft: 10, cursor: "pointer"
          }}>
          Geri Dön
        </button>
      </form>
    </div>
  );
}
if (admin && view === "admin") {
  const [kayitlar, setKayitlar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(KAYIT_API)
      .then(res => res.json())
      .then(data => {
        setKayitlar(data.slice(-100).reverse());
        setLoading(false);
      });
  }, []);

  // Basit yanlış analiz: Sık yanlış yapılan soruları belirle (demo)
  const soruSay = {};
  kayitlar.forEach(k => {
    const key = (k.ders || "") + ":" + (k.soru_id || "");
    if (!soruSay[key]) soruSay[key] = 0;
    soruSay[key] += Number(k.yanlis || 0);
  });
  const enYanlis = Object.entries(soruSay)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div style={{
      minHeight: "100vh", background: bgGradient, color: "#fff", fontFamily: "Inter, sans-serif", padding: 30
    }}>
      <h2 style={{ fontWeight: 900, fontSize: 28, marginBottom: 16 }}>Admin Paneli</h2>
      <button onClick={() => { setAdmin(false); setView("giris"); }}
        style={{
          background: errorColor, color: "#fff", border: "none", borderRadius: 7,
          padding: "7px 16px", fontWeight: 700, fontSize: 15, marginBottom: 12, cursor: "pointer"
        }}>
        Çıkış Yap (Admin)
      </button>
      <h4 style={{ color: "#ffe100", marginTop: 12 }}>Son 100 Quiz Kaydı</h4>
      {loading ? <div>Yükleniyor...</div> : (
        <div style={{
          maxHeight: 320, overflow: "auto", background: "#2228", borderRadius: 8, padding: 12, marginBottom: 20
        }}>
          <table style={{ width: "100%", fontSize: 13, color: "#fff" }}>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Telefon</th>
                <th>Ders</th>
                <th>Doğru</th>
                <th>Yanlış</th>
                <th>Süre</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {kayitlar.map((k, i) => (
                <tr key={i}>
                  <td>{k.ad}</td>
                  <td>{k.telefon}</td>
                  <td>{k.ders}</td>
                  <td>{k.dogru}</td>
                  <td>{k.yanlis}</td>
                  <td>{k.sure}</td>
                  <td>{k.tarih}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h4 style={{ color: "#ffe100", marginTop: 22 }}>En Çok Yanlış Yapılan Sorular (Demo)</h4>
      <ul>
        {enYanlis.length === 0
          ? <li>Yeterli veri yok</li>
          : enYanlis.map(([key, count], idx) =>
            <li key={idx}>{key} - Yanlış: {count}</li>
          )}
      </ul>
      <button onClick={() => setView("profil")}
        style={{
          marginTop: 26, background: "#fff1", color: "#fff", border: "none", borderRadius: 8,
          padding: "10px 22px", fontWeight: 700, fontSize: 17, cursor: "pointer"
        }}>
        Profil Ekranına Dön
      </button>
    </div>
  );
}


  

