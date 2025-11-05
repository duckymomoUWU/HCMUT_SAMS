export const validateHCMUTEmail = (email: string): boolean => {
  return email.endsWith("@hcmut.edu.vn");
};

export const validatePassword = (
  password: string,
): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
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
