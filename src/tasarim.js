import React, { useEffect, useState } from "react";

// Neon renkler ve blur efektiyle 3000 yılı stili
const bgGradient =
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)";
const cardGlass =
  "rgba(255,255,255,0.12)";
const borderNeon =
  "0 0 24px #3be8b0, 0 0 40px #6366f1";
const mainNeon = "#3be8b0";
const accentNeon = "#6366f1";
const wrongNeon = "#fd367e";
const correctNeon = "#00ffae";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Tasarim() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);

  // Sheet API url'ini kendi linkinle değiştir!
  const SHEET_API =
    "https://api.sheetbest.com/sheets/23bc6d7b-d5a0-4068-b3b5-dedb85343aae";

  useEffect(() => {
    fetch(SHEET_API)
      .then(res => res.json())
      .then(data => setQuestions(shuffle(data)));
  }, []);

  useEffect(() => {
    setReveal(true);
    const timeout = setTimeout(() => setReveal(false), 600);
    return () => clearTimeout(timeout);
  }, [current]);

  if (!questions.length)
    return (
      <div className="neon-loading">Yükleniyor...</div>
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

  const progress = Math.round(((current + 1) / questions.length) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgGradient,
        padding: 0,
        margin: 0,
        fontFamily: "'Orbitron', 'Inter', Arial, sans-serif"
      }}
    >
      {/* Animated background glow */}
      <div
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          left: 0,
          top: 0,
          zIndex: 0
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, #3be8b088 10%, transparent 70%)",
            left: 0,
            top: 0,
            filter: "blur(80px)"
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            background: "radial-gradient(circle, #6366f1aa 10%, transparent 70%)",
            right: -80,
            bottom: 0,
            filter: "blur(80px)"
          }}
        />
      </div>
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "64px 12px 32px",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1
        }}
      >
        <h1
          style={{
            fontSize: 34,
            fontWeight: 900,
            marginBottom: 18,
            background: `linear-gradient(90deg,${mainNeon},${accentNeon})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 1.5,
            textShadow: "0 0 18px #3be8b055,0 2px 8px #1d1f33"
          }}
        >
          MOLLA GPT <span style={{ opacity: 0.65 }}>&</span> VAHDETTİNİN İZİNDEN
        </h1>
        {/* Neon Progress Bar */}
        <div
          style={{
            width: "100%",
            height: 10,
            background: "#1c2743",
            borderRadius: 14,
            marginBottom: 24,
            overflow: "hidden",
            boxShadow: "0 2px 24px #6366f111"
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: `linear-gradient(90deg,${mainNeon} 0%,${accentNeon} 80%)`,
              borderRadius: 14,
              boxShadow: borderNeon,
              transition: "width 0.6s cubic-bezier(.5,1,.5,1)"
            }}
          />
        </div>
        {/* Card */}
        <div
          className={`glass-card ${reveal ? "card-animate" : ""}`}
          style={{
            background: cardGlass,
            padding: 38,
            borderRadius: 32,
            boxShadow:
              "0 8px 42px 0 #3be8b045, 0 2px 8px #6366f133",
            marginBottom: 28,
            minHeight: 260,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: `2.3px solid ${accentNeon}`,
            backdropFilter: "blur(20px)"
          }}
        >
          <div
            style={{
              fontSize: 21,
              fontWeight: 700,
              marginBottom: 28,
              color: "#fff",
              textShadow: "0 2px 24px #3be8b055, 0 1px 3px #243b55"
            }}
          >
            {q.Soru}
          </div>
          <div style={{ display: "grid", gap: 17, marginBottom: 6 }}>
            {[q.A, q.B, q.C, q.D].map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={checked}
                style={{
                  textAlign: "left",
                  padding: "18px 22px",
                  borderRadius: 16,
                  fontSize: 17,
                  border:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? `2.5px solid ${correctNeon}`
                          : `2.5px solid ${wrongNeon}`
                        : `2.5px solid ${mainNeon}`
                      : "1.5px solid #23284d",
                  background:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? "#00ffae0f"
                          : "#fd367e17"
                        : "#3be8b00b"
                      : "#12192baf",
                  color: "#fff",
                  fontWeight: selected === i ? 800 : 600,
                  transition: "all 0.19s cubic-bezier(.7,0,.2,1)",
                  boxShadow:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? "0 0 16px #00ffae55"
                          : "0 0 12px #fd367e55"
                        : "0 0 12px #3be8b044"
                      : "0 1.5px 8px #23284d11",
                  cursor: checked ? "default" : "pointer",
                  letterSpacing: 1.2,
                  outline: "none",
                  filter:
                    selected === i && !checked
                      ? "brightness(1.15)"
                      : "brightness(1)"
                }}
                onMouseOver={e => {
                  if (!checked && selected !== i)
                    e.currentTarget.style.background = "#3be8b023";
                }}
                onMouseOut={e => {
                  if (!checked && selected !== i)
                    e.currentTarget.style.background = "#12192baf";
                }}
              >
                <span style={{
                  opacity: 0.63,
                  fontWeight: 900,
                  letterSpacing: 2.2,
                  fontSize: 14,
                  marginRight: 7
                }}>
                  {"ABCD"[i]})
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
                marginTop: 32,
                width: "100%",
                padding: 18,
                background: `linear-gradient(90deg,${mainNeon},${accentNeon})`,
                color: "#141e30",
                border: "none",
                borderRadius: 16,
                fontWeight: 900,
                fontSize: 17,
                letterSpacing: 1.1,
                boxShadow: "0 4px 22px #3be8b044, 0 2px 8px #6366f144",
                cursor: selected === null ? "not-allowed" : "pointer",
                textShadow: "0 1.5px 8px #fff5",
                textTransform: "uppercase",
                transition: "all .21s cubic-bezier(.9,0,.2,1)"
              }}
            >
              CEVABI KONTROL ET
            </button>
          ) : (
            <>
              <div
                style={{
                  marginTop: 26,
                  padding: 19,
                  borderRadius: 14,
                  background:
                    selected === Number(q.DogruCevap)
                      ? "#00ffae14"
                      : "#fd367e22",
                  color:
                    selected === Number(q.DogruCevap)
                      ? correctNeon
                      : wrongNeon,
                  fontWeight: 900,
                  fontSize: 17,
                  minHeight: 48,
                  boxShadow:
                    selected === Number(q.DogruCevap)
                      ? "0 0 14px #00ffae"
                      : "0 0 13px #fd367e88",
                  border: `1.4px solid ${
                    selected === Number(q.DogruCevap) ? correctNeon : wrongNeon
                  }`,
                  letterSpacing: 1.1
                }}
              >
                {selected === Number(q.DogruCevap) ? "✨ Doğru!" : "⛔ Yanlış!"}
                <br />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>
                  {q.Aciklama}
                </span>
              </div>
              <button
                onClick={handleNext}
                disabled={current === questions.length - 1}
                style={{
                  marginTop: 21,
                  width: "100%",
                  padding: 17,
                  background: `linear-gradient(90deg,${accentNeon} 10%,${mainNeon} 100%)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: 16,
                  boxShadow: "0 4px 18px #6366f133",
                  cursor:
                    current === questions.length - 1
                      ? "not-allowed"
                      : "pointer",
                  letterSpacing: 1.2,
                  textShadow: "0 2px 14px #6366f177",
                  transition: "all .19s"
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
            color: accentNeon,
            fontSize: 15,
            marginTop: 27,
            letterSpacing: 1,
            opacity: 0.88,
            fontWeight: 700
          }}
        >
          Soru {current + 1} / {questions.length}
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#3be8b0bb",
            fontSize: 11,
            marginTop: 12,
            letterSpacing: 0.3,
            fontWeight: 700,
            textShadow: "0 2px 8px #3be8b099"
          }}
        >
          © {new Date().getFullYear()} MOLLA GPT & Vahdettinin İzinden <span style={{ fontWeight: 800, color: "#fff" }}>Quiz Uygulaması</span>
        </div>
      </div>
      {/* Yükleniyor animasyonu için ufak bir stil */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;900&display=swap');
        .neon-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.7rem;
          color: #3be8b0;
          background: ${bgGradient};
          letter-spacing: 2px;
          font-family: 'Orbitron', 'Inter', Arial, sans-serif;
          text-shadow: 0 0 16px #6366f1, 0 0 32px #3be8b0;
        }
        .glass-card {
          animation: fadein .8s cubic-bezier(.4,0,.2,1);
        }
        .card-animate {
          animation: pop .62s cubic-bezier(.5,0,.3,1);
        }
        @keyframes pop {
          0% { transform: scale(.95) rotate(-2deg);}
          65% { transform: scale(1.05) rotate(1deg);}
          100% { transform: scale(1) rotate(0);}
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
}
