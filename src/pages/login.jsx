import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import Input from "../components/common/input.jsx";
import Button from "../components/common/button.jsx";
import ErrorMessage from "../components/common/error.jsx";
import logo from "../assets/logo.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email.trim(), formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "تعذر تسجيل الدخول، تأكد من صحة البريد الإلكتروني وكلمة المرور"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="فكّرني" />
          <h1>تسجيل الدخول</h1>
          <p>مرحبًا بك مجددًا في فكّرني</p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <Input
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            required
            autoComplete="email"
          />

          <Input
            label="كلمة المرور"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={LogIn}
            style={{ width: "100%", marginTop: "8px" }}
          >
            تسجيل الدخول
          </Button>
        </form>

        <div className="auth-footer">
          ليس لديك حساب؟
          <Link to="/register">إنشاء حساب جديد</Link>
        </div>
      </div>
    </div>
  );
}
