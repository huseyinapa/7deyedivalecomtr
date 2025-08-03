import { ApplicationData } from "@/types";

interface PersonalInformationProps {
  applicationData: ApplicationData;
  setApplicationData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

export default function PersonalInformation({
  applicationData,
  setApplicationData,
}: PersonalInformationProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(value);
    setApplicationData((prevData) => ({
      ...prevData,
      personalInformation: { ...prevData.personalInformation, [name]: value },
    }));
  };

  return (
    <section
      id={"personalInformation"}
      className="min-w-[300px] sm:w-[50%] md:w-[600px] max-w-[600px] min-h-[1050px] md:min-h-[550px] bg-[#333] rounded-2xl p-6"
    >
      <div className="flex flex-col justify-center items-center h-full">
        <div className="text-2xl text-white mb-6 font-semibold">
          Kişisel Bilgiler
        </div>
        <div className="mx-auto w-[90%] h-0.5 bg-white mb-4" />
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">İsim</span>
            </div>
            <input
              type="text"
              name="firstName"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={handleChange}
              value={applicationData.personalInformation.firstName || ""}
              required
            />
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">Soyisim</span>
            </div>
            <input
              type="text"
              name="lastName"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={handleChange}
              value={applicationData.personalInformation.lastName || ""}
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">Uyruğunuz:</span>
            </div>
            <select
              name="nationality"
              className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
              onChange={handleChange}
              value={applicationData.personalInformation.nationality || ""}
              required
            >
              <option value="" disabled>
                Seçiniz
              </option>
              <option value="Türk">Türk</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          {
            applicationData.personalInformation.nationality === "Türk" && (
              <div className="w-[220px]">
                <div className="mb-2">
                  <span className="text-sm text-white">T.C Kimlik No</span>
                </div>
                <input
                  type="text"
                  name="idNumber"
                  className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
                  onChange={handleChange}
                  value={applicationData.personalInformation.idNumber || ""}
                  required
                />
              </div>
            )}
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">Cinsiyet</span>
            </div>
            <select
              name="gender"
              className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
              onChange={handleChange}
              value={applicationData.personalInformation.gender || ""}
              required
            >
              <option value="" disabled>
                Seçiniz
              </option>
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
            </select>
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">Doğum Tarihi</span>
            </div>
            <input
              type="date"
              name="birthDate"
              className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
              onChange={handleChange}
              value={applicationData.personalInformation.birthDate || ""}
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">Medeni Durum:</span>
            </div>
            <select
              name="maritalStatus"
              className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
              onChange={handleChange}
              value={applicationData.personalInformation.maritalStatus || ""}
              required
            >
              <option value="" disabled>
                Seçiniz
              </option>
              <option value="Evli">Evli</option>
              <option value="Bekar">Bekar</option>
            </select>
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">Askerlik Durumu:</span>
            </div>
            <select
              name="militaryStatus"
              className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
              onChange={handleChange}
              value={applicationData.personalInformation.militaryStatus || ""}
              required
            >
              <option value="" disabled>
                Seçiniz
              </option>
              <option value="Yapıldı">Yapıldı</option>
              <option value="Yapılmadı">Yapılmadı</option>
              <option value="Muaf">Muaf</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">Eğitim Durumu:</span>
            </div>
            <select
              name="education"
              className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
              onChange={handleChange}
              value={applicationData.personalInformation.education || ""}
              required
            >
              <option value="" disabled>
                Seçiniz
              </option>
              <option value="İlkokul">İlkokul</option>
              <option value="Ortaokul">Ortaokul</option>
              <option value="Lise">Lise</option>
              <option value="Üniversite">Üniversite</option>
              <option value="Yüksek Lisans">Yüksek Lisans</option>
              <option value="Doktora">Doktora</option>
            </select>
          </div>

          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">Ehliyet Sınıfı:</span>
            </div>
            <select
              name="licenseClass"
              className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
              onChange={handleChange}
              value={applicationData.personalInformation.licenseClass || ""}
              required
            >
              <option value="" disabled>
                Seçiniz
              </option>
              <option value="A">A</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
