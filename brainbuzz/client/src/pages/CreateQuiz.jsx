import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./CreateQuiz.module.css";

const EMPTY_QUESTION = () => ({ q: "", opts: ["", "", "", ""], ans: 0 });

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { state } = useLocation(); // state.quiz = existing quiz when editing
  const editing = state?.quiz || null;

  const [title, setTitle]           = useState(editing?.title || "");
  const [category, setCategory]     = useState(editing?.category || "");
  const [difficulty, setDifficulty] = useState(editing?.difficulty || "Medium");
  const [questions, setQuestions]   = useState(
    editing?.questions?.map((q) => ({ ...q, opts: [...q.opts] })) ||
    [EMPTY_QUESTION()]
  );
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  // ── Question helpers ──
  const updateQ = (qi, field, value) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, [field]: value } : q))
    );

  const updateOpt = (qi, oi, value) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? { ...q, opts: q.opts.map((o, j) => (j === oi ? value : o)) }
          : q
      )
    );

  const addQuestion = () => setQuestions((prev) => [...prev, EMPTY_QUESTION()]);

  const removeQuestion = (qi) =>
    setQuestions((prev) => prev.filter((_, i) => i !== qi));

  // ── Save ──
  const handleSave = async () => {
    setError("");
    if (!title.trim()) return setError("Quiz title is required");
    if (!category.trim()) return setError("Category is required");
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.q.trim()) return setError(`Question ${i + 1} text is empty`);
      if (q.opts.some((o) => !o.trim()))
        return setError(`Question ${i + 1} has empty option(s)`);
    }

    setSaving(true);
    try {
      if (editing) {
        await axios.put(`/api/custom-quizzes/${editing._id}`, {
          title, category, difficulty, questions,
        });
      } else {
        await axios.post("/api/custom-quizzes", {
          title, category, difficulty, questions,
        });
      }
      navigate("/manage-quizzes");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const LETTERS = ["A", "B", "C", "D"];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <button className={styles.backBtn} onClick={() => navigate("/manage-quizzes")}>
            ← Back
          </button>
          <div className={styles.pageTitle}>
            {editing ? "Edit Quiz" : "Create Quiz"}
          </div>
        </div>

        {/* Quiz Meta */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Quiz Details</div>
          <div className={styles.metaGrid}>
            <div className={styles.field}>
              <label>Quiz Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. World Capitals Challenge"
              />
            </div>
            <div className={styles.field}>
              <label>Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Geography"
              />
            </div>
            <div className={styles.field}>
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, qi) => (
          <div className={styles.card} key={qi}>
            <div className={styles.qCardHeader}>
              <div className={styles.cardLabel}>Question {qi + 1}</div>
              {questions.length > 1 && (
                <button className={styles.removeBtn} onClick={() => removeQuestion(qi)}>
                  ✕ Remove
                </button>
              )}
            </div>

            <div className={styles.field}>
              <label>Question Text</label>
              <input
                value={q.q}
                onChange={(e) => updateQ(qi, "q", e.target.value)}
                placeholder="Type your question here..."
              />
            </div>

            <div className={styles.optsLabel}>Options — click the circle to mark correct answer</div>
            <div className={styles.optsGrid}>
              {q.opts.map((opt, oi) => (
                <div key={oi} className={`${styles.optRow} ${q.ans === oi ? styles.optCorrect : ""}`}>
                  <button
                    className={`${styles.circle} ${q.ans === oi ? styles.circleActive : ""}`}
                    onClick={() => updateQ(qi, "ans", oi)}
                    title="Mark as correct"
                  >
                    {LETTERS[oi]}
                  </button>
                  <input
                    value={opt}
                    onChange={(e) => updateOpt(qi, oi, e.target.value)}
                    placeholder={`Option ${LETTERS[oi]}`}
                    className={styles.optInput}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add Question */}
        <button className={styles.addQBtn} onClick={addQuestion}>
          + Add Question
        </button>

        {error && <div className={styles.error}>{error}</div>}

        {/* Save */}
        <div className={styles.footer}>
          <div className={styles.summary}>
            {questions.length} question{questions.length !== 1 ? "s" : ""} · {difficulty}
          </div>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : editing ? "Update Quiz →" : "Publish Quiz →"}
          </button>
        </div>
      </div>
    </div>
  );
}
