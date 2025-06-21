import React, { useState } from "react";

import React, { useEffect, useState } from "react";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  // <-- BURAYI DÜZENLE: Sheet API url'ini kendi linkinle değiştir!
  const SHEET_API = "https://api.sheetbest.com/sheets/23bc6d7b-d5a0-4068-b3b5-dedb85343aae";

  useEffect(() => {
    fetch(SHEET_API)
      .then(res => res.json())
      .then(data => {
        // Soruları karıştırmak istersen shuffle fonksiyonu yazabilirsin
        setQuestions(data);
      });
  }, []);

  if (!questions.length) return <div>Yükleniyor...</div>;

  const q = questions[current];

  function handleSelect(i) {
    if (!checked) setSelected(i);
  }
  function handleCheck() {
    setChecked(true);
  }
  function handleNext() {
    setCurrent((c) => c + 1);
    setSelected(null);
    setChecked(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>
        MOLLA GPT İLE VAHDETTİNİN İZİNDEN
      </h1>
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 18,
          maxWidth: 600,
          margin: "auto",
          boxShadow: "0 2px 16px #0001"
        }}
      >
        <div style={{ fontSize: 18, marginBottom: 16 }}>{q.Soru}</div>
        <div style={{ display: "grid", gap: 12 }}>
          {[q.A, q.B, q.C, q.D].map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={checked}
              style={{
                textAlign: "left",
                padding: "12px 20px",
                borderRadius: 10,
                border:
                  selected === i
                    ? checked
                      ? i === Number(q.DogruCevap)
                        ? "2px solid #3b9b37"
                        : "2px solid #ce2020"
                      : "2px solid #2563eb"
                    : "1px solid #ccc",
                background:
                  selected === i
                    ? checked
                      ? i === Number(q.DogruCevap)
                        ? "#e6ffe7"
                        : "#ffe6e6"
                      : "#e7f0ff"
                    : "#f8fafc",
                cursor: checked ? "default" : "pointer"
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={selected === null}
            style={{
              marginTop: 24,
              width: "100%",
              padding: 12,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              cursor: selected === null ? "not-allowed" : "pointer"
            }}
          >
            Kontrol Et
          </button>
        ) : (
          <>
            <div
              style={{
                marginTop: 24,
                padding: 14,
                borderRadius: 10,
                background:
                  selected === Number(q.DogruCevap) ? "#e6ffe7" : "#ffe6e6",
                color: selected === Number(q.DogruCevap) ? "#228b22" : "#b91c1c"
              }}
            >
              {selected === Number(q.DogruCevap) ? "Doğru!" : "Yanlış!"}
              <br />
              <span style={{ fontSize: 14 }}>{q.Aciklama}</span>
            </div>
            <button
              onClick={handleNext}
              disabled={current === questions.length - 1}
              style={{
                marginTop: 18,
                width: "100%",
                padding: 12,
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: "bold",
                cursor:
                  current === questions.length - 1
                    ? "not-allowed"
                    : "pointer"
              }}
            >
              Sonraki Soru
            </button>
          </>
        )}
      </div>
      <div style={{ textAlign: "center", color: "#888", fontSize: 12, marginTop: 18 }}>
        Soru {current + 1} / {questions.length}
      </div>
    </div>
  );
}
