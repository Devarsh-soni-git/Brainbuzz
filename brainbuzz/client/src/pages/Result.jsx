import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styles from "./Result.module.css";

function useCountUp(target, duration = 1200, delay = 200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const update = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(update);
        else setValue(target);
      };
      requestAnimationFrame(update);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

function Confetti() {
  const colors = ["#c8f53d", "#5b9cf6", "#ff5f57", "#b08aff", "#f5a623"];
  return (
    <div className={styles.confettiWrap}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className={styles.piece}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-Math.random() * 20}px`,
            background: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${1.5 + Math.random()}s`,
            width: `${4 + Math.random() * 6}px`,
            height: `${8 + Math.random() * 8}px`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function Result() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const { updateUser, user } = useAuth();
  const saved = useRef(false);

  const { quizTitle, category, score, correct, wrong, percentage, total } = state || {};

  const animPct   = useCountUp(percentage || 0, 1200, 200);
  const animCor   = useCountUp(correct || 0, 800, 300);
  const animWrong = useCountUp(wrong || 0, 800, 300);
  const animPts   = useCountUp(score || 0, 1000, 200);

  useEffect(() => {
    if (!state || saved.current) return;
    saved.current = true;

    axios.post("/api/scores", { quizTitle, category, score, correct, wrong, percentage })
      .then(({ data }) => {
        updateUser({
          totalScore: data.totalScore,
          quizzesDone: data.quizzesDone,
        });
      })
      .catch(() => {});
  }, []);

  if (!state) { navigate("/"); return null; }

  const getBadge = () => {
    if (percentage === 100) return { icon: "🏆", msg: "Perfect Score! Genius!" };
    if (percentage >= 80)  return { icon: "🎉", msg: "Excellent Work!" };
    if (percentage >= 60)  return { icon: "👏", msg: "Good Effort!" };
    if (percentage >= 40)  return { icon: "💪", msg: "Keep Practicing!" };
    return { icon: "📚", msg: "Better luck next time." };
  };

  const { icon, msg } = getBadge();

  return (
    <div className={styles.page}>
      {percentage >= 80 && <Confetti />}

      <div className={styles.box}>
        <div className={styles.badge}>{icon}</div>

        <div className={styles.scoreBig}>{animPct}%</div>
        <div className={styles.scoreLabel}>Your Score</div>
        <div className={styles.msg}>{msg}</div>

        <div className={styles.breakdown}>
          <div className={styles.cell}>
            <div className={styles.val} style={{ color: "var(--accent)" }}>{animCor}</div>
            <div className={styles.lbl}>Correct</div>
          </div>
          <div className={styles.cell}>
            <div className={styles.val} style={{ color: "var(--accent2)" }}>{animWrong}</div>
            <div className={styles.lbl}>Wrong</div>
          </div>
          <div className={styles.cell}>
            <div className={styles.val} style={{ color: "var(--accent3)" }}>+{animPts}</div>
            <div className={styles.lbl}>Points</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.outline} onClick={() => navigate("/")}>
            ← Dashboard
          </button>
          <button
            className={styles.primary}
            onClick={() => navigate(`/quiz/${category}`, { state: { title: quizTitle } })}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
