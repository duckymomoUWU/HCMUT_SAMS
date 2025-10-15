import LogoHCMUT from "@/assets/hcmut_logo.png";
import { Phone, Mail, User } from "lucide-react";

import { Link } from "react-scroll";

const NavLink = ({
  to,
  label,
  offset,
}: {
  to: string;
  label: string;
  offset: number;
}) => (
  <Link
    to={to}
    smooth={true}
    duration={500}
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
        <NavLink to="san-pham" label="Trang chủ" offset={0} />
        <NavLink to="gioi-thieu" label="Giới thiệu" offset={0} />
        <NavLink to="co-so-vat-chat" label="Cơ sở vật chất" offset={-42} />
        <NavLink to="lien-he" label="Liên hệ" offset={0} />
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
        <div className="flex items-center gap-2 rounded-2xl bg-(--blue-light) p-2">
          <User fill="white" color="white" />
          <div className="text-base font-normal text-white">Đăng nhập</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
