import React, { useState } from "react";

// Soru havuzu - istediğin kadar ekleyebilirsin
const questions = [
  {
    question: "TBMM’nin kendi varlığını yasal olarak ilk defa kabul ettirdiği uluslararası belge hangisidir?",
    options: [
      "A) Lozan Antlaşması",
      "B) Gümrü Antlaşması",
      "C) Mudanya Ateşkes Antlaşması",
      "D) Ankara Antlaşması"
    ],
    answer: 1,
    explanation: "Gümrü Antlaşması, TBMM'nin uluslararası alanda resmen tanındığı ilk belgedir."
  },
  {
    question: "Osmanlı Devleti’nde saltanatın kaldırılması kararı hangi hukuki dayanağa bağlanmıştır?",
    options: [
      "A) 1921 Anayasası",
      "B) Teşkilat-ı Esasiye Kanunu",
      "C) Halifelik makamı",
      "D) Ulusal egemenlik ilkesi"
    ],
    answer: 3,
    explanation: "Saltanatın kaldırılması ulusal egemenlik ilkesine dayanmıştır."
  },
  {
    question: "Aşağıdakilerden hangisi Misak-ı Milli’de yer alan konulardan biri DEĞİLDİR?",
    options: [
      "A) Azınlık hakları",
      "B) Kapitülasyonların kaldırılması",
      "C) Boğazların statüsü",
      "D) Sınırların belirlenmesi"
    ],
    answer: 2,
    explanation: "Boğazların statüsü Misak-ı Milli’de doğrudan yer almaz."
  },
  // ... Devamı eklenebilir
];

// Karıştırıcı fonksiyon (her açılışta sıralar)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffle(questions);

export default function App() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

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
        <div style={{ fontSize: 18, marginBottom: 16 }}>{q.question}</div>
        <div style={{ display: "grid", gap: 12 }}>
          {q.options.map((opt, i) => (
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
                      ? i === q.answer
                        ? "2px solid #3b9b37"
                        : "2px solid #ce2020"
                      : "2px solid #2563eb"
                    : "1px solid #ccc",
                background:
                  selected === i
                    ? checked
                      ? i === q.answer
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
                  selected === q.answer ? "#e6ffe7" : "#ffe6e6",
                color: selected === q.answer ? "#228b22" : "#b91c1c"
              }}
            >
              {selected === q.answer ? "Doğru!" : "Yanlış!"}
              <br />
              <span style={{ fontSize: 14 }}>{q.explanation}</span>
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
