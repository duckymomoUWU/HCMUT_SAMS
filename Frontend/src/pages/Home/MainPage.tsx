import Header from "@/components/Main/Header";
import BodyFirst from "@/components/Main/BodyFirst";
import BodySecond from "@/components/Main/BodySecond";
import BodyThird from "@/components/Main/BodyThird";
import Footer from "@/components/Main/Footer";

const MainPage = () => {
  return (
    <div className="bg-white text-black">
      <div>
        <Header />
      </div>
      <div id="trang-chu">
        <BodyFirst />
      </div>
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
