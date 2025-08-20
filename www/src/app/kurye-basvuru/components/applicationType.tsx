import { useState, useEffect } from "react";
import { ApplicationData } from "@/types";

interface ApplicationTypeProps {
  applicationData: ApplicationData;
  setApplicationData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

export default function ApplicationType({
  applicationData,
  setApplicationData,
}: ApplicationTypeProps) {
  const applicationType = applicationData.applicationType;

  // Default state for exist is false
  const [exist, setExist] = useState(false);
  const [vehicle, setVehicle] = useState({
    exist: false,
    vehicleType: "Motosiklet",
    model: null as string | null,
    motorcycleType: null as string | null,
  });

  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "workPeriod") {
      setApplicationData((prevData) => ({
        ...prevData,
        applicationType: { ...prevData.applicationType, [name]: value },
      }));
    } else {
      console.log(name);
      console.log(value);

      const updatedExist = name === "exist" ? value === "true" : exist;
      setExist(updatedExist);
      console.log(updatedExist);

      const updatedVehicleType =
        name === "vehicleType" ? value : vehicle.vehicleType;
      const updatedModel = name === "model" ? value : vehicle.model;
      const updatedMotorcycleType =
        name === "motorcycleType" ? value : vehicle.motorcycleType;

      setExist(updatedExist);
      updateVehicleState(
        updatedVehicleType,
        updatedExist,
        updatedModel,
        updatedMotorcycleType
      );
    }
  };

  const updateVehicleState = (vehicleType: string, exist: boolean, model: string | null, motorcycleType: string | null) => {
    let updatedVehicle = {
      exist,
      vehicleType,
      model: model,
      motorcycleType: motorcycleType
    };

    if (vehicleType === "Motosiklet") {
      if (exist) {
        setApplicationData((prevData) => ({
          ...prevData,
          applicationType: {
            workPeriod: prevData.applicationType.workPeriod,
            exist,
            vehicleType,
            model,
          },
        }));
      } else {
        setApplicationData((prevData) => ({
          ...prevData,
          applicationType: {
            workPeriod: prevData.applicationType.workPeriod,
            exist,
            vehicleType,
            motorcycleType,
          },
        }));
      }
    } else {
      updatedVehicle.model = model;
      setApplicationData((prevData) => ({
        ...prevData,
        applicationType: {
          workPeriod: prevData.applicationType.workPeriod,
          exist,
          vehicleType,
          model,
        },
      }));
    }

    console.log(updatedVehicle);

    setVehicle(updatedVehicle);
    setApplicationData((prevData) => ({
      ...prevData,
      applicationType: { ...prevData.applicationType, ...updatedVehicle },
    }));
  };

  return (
    <section
      id={"applicationType"}
      className="min-w-[300px] sm:w-[50%] md:w-[600px] max-w-[600px] min-h-[470px] md:min-h-[280px] bg-[#333] rounded-2xl p-6"
    >
      <div className="flex flex-col justify-center items-center h-full">
        <div className="text-2xl text-white mb-6 font-semibold">
          Başvuru Tipi
        </div>
        <div className="mx-auto w-[90%] h-0.5 bg-white mb-4" />
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">Araç Tipi:</span>
            </div>
            <select
              name="vehicleType"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={handleChangeType}
              value={applicationType.vehicleType || ""}
            >
              <option value="" disabled >
                Seçiniz
              </option>
              <option value="Motosiklet">Motosiklet</option>
              <option value="Araç/Minivan">Araç/Minivan</option>
              <option value="Panelvan">Panelvan</option>
              <option value="Kamyonet">Kamyonet</option>
            </select>
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">Çalışma Dönemi:</span>
            </div>
            <select
              name="workPeriod"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={handleChangeType}
              value={applicationType.workPeriod || ""}
            >
              <option value="" disabled >
                Seçiniz
              </option>
              <option value="Tam Zamanlı">Tam Zamanlı</option>
              <option value="Part Time">Part Time</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-white text-sm">Araç Sahipliği:</span>
            </div>
            <select
              name="exist"
              className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={handleChangeType}
              value={exist ? "true" : "false"}
            >
              <option value="" disabled >
                Seçiniz
              </option>
              <option value="false">Aracım yok</option>
              <option value="true">Aracım var</option>
            </select>
          </div>

          {applicationType.vehicleType === "Motosiklet" && !exist ? (
            <div className="w-[220px]">
              <div className="mb-2">
                <span className="text-white text-sm">Motosiklet Türü:</span>
              </div>
              <select
                name="motorcycleType"
                className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                onChange={handleChangeType}
                value={applicationType.vehicleType === "Motosiklet" ? (applicationType as any).motorcycleType || "" : ""}
              >
                <option value="" disabled >
                  Seçiniz
                </option>
                <option value="Benzinli Motosiklet">Benzinli Motosiklet</option>
                <option value="Elektrikli Motosiklet">
                  Elektrikli Motosiklet
                </option>
                <option value="50 cc Motosiklet">50 cc Motosiklet</option>
              </select>
            </div>
          ) : (
            exist && (
              <div className="w-[220px]">
                <div className="mb-2">
                  <span className="text-white text-sm">
                    Araç Marka/Model:
                  </span>
                </div>
                <input
                  type="text"
                  name="model"
                  className="border border-gray-300 rounded-full w-full h-12 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  onChange={handleChangeType}
                  value={(applicationType as any).model || ""}
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
