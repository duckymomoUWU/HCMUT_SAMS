import * as crypto from 'crypto';

export class VNPayHelper {
  // 1. SẮP XẾP OBJECT THEO THỨ TỰ ABC (VNPay yêu cầu)
  static sortObject(obj: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};
    const str: string[] = [];
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    
    str.sort();
    
    for (let i = 0; i < str.length; i++) {
      const key = str[i];
      sorted[key] = encodeURIComponent(obj[decodeURIComponent(key)]).replace(/%20/g, '+');
    }
    
    return sorted;
  }

  // 2. TẠO PAYMENT URL
  static createPaymentUrl(
    vnpayConfig: {
      tmnCode: string;
      hashSecret: string;
      url: string;
      returnUrl: string;
    },
    paymentData: {
      amount: number;
      orderInfo: string;
      orderId: string;
      ipAddr: string;
    },
  ): string {
    const date = new Date();
    const createDate = this.formatDate(date);
    const expireDate = this.formatDate(new Date(date.getTime() + 15 * 60 * 1000));

    let vnpParams: Record<string, string | number> = {};
    
    vnpParams['vnp_Version'] = '2.1.0';
    vnpParams['vnp_Command'] = 'pay';
    vnpParams['vnp_TmnCode'] = vnpayConfig.tmnCode;
    vnpParams['vnp_Locale'] = 'vn';
    vnpParams['vnp_CurrCode'] = 'VND';
    vnpParams['vnp_TxnRef'] = paymentData.orderId;
    vnpParams['vnp_OrderInfo'] = paymentData.orderInfo;
    vnpParams['vnp_OrderType'] = 'other';
    vnpParams['vnp_Amount'] = paymentData.amount * 100;
    vnpParams['vnp_ReturnUrl'] = vnpayConfig.returnUrl;
    vnpParams['vnp_IpAddr'] = paymentData.ipAddr;
    vnpParams['vnp_CreateDate'] = createDate;
    vnpParams['vnp_ExpireDate'] = expireDate;

    // Sort params
    vnpParams = this.sortObject(vnpParams);

    // Create sign data
    const signData = Object.keys(vnpParams)
      .map(key => `${key}=${vnpParams[key]}`)
      .join('&');

    // Create secure hash
    const hmac = crypto.createHmac('sha512', vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Build final URL
    const paymentUrl = `${vnpayConfig.url}?${signData}&vnp_SecureHash=${signed}`;

    console.log('🔐 VNPay Debug:');
    console.log('Sign Data:', signData);
    console.log('Secure Hash:', signed);
    console.log('Payment URL:', paymentUrl);

    return paymentUrl;
  }

  // 3. VERIFY CALLBACK (KIỂM TRA CHỮ KÝ TRẢ VỀ)
  static verifyReturnUrl(
    query: Record<string, string>,
    secretKey: string,
  ): { isValid: boolean; data: Record<string, string> } {
    const secureHash = query['vnp_SecureHash'];

    // Remove hash fields
    const queryClone = { ...query };
    delete queryClone['vnp_SecureHash'];
    delete queryClone['vnp_SecureHashType'];

    // Sort and create sign data
    const sortedParams = this.sortObject(queryClone);
    const signData = Object.keys(sortedParams)
      .map(key => `${key}=${sortedParams[key]}`)
      .join('&');

    // Create checksum
    const hmac = crypto.createHmac('sha512', secretKey);
    const checksum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return {
      isValid: secureHash === checksum,
      data: query,
    };
  }

  // 4. FORMAT DATE (yyyyMMddHHmmss)
  private static formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }
}
