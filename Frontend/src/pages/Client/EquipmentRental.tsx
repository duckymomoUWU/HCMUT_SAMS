import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import { type Equipment } from "@/services/equipmentService";
import equipmentRentalService, {
  type CreateRentalData,
} from "@/services/equipmentRentalService";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  quantity: number;
  duration: number;
  rentalDate: string;
}

const EquipmentRental = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [rentalDate, setRentalDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    // Mock data for now
    const mockEquipments: Equipment[] = [
      {
        _id: "1",
        name: "Bóng futsal",
        type: "Bóng",
        quantity: 10,
        pricePerHour: 20000,
        status: "available",
        imageUrl: "",
        description: "Bóng futsal chất lượng cao, phù hợp cho sân cỏ nhân tạo",
      },
      {
        _id: "2",
        name: "Áo bib",
        type: "Quần áo",
        quantity: 15,
        pricePerHour: 5000,
        status: "available",
        imageUrl: "",
        description: "Áo phân biệt đội, nhiều màu sắc",
      },
      {
        _id: "3",
        name: "Cọc biên",
        type: "Dụng cụ tập",
        quantity: 12,
        pricePerHour: 3000,
        status: "available",
        imageUrl: "",
        description: "Cọc tập luyện và đánh dấu biên sân",
      },
      {
        _id: "4",
        name: "Bóng rổ",
        type: "Bóng",
        quantity: 5,
        pricePerHour: 25000,
        status: "available",
        imageUrl: "",
        description: "Bóng rổ tiêu chuẩn thi đấu",
      },
      {
        _id: "5",
        name: "Vợt cầu lông",
        type: "Vợt",
        quantity: 6,
        pricePerHour: 15000,
        status: "available",
        imageUrl: "",
        description: "Vợt cầu lông chất lượng cao với cước căng sẵn",
      },
      {
        _id: "6",
        name: "Quả cầu lông",
        type: "Vợt",
        quantity: 30,
        pricePerHour: 2000,
        status: "available",
        imageUrl: "",
        description: "Quả cầu lông chất lượng cao",
      },
      {
        _id: "7",
        name: "Lưới cầu lông",
        type: "Dụng cụ tập",
        quantity: 3,
        pricePerHour: 10000,
        status: "available",
        imageUrl: "",
        description: "Lưới tiêu chuẩn cho sân cầu lông",
      },
      {
        _id: "8",
        name: "Găng tay thủ môn",
        type: "Thiết bị khác",
        quantity: 4,
        pricePerHour: 8000,
        status: "available",
        imageUrl: "",
        description: "Găng tay chất lượng cao, chống trượt",
      },
    ];
    setEquipments(mockEquipments);
    setLoading(false);

    // Uncomment below when backend is ready
    // const fetchEquipments = async () => {
    //   try {
    //     const data = await equipmentService.getEquipments();
    //     setEquipments(data);
    //   } catch (error) {
    //     console.error("Failed to fetch equipments:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchEquipments();
  }, []);

  const categories = ["Tất cả", ...new Set(equipments.map((e) => e.type))];

  const filteredEquipments = equipments.filter(
    (e) =>
      (selectedCategory === "Tất cả" || e.type === selectedCategory) &&
      e.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (id: string) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found) {
        const eq = equipments.find((e) => e._id === id)!;
        return prev.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, eq.quantity),
              }
            : item,
        );
      } else {
        return [...prev, { id, quantity: 1, duration, rentalDate }];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => ({
          ...item,
          quantity:
            item.id === id ? Math.max(item.quantity + delta, 1) : item.quantity,
        }))
        .filter((item) => item.quantity > 0),
    );
  };

  const total = cart.reduce((sum, item) => {
    const eq = equipments.find((e) => e._id === item.id);
    return sum + (eq ? eq.pricePerHour * item.quantity * item.duration : 0);
  }, 0);

  const handleConfirmRental = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user._id) {
        alert("Vui lòng đăng nhập!");
        return;
      }

      // Create rentals for each cart item
      const rentalPromises = cart.map(async (item) => {
        const data: CreateRentalData = {
          userId: user._id,
          equipmentId: item.id,
          quantity: item.quantity,
          rentalDate: item.rentalDate,
          duration: item.duration,
          totalPrice:
            equipments.find((e) => e._id === item.id)!.pricePerHour *
            item.quantity *
            item.duration,
        };
        return equipmentRentalService.createRental(data);
      });

      const rentals = await Promise.all(rentalPromises);

      // For now, navigate to payment with first rental ID
      const rentalId = rentals[0]._id;
      navigate(`/payment?rentalId=${rentalId}&total=${total}`);

      setShowConfirm(false);
      setCart([]);
    } catch (error) {
      console.error("Failed to create rental:", error);
      alert("Có lỗi xảy ra khi thuê thiết bị!");
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
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 bg-white text-gray-800 hover:bg-blue-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <input
                    type="date"
                    value={rentalDate}
                    onChange={(e) => setRentalDate(e.target.value)}
                    className="rounded-md border px-3 py-1 text-sm text-black"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="rounded-md border px-3 py-1 text-sm text-black"
                  >
                    <option value={1}>1 giờ</option>
                    <option value={2}>2 giờ</option>
                    <option value={3}>3 giờ</option>
                    <option value={4}>4 giờ</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Grid thiết bị */}
          {loading ? (
            <div className="py-8 text-center">Đang tải...</div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {filteredEquipments.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-lg border bg-gray-50">
                      <ShoppingCart className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="line-clamp-2 text-xs text-gray-700">
                      {item.description}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {item.pricePerHour.toLocaleString("vi-VN")} đ/giờ
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      Còn {item.quantity} thiết bị{" "}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-md border">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="px-2 py-1 text-gray-800 hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-sm text-gray-900">
                        {cart.find((c) => c.id === item._id)?.quantity || 0}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, +1)}
                        className="px-2 py-1 text-gray-800 hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => addToCart(item._id)}
                      className="flex-1 rounded-md bg-blue-600 py-1 text-sm text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
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
              cart.map((item) => {
                const eq = equipments.find((e) => e._id === item.id)!;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-gray-800"
                  >
                    <div>
                      <span>{eq.name}</span>
                      <div className="text-xs text-gray-500">
                        {item.quantity} × {item.duration}h
                      </div>
                    </div>
                    <span>
                      {(
                        eq.pricePerHour *
                        item.quantity *
                        item.duration
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </span>
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
            className={`mt-4 w-full rounded-md py-2 text-sm font-medium transition ${
              cart.length === 0
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            }`}
          >
            Xác nhận thuê
          </button>
        </div>
      </div>

      {/* Modal xác nhận */}
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
              {cart.map((item) => {
                const eq = equipments.find((e) => e._id === item.id)!;
                return (
                  <p key={item.id}>
                    <span className="font-medium">{eq.name}</span> ×{" "}
                    {item.quantity} × {item.duration}h →{" "}
                    {(
                      eq.pricePerHour *
                      item.quantity *
                      item.duration
                    ).toLocaleString("vi-VN")}{" "}
                    đ
                  </p>
                );
              })}
            </div>

            <hr className="my-4" />

            <div className="text-sm text-gray-700">
              <p>
                Ngày thuê: {new Date(rentalDate).toLocaleDateString("vi-VN")}
              </p>
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
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRental}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
              >
                <CheckCircle2 className="h-4 w-4" /> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentRental;
