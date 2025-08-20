import { useState, useEffect } from "react";
import { ApplicationData } from "@/types";

interface ContactInformationProps {
  applicationData: ApplicationData;
  setApplicationData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

export default function ContactInformation({
  applicationData,
  setApplicationData,
}: ContactInformationProps) {
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // eğer city seçildiyse buradan discrit i ekle
    console.log({ name, value });

    if (name === "city") {
      for (let index = 0; index < cities.length; index++) {
        if (cities[index]["name"] === value) {
          const element = cities[index]["districts"];
          setDistricts(element || []);
          // console.log(districts);
        }
      }
    }

    setApplicationData((prevData) => ({
      ...prevData,
      contactInformation: { ...prevData.contactInformation, [name]: value },
    }));
  };

  console.log(applicationData.contactInformation);

  async function fetchCities() {
    const api_cities = await fetch("/api/turkiye");
    const cities = (await api_cities.json()).data;

    console.log(api_cities);

    // console.log(api_cities);

    const sortedCities = cities
      .slice()
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
    console.log(sortedCities);
    setCities(sortedCities);
    console.log(cities);
    for (let index = 0; index < sortedCities.length; index++) {
      // if (sortedCities[index]["name"] === storedCity) {
      //   const api_districts = sortedCities[index]["districts"];
      //   setDistricts(api_districts || []);
      //   break;
      // }
    }
  }

  return (
    <section
      id={"contactInformation"}
      className="min-w-[300px] sm:w-[50%] md:w-[600px] max-w-[600px] min-h-[590px] md:min-h-[390px] bg-[#333] rounded-2xl p-6"
    >
      <div className="p-0 flex flex-col justify-center items-center h-full gap-2">
        <div className="text-2xl font-semibold text-white justify-start ml-8 mb-2">
          İletişim Bilgileri
        </div>
        <div className="mx-auto w-[90%] h-0.5 bg-white" />
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">Telefon Numarası</span>
            </div>
            <input
              type="number"
              name="phoneNumber"
              placeholder="0 (577) 777 77 77"
              className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
              onChange={handleChange}
              value={applicationData.contactInformation.phoneNumber || ""}
              required
            />
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">E-posta</span>
            </div>
            <input
              type="email"
              name="email"
              className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
              onChange={handleChange}
              value={applicationData.contactInformation.email || ""}
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">Şehir:</span>
            </div>
            <select
              name="city"
              className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
              onChange={handleChange}
              value={applicationData.contactInformation.city || ""}
              required
            >
              <option value="" >
                Seçiniz
              </option>
              {/* {cities.map((city) => (
                <option>{city}</option>
              ))} */}
              {cities.map((city) => (
                <option key={city["id"]} value={city["name"]}>
                  {city["name"]}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">İlçe:</span>
            </div>
            <select
              name="districts"
              className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
              onChange={handleChange}
              value={applicationData.contactInformation.districts || ""}
              required
            >
              <option value="" >
                Seçiniz
              </option>
              {/* {cities.map((city) => (
                <option>{city}</option>
              ))} */}
              {districts.map((district) => (
                <option key={district["id"]} value={district["name"]}>
                  {district["name"]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <div>
            <div className="mb-2">
              <span className="text-sm text-white">Ev Adresiniz:</span>
            </div>
            <textarea
              name="address"
              required
              className="border border-gray-300 rounded-3xl bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 h-16 w-[220px] md:w-[495px] resize-none"
              onChange={handleChange}
              value={applicationData.contactInformation.address || ""}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
