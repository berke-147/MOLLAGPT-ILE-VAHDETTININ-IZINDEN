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
  // ... (YENİ Fonksiyonlar buraya ekle)
}
