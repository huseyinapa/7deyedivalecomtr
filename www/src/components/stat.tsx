import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Archive, BriefcaseBusiness } from "lucide-react";

export default function Stat() {
  return (
    <div className="flex flex-col items-center justify-center lg:justify-center mt-10 w-full h-full md:h-[850px] lg:h-full my-10 place-content-center space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-between items-center gap-12 h-auto md:h-auto md:px-14 w-[93%] my-4 text-black">
        <h1 className="mx-auto font-bold text-3xl w-[85%] lg:w-[400px]">
          Esnek Dağıtım: Hızlı ve Etkili Müşteri Çözümleri
        </h1>
        <div className="relative mx-auto w-[85%] lg:w-[370px]">
          <h2 className="mx-auto font-bold text-base"></h2>
          <h2 className="mx-auto text-base">
            <a className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 text-[#333] before:bg-[#edc81e]">
              <span className="relative skew-y-3 font-bold tracking-wide">
                Sabit modelde;
              </span>
            </a>{" "}
            <span className="font-semibold">
              kurye, işletmenizde belirlenen noktalarda bekleyerek hızlı dağıtım
              sürecine katkıda bulunurlar.
            </span>
          </h2>
        </div>
        <div className="relative mx-auto w-[85%] lg:w-[370px]">
          <h2 className="mx-auto text-base">
            <a className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 text-slate-100 before:bg-[#333]">
              <span className="relative skew-y-3 font-bold tracking-wide">
                Havuz sistemi;
              </span>
            </a>{" "}
            <span className="font-semibold">
              sahadaki kuryeler aracılığıyla etkili dağıtım sağlar. Müşteri
              memnuniyetine odaklanan şirketimiz, sektörde lider konumunu
              kusursuz lojistik hizmetleriyle korur.
            </span>
          </h2>
          {/* <div className="absolute top-0 w-20 h-10 bg-[#edc81e]"></div> */}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center place-items-center gap-5 lg:gap-2 w-[80%] md:w-[80%] lg:w-[90%] h-auto md:h-[430px] lg:h-[250px]">
        <Card className="min-w-[220px] w-[70%] md:w-[300px] lg:w-[280px] xl:w-[300px] md:h-[170px] lg:h-[180px] xl:h-[180px] place-content-center space-y-2 shadow-[#333] shadow-[0_0_10px_0]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Mutlu Müşteri</CardTitle>
            <Users className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+22.520</div>
          </CardContent>
        </Card>
        <Card className="min-w-[220px] w-[70%] md:w-[300px] lg:w-[280px] xl:w-[300px] md:h-[170px] lg:h-[180px] xl:h-[180px] place-content-center space-y-2 shadow-[#333] shadow-[0_0_10px_0]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Taşıdığımız Paket
            </CardTitle>
            {/* Ulaştırılan, Taşınan, Teslim edilen */}
            <Archive className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+120.000</div>
            <p className="text-base text-muted-foreground">Son 9 Ay içinde</p>
          </CardContent>
        </Card>
        <Card className="min-w-[220px] w-[70%] md:w-[300px] lg:w-[280px] xl:w-[300px] md:h-[170px] lg:h-[180px] xl:h-[180px] place-content-center space-y-2 shadow-[#333] shadow-[0_0_10px_0]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Yeni İşletme</CardTitle>
            <BriefcaseBusiness className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+38</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
