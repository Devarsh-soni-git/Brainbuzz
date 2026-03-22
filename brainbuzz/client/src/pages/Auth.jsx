import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

export default function Auth() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const url = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        tab === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const { data } = await axios.post(url, payload);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === "Enter" && handleSubmit();

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "login" ? styles.active : ""}`}
            onClick={() => { setTab("login"); setError(""); }}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${tab === "register" ? styles.active : ""}`}
            onClick={() => { setTab("register"); setError(""); }}
          >
            Register
          </button>
        </div>

        <div className={styles.title}>
          {tab === "login" ? "Welcome back" : "Create account"}
        </div>
        <div className={styles.sub}>
          {tab === "login"
            ? "Sign in to continue your streak →"
            : "Join 12,400+ learners →"}
        </div>

        {tab === "register" && (
          <div className={styles.field}>
            <label>Name</label>
            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              onKeyDown={handleKey}
            />
          </div>
        )}

        <div className={styles.field}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKey}
          />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKey}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          className={styles.submit}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : tab === "login" ? "Sign In →" : "Create Account →"}
        </button>
      </div>
    </div>
  );
}
