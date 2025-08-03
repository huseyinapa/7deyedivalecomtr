import { useEffect, useState } from "react";

interface ContactInformationProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any, section?: string) => void;
}

export default function ContactInformation({ onChange }: ContactInformationProps) {
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchDistricts(selectedCity);
    }
  }, [selectedCity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "city") {
      setSelectedCity(value);
    }

    onChange(e, "contactInfo");
  };

  async function fetchCities() {
    const response = await fetch("/api/turkiye");
    const data = await response.json();
    const sortedCities = data.data
      .slice()
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
    setCities(sortedCities);
  }

  async function fetchDistricts(cityName: string) {
    const city = cities.find((c: any) => c.name === cityName);
    if (city) {
      setDistricts(city.districts || []);
    }
  }

  return (
    <section
      id="contactInfo"
      className="min-w-[300px] sm:w-[50%] md:w-[600px] max-w-[600px] min-h-[470px] md:min-h-[300px] bg-[#333] rounded-2xl p-6"
    >
      <div className="flex flex-col justify-center items-center h-full">
        <div className="text-2xl text-white text-center mb-6 font-semibold">
          İletişim Bilgileri
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">İsim Soyisim</span>
            </div>
            <input
              type="text"
              name="fullName"
              placeholder="7de Yedi"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">Telefon Numarası</span>
            </div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="+90 777 77 77"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">E-Posta</span>
            </div>
            <input
              type="email"
              name="email"
              placeholder="info@7deyedivale.com"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flex flex-row w-[220px] justify-between">
            <div className="w-[100px] max-w-xs">
              <div className="mb-2">
                <span className="text-white text-sm">İl Seçiniz</span>
              </div>
              <select
                name="city"
                className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                onChange={(e) => handleChange(e)}
                defaultValue=""
              >
                <option disabled value="">
                  İl
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-[100px] max-w-xs">
              <div className="mb-2">
                <span className="text-white text-sm">İlçe Seçiniz</span>
              </div>
              <select
                name="district"
                className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                onChange={(e) => handleChange(e)}
                defaultValue=""
              >
                <option disabled value="">
                  İlçe
                </option>
                {districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
