import { useEffect, useState } from "react";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    () => window.localStorage.getItem("fakkarny-theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  function toggleTheme() {
    const nextTheme = darkMode ? "light" : "dark";
    window.localStorage.setItem("fakkarny-theme", nextTheme);
    setDarkMode(!darkMode);
  }

  return (
    <header className="app-header">
      <Link className="app-brand" to="/dashboard" aria-label="فكّرني - الرئيسية">
        <img className="app-brand__logo" src={logo} alt="" />
        <span className="app-brand__name">
          <strong lang="ar">فكّرني</strong>
          <span lang="en" dir="ltr">fakkarny</span>
        </span>
      </Link>

      <form className="app-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <Search aria-hidden="true" size={19} />
        <input type="search" placeholder="ابحث عن مستند، فاتورة أو تذكير..." aria-label="بحث" />
        <kbd>⌘ K</kbd>
      </form>

      <div className="app-header__actions">
        <Link className="icon-button notification-button" to="/notifications" aria-label="الإشعارات">
          <Bell size={20} aria-hidden="true" />
          <span className="notification-button__dot" aria-hidden="true" />
        </Link>
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"} title={darkMode ? "الوضع الفاتح" : "الوضع الداكن"}>
          {darkMode ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
