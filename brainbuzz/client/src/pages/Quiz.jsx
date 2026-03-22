import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Quiz.module.css";

const LETTERS = ["A", "B", "C", "D"];

export default function Quiz() {
  const { category } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [idx, setIdx]             = useState(0);
  const [selected, setSelected]   = useState(null);
  const [revealed, setRevealed]   = useState(false);
  const [score, setScore]         = useState(0);
  const [correct, setCorrect]     = useState(0);
  const [wrong, setWrong]         = useState(0);
  const [timeLeft, setTimeLeft]   = useState(15);
  const [loading, setLoading]     = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/quiz/${category}`)
      .then(({ data }) => { setQuestions(data.questions); setLoading(false); })
      .catch(() => navigate("/"));
  }, [category]);

  useEffect(() => {
    if (loading || revealed) return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); handleTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, loading]);

  const handleTimeout = () => {
    setSelected(-1);
    setRevealed(true);
    setWrong((w) => w + 1);
  };

  const handleSelect = (i) => {
    if (revealed || selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(i);
    setRevealed(true);
    const q = questions[idx];
    if (i === q.ans) {
      const pts = 100 + timeLeft * 5;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
    } else {
      setWrong((w) => w + 1);
    }
  };

  const handleNext = () => {
    if (idx + 1 >= questions.length) {
      const total = questions.length;
      navigate("/result", {
        state: {
          quizTitle: state?.title || category,
          category,
          score,
          correct,
          wrong,
          percentage: Math.round((correct / total) * 100),
          total,
        },
      });
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading quiz...</div>;

  const q = questions[idx];
  const progress = (idx / questions.length) * 100;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <div className={styles.info}>{state?.title || category}</div>
          <div className={`${styles.timer} ${timeLeft <= 5 ? styles.warning : ""}`}>
            ⏱ {timeLeft}s
          </div>
        </div>

        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.card}>
          <div className={styles.qNum}>Question {idx + 1} of {questions.length}</div>
          <div className={styles.qText}>{q.q}</div>

          <div className={styles.grid}>
            {q.opts.map((opt, i) => {
              let cls = styles.opt;
              if (revealed) {
                if (i === q.ans) cls += ` ${styles.correct}`;
                else if (i === selected) cls += ` ${styles.wrong}`;
              } else if (i === selected) {
                cls += ` ${styles.selected}`;
              }
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={revealed}>
                  <span className={styles.letter}>{LETTERS[i]}</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.action}>
          <button
            className={`${styles.nextBtn} ${revealed ? styles.enabled : ""}`}
            onClick={handleNext}
            disabled={!revealed}
          >
            {idx + 1 >= questions.length ? "See Results →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
