"use client";
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

interface AddressSelectorProps {
  onClose: () => void;
  onSelectAddress: (address: string, addressType: string) => void;
  addressType: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter: Coordinates = {
  lat: 37.7648, // Isparta coordinates
  lng: 30.5567, // Isparta coordinates
};

const allowedProvince = "Isparta"; // ! Array'e alınabilir, örneğin ["Isparta", "Burdur", "Antalya"]

const AddressSelector: React.FC<AddressSelectorProps> = ({
  onClose,
  onSelectAddress,
  addressType,
}) => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<Coordinates>(defaultCenter);
  const [address, setAddress] = useState<string>("");
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  const { isLoaded, loadError: mapLoadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey || "",
    language: "tr",
  });

  useEffect(() => {
    if (mapLoadError) {
      setLoadError(true);
      console.error("Google Maps failed to load:", mapLoadError);
    }
  }, [mapLoadError]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Konum alınamadığında varsayılan merkezi (Isparta) kullan
          setCenter(defaultCenter);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Geolocation desteklenmiyorsa varsayılan merkezi (Isparta) kullan
      setCenter(defaultCenter);
    }
  }, []);

  const getAddressDetails = async (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results && results[0]) {
          setAddress(results[0].formatted_address);
          checkAddressValidity(results[0].address_components);
        } else {
          setAddress("Address not found");
          setIsAddressValid(false);
        }
      } else {
        console.log("Geocoder failed due to: " + status);
        setAddress("Address not found");
        setIsAddressValid(false);
      }
    });
  };

  const checkAddressValidity = (addressComponents: AddressComponent[]) => {
    const province = addressComponents.find(
      (component) =>
        component.types.includes("administrative_area_level_1") ||
        component.types.includes("locality")
    );

    if (province && province.long_name === allowedProvince) {
      setIsAddressValid(true);
    } else {
      setIsAddressValid(false);
    }
  };

  const handleBoundsChanged = useCallback(async () => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        const lat = center.lat();
        const lng = center.lng();
        await getAddressDetails(lat, lng);
      }
    }
  }, [map]);

  const handleLoad = (map: google.maps.Map) => {
    console.log(map);
    setMap(map);

    // Harita yüklendiğinde başlangıç konumu için adres bilgisini al
    const mapCenter = map.getCenter();
    if (mapCenter) {
      getAddressDetails(mapCenter.lat(), mapCenter.lng());
    }

    // Check if the controlDiv already exists
    const existingControlDiv = document.getElementById("custom-map-control");
    if (existingControlDiv) {
      return;
    }

    // Add custom close button with SVG icon
    const controlDiv = document.createElement("div");
    controlDiv.id = "custom-map-control";
    controlDiv.style.display = "flex";
    controlDiv.style.flexDirection = "column";
    controlDiv.style.gap = "10px";

    const closeButton = document.createElement("button");
    closeButton.style.backgroundColor = "#fff";
    closeButton.style.border = "2px solid #fff";
    closeButton.style.borderRadius = "3px";
    closeButton.style.boxShadow = "0 1px 3px rgba(0,0,0,.3)";
    closeButton.style.cursor = "pointer";
    closeButton.style.textAlign = "center";
    closeButton.style.width = "40px"; // Adjust width as needed
    closeButton.style.height = "40px"; // Adjust height as needed
    closeButton.style.display = "flex";
    closeButton.style.alignItems = "center";
    closeButton.style.justifyContent = "center";
    closeButton.className = "absolute top-5 right-5";
    closeButton.title = "Haritayı kapatmak için tıkla";
    closeButton.id = "test1";

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6" style="width: 24px; height: 24px;">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    `;
    closeButton.innerHTML = svgIcon;
    closeButton.addEventListener("click", () => {
      onClose();
    });

    controlDiv.appendChild(closeButton);

    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
  };

  const handleSelect = () => {
    if (isAddressValid) {
      onSelectAddress(address, addressType);
      onClose();
    }
  };

  return !loadError && isLoaded ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex-1 w-full h-full">
        <div className="w-full h-5/6">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={handleLoad}
            onBoundsChanged={handleBoundsChanged}
            options={{
              gestureHandling: "greedy",
              fullscreenControl: false, // Disable default fullscreen button
            }}
          >
            {/* Marker is not placed here because it is supposed to be in the center of the map */}
          </GoogleMap>
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            alt="marker"
            style={{ width: 40, height: 40 }}
          />
        </div>
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white p-2 rounded shadow-md">
            <span>{address}</span>
          </div>
        </div>
        <div className="flex flex-col items-center h-5/6 p-4 bg-gray-100">
          {isAddressValid ? (
            <p>
              Haritayı hareket ettirerek, seçmek istediğiniz noktayı hedef
              işaretinin altına getirin
            </p>
          ) : (
            <p>
              Hizmetlerimiz şuan için Isparta ili ve ilçeleri ile sınırlıdır.
              Anlayışınız için teşekkür eder sizlerin destekleriyle diğer
              illerimizde görüşmek dileğiyle..
            </p>
          )}
          <button
            className={`px-8 py-3 font-semibold rounded-full transition-colors mt-2 ${isAddressValid
              ? "bg-[#333] text-white"
              : "bg-gray-300 text-gray-600"
              } p-2 rounded-3xl`}
            onClick={handleSelect}
            disabled={!isAddressValid}
          >
            Bu adresi seç
          </button>
        </div>
      </div>
    </div>
  ) : loadError ? (
    // Fallback manual address input when Google Maps fails to load
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Adres Girişi</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Harita yüklenemediği için lütfen adresinizi manuel olarak giriniz.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {addressType === "sender" ? "Gönderici Adresi" : "Alıcı Adresi"}
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Detaylı adresinizi yazınız (Sokak, mahalle, bina no vb.)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (address.trim()) {
                  onSelectAddress(address, addressType);
                  onClose();
                }
              }}
              disabled={!address.trim()}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${address.trim()
                ? "bg-[#333] text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Adresi Kullan
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#333]"></div>
          <span>Harita yükleniyor...</span>
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;
