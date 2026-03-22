import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/auth"); };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        <span className={styles.dot} />
        Brain<span className={styles.accent}>Buzz</span>
      </div>

      <div className={styles.right}>
        {user && (
          <div className={styles.badge}>⚡ {user.totalScore?.toLocaleString() || 0} pts</div>
        )}

        {user?.isAdmin && (
          <button className={styles.adminBtn} onClick={() => navigate("/manage-quizzes")}>
            ⚙ My Quizzes
          </button>
        )}

        <div className={styles.themeRow}>
          <span className={styles.themeIcon}>{theme === "dark" ? "🌙" : "☀️"}</span>
          <button
            className={styles.toggle}
            onClick={toggleTheme}
            data-active={theme === "light"}
            title="Toggle theme"
          />
        </div>

        {user && (
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
        )}
      </div>
    </nav>
  );
}
