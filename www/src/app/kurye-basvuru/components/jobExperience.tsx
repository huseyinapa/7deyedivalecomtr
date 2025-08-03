import { useState } from "react";
import { ApplicationData } from "@/types";

interface JobExperienceProps {
  applicationData: ApplicationData;
  setApplicationData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

export default function JobExperience({ applicationData, setApplicationData }: JobExperienceProps) {
  const jobExperiences = applicationData.jobExperiences;

  const [experiences, setExperiences] = useState({
    courierExperience: jobExperiences.courierExperience,
    workExperiences: jobExperiences.workExperiences,
  });

  console.log(experiences);

  // console.log(Object.values(jobExperiences.workplaces).length);

  const [workplaces, setWorkplaces] = useState(
    Object.values(jobExperiences.workplaces).length !== 0
      ? jobExperiences.workplaces
      : [
        {
          companyName: "",
          position: "",
          startDate: "",
          endDate: "",
          reasonForLeaving: "",
        },
      ]
  );

  // {
  //   companyName: "",
  //   position: "",
  //   startDate: "",
  //   endDate: "",
  //   reasonForLeaving: "",
  // },

  const handleRemoveExperience = (index: number) => {
    const newExperiences = workplaces.filter((_, i) => i !== index);
    setWorkplaces(newExperiences);
    console.log(newExperiences);

    setApplicationData((prevData) => ({
      ...prevData,
      jobExperiences: {
        ...prevData.jobExperiences,
        workplaces: newExperiences
      },
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    // if (name) {

    // }
    setExperiences((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setApplicationData((prevData) => ({
      ...prevData,
      jobExperiences: { ...prevData.jobExperiences, [name]: value },
    }));
  };

  const handleChangeExperiences = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newExperiences = workplaces.map((exp, i) =>
      i === index ? { ...exp, [name]: value } : exp
    );
    setWorkplaces(newExperiences);

    console.log(name);
    console.log(newExperiences);

    // if (name) {

    // }
    console.log(workplaces);

    setApplicationData((prevData) => ({
      ...prevData,
      jobExperiences: { ...prevData.jobExperiences, workplaces: workplaces },
    }));
  };

  const handleAddExperience = async () => {
    setWorkplaces([
      ...workplaces,
      {
        companyName: "",
        position: "",
        startDate: "",
        endDate: "",
        reasonForLeaving: "",
      },
    ]);

    console.log(workplaces);
  };

  return (
    <section id={"jobExperience"}>
      <div className="card min-w-[300px] sm:w-[50%] md:w-[600px] max-w-[600px] min-h-[470px] md:min-h-[470px] p-4 bg-[#333] rounded-2xl">
        <div className="flex flex-col justify-center items-center h-full ">
          <div className="text-2xl font-semibold text-white justify-start ml-8 mb-2">
            İş Tecrübesi
          </div>
          <div className="mx-auto w-[90%] h-0.5 bg-white" />
          <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4 mb-2">
            <div className="w-[220px]">
              <div className="mb-2">
                <span className="text-sm text-white">
                  Kuryelik Tecrübeniz:
                </span>
              </div>
              <select
                name="courierExperience"
                className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
                onChange={handleChange}
                value={experiences.courierExperience || ""}
              >
                <option value="">Tecrübem Yok</option>
                <option value="1-11 Ay">1-11 Ay</option>
                <option value="1-2 Yıl">1-2 Yıl</option>
                <option value="3-5 Yıl">3-5 Yıl</option>
                <option value="5 Yıl ve Üzeri">5 Yıl ve Üzeri</option>
              </select>
            </div>
            <div className="w-[220px]">
              <div className="mb-2">
                <span className="text-sm text-white">
                  Nerelerde Tecrübe Kazandınız?
                </span>
              </div>
              <input
                name="workExperiences"
                type="text"
                className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
                onChange={handleChange}
                value={experiences.workExperiences || ""}
              />
            </div>
          </div>
          <div className="flex flex-col w-[285px] md:w-[568px] mx-auto items-center md:justify-center gap-2">
            <h2 className="text-pretty text-white">Çalıştığınız Yerler:</h2>
            {workplaces.map((experience, index) => (
              <div
                key={index}
                className="flex w-[220px] md:w-[493px] mb-4 justify-center"
              >
                <div className="flex flex-col w-full justify-between gap-4 mb-2">
                  <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
                    <div className="w-[220px]">
                      <div className="mb-2">
                        <span className="text-sm text-white">Firma Adı</span>
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
                        value={experience.companyName || ""}
                        onChange={(e) => handleChangeExperiences(index, e)}
                      />
                    </div>
                    <div className="w-[220px]">
                      <div className="mb-2">
                        <span className="text-sm text-white">Göreviniz</span>
                      </div>
                      <input
                        type="text"
                        name="position"
                        className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
                        value={experience.position || ""}
                        onChange={(e) => handleChangeExperiences(index, e)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
                    <div className="w-[220px]">
                      <div className="mb-2">
                        <span className="text-sm text-white">
                          Başlangıç Tarihi
                        </span>
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
                        value={experience.startDate}
                        onChange={(e) => handleChangeExperiences(index, e)}
                      />
                    </div>
                    <div className="w-[220px]">
                      <div className="mb-2">
                        <span className="text-sm text-white">
                          Bitiş Tarihi
                        </span>
                      </div>
                      <input
                        type="date"
                        name="endDate"
                        className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
                        value={experience.endDate}
                        onChange={(e) => handleChangeExperiences(index, e)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-end justify-between">
                    <div>
                      <div className="mb-2">
                        <span className="text-sm text-white">
                          Ayrılma Nedeni
                        </span>
                      </div>
                      <textarea
                        name="reasonForLeaving"
                        className="border border-gray-300 rounded-3xl bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 h-16 w-[170px] md:w-[400px] max-w-lg resize-none"
                        value={experience.reasonForLeaving || ""}
                        onChange={(e) => handleChangeExperiences(index, e)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors mb-2 text-gray-700 hover:text-red-700 border border-gray-300"
                    >
                      &#x2715;
                    </button>
                  </div>
                  <div className="mx-auto w-[90%] h-0.5 bg-white m-3" />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddExperience}
              className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full border border-gray-300 text-gray-700 transition-colors"
            >
              ALAN EKLE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
