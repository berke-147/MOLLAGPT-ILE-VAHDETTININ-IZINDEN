// Sidebar.js
import React from "react";

const MENU = [
  { view: "giris", label: "Giriş", icon: "🏠" },
  { view: "soruSayisi", label: "Quiz Başlat", icon: "📝" },
  { view: "profil", label: "Profil", icon: "👤" },
  { view: "soruEkle", label: "Soru Ekle", icon: "➕" },
  { view: "istatistik", label: "İstatistikler", icon: "📊" },
  { view: "yardim", label: "Yardım", icon: "❓" },
  { view: "adminGiris", label: "Admin", icon: "🔑" },
  // İsteğe bağlı menüler:
  // { view: "favoriler", label: "Favoriler", icon: "⭐" },
  // { view: "gecmis", label: "Geçmiş Quizler", icon: "🕒" },
];

export default function Sidebar({ view, setView, user, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobilde açma/kapatma butonu */}
      <div className="sidebar-mobile-btn" onClick={() => setSidebarOpen(o => !o)}>
        <span>☰</span>
      </div>
      <div
        className="sidebar"
        style={{
          width: 220, minHeight: "100vh",
          background: "#181e33", color: "#fff",
          boxShadow: "2px 0 10px #0002",
          position: "fixed",
          left: sidebarOpen ? 0 : "-220px",
          top: 0, zIndex: 99,
          transition: "left 0.25s",
          display: "flex", flexDirection: "column"
        }}>
        <div style={{
          fontWeight: 900, fontSize: 21, letterSpacing: 2,
          margin: "38px 0 24px 0", textAlign: "center"
        }}>
          Hukuk Fak <span style={{ color: "#a78bfa" }}>Çalışma</span>
        </div>
        <div style={{ flex: 1 }}>
          {MENU.map(item => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={view === item.view ? "sidebar-active" : ""}
              style={{
                width: "95%", margin: "7px auto", display: "flex", alignItems: "center",
                padding: "12px 0 12px 15px", borderRadius: 10,
                border: "none", background: view === item.view ? "#312e81" : "transparent",
                color: view === item.view ? "#a78bfa" : "#fff", fontWeight: 700,
                fontSize: 16, cursor: "pointer", gap: 11,
                boxShadow: view === item.view ? "0 2px 9px #6d28d91a" : "none",
                transition: "background 0.14s, color 0.18s"
              }}
            >
              <span style={{ fontSize: 19 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div style={{ color: "#818cf8", fontSize: 13, margin: "0 0 18px 0", textAlign: "center" }}>
          © {new Date().getFullYear()}
        </div>
      </div>
      {/* Mobilde üstte aç/kapat tuşu */}
      <style>{`
        .sidebar-mobile-btn {
          display: none;
          position: fixed; left: 11px; top: 14px; z-index: 200;
          font-size: 28px; color: #5b21b6; background: #fff; padding: 7px 16px; border-radius: 10px; box-shadow: 0 2px 9px #a78bfa22; cursor: pointer;
        }
        @media (max-width: 800px) {
          .sidebar {
            position: fixed; left: 0; top: 0; z-index: 999;
          }
          .sidebar-mobile-btn {
            display: block;
          }
        }
        .sidebar-active {
          background: #312e81 !important;
          color: #a78bfa !important;
        }
      `}</style>
    </>
  );
}

