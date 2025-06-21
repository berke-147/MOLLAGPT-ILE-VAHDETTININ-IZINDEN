import React, { useEffect, useState } from "react";

const bgGradient =
  "linear-gradient(135deg, #f2e9f7 0%, #e0ecfa 100%)";
const cardShadow =
  "0 4px 32px 0 rgba(49, 69, 130, 0.07), 0 1.5px 6px 0 rgba(49, 69, 130, 0.04)";
const mainColor = "#7c3aed";
const successColor = "#22c55e";
const errorColor = "#ef4444";

export default function ChicQuiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  // Google Sheets veya SheetBest API URL'inizi buraya yazın!
  const SHEET_API =
    "https://opensheet.vercel.app/1I5DByjjeLDPikYzI7c9MuUQhTP85OHeN_lMkrOu6LH0/Sheet1";

  useEffect(() => {
    fetch(SHEET_API)
      .then((res) => res.json())
      .then((data) => setQuestions(data));
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
