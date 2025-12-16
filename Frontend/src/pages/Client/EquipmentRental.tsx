import { useState } from "react";
import { Search, ShoppingCart, Plus, Minus, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";

const EquipmentRental = () => {
  const equipments = [
    { id: 1, name: "Bóng futsal", desc: "Bóng futsal chất lượng cao, phù hợp cho sân cỏ nhân tạo", price: 20000, stock: 10, category: "Bóng" },
    { id: 2, name: "Áo bib", desc: "Áo phân biệt đội, nhiều màu sắc", price: 5000, stock: 15, category: "Quần áo" },
    { id: 3, name: "Cọc biên", desc: "Cọc tập luyện và đánh dấu biên sân", price: 3000, stock: 12, category: "Dụng cụ tập" },
    { id: 4, name: "Bóng rổ", desc: "Bóng rổ tiêu chuẩn thi đấu", price: 25000, stock: 5, category: "Bóng" },
    { id: 5, name: "Vợt cầu lông", desc: "Vợt cầu lông chất lượng cao với cước căng sẵn", price: 15000, stock: 6, category: "Vợt" },
    { id: 6, name: "Quả cầu lông", desc: "Quả cầu lông chất lượng cao", price: 2000, stock: 30, category: "Vợt" },
    { id: 7, name: "Lưới cầu lông", desc: "Lưới tiêu chuẩn cho sân cầu lông", price: 10000, stock: 3, category: "Dụng cụ tập" },
    { id: 8, name: "Găng tay thủ môn", desc: "Găng tay chất lượng cao, chống trượt", price: 8000, stock: 4, category: "Thiết bị khác" },
  ];

  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const categories = ["Tất cả", "Bóng", "Quần áo", "Vợt", "Dụng cụ tập", "Thiết bị khác"];

  const filteredEquipments = equipments.filter(
    (e) =>
      (selectedCategory === "Tất cả" || e.category === selectedCategory) &&
      e.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (id: number) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found) {
        return prev.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(item.quantity + 1, equipments.find((e) => e.id === id)!.stock) }
            : item
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
          quantity: item.id === id ? Math.max(item.quantity + delta, 1) : item.quantity,
        }))
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => {
    const eq = equipments.find((e) => e.id === item.id);
    return sum + (eq ? eq.price * item.quantity : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader title="Thuê thiết bị" subtitle="Chọn thiết bị cần thuê cho hoạt động thể thao" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Danh sách thiết bị */}
        <div className="lg:col-span-3 space-y-4">
          {/* Thanh tìm kiếm & bộ lọc */}
          <div className="bg-white border rounded-xl shadow-sm p-4">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thiết bị"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border rounded-md py-2 pl-9 pr-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white placeholder:text-gray-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full border transition ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-200 hover:bg-blue-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid thiết bị */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredEquipments.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="w-16 h-16 mx-auto bg-gray-50 border rounded-lg flex items-center justify-center mb-3">
                    <ShoppingCart className="text-gray-400 w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-700 line-clamp-2">{item.desc}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Còn {item.stock} thiết bị </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 text-gray-800 hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-sm text-gray-900">
                      {cart.find((c) => c.id === item.id)?.quantity || 0}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, +1)}
                      className="px-2 py-1 text-gray-800 hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(item.id)}
                    className="flex-1 text-sm bg-blue-600 text-white py-1 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Giỏ thuê */}
        <div className="bg-white border rounded-xl shadow-sm p-5 h-fit sticky top-20">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-blue-600" /> Giỏ thuê ({cart.length})
          </h3>
          <div className="space-y-2 text-sm">
            {cart.length === 0 ? (
              <p className="text-gray-600 text-sm">Chưa có thiết bị nào.</p>
            ) : (
              cart.map((item) => {
                const eq = equipments.find((e) => e.id === item.id)!;
                return (
                  <div key={item.id} className="flex justify-between items-center text-gray-800">
                    <span>{eq.name}</span>
                    <span>{(eq.price * item.quantity).toLocaleString("vi-VN")} đ</span>
                  </div>
                );
              })
            )}
          </div>

          <hr className="my-3" />
          <div className="flex justify-between text-base font-medium">
            <span>Tổng cộng:</span>
            <span className="text-blue-700 font-semibold">{total.toLocaleString("vi-VN")} đ</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => setShowConfirm(true)}
            className={`w-full mt-4 text-sm py-2 rounded-md font-medium transition ${
              cart.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            }`}
          >
            Xác nhận thuê
          </button>
        </div>
      </div>

      {/* Modal xác nhận */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[420px] p-6 relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Xác nhận thuê thiết bị</h3>
            <p className="text-sm text-gray-700 mb-4">Vui lòng kiểm tra thông tin trước khi xác nhận</p>

            <div className="space-y-2 text-sm text-gray-800">
              {cart.map((item) => {
                const eq = equipments.find((e) => e.id === item.id)!;
                return (
                  <p key={item.id}>
                    <span className="font-medium">{eq.name}</span> × {item.quantity} →{" "}
                    {(eq.price * item.quantity).toLocaleString("vi-VN")} đ
                  </p>
                );
              })}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-base font-medium">
              <span>Tổng thanh toán:</span>
              <span className="text-blue-700 font-semibold">{total.toLocaleString("vi-VN")} đ</span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  alert("Thuê thiết bị thành công!");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentRental;
