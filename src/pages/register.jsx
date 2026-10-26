import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import Input from "../components/common/input.jsx";
import Button from "../components/common/button.jsx";
import ErrorMessage from "../components/common/error.jsx";
import logo from "../assets/logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.name.trim().length < 2) {
      setError("الاسم يجب أن يتكون من حرفين على الأقل");
      return;
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن لا تقل عن 6 أحرف");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);

    try {
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "تعذر إنشاء الحساب، يرجى التحقق من البيانات المدخلة"
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
          <h1>إنشاء حساب جديد</h1>
          <p>انضم إلينا لإدارة مستنداتك وفواتيرك بسهولة</p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <Input
            label="الاسم بالكامل"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="أحمد محمد"
            required
            autoComplete="name"
          />

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
            placeholder="6 أحرف على الأقل"
            required
            autoComplete="new-password"
          />

          <Input
            label="تأكيد كلمة المرور"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="أعد إدخال كلمة المرور"
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={UserPlus}
            style={{ width: "100%", marginTop: "8px" }}
          >
            إنشاء الحساب
          </Button>
        </form>

        <div className="auth-footer">
          لديك حساب بالفعل؟
          <Link to="/login">تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
