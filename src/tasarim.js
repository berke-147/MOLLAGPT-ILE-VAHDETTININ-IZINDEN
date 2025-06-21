import React, { useEffect, useState } from "react";

const CAN_HAKKI = 6; // toplam yanlış hakkı (can)

const bgGradient =
  "linear-gradient(135deg, #181824 0%, #233356 100%)";
const cardShadow =
  "0 4px 32px 0 rgba(49, 69, 130, 0.10), 0 1.5px 6px 0 rgba(49, 69, 130, 0.06)";
const mainColor = "#7c3aed";
const errorColor = "#ef4444";
const correctColor = "#22c55e";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function saveUser(name) {
  window.localStorage.setItem("adam-asmaca-user", name);
}
function getUser() {
  return window.localStorage.getItem("adam-asmaca-user");
}

export default function Tasarim() {
  const [user, setUser] = useState(getUser() || "");
  const [ad, setAd] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [can, setCan] = useState(CAN_HAKKI);
  const [bitti, setBitti] = useState(false);
  const [kazandi, setKazandi] = useState(false);

  // Sheet API url'ini kendi linkinle değiştir!
  const SHEET_API =
    "https://api.sheetbest.com/sheets/23bc6d7b-d5a0-4068-b3b5-dedb85343aae";

  useEffect(() => {
    fetch(SHEET_API)
      .then(res => res.json())
      .then(data => setQuestions(shuffle(data)));
  }, []);

  // Adam asmaca grafiği için
  function AdamAsmaca({can}) {
    // 6 can hakkı için klasik asma adam basitleştirilmiş
    return (
      <svg width="80" height="110">
        <line x1="10" y1="100" x2="70" y2="100" stroke="#fff" strokeWidth="3"/>
        <line x1="40" y1="100" x2="40" y2="20" stroke="#fff" strokeWidth="3"/>
        <line x1="40" y1="20" x2="65" y2="20" stroke="#fff" strokeWidth="3"/>
        <line x1="65" y1="20" x2="65" y2="30" stroke="#fff" strokeWidth="3"/>
        {can <= 5 && <circle cx="65" cy="36" r="7" stroke="#fff" strokeWidth="2.5" fill="none"/>}
        {can <= 4 && <line x1="65" y1="43" x2="65" y2="65" stroke="#fff" strokeWidth="2.5"/>}
        {can <= 3 && <line x1="65" y1="50" x2="55" y2="55" stroke="#fff" strokeWidth="2.5"/>}
        {can <= 2 && <line x1="65" y1="50" x2="75" y2="55" stroke="#fff" strokeWidth="2.5"/>}
        {can <= 1 && <line x1="65" y1="65" x2="60" y2="80" stroke="#fff" strokeWidth="2.5"/>}
        {can <= 0 && <line x1="65" y1="65" x2="70" y2="80" stroke="#fff" strokeWidth="2.5"/>}
      </svg>
    );
  }

  // Oyunu sıfırlama
  function restart() {
    setCurrent(0);
    setCan(CAN_HAKKI);
    setBitti(false);
    setKazandi(false);
    setSelected(null);
    setChecked(false);
    setQuestions(shuffle(questions));
  }

  // Kullanıcı giriş ekranı
  if (!user) {
    return (
      <div style={{
        minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        background: bgGradient,
        fontFamily: "Inter, sans-serif"
      }}>
        <form onSubmit={e=>{
          e.preventDefault();
          if(ad.trim().length > 1){
            setUser(ad.trim());
            saveUser(ad.trim());
          }
        }} style={{
          background: "#fff2",
          borderRadius: 18,
          boxShadow: cardShadow,
          padding:32,
          minWidth: 320,
          textAlign: "center"
        }}>
          <h2 style={{
            fontWeight:900, fontSize:24, marginBottom:16, color:"#fff"
          }}>Adam Asmaca Quiz'e Hoşgeldin!</h2>
          <input
            placeholder="Adınızı girin..."
            value={ad}
            onChange={e=>setAd(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border:"none",
              width:"90%",
              marginBottom:14,
              fontSize: 17,
              outline: "none"
            }}
            required
          /><br/>
          <button type="submit"
            style={{
              background: mainColor,
              color:"#fff",
              border:"none",
              borderRadius:8,
              padding:"10px 22px",
              fontWeight:700,
              fontSize:17,
              cursor:"pointer",
              boxShadow:"0 2px 8px #7c3aed22"
            }}
          >Giriş Yap</button>
        </form>
      </div>
    )
  }

  if (!questions.length) return <div className="loading">Yükleniyor...</div>;

  const q = questions[current];

  // Oyun bitti ekranı
  if (bitti) {
    return (
      <div style={{
        minHeight:"100vh",
        background: bgGradient,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        color:"#fff"
      }}>
        <AdamAsmaca can={0}/>
        <h2 style={{fontSize:28,marginTop:18}}>Kaybettin! 😥</h2>
        <div style={{margin:"18px 0",fontSize:20}}>Doğru cevap: <span style={{color:correctColor}}>{["A","B","C","D"][q.DogruCevap]}) {q[["A","B","C","D"][q.DogruCevap]]}</span></div>
        <div style={{color:"#ddd", marginBottom:16}}>{q.Aciklama}</div>
        <button onClick={restart} style={{
          background: mainColor,
          color:"#fff",
          border:"none",
          borderRadius:8,
          padding:"10px 22px",
          fontWeight:700,
          fontSize:18,
          marginTop:8,
          cursor:"pointer"
        }}>Tekrar Dene</button>
        <button onClick={()=>{setUser(""); saveUser("");}} style={{
          background:"#fff1",
          color:"#fff",
          border:"none",
          borderRadius:8,
          padding:"8px 20px",
          fontWeight:600,
          fontSize:15,
          marginTop:16,
          cursor:"pointer"
        }}>Çıkış Yap</button>
      </div>
    );
  }

  // Oyun bitti (tüm soruları geçti)
  if (kazandi) {
    return (
      <div style={{
        minHeight:"100vh",
        background: bgGradient,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        color:"#fff"
      }}>
        <AdamAsmaca can={can}/>
        <h2 style={{fontSize:30,marginTop:12}}>Tebrikler {user}! 🎉</h2>
        <div style={{margin:"18px 0",fontSize:20}}>Tüm soruları doğru bildin!</div>
        <button onClick={restart} style={{
          background: mainColor,
          color:"#fff",
          border:"none",
          borderRadius:8,
          padding:"10px 22px",
          fontWeight:700,
          fontSize:18,
          marginTop:8,
          cursor:"pointer"
        }}>Baştan Oyna</button>
        <button onClick={()=>{setUser(""); saveUser("");}} style={{
          background:"#fff1",
          color:"#fff",
          border:"none",
          borderRadius:8,
          padding:"8px 20px",
          fontWeight:600,
          fontSize:15,
          marginTop:16,
          cursor:"pointer"
        }}>Çıkış Yap</button>
      </div>
    );
  }

  // Soru ekranı
  function handleSelect(i) {
    if (!checked) setSelected(i);
  }
  function handleCheck() {
    setChecked(true);
    if (selected !== Number(q.DogruCevap)) {
      setCan(c => {
        if (c <= 1) {
          setBitti(true);
          return 0;
        }
        return c - 1;
      });
    } else if (current === questions.length - 1) {
      setKazandi(true);
    }
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
        fontFamily: "Inter, sans-serif",
        color: "#fff"
      }}
    >
      <div style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "50px 12px 24px",
        minHeight: "100vh",
        position: "relative"
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontWeight:700, fontSize:21, letterSpacing:1, marginBottom:18}}>
            Adam Asmaca Quiz
          </div>
          <div style={{
            fontWeight:700,
            fontSize:15,
            background:"#fff2",
            padding:"7px 14px",
            borderRadius:8
          }}>
            <span role="img" aria-label="user">👤</span> {user}
          </div>
        </div>
        {/* Progress Bar ve Can */}
        <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:14}}>
          <div style={{
            width: 90, height: 110, display:"flex",alignItems:"center",justifyContent:"center"
          }}>
            <AdamAsmaca can={can}/>
          </div>
          <div style={{flex:1}}>
            <div style={{
              width:"100%",height:8, background:"#393a50",borderRadius:8,overflow:"hidden",marginBottom:9
            }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: mainColor,
                borderRadius: 8,
                transition: "width 0.5s cubic-bezier(.5,1,.5,1)"
              }}/>
            </div>
            <div style={{fontSize:14,color:"#fff",opacity:.88,marginLeft:1}}>
              Soru {current + 1} / {questions.length}
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span style={{color: errorColor}}>Can: {can}</span>
            </div>
          </div>
        </div>
        {/* Soru Kartı */}
        <div
          style={{
            background: "#fff2",
            padding: 30,
            borderRadius: 22,
            boxShadow: cardShadow,
            marginBottom: 22,
            minHeight: 170,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border:"1.5px solid #393a50"
          }}
        >
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 20, color:"#fff" }}>
            {q.Soru}
          </div>
          <div style={{ display: "grid", gap: 14, marginBottom: 5 }}>
            {[q.A, q.B, q.C, q.D].map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={checked}
                style={{
                  textAlign: "left",
                  padding: "14px 18px",
                  borderRadius: 13,
                  fontSize: 16,
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
                  color: "#fff",
                  fontWeight: selected === i ? 700 : 500,
                  transition: "all 0.13s",
                  boxShadow:
                    selected === i
                      ? checked
                        ? i === Number(q.DogruCevap)
                          ? "0 0 9px #24fbb377"
                          : "0 0 9px #ff7b8c44"
                        : "0 0 6px #7c3aed33"
                      : "",
                  cursor: checked ? "default" : "pointer",
                  outline: "none"
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
              onClick={handleCheck}
              disabled={selected === null}
              style={{
                marginTop: 22,
                width: "100%",
                padding: 14,
                background: mainColor,
                color: "#fff",
                border: "none",
                borderRadius: 11,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: "0 4px 15px #7c3aed18",
                cursor: selected === null ? "not-allowed" : "pointer"
              }}
            >
              Kontrol Et
            </button>
          ) : (
            <>
              <div
                style={{
                  marginTop: 18,
                  padding: 13,
                  borderRadius: 10,
                  background:
                    selected === Number(q.DogruCevap)
                      ? "#24fbb325"
                      : "#ff7b8c24",
                  color:
                    selected === Number(q.DogruCevap)
                      ? correctColor
                      : errorColor,
                  fontWeight: 700,
                  fontSize: 16,
                  minHeight: 32,
                  boxShadow:
                    selected === Number(q.DogruCevap)
                      ? "0 0 8px #22c55e66"
                      : "0 0 8px #ef444466"
                }}
              >
                {selected === Number(q.DogruCevap) ? "Doğru!" : "Yanlış!"}
                <br />
                <span style={{ fontSize: 14, color:"#fff" }}>{q.Aciklama}</span>
              </div>
              {current !== questions.length - 1 && (
                <button
                  onClick={handleNext}
                  style={{
                    marginTop: 14,
                    width: "100%",
                    padding: 14,
                    background: correctColor,
                    color: "#fff",
                    border: "none",
                    borderRadius: 11,
                    fontWeight: 700,
                    fontSize: 16,
                    boxShadow: "0 4px 12px #22c55e33",
                    cursor: "pointer"
                  }}
                >
                  Sonraki Soru
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
