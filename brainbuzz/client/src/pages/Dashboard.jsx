import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styles from "./Dashboard.module.css";

const BUILT_IN = [
  { title: "JavaScript Fundamentals", category: "tech",    tag: "Technology",  tagClass: "tech",    difficulty: "Medium", diffClass: "medium" },
  { title: "React & State Management",category: "tech",    tag: "Technology",  tagClass: "tech",    difficulty: "Hard",   diffClass: "hard"   },
  { title: "General Knowledge Blast", category: "general", tag: "General",     tagClass: "general", difficulty: "Easy",   diffClass: "easy"   },
  { title: "Data Structures & Algo",  category: "tech",    tag: "Technology",  tagClass: "tech",    difficulty: "Hard",   diffClass: "hard"   },
  { title: "Science Trivia",          category: "science", tag: "Science",     tagClass: "science", difficulty: "Medium", diffClass: "medium" },
  { title: "Math Challenge",          category: "math",    tag: "Mathematics", tagClass: "math",    difficulty: "Medium", diffClass: "medium" },
];

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
      else { setValue(target); prev.current = target; }
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  const animScore  = useCountUp(user?.totalScore  || 0);
  const animDone   = useCountUp(user?.quizzesDone || 0);
  const animStreak = useCountUp(user?.bestStreak  || 0);

  useEffect(() => {
    axios.get("/api/scores/leaderboard").then(({ data }) => setLeaderboard(data)).catch(() => {});
  }, [user]);

  const maxScore = leaderboard[0]?.totalScore || 1;

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.greeting}>Good session,</div>
        <div className={styles.name}>{user?.name}<span> .</span></div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Score</div>
          <div className={styles.statValue}>{animScore.toLocaleString()}</div>
          <div className={styles.statSub}>lifetime points</div>
          <div className={styles.statIcon}>⚡</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Quizzes Done</div>
          <div className={styles.statValue}>{animDone}</div>
          <div className={styles.statSub}>completed</div>
          <div className={styles.statIcon}>✓</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Best Streak</div>
          <div className={styles.statValue}>{animStreak}</div>
          <div className={styles.statSub}>consecutive correct</div>
          <div className={styles.statIcon}>🔥</div>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitle}>Available Quizzes</div>
      </div>
      <div className={styles.quizGrid}>
        {BUILT_IN.map((q) => (
          <div
            key={q.category + q.title}
            className={styles.quizCard}
            onClick={() => navigate(`/quiz/${q.category}`, { state: { title: q.title } })}
          >
            <div className={`${styles.diffDot} ${styles[q.diffClass]}`} />
            <div className={`${styles.tag} ${styles[q.tagClass]}`}>{q.tag}</div>
            <div className={styles.quizName}>{q.title}</div>
            <div className={styles.quizMeta}>
              <span>⏱ 15s/q</span>
              <span>◈ 5 questions</span>
              <span>⬡ {q.difficulty}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitle}>Leaderboard</div>
      </div>
      <div className={styles.leaderList}>
        {leaderboard.length === 0 ? (
          <div className={styles.empty}>No scores yet — be the first! 🚀</div>
        ) : (
          leaderboard.map((entry, i) => (
            <div key={entry._id} className={styles.leaderRow}>
              <div className={`${styles.rank} ${i < 3 ? styles["rank" + (i + 1)] : ""}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </div>
              <div
                className={styles.avatar}
                style={{ background: `hsl(${(i * 47 + 120) % 360},60%,30%)`, color: `hsl(${(i * 47 + 120) % 360},80%,70%)` }}
              >
                {entry.name[0].toUpperCase()}
              </div>
              <div
                className={styles.leaderName}
                style={entry._id === user?.id ? { color: "var(--accent)" } : {}}
              >
                {entry.name}{entry._id === user?.id ? " (you)" : ""}
              </div>
              <div className={styles.barWrap}>
                <div className={styles.bar} style={{ width: `${Math.round((entry.totalScore / maxScore) * 100)}%` }} />
              </div>
              <div className={styles.leaderScore}>{entry.totalScore.toLocaleString()}</div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
