// EMAIL
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// HCMUTemail
export const validateHCMUTEmail = (email: string) => {
  return email.endsWith("@hcmut.edu.vn");
};

// Password
export const validatePassword = (
  password: string,
): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 1 chữ thường" };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 1 chữ HOA" };
  }

  if (!/\d/.test(password)) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 1 chữ số" };
  }

  return { valid: true, message: "" };
};

// OTP
export const validateOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

// Phone
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};
