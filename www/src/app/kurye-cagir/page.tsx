"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import uid from "@/utils/uid";
import { useCallCourierMutations } from "@/hooks/useCallCourier";
import { SenderInfo, ReceiverInfo, PackageDetails as PackageDetailsType } from "@/types/courier/call";
import { ValidationResult } from "@/types";
import { PackageDetails } from "./components/packageDetails";
import AddressSelector from "./components/AddressSelector";

export default function PackageForm() {
  const { createCallCourier } = useCallCourierMutations();

  const initialSenderInfo: SenderInfo = {
    name: "",
    phone: "",
    address: "",
  };

  const initialReceiverInfo: ReceiverInfo = {
    name: "",
    phone: "",
    address: "",
  };

  const initialPackageDetails: PackageDetailsType = {
    description: "",
    width: 0,
    height: 0,
    length: 0,
    weight: 0,
    value: 0,
  };

  const [senderInfo, setSenderInfo] = useState<SenderInfo>(initialSenderInfo);
  const [receiverInfo, setReceiverInfo] = useState<ReceiverInfo>(initialReceiverInfo);
  const [packageDetails, setPackageDetails] = useState<PackageDetailsType>(initialPackageDetails);

  const [selectedAddressType, setSelectedAddressType] = useState<string>("");
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isAddressSelectorOpen) {
      // Disable scroll when the address selector is open
      document.body.style.overflow = "hidden";
    } else {
      // Enable scroll when the address selector is closed
      document.body.style.overflow = "auto";
    }
  }, [isAddressSelectorOpen]);

  const validateForm = (): ValidationResult => {
    // Sender info validation
    if (!senderInfo.name.trim()) {
      return {
        status: false,
        reason: "Gönderici isim soyisim gerekli",
        ref: "senderInfo",
      };
    }
    if (!senderInfo.phone.trim()) {
      return {
        status: false,
        reason: "Gönderici telefon numarası gerekli",
        ref: "senderInfo",
      };
    }
    if (!senderInfo.address.trim()) {
      return {
        status: false,
        reason: "Gönderici adresi gerekli",
        ref: "senderInfo",
      };
    }

    // Receiver info validation
    if (!receiverInfo.name.trim()) {
      return {
        status: false,
        reason: "Alıcı isim soyisim gerekli",
        ref: "receiverInfo",
      };
    }
    if (!receiverInfo.phone.trim()) {
      return {
        status: false,
        reason: "Alıcı telefon numarası gerekli",
        ref: "receiverInfo",
      };
    }
    if (!receiverInfo.address.trim()) {
      return {
        status: false,
        reason: "Alıcı adresi gerekli",
        ref: "receiverInfo",
      };
    }

    // Package details validation
    if (!packageDetails.weight || packageDetails.weight <= 0) {
      return {
        status: false,
        reason: "Paket ağırlığı gerekli",
        ref: "packageDetails",
      };
    }

    // Phone number format validation (Turkish format)
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    if (!phoneRegex.test(senderInfo.phone.replace(/\s/g, ""))) {
      return {
        status: false,
        reason: "Gönderici telefon numarası geçerli formatta olmalı",
        ref: "senderInfo",
      };
    }
    if (!phoneRegex.test(receiverInfo.phone.replace(/\s/g, ""))) {
      return {
        status: false,
        reason: "Alıcı telefon numarası geçerli formatta olmalı",
        ref: "receiverInfo",
      };
    }

    return {
      status: true,
      reason: "Form gönderme işlemi başarılı.",
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateForm();

    if (!validation.status) {
      return toast.error(validation.reason);
    }

    try {
      const createCallUID = uid.createCallUID();

      const callPayload = {
        uid: createCallUID,
        senderName: senderInfo.name,
        senderPhone: senderInfo.phone,
        senderAddress: senderInfo.address,
        receiverName: receiverInfo.name,
        receiverPhone: receiverInfo.phone,
        receiverAddress: receiverInfo.address,
        packageDescription: packageDetails.description || "",
        packageWeight: Number(packageDetails.weight) || 0,
        packageValue: Number(packageDetails.value) || 0,
        notes: `Boyutlar: ${Number(packageDetails.length) || 0}x${Number(packageDetails.width) || 0}x${Number(packageDetails.height) || 0}`,
      };

      const data = await createCallCourier(callPayload);

      if (data) {
        toast.success("Bilgiler kaydedildi. En yakın zamanda dönüş yapılacaktır.");
        setSenderInfo(initialSenderInfo);
        setReceiverInfo(initialReceiverInfo);
        setPackageDetails(initialPackageDetails);
      }
    } catch (error: any) {
      console.error("Call courier error:", error);
      toast.error(error?.response?.data?.message || "Kurye çağırma işleminde hata oluştu");
    }
  };

  const openAddressSelector = (addressType: string) => {
    setSelectedAddressType(addressType);
    setIsAddressSelectorOpen(true);
  };

  const closeAddressSelector = () => {
    setIsAddressSelectorOpen(false);
  };

  const handleAddressSelect = (address: string, addressType: string) => {
    if (addressType === "sender") {
      setSenderInfo({ ...senderInfo, address });
    } else if (addressType === "receiver") {
      setReceiverInfo({ ...receiverInfo, address });
    }
    setIsAddressSelectorOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string, field: string) => {
    const value = e.target.value;

    if (type === "sender") {
      setSenderInfo({ ...senderInfo, [field]: value });
    } else if (type === "receiver") {
      setReceiverInfo({ ...receiverInfo, [field]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="bottom-right" />

      <title>7de Yedi Vale - Hemen Kurye Çağırın</title>

      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          className="flex flex-col items-center justify-center gap-4 bg-white p-4 rounded-lg shadow-[#333] shadow-[0_0_5px_0] w-[650px]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold">Kurye Çağır</h2>

          <div className="border-b border-gray-300 font-semibold text-lg text-[#333] pb-2 mb-4">
            Gönderici Bilgileri
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-row justify-between items-center w-[600px]">
              <label className="block space-y-2 w-[280px]">
                <span className="text-base text-black">
                  İsim Soyisim:
                </span>
                <input
                  type="text"
                  name="senderName"
                  className="border border-gray-300 rounded-full w-full bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={senderInfo.name}
                  onChange={(e) => handleInputChange(e, "sender", "name")}
                // required
                />
              </label>

              <label className="block space-y-2 w-[280px]">
                <span className="text-base text-black">
                  Telefon Numarası:
                </span>
                <input
                  type="tel"
                  name="senderPhone"
                  className="border border-gray-300 rounded-full w-full bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={senderInfo.phone}
                  onChange={(e) =>
                    handleInputChange(e, "sender", "phone")
                  }
                // required
                />
              </label>
            </div>
            <div className="flex justify-center items-center">
              <div className="border border-gray-300 rounded-3xl flex justify-center items-center gap-2 bg-white px-4 py-2">
                <div
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full cursor-pointer transition-colors"
                  onClick={() => openAddressSelector("sender")}
                >
                  <a className="">Harita</a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"></path>
                    <path d="M11.42 21.814a.998.998 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819zM12 4c3.309 0 6 2.691 6 6.005.021 4.438-4.388 8.423-6 9.73-1.611-1.308-6.021-5.294-6-9.735 0-3.309 2.691-6 6-6z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  name="senderAddress"
                  placeholder="Gönderici Adresi"
                  className="w-[459px]"
                  value={senderInfo.address}
                  onChange={(e) => handleInputChange(e, "sender", "address")}
                // required
                />
              </div>
            </div>
          </div>
          <div className="border-b border-gray-300 font-semibold text-lg text-[#333] pb-2 mb-4">
            Alıcı Bilgileri
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-row justify-between items-center w-[600px]">
              <label className="block space-y-2 w-[292px]">
                <span className="text-base text-black">
                  İsim Soyisim:
                </span>
                <input
                  type="text"
                  name="receiverName"
                  className="border border-gray-300 rounded-full w-full bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={receiverInfo.name}
                  onChange={(e) => handleInputChange(e, "receiver", "name")}
                // required
                />
              </label>

              <label className="block space-y-2 w-[292px]">
                <span className="text-base text-black">
                  Telefon Numarası:
                </span>
                <input
                  type="tel"
                  name="receiverPhone"
                  className="border border-gray-300 rounded-full w-full bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={receiverInfo.phone}
                  onChange={(e) =>
                    handleInputChange(e, "receiver", "phone")
                  }
                // required
                />
              </label>
            </div>
            <div className="flex justify-center items-center">
              <div className="border border-gray-300 rounded-3xl flex items-center gap-2 bg-white px-4 py-2">
                <div
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full cursor-pointer transition-colors"
                  onClick={() => openAddressSelector("receiver")}
                >
                  <a className="">Harita</a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"></path>
                    <path d="M11.42 21.814a.998.998 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819zM12 4c3.309 0 6 2.691 6 6.005.021 4.438-4.388 8.423-6 9.73-1.611-1.308-6.021-5.294-6-9.735 0-3.309 2.691-6 6-6z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  name="receiverAddress"
                  placeholder="Alıcı Adresi"
                  className="grow w-[459px]"
                  value={receiverInfo.address}
                  onChange={(e) => handleInputChange(e, "receiver", "address")}
                // required
                />
              </div>
            </div>
          </div>
          <PackageDetails
            packageDetails={packageDetails}
            setPackageDetails={setPackageDetails}
          />
          <button
            type="submit"
            className="w-full bg-[#333] text-white p-2 rounded-3xl mt-4 px-4 py-2 font-medium transition-colors hover:bg-gray-700"
          >
            Gönder
          </button>
        </form>
        {isAddressSelectorOpen && (
          <AddressSelector
            onClose={closeAddressSelector}
            onSelectAddress={handleAddressSelect}
            addressType={selectedAddressType}
          />
        )}
      </div>
    </div>
  );
}
