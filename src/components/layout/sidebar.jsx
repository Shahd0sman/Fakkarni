import { useNavigate, NavLink } from "react-router-dom";
import {
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
  UserRound,
  BellRing,
} from "lucide-react";

const navigation = [
  { to: "/dashboard", label: "الداشبورد", icon: LayoutDashboard },
  { to: "/documents", label: "المستندات", icon: FileText },
  { to: "/bills", label: "الفواتير", icon: ReceiptText },
  { to: "/reminders", label: "التذكيرات", icon: BellRing },
  { to: "/notifications", label: "الإشعارات", icon: Bell },
  { to: "/settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/login");
  }

  return (
    <aside className="app-sidebar" aria-label="القائمة الرئيسية">
      <p className="app-sidebar__caption">القائمة الرئيسية</p>
      <nav className="app-sidebar__nav">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
          >
            <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="app-sidebar__account">
        <div className="account-avatar" aria-hidden="true">
          <UserRound size={21} strokeWidth={1.8} />
        </div>
        <div className="account-details">
          <strong>حسابي</strong>
          <span>أهلًا بيك</span>
        </div>
        <button className="account-logout" type="button" onClick={handleLogout} aria-label="تسجيل الخروج" title="تسجيل الخروج">
          <LogOut size={18} aria-hidden="true" />
          <span>خروج</span>
        </button>
      </div>
    </aside>
  );
}
