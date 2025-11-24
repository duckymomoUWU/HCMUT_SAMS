import Logo from "@/assets/hcmut_logo.png";

const Info1 = [
  { content: "Đặt sân online thông minh" },
  { content: "uản lý lịch sử đặt sân" },
  { content: "Thanh toán điện tử MyBK" },
  { content: "Thông báo real-time" },
  { content: "Báo cáo thông kê" },
];

const Info2 = [
  { content: "Website chính thức" },
  { content: "MyBK Portal" },
  { content: "E-Learning BKU" },
  { content: "Thư viện số" },
  { content: "BK-OISP" },
];

const Info3 = [
  {
    first: "Trụ sở chính",
    second: "268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM",
  },
  {
    first: "Hotline SAMS",
    second: "(028) 38 651 670   Ext: 5258, 5234",
  },
  {
    first: "Email hỗ trợ",
    second: "sams@hcmut.edu.vn",
  },
];

const Footer = () => {
  return (
    <div className="flex w-full justify-between bg-(--blue-med) p-8 text-white">
      {/* First */}
      <div className="flex w-[20%] flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex items-center justify-center">
            <img src={Logo} alt="Logo" width={40} height={40} />
          </div>
          <div className="flex flex-col">
            <div className="text-base font-semibold">HCMUT SAMS</div>
            <div className="text-sm font-normal">
              Sports Arena Management System
            </div>
          </div>
        </div>
        <div className="text-justify text-sm font-normal text-gray-100">
          Hệ thống quản lý sân thể thao thông minh của Đại học Bách Khoa TP.HCM,
          mang đến trải nghiệm đặt sân hiện đại và tiện lợi cho sinh viên.
        </div>
      </div>
      {/* Second */}
      <div className="flex flex-col gap-2">
        <div className="text-base font-semibold">TÍNH NĂNG SAMS</div>
        <div className="flex flex-col gap-1.5 text-sm font-normal text-gray-100">
          {Info1.map((item, index) => {
            return (
              <div className="" key={index}>
                {item.content}
              </div>
            );
          })}
        </div>
      </div>
      {/* Third */}
      <div className="flex flex-col gap-2">
        <div className="text-base font-semibold">HỆ SINH THÁI HCMUT</div>
        <div className="flex flex-col gap-1.5 text-sm font-normal text-gray-100">
          {Info2.map((item, index) => {
            return (
              <div className="" key={index}>
                {item.content}
              </div>
            );
          })}
        </div>
      </div>
      {/* Fourth */}
      <div className="flex flex-col gap-2">
        <div className="text-base font-semibold">THÔNG TIN LIÊN HỆ</div>
        <div className="flex flex-col gap-2">
          {Info3.map((item, index) => {
            return (
              <div className="flex flex-col" key={index}>
                <div className="text-sm font-semibold text-gray-100">
                  {item.first}
                </div>
                <div className="text-sm">{item.second}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;
