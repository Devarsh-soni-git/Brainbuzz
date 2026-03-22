import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ManageQuizzes.module.css";

const DIFF_COLOR = { Easy: "easy", Medium: "medium", Hard: "hard" };

export default function ManageQuizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchMine = () => {
    axios.get("/api/custom-quizzes/mine")
      .then(({ data }) => { setQuizzes(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMine(); }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await axios.delete(`/api/custom-quizzes/${id}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch {
      alert("Failed to delete quiz");
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <button className={styles.backBtn} onClick={() => navigate("/")}>← Dashboard</button>
            <div className={styles.title}>Manage Quizzes</div>
            <div className={styles.sub}>All quizzes you've created</div>
          </div>
          <button className={styles.createBtn} onClick={() => navigate("/create-quiz")}>
            + Create Quiz
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : quizzes.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <div className={styles.emptyText}>No quizzes yet</div>
            <div className={styles.emptySub}>Create your first quiz and it'll appear here</div>
            <button className={styles.createBtn} onClick={() => navigate("/create-quiz")}>
              + Create First Quiz
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {quizzes.map((q) => (
              <div key={q._id} className={styles.row}>
                <div className={`${styles.diffBadge} ${styles[DIFF_COLOR[q.difficulty]]}`}>
                  {q.difficulty}
                </div>

                <div className={styles.info}>
                  <div className={styles.quizTitle}>{q.title}</div>
                  <div className={styles.quizMeta}>
                    <span>{q.category}</span>
                    <span>·</span>
                    <span>{q.questions.length} questions</span>
                    <span>·</span>
                    <span>{q.plays} plays</span>
                    <span>·</span>
                    <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.playBtn}
                    onClick={() => navigate(`/quiz/custom/${q._id}`, { state: { title: q.title } })}
                  >
                    ▶ Play
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => navigate("/create-quiz", { state: { quiz: q } })}
                  >
                    Edit
                  </button>

                  {confirmId === q._id ? (
                    <div className={styles.confirmRow}>
                      <span className={styles.confirmText}>Delete?</span>
                      <button
                        className={styles.confirmYes}
                        onClick={() => handleDelete(q._id)}
                        disabled={deleting === q._id}
                      >
                        {deleting === q._id ? "..." : "Yes"}
                      </button>
                      <button className={styles.confirmNo} onClick={() => setConfirmId(null)}>
                        No
                      </button>
                    </div>
                  ) : (
                    <button className={styles.deleteBtn} onClick={() => setConfirmId(q._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
