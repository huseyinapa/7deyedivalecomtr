"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Services() {
  return (
    <div className="min-w-fit bg-white space-y-16">
      <title>7de Yedi Vale - Hizmetlerimiz</title>

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="pl-3 pt-6 text-2xl lg:text-4xl font-bold text-[#333]">
            Kurye Hizmetlerimiz
          </h1>
          <a className="pl-3 text-sm md:text-base font-medium text-center opacity-70 text-[#333]">
            Müşteri memnuniyetine odaklanan şirketimiz, sektörde lider konumunu
            kusursuz lojistik hizmetleriyle korur.
          </a>
        </div>
        <div className="mx-auto mt-11 flex flex-col p-6 sm:p-9 px-5 sm:px-9 xl:justify-center gap-5 md:gap-10 bg-white rounded-3xl w-[80%] md:w-[90%] lg:w-[87%] xl:w-[85%] h-auto sm:h-auto md:h-auto lg:h-auto xl:h-[300px]">
          {/* Arac karti container */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center place-items-center md:h-auto xl:h-[350px] gap-7">
            {/* Arac karti 1 */}
            <div className="flex flex-col w-52 m-3 items-center justify-center gap-3">
              <img
                src="assets/tesla_back.png"
                className="w-16 md:w-20 lg:w-28 opacity-80"
              />
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-[#333] opacity-90">
                  Araç Kurye
                </h1>
                <a className="font-semibold text-[#333] text-sm text-center opacity-60">
                  Büyük ebatlı gönderileriniz için ekonomik çözüm
                </a>
              </div>
            </div>
            {/* Arac karti 2 */}
            <div className="flex flex-col w-52 m-3 items-center justify-center gap-3 ">
              <img
                src="assets/scooter_back.png"
                className="w-16 md:w-20 lg:w-28 opacity-80"
              />
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-[#333] opacity-90">
                  Moto Kurye
                </h1>
                <a className="font-semibold text-[#333] text-sm text-center opacity-60">
                  Küçük ebatlı gönderileriniz'in anında teslimatı için her zaman
                  yanınızda.
                </a>
              </div>
            </div>
            {/* Arac karti 3 */}
            <div className="flex flex-col w-52 m-3 items-center justify-center gap-3 ">
              <img
                src="assets/bike_back.png"
                className="w-16 md:w-20 lg:w-28 opacity-80"
              />
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-[#333] opacity-90">
                  Bisiklet Kurye
                </h1>
                <a className="font-semibold text-[#333] text-sm text-center opacity-60">
                  Küçük ebatlı gönderileriniz'in belirli saat aralıklarında
                  teslimatı için ekonomik çözüm.
                </a>
              </div>
            </div>
            {/* Arac karti 4 */}
            <div className="flex flex-col w-52 m-3 items-center justify-center gap-3 ">
              <img
                src="assets/kick_scooter_back.png"
                className="w-16 md:w-20 lg:w-28 opacity-80"
              />
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-[#333] opacity-90">
                  Scooter Kurye
                </h1>
                <a className="font-semibold text-[#333] text-sm text-center opacity-60">
                  Küçük ebatlı gönderileriniz'in, 'Ekspres ve Ekonomik
                  Teslimatı' için her zaman yanınızda.
                </a>
              </div>
            </div>
            {/* Arac karti 5 */}
            <div className="flex flex-col w-52 m-3 items-center justify-center gap-3 ">
              <img
                src="assets/walking_back.png"
                className="w-16 md:w-20 lg:w-28 opacity-80"
              />
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-[#333] opacity-90">
                  Yaya Kurye
                </h1>
                <a className="font-semibold text-[#333] text-sm text-center opacity-60">
                  Minik gönderileriniz'in kısa mesafeye en hızlı sürede ulaşması
                  için ekonomik çözüm.
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 my-10 py-8 md:px-8 px-0 w-full bg-white">
        <div className="w-[90%] md:w-[43%] lg:w-[40%] space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#333]">
            <a className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 text-[#333] before:bg-[#edc81e]">
              <span className="relative skew-y-3 font-extrabold tracking-wide">
                7de Yedi Vale
              </span>
            </a>{" "}
            Neden?
          </h1>
          <span className="flex flex-col gap-8 text-lg text-pretty text-black opacity-80">
            <span>
              Güvenilirlik: Her gönderi, özel olarak kodlanarak karışıklık
              olmadan doğru adrese ulaştırılır. Teslimat süreci boyunca
              paketinizin nerede olduğunu takip edebilirsiniz.
            </span>
            <span>
              Hızlı Teslimat: Modern teknolojiler ve geniş kurye ağımız
              sayesinde, gönderileriniz hızlı bir şekilde alıcısına ulaşır. Acil
              gönderimleriniz için özel çözümler sunarız.
            </span>
            <span>
              Müşteri Destek: Her zaman yanınızdayız. Sorularınız ve
              talepleriniz için 7/24 müşteri destek hizmetimizden
              faydalanabilirsiniz.
            </span>
          </span>
        </div>
        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="w-[90%] md:w-[43%] lg:w-[40%]"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl">
              Teknolojimiz
            </AccordionTrigger>
            <AccordionContent>
              Bilgisayarınızdan "Çağır" butonuna basmanız yeterli. Geri kalan
              her şeyi bizim kuryelerimiz halledecek. Kullanımı kolay
              platformumuz, size zaman kazandırırken, akıllı algoritmalarımız
              paketinizin en hızlı rotada ulaşmasını sağlar. Hem güvenli hem de
              hızlı!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl">
              Esnek Çözümler
            </AccordionTrigger>
            <AccordionContent>
              İşletmenizin özel ihtiyaçlarına yönelik esnek çözümler sunuyoruz.
              Gönderim hacminiz ne olursa olsun, size özel fiyatlandırma ve
              hizmet paketlerimizle bütçenize uygun taşımacılık seçenekleri
              sunuyoruz. İhtiyaçlarınıza göre özelleştirilmiş çözümlerle iş
              süreçlerinizi optimize ediyoruz.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl">
              Sürdürülebilir Taşımacılık
            </AccordionTrigger>
            <AccordionContent>
              Çevreye duyarlılık, işimizin ayrılmaz bir parçasıdır.
              Sürdürülebilir taşımacılık çözümlerimiz ile karbon ayak izimizi
              minimumda tutmayı hedefliyoruz. Elektrikli araçlarımız ve çevre
              dostu uygulamalarımız sayesinde, hem size hem de gezegenimize
              değer katıyoruz.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl">
              Olağanüstü Durum Çözümleri
            </AccordionTrigger>
            <AccordionContent>
              Her zaman planlar yolunda gitmeyebilir! Ancak, 7de Yedi Vale
              olarak her türlü aksiliğe karşı hazırlıklıyız. Beklenmedik
              durumlar için geliştirdiğimiz özel senaryolarımız sayesinde,
              paketinizin güvenle ve zamanında ulaştırılması garantidir. Ani bir
              sorun yaşandığında, devreye giren Yedek Kuryelerimiz ile
              gönderilerinizin yolda kalmasını önlüyoruz. Bu sayede, "Paketim
              nerede?" endişesinden tamamen kurtulmuş oluyorsunuz.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
