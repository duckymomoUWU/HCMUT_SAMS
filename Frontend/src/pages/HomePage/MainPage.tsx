import Header from "@/components/MainPage/Header";
import BodyFirst from "@/components/MainPage/BodyFirst";
import BodySecond from "@/components/MainPage/BodySecond";
import BodyThird from "@/components/MainPage/BodyThird";
import Footer from "@/components/MainPage/Footer";

const MainPage = () => {
  return (
    <div className="bg-white text-black">
      <div id="trang-chu">
        <Header />
      </div>
      <BodyFirst />
      <div id="co-so-vat-chat">
        <BodySecond />
      </div>
      <div id="gioi-thieu">
        <BodyThird />
      </div>
      <div id="lien-he">
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;
