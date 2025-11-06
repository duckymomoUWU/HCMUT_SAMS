import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Admin/SideBar";
import Header from "../../components/Admin/Header";

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  bookingsManaged?: number;
  usersInSystem?: number;
  deviceTypes?: number;
  uptime?: string;
  lastLogin?: string;
  loginStatus?: string;
};

const StatCard: React.FC<{ title: string; value: string | number }> = ({
  title,
  value,
}) => (
  <div className="min-w-[140px] rounded-lg border border-[#e8eef4] bg-white p-4 text-center">
    <div className="mb-2 text-sm text-[#6b7280]">{title}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

const TabButton: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold ${
      active
        ? "border-[#e6eef7] bg-[#f8fafc]"
        : "border-transparent bg-transparent"
    }`}
  >
    {children}
  </button>
);

const mockProfile: AdminProfile = {
  id: "admin-1",
  name: "Nguyễn Văn A",
  email: "admin@hcmut.edu.vn",
  phone: "0123456789",
  role: "Administrator",
  bookingsManaged: 12,
  usersInSystem: 10,
  deviceTypes: 1,
  uptime: "100%",
  lastLogin: "2023-10-15 14:30:00",
  loginStatus: "Hoạt động",
};

const Setting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  const [activeTab, setActiveTab] = useState<number>(0); // 0: personal, 1: security, 2: activity, 3: settings

  // edit state
  const [editing, setEditing] = useState<boolean>(false);
  const [form, setForm] = useState<Partial<AdminProfile>>({});

  // password change state
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoApproveBookings: false,
    dailyBackup: true,
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (!res.ok) throw new Error(`Server ${res.status}`);
        const data = (await res.json()) as AdminProfile;
        if (mounted) {
          setProfile(data);
          setForm(data);
        }
      } catch {
        // fallback to mock
        setProfile(mockProfile);
        setForm(mockProfile);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    setForm(profile || {});
    setEditing(false);
  };

  const save = async () => {
    // For now simulate save; replace with real API call
    if (!profile) return;
    try {
      const updated: AdminProfile = { ...profile, ...(form as AdminProfile) };
      setProfile(updated);
      setForm(updated);
      setEditing(false);
      // show a quick feedback
      alert("Cập nhật thông tin thành công");
    } catch (err) {
      alert("Lỗi khi lưu: " + (err instanceof Error ? err.message : "unknown"));
    }
  };

  const startChangePassword = () => setChangingPassword(true);
  const cancelChangePassword = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setChangingPassword(false);
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    try {
      // Example: await fetch(`/api/admin/change-password`, { method: "POST", body: JSON.stringify(passwordForm) })
      alert("Đổi mật khẩu thành công");
      cancelChangePassword();
    } catch (err) {
      alert(
        "Lỗi khi đổi mật khẩu: " +
          (err instanceof Error ? err.message : "unknown"),
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#b7e63e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 transition-all lg:ml-68">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 h-16 rounded-lg bg-[#006199] p-4">
            <h1 className="mb-2 text-2xl leading-tight font-normal md:text-[28px] md:leading-[13px]">
              Cài đặt
            </h1>
            <p className="text-xs text-white">
              Quản lý thông tin cá nhân và cài đặt tài khoản admin
            </p>
          </div>
          <section className="grid gap-4">
            <div className="grid grid-cols-1 gap-3 text-black sm:grid-cols-2 md:grid-cols-4">
              <StatCard
                title="Booking đã quản lý"
                value={profile?.bookingsManaged ?? "-"}
              />
              <StatCard
                title="User trong hệ thống"
                value={profile?.usersInSystem ?? "-"}
              />
              <StatCard
                title="Loại thiết bị"
                value={profile?.deviceTypes ?? "-"}
              />
              <StatCard
                title="Uptime hệ thống"
                value={profile?.uptime ?? "-"}
              />
            </div>

            <div className="rounded-lg border border-[#e8eef4] bg-white p-4 text-black">
              <div className="mb-3 flex items-center gap-3">
                <TabButton
                  active={activeTab === 0}
                  onClick={() => setActiveTab(0)}
                >
                  Thông tin cá nhân
                </TabButton>
                <TabButton
                  active={activeTab === 1}
                  onClick={() => setActiveTab(1)}
                >
                  Bảo mật
                </TabButton>
                <TabButton
                  active={activeTab === 2}
                  onClick={() => setActiveTab(2)}
                >
                  Hoạt động
                </TabButton>
                <TabButton
                  active={activeTab === 3}
                  onClick={() => setActiveTab(3)}
                >
                  Cài đặt
                </TabButton>
              </div>

              {/* Tab content */}
              {activeTab === 0 && (
                <div className="mt-2">
                  <div className="grid grid-cols-1 items-start gap-3 rounded-lg border border-[#eef2f6] p-4 md:grid-cols-2">
                    <div className="col-span-full flex items-center justify-between">
                      <div className="font-bold">Thông tin cá nhân</div>
                      <div className="flex gap-2">
                        {!editing ? (
                          <button
                            onClick={startEdit}
                            className="cursor-pointer rounded-md border border-[#e6eef7] bg-white px-3 py-2"
                          >
                            Chỉnh sửa
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={save}
                              className="cursor-pointer rounded-md border-none bg-[#0ea5e9] px-3 py-2 text-white"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="cursor-pointer rounded-md border border-[#e6eef7] bg-white px-3 py-2"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 text-sm text-[#6b7280]">
                        Họ và tên *
                      </div>
                      <input
                        value={form.name ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        disabled={!editing}
                        className={`w-full rounded-md border border-[#e6eef7] px-3 py-2.5 ${
                          editing ? "bg-white" : "bg-[#f3f4f6]"
                        }`}
                      />
                    </div>

                    <div>
                      <div className="mb-1.5 text-sm text-[#6b7280]">
                        Email *
                      </div>
                      <input
                        value={form.email ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        disabled={!editing}
                        className={`w-full rounded-md border border-[#e6eef7] px-3 py-2.5 ${
                          editing ? "bg-white" : "bg-[#f3f4f6]"
                        }`}
                      />
                    </div>

                    <div>
                      <div className="mb-1.5 text-sm text-[#6b7280]">
                        Số điện thoại
                      </div>
                      <input
                        value={form.phone ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        disabled={!editing}
                        className={`w-full rounded-md border border-[#e6eef7] px-3 py-2.5 ${
                          editing ? "bg-white" : "bg-[#f3f4f6]"
                        }`}
                      />
                    </div>

                    <div>
                      <div className="mb-1.5 text-sm text-[#6b7280]">
                        Vai trò
                      </div>
                      <input
                        value={form.role ?? ""}
                        disabled
                        className="w-full rounded-md border border-[#e6eef7] bg-[#f3f4f6] px-3 py-2.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="mt-2">
                  <div className="p-4">
                    <div className="mb-2 font-bold">Bảo mật</div>
                    <div className="text-[#475569]">
                      Thay đổi mật khẩu và quản lý bảo mật tài khoản.
                    </div>

                    {!changingPassword ? (
                      <div className="mt-3 space-y-4">
                        <div>
                          <div className="mb-1.5 text-sm text-[#6b7280]">
                            Lần đăng nhập cuối: {profile?.lastLogin ?? "N/A"}
                          </div>
                          <div className="text-sm text-[#475569]">
                            Trạng thái: {profile?.loginStatus ?? "N/A"}
                          </div>
                        </div>
                        <button
                          onClick={startChangePassword}
                          className="cursor-pointer rounded-md border border-[#e6eef7] bg-white px-3 py-2"
                        >
                          Đổi mật khẩu
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="mb-1.5 block text-sm text-[#6b7280]">
                            Mật khẩu hiện tại *
                          </label>
                          <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm((f) => ({
                                ...f,
                                currentPassword: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-[#e6eef7] bg-white px-3 py-2.5"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm text-[#6b7280]">
                            Mật khẩu mới *
                          </label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm((f) => ({
                                ...f,
                                newPassword: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-[#e6eef7] bg-white px-3 py-2.5"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm text-[#6b7280]">
                            Xác nhận mật khẩu mới *
                          </label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm((f) => ({
                                ...f,
                                confirmPassword: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-[#e6eef7] bg-white px-3 py-2.5"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={changePassword}
                            className="cursor-pointer rounded-md border-none bg-[#0ea5e9] px-3 py-2 text-white"
                          >
                            Đổi mật khẩu
                          </button>
                          <button
                            onClick={cancelChangePassword}
                            className="cursor-pointer rounded-md border border-[#e6eef7] bg-white px-3 py-2"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="mt-2">
                  <div className="p-4">
                    <div className="mb-2 font-bold">Hoạt động</div>
                    <div className="text-[#475569]">
                      Lịch sử hoạt động gần đây của tài khoản admin sẽ hiển thị
                      ở đây.
                    </div>
                    <div className="mt-3 text-[#94a3b8]">
                      Chưa có hoạt động để hiển thị.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="mt-2">
                  <div className="p-4">
                    <div className="mb-2 font-bold">Cài đặt</div>
                    <div className="text-[#475569]">
                      Các cấu hình hệ thống chung — thông báo, ngôn ngữ,
                      timezone, v.v.
                    </div>

                    <div className="mt-3 space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={settings.emailNotifications}
                          onChange={(e) =>
                            setSettings((s) => ({
                              ...s,
                              emailNotifications: e.target.checked,
                            }))
                          }
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor="emailNotifications"
                          className="text-sm text-[#6b7280]"
                        >
                          Nhận thông báo qua email
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="autoApproveBookings"
                          checked={settings.autoApproveBookings}
                          onChange={(e) =>
                            setSettings((s) => ({
                              ...s,
                              autoApproveBookings: e.target.checked,
                            }))
                          }
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor="autoApproveBookings"
                          className="text-sm text-[#6b7280]"
                        >
                          Tự động duyệt đơn đặt hợp lệ
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="dailyBackup"
                          checked={settings.dailyBackup}
                          onChange={(e) =>
                            setSettings((s) => ({
                              ...s,
                              dailyBackup: e.target.checked,
                            }))
                          }
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor="dailyBackup"
                          className="text-sm text-[#6b7280]"
                        >
                          Tự động backup dữ liệu
                        </label>
                      </div>

                      <div className="mt-6">
                        <label className="mb-1.5 block text-sm text-[#6b7280]">
                          Ngôn ngữ
                        </label>
                        <select className="rounded-md border border-[#e6eef7] bg-white px-3 py-2.5">
                          <option>Tiếng Việt</option>
                          <option>English</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
export default Setting;
