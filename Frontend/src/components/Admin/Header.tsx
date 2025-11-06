import { Bell, LogOut, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="flex h-auto items-center justify-between border-b-2 border-[gray] bg-[#FEFEFF] px-4 py-4 md:h-[77px] md:px-8 md:py-0">
      <div className="flex items-center gap-4">
        <button className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6 text-black" />
        </button>

        <div className="flex-1">
          <div className="mb-2 text-lg leading-tight font-normal text-black md:mb-[21px] md:text-xl md:leading-[10px]">
            Xin chào, Nguyễn Văn A
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs leading-[10px] font-normal text-black md:text-sm">
              Vai trò:
            </span>
            <span className="rounded-lg bg-[red] px-[6px] py-[10px] text-xs leading-[10px] font-normal text-white">
              Quản trị viên
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <button className="relative rounded-lg p-1 hover:bg-[#d9d9d9]">
          <Bell className="h-5 w-5 text-black md:h-6 md:w-6" />
        </button>

        <button className="hidden items-center gap-3 rounded-lg border border-[black] bg-white px-4 py-2 transition-colors hover:bg-[#d9d9d9] md:flex">
          <LogOut className="h-4 w-5 text-[#222222]" />
          <span className="text-[10px] leading-[10px] font-normal text-black">
            Đăng xuất
          </span>
        </button>

        <button className="md:hidden">
          <LogOut className="h-5 w-5 text-[#222222]" />
        </button>
      </div>
    </header>
  );
};
export default Header;
