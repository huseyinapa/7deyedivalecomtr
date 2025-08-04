"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import ContactInformation from "./components/contactInfo";
import CompanyInformation from "./components/companyInfo";
import { useCourierServiceMutations } from "@/hooks/useCourierService";
import { useRateLimit } from "@/hooks/useRateLimit";
import { RateLimitWarning } from "@/components/ui/RateLimitWarning";
import { CreateCourierServiceDto } from "@/lib/api";

interface ServiceContactInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  district: string;
}

interface ServiceCompanyInfo {
  sector: string;
  companyName: string;
  branchCount: string;
  startDate: string;
  dailyDeliveryCount: string;
  monthlyDeliveryCount: string;
  courierCount: string;
  workingHours: string;
}

interface ServiceFormData {
  contactInfo: ServiceContactInfo;
  companyInfo: ServiceCompanyInfo;
}

interface ValidationResult {
  status: boolean;
  reason: string;
  ref?: string;
}

export default function Page(): JSX.Element {
  const { createService } = useCourierServiceMutations();
  const {
    rateLimitInfo,
    handleRateLimitError,
    clearRateLimit,
    showRateLimitWarning
  } = useRateLimit();

  const initialFormData: ServiceFormData = {
    contactInfo: {
      fullName: "",
      phoneNumber: "",
      email: "",
      city: "",
      district: "",
    },
    companyInfo: {
      sector: "",
      companyName: "",
      branchCount: "",
      startDate: "",
      dailyDeliveryCount: "",
      monthlyDeliveryCount: "",
      courierCount: "",
      workingHours: "",
    },
  };

  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section: keyof ServiceFormData) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const validateForm = (): ValidationResult => {
    const { contactInfo, companyInfo } = formData;

    // Check for empty fields in contactInfo
    for (const key in contactInfo) {
      const value = contactInfo[key as keyof ServiceContactInfo];
      if (!value || value.toString().trim() === "") {
        return {
          status: false,
          reason: "İletişim bilgileri bölümünü tekrar kontrol ediniz.",
          ref: "contactInfo",
        };
      }
    }

    // Check for empty fields in companyInfo (startDate has special handling)
    for (const key in companyInfo) {
      const value = companyInfo[key as keyof ServiceCompanyInfo];
      if (!value || value.toString().trim() === "" || value === "Tarih seçin") {
        return {
          status: false,
          reason: "Firma bilgileri bölümünü tekrar kontrol ediniz.",
          ref: "companyInfo",
        };
      }
    }

    return {
      status: true,
      reason: "Form gönderme işlemi başarılı.",
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateForm();

    if (validation.status) {
      try {
        const serviceData: CreateCourierServiceDto = {
          companyName: formData.companyInfo.companyName,
          contactName: formData.contactInfo.fullName,
          contactEmail: formData.contactInfo.email,
          contactPhone: formData.contactInfo.phoneNumber,
          sector: formData.companyInfo.sector,
          branchCount: parseInt(formData.companyInfo.branchCount) || undefined,
          startDate: formData.companyInfo.startDate !== "Tarih seçin" ? formData.companyInfo.startDate : undefined,
          courierCount: parseInt(formData.companyInfo.courierCount) || undefined,
          city: formData.contactInfo.city,
          district: formData.contactInfo.district,
        };

        const result = await createService(serviceData);

        toast.success("Başvurunuz başarıyla gönderildi!");
        setFormData(initialFormData);
        clearRateLimit(); // Rate limit durumunu temizle
        console.log("Service created:", result);
      } catch (error: any) {
        console.error("Service creation error:", error);

        // Rate limiting error handling
        if (error?.response?.status === 429) {
          handleRateLimitError(error);
        } else {
          toast.error(error.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
        }
      }
    } else {
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
      console.warn("Validation failed:", validation.reason);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="bottom-right" reverseOrder={false} />

      <title>7de Yedi Vale - İşletmeniz için Kurye Hizmeti Alın</title>

      <div className="flex flex-col justify-start items-start p-4 h-[190px] bg-[#EDC81E] gap-3">
        <div className="text-4xl font-bold ml-8">KOBİ Başvuru</div>
        <div className="text-lg font-medium ml-8">
          Kurye ihtiyaçlarınız için formu doldurun gerisini bize bırakın :)
        </div>
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

        <ContactInformation onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleChange(e, "contactInfo")} />
        <CompanyInformation onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => handleChange(e, "companyInfo")} />
        <button
          type="submit"
          disabled={rateLimitInfo.isLimited}
          className={`w-52 lg:w-[20%] xl:w-[21%] 2xl:w-[22%] min-[2000px]:w-[450px] rounded-3xl px-4 py-2 font-medium transition-colors ${rateLimitInfo.isLimited
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-[#333] text-white hover:bg-gray-700'
            }`}
        >
          {rateLimitInfo.isLimited ? 'Geçici olarak kısıtlandı' : 'Başvuruyu Gönder'}
        </button>
      </form>
    </div>
  );
}
