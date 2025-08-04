import Image from "next/image";

export default function Fleet() {
  return (
    <div className="mt-10 w-full bg-white">
      <div className="mx-auto flex flex-col p-6 sm:p-9 px-5 sm:px-9 xl:justify-center gap-5 md:gap-10 w-[80%] md:w-[90%] lg:w-[87%] xl:w-[85%] h-auto xl:h-[500px] bg-[#333] shadow-[0_0_20px_3px] rounded-3xl">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold pl-3 text-2xl lg:text-3xl text-white">
              Sürdürülebilir Filomuz
            </h1>
            <a className="text-xl font-semibold pl-3 md:text-base opacity-60 text-white">
              Hızlı ve çevreye duyarlı hizmetlerimiz
            </a>
          </div>
          <span className="relative flex h-7 w-7">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#edc81e] opacity-60"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-[#edc81e]"></span>
          </span>
        </div>
        {/* Arac karti container */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center place-items-center md:h-auto xl:h-[350px] gap-7">
          {/* Arac karti 1 */}
          <div className="flex flex-col w-52 m-3 items-center justify-center gap-3">
            <Image
              src="/assets/tesla.png"
              className="w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 object-contain"
              alt="Tesla araç"
              width={128}
              height={128}
              loading="lazy"
            />
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold text-white opacity-70">Araç Kurye</h1>
              <a className="font-medium text-white text-sm text-center opacity-45">
                Büyük ebatlı gönderileriniz için her zaman yanınızda.
              </a>
            </div>
          </div>
          {/* Arac karti 2 */}
          <div className="flex flex-col w-52 m-3 items-center justify-center gap-3 ">
            <Image
              src="/assets/scooter.png"
              className="w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 object-contain"
              alt="Scooter"
              width={128}
              height={128}
              loading="lazy"
            />
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold text-white opacity-70">Moto Kurye</h1>
              <a className="font-medium text-white text-sm text-center opacity-45">
                Küçük ebatlı gönderileriniz'in anında teslimatı için her zaman
                yanınızda.
              </a>
            </div>
          </div>
          {/* Arac karti 3 */}
          <div className="flex flex-col w-52 m-3 items-center justify-center gap-3 ">
            <Image
              src="/assets/bike.png"
              className="w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 object-contain"
              alt="Bisiklet"
              width={128}
              height={128}
              loading="lazy"
            />
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold text-white opacity-70">
                Bisiklet Kurye
              </h1>
              <a className="font-medium text-white text-sm text-center opacity-45">
                Küçük ebatlı gönderileriniz'in belirli saat aralıklarında
                teslimatı için ekonomik çözüm.
              </a>
            </div>
          </div>
          {/* Arac karti 4 */}
          <div className="flex flex-col w-52 m-3 items-center justify-center gap-3 ">
            <Image
              src="/assets/kick_scooter.png"
              className="w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 object-contain"
              alt="Kick scooter"
              width={128}
              height={128}
              loading="lazy"
            />
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold text-white opacity-70">
                Scooter Kurye
              </h1>
              <a className="font-medium text-white text-sm text-center opacity-45">
                Küçük ebatlı gönderileriniz'in, 'Ekspres ve Ekonomik Teslimatı'
                için her zaman yanınızda.
              </a>
            </div>
          </div>
          {/* Arac karti 5 */}
          <div className="flex flex-col w-52 m-3 items-center justify-center gap-3 ">
            <Image
              src="/assets/walking.png"
              className="w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 object-contain"
              alt="Yaya kurye"
              width={128}
              height={128}
              loading="lazy"
            />
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold text-white opacity-70">Yaya Kurye</h1>
              <a className="font-medium text-white text-sm text-center opacity-45">
                Minik gönderileriniz'in kısa mesafeye en hızlı sürede ulaşması
                için ekonomik çözüm.
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
