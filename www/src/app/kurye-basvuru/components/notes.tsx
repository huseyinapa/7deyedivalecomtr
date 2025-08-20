import { useState, useEffect } from "react";
import { ApplicationData } from "@/types";

interface NotesProps {
  notesRef: React.RefObject<HTMLDivElement>;
  applicationData: ApplicationData;
  setApplicationData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

export default function Notes({
  notesRef,
  applicationData,
  setApplicationData,
}: NotesProps) {
  const [notes, setNotes] = useState(applicationData.notes);

  useEffect(() => {
    setApplicationData((prevData) => ({
      ...prevData,
      notes: notes,
    }));
  }, [notes, setApplicationData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNotes((prevNotes) => ({
      ...prevNotes,
      [name]: value,
    }));
  };

  return (
    <section
      ref={notesRef}
      className="card min-w-[300px] sm:w-[50%] md:w-[600px] max-w-[600px] min-h-[500px] md:min-h-[400px] bg-[#333] rounded-2xl p-4"
    >
      <div className="flex flex-col justify-center items-center h-full ">
        <div className="text-2xl font-semibold text-white justify-start mb-2">
          Notlar
        </div>
        <div className="mx-auto w-[90%] h-0.5 bg-white gap-4" />
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">
                Varsa Referans:
              </span>
            </div>
            <input
              type="text"
              placeholder="Referans Adı"
              name="referenceName"
              className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
              value={notes.referenceName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="w-[220px]">
            <div className="mb-2">
              <span className="text-sm text-white">
                Referansın Çalıştığı Bölge:
              </span>
            </div>
            <input
              type="text"
              placeholder="Bölge"
              name="referenceArea"
              className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 bg-white rounded-full text-gray-900"
              value={notes.referenceArea || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-4">
          <div className="w-[220px] md:w-[495px]">
            <div className="mb-2">
              <span className="text-sm text-white">
                Bizi Nereden Duydunuz:
              </span>
            </div>
            <select
              className="border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-full h-12 text-gray-900"
              name="heardFrom"
              value={notes.heardFrom || ""}
              onChange={handleChange}
            >
              <option value="">Seçiniz</option>
              <option value="Arkadaş">Arkadaş</option>
              <option value="İnternet">İnternet</option>
              <option value="Sosyal Medya">Sosyal Medya</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <div>
            <div className="mb-2">
              <span className="text-sm text-white">Notlar:</span>
            </div>
            <textarea
              placeholder="Doldurduğunuz bilgiler dışında özgeçmişinize eklemek istediğiniz bilgiler varsa bu alana yazabilirsiniz."
              name="note"
              className="border border-gray-300 rounded-3xl bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 h-20 w-[220px] md:w-[495px] resize-none"
              value={notes.note || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
