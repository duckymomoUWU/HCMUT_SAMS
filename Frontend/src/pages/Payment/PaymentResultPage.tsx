import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/services/api';

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const success = searchParams.get('success') === 'true';
  const paymentId = searchParams.get('paymentId');
  const error = searchParams.get('error');

  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  const type = paymentInfo?.type || searchParams.get('type');
  const getHistoryRoute = () => {
    if (type === 'booking') return '/client/court-booking-history';
    if (type === 'equipment-rental') return '/client/booking-history';
    return '/client/booking-history';
  };

  useEffect(() => {
    if (paymentId) {
      fetchPaymentInfo();
    } else {
      setLoading(false);
    }
  }, [paymentId]);

  const fetchPaymentInfo = async () => {
    try {
      const response = await api.get(`/payment/${paymentId}`);
      setPaymentInfo(response.data.payment);
    } catch (error) {
      console.error('Lỗi lấy payment info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        {success ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 text-center mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Giao dịch của bạn đã được xử lý thành công
            </p>

            {paymentInfo && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium">{paymentInfo.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-green-600">
                    {paymentInfo.amount.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium text-green-600">
                    Thành công
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate(getHistoryRoute())}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Xem lịch sử 
            </button>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 text-center mb-2">
              Thanh toán thất bại
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {error || 'Giao dịch không thành công. Vui lòng thử lại.'}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/client/booking')}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Đặt sân lại
              </button>
              <button
                onClick={() => navigate('/client/booking-history')}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Xem lịch sử
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResultPage;