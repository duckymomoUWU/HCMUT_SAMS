import { useRef } from "react";

interface OTPInputProps {
  otp: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ otp, onChange, disabled }) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits

    const otpArray = otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");

    onChange({ target: { name: "otp", value: newOtp } });

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          disabled={disabled}
          type="text"
          maxLength={1}
          ref={(el) => {
            if (el !== null) {
              inputsRef.current[i] = el;
            }
          }}
          value={otp[i] || ""}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="h-14 w-12 rounded-xl border border-gray-300 text-center text-2xl font-semibold transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
        />
      ))}
    </div>
  );
};

export default OTPInput;
