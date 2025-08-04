"use client";

import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import ApplicationType from "./components/applicationType";
import PersonalInformation from "./components/personalInformation";
import ContactInformation from "./components/contactInfo";
import JobExperience from "./components/jobExperience";
import Notes from "./components/notes";
import uid from "@/utils/uid";
import { useCourierApplicationMutations } from "@/hooks/useCourierApplication";
import { useRateLimit } from "@/hooks/useRateLimit";
import { RateLimitWarning } from "@/components/ui/RateLimitWarning";
import { ApplicationData, ValidationResult } from "@/types";

export default function Page(): JSX.Element {
  const { createApplication } = useCourierApplicationMutations();
  const {
    rateLimitInfo,
    handleRateLimitError,
    clearRateLimit,
    showRateLimitWarning
  } = useRateLimit();

  const initialApplicationData: ApplicationData = {
    applicationType: {
      workPeriod: null,
      exist: false,
      vehicleType: null,
    },
    personalInformation: {
      firstName: null,
      lastName: null,
      nationality: null,
      idNumber: null,
      gender: null,
      birthDate: null,
      maritalStatus: null,
      militaryStatus: null,
      education: null,
      licenseClass: null,
    },
    contactInformation: {
      phoneNumber: null,
      email: null,
      city: null,
      districts: null,
      address: null,
    },
    jobExperiences: {
      courierExperience: "",
      workExperiences: "",
      workplaces: [],
    },
    notes: {
      referenceName: "",
      referenceArea: "",
      heardFrom: "",
      note: "",
    },
  };

  const [applicationData, setApplicationData] = useState<ApplicationData>(initialApplicationData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);

  const validateForm = (): ValidationResult => {
    // Application Type validation
    if (!applicationData.applicationType.workPeriod) {
      return { status: false, reason: "Çalışma süresi gerekli", ref: "workPeriod" };
    }
    if (!applicationData.applicationType.vehicleType) {
      return { status: false, reason: "Araç tipi seçimi gerekli", ref: "vehicleType" };
    }

    // Personal Information validation
    if (!applicationData.personalInformation.firstName) {
      return { status: false, reason: "İsim gerekli", ref: "firstName" };
    }
    if (!applicationData.personalInformation.lastName) {
      return { status: false, reason: "Soyisim gerekli", ref: "lastName" };
    }
    if (!applicationData.personalInformation.nationality) {
      return { status: false, reason: "Uyruk bilgisi gerekli", ref: "nationality" };
    }
    if (!applicationData.personalInformation.idNumber) {
      return { status: false, reason: "TC Kimlik No gerekli", ref: "idNumber" };
    }
    if (!applicationData.personalInformation.gender) {
      return { status: false, reason: "Cinsiyet seçimi gerekli", ref: "gender" };
    }
    if (!applicationData.personalInformation.birthDate) {
      return { status: false, reason: "Doğum tarihi gerekli", ref: "birthDate" };
    }

    // Contact Information validation
    if (!applicationData.contactInformation.phoneNumber) {
      return { status: false, reason: "Telefon numarası gerekli", ref: "phoneNumber" };
    }
    if (!applicationData.contactInformation.email) {
      return { status: false, reason: "E-posta adresi gerekli", ref: "email" };
    }
    if (!applicationData.contactInformation.city) {
      return { status: false, reason: "Şehir bilgisi gerekli", ref: "city" };
    }
    if (!applicationData.contactInformation.districts) {
      return { status: false, reason: "İlçe bilgisi gerekli", ref: "districts" };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.contactInformation.email || "")) {
      return { status: false, reason: "Geçerli bir e-posta adresi giriniz", ref: "email" };
    }

    // Phone number validation (Turkish format)
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    if (!phoneRegex.test(applicationData.contactInformation.phoneNumber?.replace(/\s/g, "") || "")) {
      return { status: false, reason: "Geçerli bir telefon numarası giriniz", ref: "phoneNumber" };
    }

    // TC Kimlik No validation (basic 11 digit check)
    const tcRegex = /^[1-9][0-9]{10}$/;
    if (!tcRegex.test(applicationData.personalInformation.idNumber || "")) {
      return { status: false, reason: "Geçerli bir TC Kimlik No giriniz", ref: "idNumber" };
    }

    return { status: true, reason: "Başvuru başarıyla gönderildi!" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const validation = validateForm();
      if (!validation.status) {
        toast.error(validation.reason);

        if (typeof document !== "undefined") {
          const section = document.getElementById(validation.ref || "");
          if (section) {
            window.scrollTo({
              top: section.offsetTop,
              behavior: "smooth",
            });
          }
        }
        return;
      }

      const createApplicationUID = uid.createApplicationUID();

      const applicationPayload = {
        uid: createApplicationUID,
        firstName: applicationData.personalInformation.firstName || "",
        lastName: applicationData.personalInformation.lastName || "",
        email: applicationData.contactInformation.email || "",
        phone: applicationData.contactInformation.phoneNumber || "",
        city: applicationData.contactInformation.city || "",
        district: applicationData.contactInformation.districts || "",
        address: applicationData.contactInformation.address || "",
        birthDate: applicationData.personalInformation.birthDate || "",
        gender: applicationData.personalInformation.gender || "",
        nationality: applicationData.personalInformation.nationality || "",
        idNumber: applicationData.personalInformation.idNumber || "",
        maritalStatus: applicationData.personalInformation.maritalStatus || "",
        militaryStatus: applicationData.personalInformation.militaryStatus || "",
        education: applicationData.personalInformation.education || "",
        licenseClass: applicationData.personalInformation.licenseClass || "",
        vehicleType: applicationData.applicationType.vehicleType || "",
        workPeriod: applicationData.applicationType.workPeriod || "",
        hasVehicle: applicationData.applicationType.exist,
        courierExperience: applicationData.jobExperiences.courierExperience || "",
        workExperiences: applicationData.jobExperiences.workExperiences || "",
        references: `${applicationData.notes.referenceName} - ${applicationData.notes.referenceArea}`,
        notes: `Nereden duydunuz: ${applicationData.notes.heardFrom}\nNotlar: ${applicationData.notes.note}`,
      };

      const data = await createApplication(applicationPayload);

      if (data) {
        toast.success(validation.reason);
        // Reset form
        setApplicationData(initialApplicationData);
        clearRateLimit(); // Rate limit durumunu temizle
      } else {
        toast.error("Başvuru gönderilirken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Başvuru hatası:", error);

      // Rate limiting error handling
      if (error?.response?.status === 429) {
        handleRateLimitError(error);
      } else {
        toast.error(error?.response?.data?.message || "Başvuru gönderilirken bir hata oluştu");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="bottom-right" reverseOrder={false} />
      <title>7de Yedi Vale - Kurye Başvuru</title>

      <div className="relative flex flex-col justify-start items-start p-4 h-[190px] bg-[#EDC81E] gap-3">
        <div className="text-4xl font-bold ml-8">Kurye Başvuru</div>
        <div className="text-lg font-medium ml-8">
          Kurye ihtiyaçlarınız için formu doldurun gerisini bize bırakın :)
        </div>
        <img
          src="/assets/motor.png"
          className="absolute bottom-0 right-80 h-[150px] object-contain"
          alt="Motor"
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center w-[100%] py-12 gap-14"
      >
        {/* Rate Limit Warning */}
        {rateLimitInfo.isLimited && (
          <div className="w-full max-w-md">
            <RateLimitWarning rateLimitInfo={rateLimitInfo} />
          </div>
        )}

        <ApplicationType
          applicationData={applicationData}
          setApplicationData={setApplicationData}
        />
        <PersonalInformation
          applicationData={applicationData}
          setApplicationData={setApplicationData}
        />
        <ContactInformation
          applicationData={applicationData}
          setApplicationData={setApplicationData}
        />
        <JobExperience
          applicationData={applicationData}
          setApplicationData={setApplicationData}
        />
        <Notes
          notesRef={notesRef}
          applicationData={applicationData}
          setApplicationData={setApplicationData}
        />
        <button
          type="submit"
          disabled={isSubmitting || rateLimitInfo.isLimited}
          className={`w-52 lg:w-[20%] xl:w-[21%] 2xl:w-[22%] min-[2000px]:w-[450px] text-white rounded-3xl px-4 py-2 font-medium transition-colors ${isSubmitting || rateLimitInfo.isLimited
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#333] hover:bg-gray-700'
            }`}
        >
          {isSubmitting
            ? 'Gönderiliyor...'
            : rateLimitInfo.isLimited
              ? 'Geçici olarak kısıtlandı'
              : 'Başvur'
          }
        </button>
      </form>
    </div>
  );
}
