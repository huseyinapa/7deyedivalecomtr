export default function CallCourier() {
  return (
    <div className="mx-auto flex flex-col md:flex-row mt-8 md:p-6 sm:p-9 md:px-5 sm:px-9 items-center md:justify-center xl:justify-around gap-2 md:gap-7 lg:gap-10 w-[90%] md:w-[97%] lg:w-[92%] xl:w-[85%] h-[600px] md:h-[400px] lg:h-[470px] xl:h-[530px]">
      <div>
        <img
          className="w-[700px] md:w-[700px] lg:w-[600px] h-[200px] md:h-[250px] lg:h-[250px] object-contain lg:object-cover"
          src="/assets/araba.png"
        />
      </div>
      <div className="flex flex-col justify-center p-3 md:p-6 md:pl-9 gap-8 md:gap-3 w-[97%] md:w-[94%] lg:w-[87%] xl:w-[55%]">
        <div className="flex flex-row justify-between">
          <h1 className="text-xl font-bold lg:text-3xl text-center md:text-left text-[#333]">
            İhtiyacınız Olduğu Durumlarda Araç Kurye Yanınızda!
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="font-semibold text-sm md:text-base lg:text-lg text-[#333] opacity-70">
            7de Yedi Vale olarak, büyük gönderilerinizi taşımak için özel olarak
            donatılmış araçlarımız ve uzman ekibimizle yanınızdayız. Sizin için
            büyük düşünüyor, gönderilerinizi güvenle ve hızla teslim ediyoruz.
          </h1>
          <a
            className="px-8 py-3 font-semibold transition-colors bg-[#333] border-none text-white hover:text-[#333] rounded-3xl"
            href="/kurye-cagir"
          >
            Kurye Çağırın!
          </a>
        </div>
      </div>
    </div>
  );
}
