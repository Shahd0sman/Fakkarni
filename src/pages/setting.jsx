import { useState } from "react";
import { User, AlertTriangle, CheckCircle } from "lucide-react";
import PageHeader from "../components/layout/pageHeader.jsx";
import Button from "../components/common/button.jsx";
import Input from "../components/common/input.jsx";
import ErrorMessage from "../components/common/error.jsx";
import ConfirmDialog from "../components/common/confirmDialog.jsx";
import { useAuth } from "../hooks/useAuth.js";
import authService from "../services/authservice.js";

export default function SettingsPage() {
  const { user, updateUserState, logout } = useAuth();

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Delete Account
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const res = await authService.updateProfile({
        name: profileData.name.trim(),
      });
      if (res && res.data) {
        updateUserState(res.data);
      }
      setProfileSuccess("تم تحديث الملف الشخصي بنجاح");
    } catch (err) {
      setProfileError(err.response?.data?.message || "تعذر تحديث البيانات");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("يرجى كتابة كلمة المرور لتأكيد الحذف");
      return;
    }

    setDeleteLoading(true);
    try {
      await authService.deleteAccount(deletePassword);
      logout();
    } catch (err) {
      setDeleteError(err.response?.data?.message || "كلمة المرور غير صحيحة");
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="الإعدادات"
        description="إدارة بيانات حسابك."
      />

      <div style={{ display: "grid", gap: "24px", maxWidth: "680px" }}>
        {/* Profile Info */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <User size={20} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ margin: 0, fontSize: "17px" }}>البيانات الشخصية</h3>
          </div>

          <ErrorMessage message={profileError} />
          {profileSuccess && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              backgroundColor: "color-mix(in srgb, var(--color-success) 12%, transparent)",
              color: "var(--color-success)",
              borderRadius: "var(--radius-sm)",
              marginBottom: "16px",
              fontSize: "14px"
            }}>
              <CheckCircle size={16} />
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <Input
              label="الاسم"
              name="name"
              value={profileData.name}
              onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />

            <Button type="submit" variant="primary" loading={profileLoading}>
              حفظ التعديلات
            </Button>
          </form>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="card" style={{ borderColor: "color-mix(in srgb, var(--color-error) 30%, var(--color-border))" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "var(--color-error)" }}>
            <AlertTriangle size={20} />
            <h3 style={{ margin: 0, fontSize: "17px" }}>منطقة الخطر</h3>
          </div>

          <p style={{ margin: "0 0 16px", fontSize: "14px", color: "var(--color-text-secondary)" }}>
            عند حذف حسابك، سيتم مسح كافة بياناتك ومستنداتك وفواتيرك نهائياً ولن تتمكن من استعادتها.
          </p>

          <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
            حذف الحساب نهائياً
          </Button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {isDeleteOpen && (
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletePassword("");
            setDeleteError("");
          }}
          onConfirm={handleDeleteAccount}
          title="تأكيد حذف الحساب نهائياً"
          confirmText="حذف الحساب الآن"
          loading={deleteLoading}
          message={
            <div>
              <p style={{ margin: "0 0 12px" }}>
                لتأكيد عملية الحذف، يرجى إدخال كلمة المرور الخاصة بحسابك:
              </p>
              <ErrorMessage message={deleteError} />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  boxSizing: "border-box",
                }}
              />
            </div>
          }
        />
      )}
    </div>
  );
}
