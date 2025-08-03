import { useEffect, useState } from "react";
import { DatePickerWithPresets } from "./datePicker";

interface CompanyInformationProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement> | any, section?: string) => void;
}

export default function CompanyInformation({ onChange }: CompanyInformationProps) {
  const [date, setDate] = useState<Date | undefined>();
  console.log(date);

  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date ? new Intl.DateTimeFormat("tr-TR", options).format(date) : "Tarih seçin";

  console.log(formattedDate);
  useEffect(() => {
    if (date) {
      const mark = {
        target: {
          name: "startDate",
          value: formattedDate,
        },
      };
      onChange(mark, "companyInfo");
    }
  }, [date, formattedDate]);

  return (
    <section
      id="companyInfo"
      className="min-w-[300px] sm:w-[50%] md:w-[600px] max-w-[600px] min-h-[770px] md:min-h-[500px] bg-[#333] rounded-2xl p-6"
    >
      <div className="flex flex-col justify-center items-center h-full">
        <div className="text-2xl text-white text-center mb-6 font-semibold">
          Firma Bilgileri
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">Sektör</span>
            </div>
            <select
              name="sector"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => onChange(e, "companyInfo")}
              required
              defaultValue=""
            >
              <option disabled value="">
                Seçiniz
              </option>
              <option value="Restoran">Restoran</option>
              <option value="Market">Market</option>
              <option value="Perakende">Perakende</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">Firma Adı</span>
            </div>
            <input
              type="text"
              name="companyName"
              placeholder="7de Yedi Vale"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => onChange(e, "companyInfo")}
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">Toplam Şube Sayısı</span>
            </div>
            <input
              type="number"
              name="branchCount"
              placeholder="7"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => onChange(e, "companyInfo")}
              required
            />
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">
                Talep Ettiğiniz Başlangıç Tarihi
              </span>
            </div>
            <DatePickerWithPresets setReturnedDate={setDate} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div>
            <div className="mb-2">
              <span className="text-white text-sm">Günlük Teslimat Sayısı</span>
            </div>
            <input
              type="number"
              name="dailyDeliveryCount"
              placeholder="15"
              className="border border-gray-300 rounded-full w-[220px] max-w-xs bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onChange(e, "companyInfo")}
              required
            />
          </div>
          <div>
            <div className="mb-2">
              <span className="text-white text-sm">Aylık Teslimat Sayısı</span>
            </div>
            <input
              type="number"
              name="monthlyDeliveryCount"
              placeholder="450"
              className="border border-gray-300 rounded-full w-[220px] max-w-xs bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onChange(e, "companyInfo")}
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div>
            <div className="mb-2">
              <span className="text-white text-sm">Çalıştırmak İstediğiniz Kurye Sayısı</span>
            </div>
            <input
              type="number"
              name="courierCount"
              placeholder="3"
              className="border border-gray-300 rounded-full w-[220px] max-w-xs bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onChange(e, "companyInfo")}
              required
            />
          </div>
          <div>
            <div className="mb-2">
              <span className="text-white text-sm">Çalışma Saatleri</span>
            </div>
            <input
              type="text"
              name="workingHours"
              placeholder="09:00 - 18:00"
              className="border border-gray-300 rounded-full w-[220px] max-w-xs bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onChange(e, "companyInfo")}
              required
            />
          </div>
        </div>
      </div>
    </section>
  );
}
