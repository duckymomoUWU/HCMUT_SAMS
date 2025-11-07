/**
 * Decode JWT token (không verify signature)
 * Frontend chỉ cần check expiration, backend sẽ verify signature
 */
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Check xem token đã hết hạn chưa
 * @param token - JWT token
 * @returns true nếu token còn hợp lệ, false nếu đã hết hạn
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return false;

  // exp trong JWT là Unix timestamp (seconds)
  // Date.now() trả về milliseconds
  const currentTime = Date.now() / 1000;
  
  // Token còn hạn nếu exp > currentTime
  return decoded.exp > currentTime;
};

/**
 * Lấy thời gian còn lại của token (seconds)
 */
export const getTokenRemainingTime = (token: string | null): number => {
  if (!token) return 0;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return 0;

  const currentTime = Date.now() / 1000;
  const remaining = decoded.exp - currentTime;

  return remaining > 0 ? remaining : 0;
};