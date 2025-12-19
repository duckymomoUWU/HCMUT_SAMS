import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import api from "@/lib/Axios";
import { type Equipment } from "@/services/equipmentService";
import equipmentService from "@/services/equipmentService";
import equipmentRentalService, {
  type CreateRentalDTO,
} from "@/services/equipmentRentalService";
import { useNavigate } from "react-router-dom";
import { decodeJWT } from "@/utils/jwt";

// Time slots available for rental
const TIME_SLOTS = [
  { id: 1, label: "08:00 - 10:00", start: "08:00", end: "10:00", hours: 2 },
  { id: 2, label: "10:00 - 12:00", start: "10:00", end: "12:00", hours: 2 },
  { id: 3, label: "12:00 - 14:00", start: "12:00", end: "14:00", hours: 2 },
  { id: 4, label: "14:00 - 16:00", start: "14:00", end: "16:00", hours: 2 },
  { id: 5, label: "16:00 - 18:00", start: "16:00", end: "18:00", hours: 2 },
  { id: 6, label: "18:00 - 20:00", start: "18:00", end: "20:00", hours: 2 },
];

interface CartItem {
  id: string;
  quantity: number;
  rentalDate: string;
  timeSlot: string;
  hours: number;
}

// Số lượng thực tế
interface EquipmentWithStock extends Equipment {
  realStock: number;
}

const EquipmentRental = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState<EquipmentWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentWithStock | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Fetch cả Equipment và Item để tính tồn kho thực tế
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [equipmentData, itemsData] = await Promise.all([
          equipmentService.getEquipments(),
          equipmentService.getEquipmentItems(),
        ]);

        // Merge data để tính realStock
        const mergedData = equipmentData.map((eq) => {
          // Đếm số item có status = 'available' thuộc về equipment này
          const availableCount = itemsData.filter((item) => {
            const itemEqId =
              typeof item.equipment === "object" && item.equipment !== null
                ? (item.equipment as any)._id
                : item.equipment;
            return itemEqId === eq._id && item.status === "available";
          }).length;

          return {
            ...eq,
            realStock: availableCount,
          };
        });

        setEquipments(mergedData);
      } catch (error) {
        console.error("Failed to fetch equipments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ["Tất cả", ...new Set(equipments.map((e) => e.type))];

  const filteredEquipments = equipments.filter(
    (e) =>
      (selectedCategory === "Tất cả" || e.type === selectedCategory) &&
      e.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openRentalModal = (equipment: EquipmentWithStock) => {
    setSelectedEquipment(equipment);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setSelectedTimeSlot("");
    setQuantity(1);
    setShowModal(true);
  };

  const addToCart = () => {
    if (!selectedEquipment || !selectedDate || !selectedTimeSlot) {
      alert("Vui lòng chọn đầy đủ ngày giờ!");
      return;
    }

    // Check realStock
    if (quantity > selectedEquipment.realStock) {
      alert(`Kho chỉ còn ${selectedEquipment.realStock} thiết bị khả dụng.`);
      return;
    }

    const slot = TIME_SLOTS.find((s) => s.label === selectedTimeSlot)!;
    const newItem: CartItem = {
      id: selectedEquipment._id,
      quantity,
      rentalDate: selectedDate,
      timeSlot: selectedTimeSlot,
      hours: slot.hours,
    };

    setCart((prev) => [...prev, newItem]);
    setShowModal(false);
    alert("Thêm vào giỏ thành công!");
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    const item = cart[index];
    const equipment = equipments.find((e) => e._id === item.id);

    // Check realStock
    if (equipment && newQuantity > equipment.realStock) {
      alert(
        `Chỉ còn ${equipment.realStock} thiết bị. Không thể chọn ${newQuantity}!`,
      );
      return;
    }
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const total = cart.reduce((sum, item) => {
    const eq = equipments.find((e) => e._id === item.id);
    if (eq) {
      return sum + eq.pricePerHour * item.quantity * item.hours;
    }
    return sum;
  }, 0);

  const handleConfirmRental = async () => {
  if (cart.length === 0) {
    alert("Giỏ hàng trống");
    return;
  }

  setIsProcessing(true);

  try {
    // 1. Get userId from token or localStorage
    const token = localStorage.getItem("accessToken");
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = decodeJWT(token);
        userId = decoded.sub || decoded.id || decoded._id;
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }

    if (!userId) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userId = userData?._id;
    }

    if (!userId) {
      alert("Vui lòng đăng nhập!");
      setIsProcessing(false);
      return;
    }

    // 2. Create rental for first item (or merge multiple items)
    // Assuming single rental per transaction for simplicity
    const firstItem = cart[0];
    const rentalData: CreateRentalDTO = {
      equipmentId: firstItem.id,
      items: [], // hoặc list itemIds nếu có
      rentalDate: new Date(firstItem.rentalDate),
      duration: firstItem.hours,
      totalPrice: total,
    };

    console.log("📦 Creating rental:", rentalData);
    const rentalResponse = await equipmentRentalService.createRental(rentalData);
    console.log("✅ Rental created:", rentalResponse);

    if (!rentalResponse?.rental?._id) {
      throw new Error("Failed to get rental ID from backend");
    }

    const rentalId = rentalResponse.rental._id;

    // 3. Create payment via API
    console.log("💳 Creating payment for rental:", rentalId);
    
    // Format date without diacritics for VNPay
    const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
    const firstEquipment = equipments.find(e => e._id === firstItem.id);
    
    const paymentData = {
      type: "equipment-rental",
      referenceId: rentalId,
      amount: total,
      description: `Thue thiet bi ${firstEquipment?.name || 'equipment'} - ${dateStr}`,
    };

    const paymentResponse = await api.post("/payment", paymentData);
    console.log("✅ Payment created:", paymentResponse.data);

    // 4. Redirect to VNPay payment URL
    if (paymentResponse.data?.paymentUrl) {
      console.log("🔗 Redirecting to VNPay:", paymentResponse.data.paymentUrl);
      window.location.href = paymentResponse.data.paymentUrl;
    } else {
      throw new Error("No payment URL returned from backend");
    }

    // Clear cart after successful payment initiation
    setCart([]);
    setShowConfirm(false);

  } catch (error: any) {
    console.error("❌ Rental/Payment error:", error);
    console.error("Error details:", error.response?.data);
    
    const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra";
    alert(`Có lỗi xảy ra khi thuê thiết bị!\n${errorMessage}`);
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Thuê thiết bị"
        subtitle="Chọn thiết bị cần thuê cho hoạt động thể thao"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Danh sách thiết bị */}
        <div className="space-y-4 lg:col-span-3">
          {/* Thanh tìm kiếm & bộ lọc */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thiết bị"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full border px-3 py-1 transition ${
                      selectedCategory === cat
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid thiết bị */}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-center">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" /> Đang
              tải kho...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {filteredEquipments.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-lg border bg-gray-50">
                      {<ShoppingCart className="h-6 w-6 text-gray-400" />}
                    </div>
                    <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="line-clamp-2 text-xs text-gray-700">
                      {item.description}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {item.pricePerHour.toLocaleString("vi-VN")} đ/giờ
                    </p>
                    {/* Hiển thị realStock */}
                    <p
                      className={`mt-1 text-xs font-medium ${item.realStock > 0 ? "text-green-600" : "text-red-500"}`}
                    >
                      {item.realStock > 0
                        ? `Còn sẵn: ${item.realStock}`
                        : "Hết hàng"}
                    </p>
                  </div>

                  <button
                    onClick={() => openRentalModal(item)}
                    disabled={item.realStock === 0}
                    className={`mt-3 w-full rounded-md py-2 text-sm font-medium text-white transition ${
                      item.realStock > 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "cursor-not-allowed bg-gray-300"
                    }`}
                  >
                    {item.realStock > 0 ? "Chọn thuê" : "Hết hàng"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Giỏ thuê */}
        <div className="sticky top-20 h-fit rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
            <ShoppingCart className="h-4 w-4 text-blue-600" /> Giỏ thuê (
            {cart.length})
          </h3>
          <div className="space-y-2 text-sm">
            {cart.length === 0 ? (
              <p className="text-sm text-gray-600">Chưa có thiết bị nào.</p>
            ) : (
              cart.map((item, idx) => {
                const eq = equipments.find((e) => e._id === item.id)!;
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-gray-200 p-2 text-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium">{eq.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.rentalDate} {item.timeSlot}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateCartQuantity(idx, item.quantity - 1)
                        }
                        className="rounded px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(idx, item.quantity + 1)
                        }
                        className="rounded px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="mt-1 text-right text-xs font-medium">
                      {(
                        eq.pricePerHour *
                        item.quantity *
                        item.hours
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <hr className="my-3" />
          <div className="flex justify-between text-base font-medium">
            <span>Tổng cộng:</span>
            <span className="font-semibold text-blue-700">
              {total.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => setShowConfirm(true)}
            className={`mt-4 w-full rounded-md py-2 font-medium transition ${
              cart.length === 0
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Xác nhận thuê
          </button>
        </div>
      </div>

      {/* Phần chọn ngày/giờ/số lượng thiết bị thuê */}
      {showModal && selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[450px] rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {selectedEquipment.name}
            </h3>
            <p className="mb-4 text-sm text-gray-700">
              {selectedEquipment.pricePerHour.toLocaleString("vi-VN")} đ/giờ
            </p>

            <div className="space-y-4">
              {/* Chọn ngày */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ngày thuê
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Chọn khung giờ */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Khung giờ
                </label>
                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => (
                    <label
                      key={slot.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition hover:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slot.label}
                        checked={selectedTimeSlot === slot.label}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="h-4 w-4"
                      />
                      <span className="flex-1 text-sm text-gray-700">
                        {slot.label} ({slot.hours}h)
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Chọn số lượng */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Số lượng
                </label>
                <div className="flex w-fit items-center gap-3 rounded-md border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-medium text-gray-700">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedEquipment.realStock, quantity + 1),
                      )
                    }
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {/* Hiển thị realStock */}
                <p className="mt-1 text-xs text-gray-500">
                  Có {selectedEquipment.realStock} thiết bị
                </p>
              </div>

              {/* Tổng tiền */}
              {selectedTimeSlot && (
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-sm text-gray-700">
                    Tổng:{" "}
                    <span className="font-semibold text-blue-600">
                      {(
                        selectedEquipment.pricePerHour *
                        quantity *
                        (TIME_SLOTS.find((s) => s.label === selectedTimeSlot)
                          ?.hours || 0)
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={addToCart}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                <CheckCircle2 className="h-4 w-4" /> Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Khung xác nhận */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Xác nhận thuê thiết bị
            </h3>
            <p className="mb-4 text-sm text-gray-700">
              Vui lòng kiểm tra thông tin trước khi xác nhận
            </p>

            <div className="space-y-2 text-sm text-gray-800">
              {cart.map((item, idx) => {
                const eq = equipments.find((e) => e._id === item.id)!;
                return (
                  <p key={idx}>
                    <span className="font-medium">{eq.name}</span> ×{" "}
                    {item.quantity} ({item.timeSlot}) →{" "}
                    {(
                      eq.pricePerHour *
                      item.quantity *
                      item.hours
                    ).toLocaleString("vi-VN")}{" "}
                    đ
                  </p>
                );
              })}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-base font-medium">
              <span>Tổng thanh toán:</span>
              <span className="font-semibold text-blue-700">
                {total.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isProcessing}
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRental}
                disabled={isProcessing}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Xác nhận
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentRental;
