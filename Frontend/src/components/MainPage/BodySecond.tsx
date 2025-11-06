import Arena from "@/assets/hcmut_arena.png";

const BodySecond = () => {
  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="text-center text-3xl font-bold text-(--blue-light)">
        Không gian thi đấu chuyên nghiệp
      </div>
      <div className="my-4 w-[50%] text-center text-xl font-normal text-black">
        Khám phá nhà thi đấu Bách Khoa với không gian rộng lớn, khán đài hiện
        đại và trang thiết bị đạt chuẩn quốc tế
      </div>
      {/* Body */}
      <div className="relative mb-12 flex h-[520px] w-[58%] rounded-2xl hover:shadow-2xl">
        {/* Gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Picture */}
        <img
          src={Arena}
          alt=""
          className="h-full w-full rounded-2xl object-cover mix-blend-multiply shadow-2xl"
        />

        {/* Letter */}
        <div className="absolute bottom-12 left-12 w-[60%] text-white">
          <div className="h-full w-fit rounded-sm bg-white/20 p-1 text-xs font-normal">
            Nhà thi đấu đa năng
          </div>
          <div className="my-2 text-2xl font-bold">
            Sân thi đấu với khán đài 500 chỗ ngồi
          </div>
          <div className="text-base text-gray-300">
            Với thiết kế hiện đại, khán đài màu đỏ-xanh đặc trưng và sàn gỗ
            chuyên nghiệp, đây là nơi lý tưởng cho mọi hoạt động thể thao.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodySecond;
