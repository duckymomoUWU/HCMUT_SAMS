import { useState } from "react";
import { Search, ShoppingCart, Plus, Minus, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";

const EquipmentRental = () => {
  const equipments = [
    {
      id: 1,
      name: "Bóng futsal",
      desc: "Bóng futsal chất lượng cao, phù hợp cho sân cỏ nhân tạo",
      price: 20000,
      stock: 10,
      category: "Bóng",
    },
    {
      id: 2,
      name: "Áo bib",
      desc: "Áo phân biệt đội, nhiều màu sắc",
      price: 5000,
      stock: 15,
      category: "Quần áo",
    },
    {
      id: 3,
      name: "Cọc biên",
      desc: "Cọc tập luyện và đánh dấu biên sân",
      price: 3000,
      stock: 12,
      category: "Dụng cụ tập",
    },
    {
      id: 4,
      name: "Bóng rổ",
      desc: "Bóng rổ tiêu chuẩn thi đấu",
      price: 25000,
      stock: 5,
      category: "Bóng",
    },
    {
      id: 5,
      name: "Vợt cầu lông",
      desc: "Vợt cầu lông chất lượng cao với cước căng sẵn",
      price: 15000,
      stock: 6,
      category: "Vợt",
    },
    {
      id: 6,
      name: "Quả cầu lông",
      desc: "Quả cầu lông chất lượng cao",
      price: 2000,
      stock: 30,
      category: "Vợt",
    },
    {
      id: 7,
      name: "Lưới cầu lông",
      desc: "Lưới tiêu chuẩn cho sân cầu lông",
      price: 10000,
      stock: 3,
      category: "Dụng cụ tập",
    },
    {
      id: 8,
      name: "Găng tay thủ môn",
      desc: "Găng tay chất lượng cao, chống trượt",
      price: 8000,
      stock: 4,
      category: "Thiết bị khác",
    },
  ];

  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const categories = [
    "Tất cả",
    "Bóng",
    "Quần áo",
    "Vợt",
    "Dụng cụ tập",
    "Thiết bị khác",
  ];

  const filteredEquipments = equipments.filter(
    (e) =>
      (selectedCategory === "Tất cả" || e.category === selectedCategory) &&
      e.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (id: number) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found) {
        return prev.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  equipments.find((e) => e.id === id)!.stock,
                ),
              }
            : item,
        );
      } else {
        return [...prev, { id, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id: number, delta: number) => {
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
    const eq = equipments.find((e) => e.id === item.id);
    return sum + (eq ? eq.price * item.quantity : 0);
  }, 0);

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
            </div>
          </div>

          {/* Grid thiết bị */}
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {filteredEquipments.map((item) => (
              <div
                key={item.id}
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
                    {item.desc}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Còn {item.stock} thiết bị{" "}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center rounded-md border">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 text-gray-800 hover:bg-gray-100"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-2 text-sm text-gray-900">
                      {cart.find((c) => c.id === item.id)?.quantity || 0}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, +1)}
                      className="px-2 py-1 text-gray-800 hover:bg-gray-100"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(item.id)}
                    className="flex-1 rounded-md bg-blue-600 py-1 text-sm text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                const eq = equipments.find((e) => e.id === item.id)!;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-gray-800"
                  >
                    <span>{eq.name}</span>
                    <span>
                      {(eq.price * item.quantity).toLocaleString("vi-VN")} đ
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
                const eq = equipments.find((e) => e.id === item.id)!;
                return (
                  <p key={item.id}>
                    <span className="font-medium">{eq.name}</span> ×{" "}
                    {item.quantity} →{" "}
                    {(eq.price * item.quantity).toLocaleString("vi-VN")} đ
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
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  alert("Thuê thiết bị thành công!");
                }}
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
