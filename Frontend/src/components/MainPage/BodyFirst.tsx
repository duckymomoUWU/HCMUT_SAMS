import { UserPlus, MapPin, Users, Clock, Shield, Check } from "lucide-react";

import BackGround from "@/assets/hcmut_background.png";
import Arena from "@/assets/hcmut_arena.png";

import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

const ScrollButton = [{ index: 0 }, { index: 1 }, { index: 2 }];

const ScrollImage = [{ img: BackGround }, { img: Arena }, { img: BackGround }];

const BodyFirst = () => {
  const [isSerial, setIsSerial] = useState(0);
  const [isFlag, setIsFlag] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const scroll = (dir: "left" | "right", times: number) => {
    const element = scrollRef.current;
    if (!element) return;

    const cardWidth = element.firstElementChild!.clientWidth;
    element.scrollBy({
      left: dir === "left" ? -cardWidth * times : cardWidth * times,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!isFlag) return;
    const interval = setInterval(() => {
      setIsSerial((prev) => {
        if (prev === 2) {
          scroll("left", 2);
          return 0;
        } else {
          scroll("right", 1);
          return prev + 1;
        }
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isFlag]);

  return (
    <div className="flex bg-linear-to-bl from-[#EEEEEE] to-[#51A4F1] p-16 h-screen">
      {/* Left */}
      <div className="w-1/2">
        <div className="mb-4 text-(--blue-med)">
          <div className="w-1/2 text-8xl leading-22 font-semibold">
            HCMUT SAMS
          </div>
        </div>
        <div className="mb-4 text-4xl font-semibold">
          Sports Arena Management System
        </div>
        <div className="w-[90%] text-2xl font-semibold">
          Nền tảng quản lý và đặt sân thể thao thông minh của Đại học Bách Khoa
          TP.HCM
        </div>
        {/* Button */}
        <div className="my-4 flex gap-8">
          {/* Login */}
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:shadow-lg hover:brightness-110 active:scale-95 cursor-pointer p-5 hover:-translate-y-[1px]">
            <UserPlus color="white" />
            <div className="text-white" onClick={() => navigate("/login")}>Đăng nhập vào SAMS</div>
          </div>
          {/* Map */}
          <Link to="co-so-vat-chat" smooth={true} duration={500} offset={-42}className="flex items-center justify-center gap-2 rounded-2xl bg-white p-5 hover:-translate-y-[1px] hover:shadow-md 
             hover:brightness-95 active:scale-95 cursor-pointer">
            <MapPin color="var(--blue-light)" />
            <div className="text-(--blue-light)">Khám phá cơ sở vật chất</div>
          </Link>
        </div>
        {/* Label */}
        <div className="flex">
          {/* Clock */}
          <div className="flex w-40 flex-col items-center gap-1">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-sm bg-[#B7E0FF] hover:shadow-2xl">
              <Clock color="var(--blue-light)" width={35} height={35} />
            </div>
            <div className="text-center text-lg font-medium">24/7</div>
            <div className="text-center text-lg font-normal">
              Hệ thống hoạt động liên tục
            </div>
          </div>
          {/* Users */}
          <div className="flex w-40 flex-col items-center gap-1">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-sm bg-[#D3FBE1] hover:shadow-2xl">
              <Users color="#4FBA69" width={35} height={35} />
            </div>
            <div className="text-center text-lg font-medium">500+</div>
            <div className="w-[80%] text-center text-lg font-normal">
              Chỗ ngồi khán đài
            </div>
          </div>
          {/* Shield */}
          <div className="flex w-40 flex-col items-center gap-1">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-sm bg-[#F0E2FF] hover:shadow-2xl">
              <Shield color="#9810FA" width={35} height={35} />
            </div>
            <div className="text-center text-lg font-medium">Prenium</div>
            <div className="w-[90%] text-center text-lg font-normal">
              Chất lượng quốc tế
            </div>
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="relative flex w-1/2  justify-center">
        <div
          className="scrollbar-hide flex h-[95%] w-[80%] snap-x snap-mandatory overflow-x-hidden scroll-smooth rounded-2xl shadow-2xl"
          ref={scrollRef}
        >
          {ScrollImage.map((item, index) => (
            <img
              src={item.img}
              alt=""
              className="h-full w-full shrink-0 snap-start rounded-2xl shadow-2xl"
              key={index}
            />
          ))}
        </div>
        {/* Top Right */}
        <div className="text-bold absolute -top-6 right-0 flex items-center justify-center gap-2 rounded-md bg-white p-4 shadow-2xl">
          <div className="rounded bg-[#D3FBE1] p-2">
            <Check color="#4FBA69" width={20} height={20} />
          </div>
          <div className="w-40 text-base text-black">
            Cơ sở vật chất hiện đại
          </div>
        </div>
        {/* Bottom Left */}
        <div className="text-bold absolute bottom-4 -left-4 flex items-center justify-center gap-2 rounded-md bg-white p-4 shadow-xl">
          <div className="rounded bg-[#B7E0FF] p-2">
            <MapPin color="var(--blue-light)" />
          </div>
          <div className="w-[200px] text-base text-black">
            Địa điểm lí tưởng để thể dục, thể thao
          </div>
        </div>
        {/* Navigation */}
        <div className="absolute bottom-12 flex gap-4">
          {ScrollButton.map((item) => (
            <div
              key={item.index}
              className={`h-3 w-3 rounded-full transition-colors duration-300 ease-in-out ${item.index === isSerial ? "bg-neutral-400" : "cursor-pointer bg-gray-100"}`}
              onClick={() => {
                if (item.index < isSerial) {
                  scroll("left", isSerial - item.index);
                  setIsFlag(false);
                  setTimeout(() => setIsFlag(true), 4000);
                } else if (item.index > isSerial) {
                  scroll("right", item.index - isSerial);
                  setIsFlag(false);
                  setTimeout(() => setIsFlag(true), 4000);
                }
                setTimeout(() => setIsSerial(item.index), 200);
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyFirst;
