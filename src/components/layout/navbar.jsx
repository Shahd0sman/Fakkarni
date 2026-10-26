import { useEffect, useState } from "react";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import notificationService from "../../services/notificationservice";
import documentService from "../../services/documentservice";
import billsService from "../../services/billsService";
import reminderService from "../../services/reminderservice";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    () => window.localStorage.getItem("fakkarny-theme") === "dark",
  );
  const [hasUnread, setHasUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultQuery, setSearchResultQuery] = useState("");
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    let isMounted = true;
    async function checkNotifications() {
      try {
        const res = await notificationService.getNotifications();
        if (isMounted && res?.data) {
          const unread = res.data.some((n) => !n.isRead);
          setHasUnread(unread);
        }
      } catch {
        // Ignore if error
      }
    }
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return undefined;

    let isCurrentSearch = true;
    const timeoutId = setTimeout(async () => {
      setSearchError("");

      try {
        const [documentsRes, billsRes, remindersRes] = await Promise.all([
          documentService.getDocuments(),
          billsService.getBills(),
          reminderService.getReminders(),
        ]);
        if (!isCurrentSearch) return;

        const results = [
          ...(documentsRes.data || [])
            .filter((document) => document.title?.toLocaleLowerCase().includes(query))
            .map((document) => ({
              id: document.id,
              title: document.title,
              to: "/documents",
            })),
          ...(billsRes.data || [])
            .filter((bill) => bill.title?.toLocaleLowerCase().includes(query))
            .map((bill) => ({
              id: bill.id,
              title: bill.title,
              to: "/bills",
            })),
          ...(remindersRes.data || [])
            .filter((reminder) =>
              reminder.document?.title?.toLocaleLowerCase().includes(query),
            )
            .map((reminder) => ({
              id: reminder.id,
              title: reminder.document.title,
              to: "/reminders",
            })),
        ];
        setSearchResults(results);
        setSearchResultQuery(query);
      } catch (error) {
        if (isCurrentSearch) {
            setSearchResults([]);
            setSearchError(error.response?.data?.message || "تعذر إتمام البحث");
            setSearchResultQuery(query);
        }
      }
    }, 250);

    return () => {
      isCurrentSearch = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  function toggleTheme() {
    const nextTheme = darkMode ? "light" : "dark";
    window.localStorage.setItem("fakkarny-theme", nextTheme);
    setDarkMode(!darkMode);
  }

  return (
    <header className="app-header">
      <Link className="app-brand" to="/dashboard" aria-label="فكّرني - الرئيسية">
        <img className="app-brand__logo" src={logo} alt="logo" />
        <span className="app-brand__name">
          <strong lang="ar">فكّرني</strong>
        </span>
      </Link>

      <div className="app-search-container">
        <form className="app-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <Search aria-hidden="true" size={19} />
          <input
            type="search"
            placeholder="ابحث عن مستند، فاتورة أو تذكير..."
            aria-label="بحث"
            aria-expanded={!!searchQuery.trim()}
            aria-controls="app-search-results"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </form>
        {!!searchQuery.trim() && (
          <div className="app-search__results" id="app-search-results" role="listbox">
            {searchResultQuery !== searchQuery.trim().toLocaleLowerCase() ? (
              <p className="app-search__message">جاري البحث...</p>
            ) : searchError ? (
              <p className="app-search__message app-search__message--error">{searchError}</p>
            ) : searchResults.length ? (
              searchResults.map((result, index) => (
                <Link
                  className="app-search__result"
                  key={`${result.to}-${result.id}-${index}`}
                  to={result.to}
                  role="option"
                  onClick={() => setSearchQuery("")}
                >
                  {result.title}
                </Link>
              ))
            ) : (
              <p className="app-search__message">لا توجد نتائج</p>
            )}
          </div>
        )}
      </div>

      <div className="app-header__actions">
        <Link className="icon-button notification-button" to="/notifications" aria-label="الإشعارات">
          <Bell size={20} aria-hidden="true" />
          {hasUnread && <span className="notification-button__dot" aria-hidden="true" />}
        </Link>
        <button
          className="icon-button"
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
          title={darkMode ? "الوضع الفاتح" : "الوضع الداكن"}
        >
          {darkMode ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
