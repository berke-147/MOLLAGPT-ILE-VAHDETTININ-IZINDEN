import React, { useEffect, useState } from "react";

const bgGradient =
  "linear-gradient(135deg, #f2e9f7 0%, #e0ecfa 100%)";
const cardShadow =
  "0 4px 32px 0 rgba(49, 69, 130, 0.07), 0 1.5px 6px 0 rgba(49, 69, 130, 0.04)";
const mainColor = "#7c3aed";
const successColor = "#22c55e";
const errorColor = "#ef4444";

export default function Tasarim() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  // Sheet API url'ini kendi linkinle değiştir!
  const SHEET_API = "https://api.sheetbest.com/sheets/23bc6d7b-d5a0-4068-b3b5-dedb85343aae";

  useEffect(() => {
    fetch(SHEET_API)
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  if (!questions.length)
    return (
      <div className="loading">Yükleniyor...</div>
    );

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

  // PROGRESS BAR
  const progress = Math.round(((current + 1) / questions.length) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgGradient,
        padding: 0,
        margin: 0,
        fontFamily: "Inter, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: 440,
          margin: "0 auto",
          padding: "56px 12px 24px",
          minHeight: "100vh"
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 16,
            background: "linear-gradient(90deg,#7c3aed 0,#22c55e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 1
          }}
        >
          MOLLA GPT <span style={{ opacity: 0.7 }}>&</span> VAHDETTİNİN İZİNDEN
        </h1>
        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: 8,
            background: "#f0f1f6",
            borderRadius: 10,
            marginBottom: 24,
            overflow: "hidden",
            boxShadow: "0 1px 4px #0001"
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: mainColor,
              transition: "width 0.5s cubic-bezier(.5,1,.5,1)",
              borderRadius: 10
            }}
          />
        </div>
        {/* Card */}
        <div
          style={{
            background: "#fff",
            padding: 32,
            borderRadius: 24,
            boxShadow: cardShadow,
            marginBottom: 24,
            minHeight: 260,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
            {q.Soru}
          </div>
          <div style={{ display: "grid", gap: 14, marginBottom: 6 }}>
            {[q.A, q.B, q.C, q.D].map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={checked}
                style={{
                  textAlign: "left",
                  padding: "15px 18px",
                  borderRadius: 14,
                  fontSize: 16,
                  border:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? `2.5px solid ${successColor}`
                          : `2.5px solid ${errorColor}`
                        : `2.5px solid ${mainColor}`
                      : "1.5px solid #e3e5ed",
                  background:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? "#e6ffe7"
                          : "#ffe6e6"
                        : "#f4f3fd"
                      : "#f9f9fb",
                  color: "#222",
                  fontWeight: selected === i ? 700 : 500,
                  transition: "all 0.15s",
                  boxShadow:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? "0 0 8px #22c55e77"
                          : "0 0 8px #ef444477"
                        : "0 0 7px #7c3aed11"
                      : "",
                  cursor: checked ? "default" : "pointer",
                  outline: "none"
                }}
                onMouseOver={e => {
                  if (!checked && selected !== i)
                    e.currentTarget.style.background = "#e7eafe";
                }}
                onMouseOut={e => {
                  if (!checked && selected !== i)
                    e.currentTarget.style.background = "#f9f9fb";
                }}
              >
                <span style={{ opacity: 0.5, fontWeight: 600 }}>
                  {"ABCD"[i]}){" "}
                </span>
                {opt}
              </button>
            ))}
          </div>
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={selected === null}
              style={{
                marginTop: 26,
                width: "100%",
                padding: 16,
                background: mainColor,
                color: "#fff",
                border: "none",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: "0 4px 18px #7c3aed22",
                cursor: selected === null ? "not-allowed" : "pointer",
                letterSpacing: 0.5,
                transition: "all .2s"
              }}
            >
              Cevabı Kontrol Et
            </button>
          ) : (
            <>
              <div
                style={{
                  marginTop: 20,
                  padding: 18,
                  borderRadius: 12,
                  background:
                    selected === Number(q.DogruCevap)
                      ? "#e6ffe7"
                      : "#ffe6e6",
                  color:
                    selected === Number(q.DogruCevap)
                      ? "#22c55e"
                      : "#ef4444",
                  fontWeight: 700,
                  fontSize: 16,
                  minHeight: 40,
                  boxShadow:
                    selected === Number(q.DogruCevap)
                      ? "0 0 8px #22c55e66"
                      : "0 0 8px #ef444466"
                }}
              >
                {selected === Number(q.DogruCevap) ? "Doğru!" : "Yanlış!"}
                <br />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
                  {q.Aciklama}
                </span>
              </div>
              <button
                onClick={handleNext}
                disabled={current === questions.length - 1}
                style={{
                  marginTop: 18,
                  width: "100%",
                  padding: 16,
                  background: successColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: "0 4px 18px #22c55e33",
                  cursor:
                    current === questions.length - 1
                      ? "not-allowed"
                      : "pointer",
                  letterSpacing: 0.5,
                  transition: "all .2s"
                }}
              >
                Sonraki Soru
              </button>
            </>
          )}
        </div>
        {/* Mini footer */}
        <div
          style={{
            textAlign: "center",
            color: "#7c3aed",
            fontSize: 14,
            marginTop: 22,
            letterSpacing: 1,
            opacity: 0.8
          }}
        >
          Soru {current + 1} / {questions.length}
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: 11,
            marginTop: 10,
            letterSpacing: 0.2
          }}
        >
          © {new Date().getFullYear()} MOLLA GPT & Vahdettinin İzinden <span style={{ fontWeight: 600 }}>Quiz Uygulaması</span>
        </div>
      </div>
      {/* Yükleniyor animasyonu için ufak bir stil */}
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
