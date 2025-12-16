import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  AlertTriangle,
  Edit,
  Key,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

// Define the structure for the user profile data
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  penaltyPoints: number;
  createdAt: string;
  isVerified: boolean;
  avatarUrl?: string;
  // These will be fetched separately or calculated
  totalBookings?: number;
  equipmentRentals?: number;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"info" | "security" | "violations">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [originalUserProfile, setOriginalUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          const profile = response.data.user;
          // For now, stats are placeholders until their API is ready
          const stats = {
            totalBookings: 12,
            equipmentRentals: 8,
          };
          setUserProfile({...profile, ...stats});
          setOriginalUserProfile({...profile, ...stats});
        } else {
          throw new Error(response.data.message || "Failed to fetch user profile.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching your profile.");
      } finally {
        setLoading(false);
      }
    };
    
    if (!isAuthLoading && isAuthenticated) {
      fetchUserProfile();
    } else if (!isAuthLoading && !isAuthenticated) {
      // Handle case where user is not authenticated after auth check
      setLoading(false);
      setError("Bạn phải đăng nhập để xem trang này.");
    }
  }, [isAuthenticated, isAuthLoading]);

  const handleUpdateProfile = async () => {
    if (!userProfile) return;
    try {
      const updatedData = {
        fullName: userProfile.fullName,
        phone: userProfile.phone,
      };
      const response = await api.patch('/auth/me', updatedData);
      if (response.data.success) {
        const profile = response.data.user;
        const stats = { totalBookings: 12, equipmentRentals: 8 }; // Keep stats
        setUserProfile({...profile, ...stats});
        setOriginalUserProfile({...profile, ...stats});
        setIsEditing(false);
        // Maybe show a success toast here
      } else {
        throw new Error(response.data.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your profile.");
    }
  };
  
  const handleCancelEdit = () => {
    if (originalUserProfile) {
      setUserProfile(originalUserProfile);
    }
    setIsEditing(false);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin": return "Quản trị viên";
      case "student": return "Sinh viên";
      default: return "Không rõ";
    }
  };

  const getMemberSince = (createdAt: string) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return `${diffMonths} tháng`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertTriangle className="w-12 h-12" />
        <p className="mt-4 text-lg">Đã xảy ra lỗi</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!userProfile) {
    return null; // or a 'not found' component
  }

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Hồ sơ cá nhân"
        subtitle="Quản lý thông tin tài khoản và cài đặt bảo mật"
      />

      {/* Tabs */}
      <div className="flex gap-4 border-b">
         {/* Tabs remain the same for now */}
         <button onClick={() => setActiveTab("info")} className={`px-4 pb-3 font-medium transition ${activeTab === "info" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}>
          Thông tin cá nhân
        </button>
        <button onClick={() => setActiveTab("security")} className={`px-4 pb-3 font-medium transition ${activeTab === "security" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}>
          Bảo mật
        </button>
        <button onClick={() => setActiveTab("violations")} className={`px-4 pb-3 font-medium transition ${activeTab === "violations" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}>
          Vi phạm ({userProfile.penaltyPoints})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between text-black">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  {userProfile.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{userProfile.fullName}</h2>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{getRoleName(userProfile.role)}</span>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">{userProfile.penaltyPoints} điểm phạt</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm text-[#000000] transition hover:bg-gray-50">
                <Edit className="h-4 w-4 text-[#000000]" />
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 font-semibold text-gray-900">Thông tin cá nhân</h3>
              <p className="mb-4 text-sm text-gray-600">Cập nhật thông tin liên hệ của bạn</p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                    <input type="text" value={userProfile.fullName} onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })} disabled={!isEditing} className="w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                    <input type="email" value={userProfile.email} disabled className="w-full rounded-md border bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                    <input type="tel" value={userProfile.phone} onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })} disabled={!isEditing} className="w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Vai trò</label>
                  <div className="relative">
                    <Shield className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                    <input type="text" value={getRoleName(userProfile.role)} disabled className="w-full rounded-md border bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-900" />
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={handleCancelEdit} className="rounded-md border px-4 py-2 text-sm text-black transition hover:bg-gray-50">Hủy</button>
                  <button onClick={handleUpdateProfile} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">Lưu thay đổi</button>
                </div>
              )}
            </div>
          </div>
          {/* Account Stats */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Thông kê tài khoản</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center"><p className="text-3xl font-bold text-blue-700">{userProfile.totalBookings}</p><p className="mt-1 text-sm text-gray-700">Lần đặt sân</p></div>
              <div className="rounded-lg bg-purple-50 p-4 text-center"><p className="text-3xl font-bold text-purple-700">{userProfile.equipmentRentals}</p><p className="mt-1 text-sm text-gray-700">Lần mượn dụng cụ</p></div>
              <div className="rounded-lg bg-red-50 p-4 text-center"><p className="text-3xl font-bold text-red-700">{userProfile.penaltyPoints}</p><p className="mt-1 text-sm text-gray-700">Điểm phạt</p></div>
              <div className="rounded-lg bg-green-50 p-4 text-center"><p className="text-3xl font-bold text-green-700">{getMemberSince(userProfile.createdAt)}</p><p className="mt-1 text-sm text-gray-700">Thành viên</p></div>
            </div>
          </div>
        </div>
      )}
      {/* Other tabs remain the same for now */}
    </div>
  );
};
export default Profile;
