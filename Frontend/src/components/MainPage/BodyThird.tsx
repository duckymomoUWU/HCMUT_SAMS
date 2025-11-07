import {
  Trophy,
  Users,
  CircleStar,
  Clock,
  User,
  BookOpen,
  Heart,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Info = [
  {
    icon: Trophy,
    first: "15+",
    second: "Năm kinh nghiệm",
    third: "Phục vụ cộng đồng thể thao",
  },
  {
    icon: Users,
    first: "10,000+",
    second: "Sinh viên sử dụng",
    third: "Mỗi năm học",
  },
  {
    icon: CircleStar,
    first: "50+",
    second: "Sự kiện thể thao",
    third: "Được tổ chức hàng năm",
  },
  {
    icon: Clock,
    first: "24/7",
    second: "Phục vụ liên tục",
    third: "Mọi ngày trong tuần",
  },
];

const Info2 = [
  {
    icon: BookOpen,
    title: "Nhà thi đấu Bách Khoa Sports",
    content:
      "Khuyến khích sinh viên tham gia các hoạt động thể thao để phát triển toàn diện",
  },
  {
    icon: Users,
    title: "Sức khỏe cộng đồng",
    content:
      "Tạo điều kiện cho mọi người duy trì lối sống khỏe mạnh và tích cực",
  },
  {
    icon: Heart,
    title: "Tinh thần đồng đội",
    content:
      "Xây dựng môi trường giao lưu, kết nối và phát triển kỹ năng xã hội",
  },
];

const BodyThird = () => {
  const navigate = useNavigate();
  return (
    <div className="mb-12 flex flex-col">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-3xl font-bold">
          Hơn 15 năm đồng hành cùng thể thao
        </div>
        <div className="w-[60%] text-center text-lg text-gray-700">
          Nhà thi đấu Bách Khoa Sports là trung tâm thể thao hàng đầu tại
          TP.HCM, nơi kết nối cộng đồng qua đam mê thể thao và lối sống khỏe
          mạnh.
        </div>
      </div>
      <div className="my-4 flex items-center justify-center gap-4">
        {Info.map((item, index) => {
          return (
            <div
              className="flex w-[16%] flex-col items-center justify-center gap-2 
                        rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 
                        hover:-translate-y-2 hover:shadow-2xl hover:cursor-pointer"
              key={index}
            >
              <div className="rounded-lg bg-(--blue-background) p-4">
                <item.icon
                  width={32}
                  height={32}
                  color="var(--blue-dark-background)"
                />
              </div>
              <div className="text-xl font-bold">{item.first}</div>
              <div className="text-sz font-medium">{item.second}</div>
              <div className="text-sm font-normal text-gray-600">
                {item.third}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex w-full items-center justify-center gap-8">
        {/* Left */}
        <div className="flex w-[40%] flex-col gap-4">
          <div className="w-fit self-start rounded-md bg-[var(--blue-dark-background)] px-3 py-1 text-lg font-semibold text-white hover:shadow-2xl">
            Sứ mệnh
          </div>
          <div className="text-2xl font-bold">
            Nâng tầm văn hóa thể thao sinh viên
          </div>
          <div className="text-sz text-gray-600">
            Chúng tôi cam kết tạo ra một môi trường thể thao chuyên nghiệp, an
            toàn và thân thiện, nơi mọi người có thể phát triển kỹ năng, duy trì
            sức khỏe và xây dựng những mối quan hệ bền vững.
          </div>
          <div className="text-sz text-gray-600">
            Với trang thiết bị hiện đại và đội ngũ hỗ trợ tận tâm, chúng tôi
            không ngừng nâng cao chất lượng dịch vụ để mang đến trải nghiệm thể
            thao tốt nhất cho cộng đồng.
          </div>
          <div className="flex w-fit items-center justify-center gap-2 rounded-2xl bg-(--blue-dark-background) p-4 shadow-2xl hover:cursor-pointer hover:bg-[#0f4ad1]" onClick={() => navigate("/login")}>
            <User width={20} height={20} color="white" />
            <div className="text-sm font-normal text-white" >
              Đăng nhập để trải nghiệm
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="flex w-[32%] flex-col gap-4">
          <div className="text-xl font-semibold">Giá trị cốt lõi</div>
          <div className="">
            {Info2.map((item, index) => {
              return (
                <div
                  className="mb-4 flex h-[100px] items-center gap-4 rounded-2xl bg-white p-4 shadow-2xl 
                            transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] 
                            hover:cursor-pointer"
                  key={index}
                >
                  <div className="flex h-[80%] w-fit items-center justify-center rounded-lg bg-(--blue-background) p-2">
                    <item.icon
                      width={32}
                      height={32}
                      color="var(--blue-light)"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-base font-medium">{item.title}</div>
                    <div className="text-base text-gray-600">
                      {item.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyThird;
