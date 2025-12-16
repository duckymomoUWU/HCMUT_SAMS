import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const rentalId = searchParams.get("rentalId");
  const total = searchParams.get("total");

  const handlePayment = async () => {
    setLoading(true);
    try {
      // TODO: Implement payment API call
      // For now, simulate payment success
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Thanh toán thành công!");
      // Redirect to rental history
      navigate("/client/booking-history");
    } catch (error) {
      alert("Thanh toán thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!rentalId || !total) {
    return (
      <div className="flex flex-col gap-8 pt-4">
        <PageHeader
          title="Thanh toán"
          subtitle="Thông tin thanh toán không hợp lệ"
        />
        <div className="text-center">Thiếu thông tin thanh toán</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Thanh toán"
        subtitle="Hoàn tất thanh toán cho đơn thuê thiết bị"
      />

      <div className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-blue-600" />
          <h3 className="mt-2 text-lg font-semibold">Thanh toán thiết bị</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Mã đơn thuê:</span>
            <span className="font-medium">{rentalId}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Tổng tiền:</span>
            <span className="text-blue-600">
              {parseInt(total).toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`mt-6 w-full rounded-md py-3 font-medium transition ${
            loading
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? (
            "Đang xử lý..."
          ) : (
            <>
              <CheckCircle2 className="mr-2 inline h-4 w-4" />
              Thanh toán
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;
