import LogoHCMUT from "@/assets/hcmut_logo.png";
import { Phone, Mail, User } from "lucide-react";

import { Link } from "react-scroll";

import { useNavigate } from "react-router-dom";

const NavLink = ({
  to,
  label,
  offset,
  duration,
}: {
  to: string;
  label: string;
  offset: number;
  duration: number;
}) => (
  <Link
    to={to}
    smooth={true}
    duration={duration}
    offset={offset}
    className="group relative cursor-pointer text-black transition-colors duration-300"
  >
    <span className="relative transition-colors duration-300 group-hover:text-[var(--blue-light)]">
      {label}
    </span>
    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[var(--blue-light)] transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between bg-white p-2">
      {/* LEFT */}
      <div className="ml-4 flex">
        <img src={LogoHCMUT} alt="logo" className="bg-blue-light w-[50px]" />
        <div className="ml-2 flex flex-col text-(--blue-light)">
          <div className="text-2xl font-bold">HCMUT SAMS</div>
          <div className="">Sports Arena Management System</div>
        </div>
      </div>
      {/* CENTER */}
      <div className="flex gap-20 text-base font-semibold">
        <NavLink to="trang-chu" label="Trang chủ" offset={0} duration={300} />
        <NavLink to="gioi-thieu" label="Giới thiệu" offset={0} duration={800} />
        <NavLink
          to="co-so-vat-chat"
          label="Cơ sở vật chất"
          offset={-42}
          duration={500}
        />
        <NavLink to="lien-he" label="Liên hệ" offset={0} duration={1000} />
      </div>
      {/* RIGHT */}
      <div className="mr-4 flex gap-4">
        {/* Liên hệ */}
        <div className="mr-4 flex flex-col">
          <div className="flex gap-4">
            <Phone color="var(--blue-light)" />
            <div>033 333 3333</div>
          </div>
          <div className="flex gap-4">
            <Mail color="var(--blue-light)" />
            <div>sports@hcmut.edu.vn</div>
          </div>
        </div>
        {/* Đăng nhập */}
        <div
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 rounded-2xl 
                    bg-gradient-to-r from-[#3b82f6] to-[#2563eb] 
                    px-4 py-2 text-white shadow-md transition-all duration-300 
                    hover:-translate-y-[1px] hover:shadow-lg hover:brightness-110 
                    active:scale-95 hover:cursor-pointer"
        >
          <User fill="white" color="white" />
          <div className="text-base font-semibold">Đăng nhập</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
