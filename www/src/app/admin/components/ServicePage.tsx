import React from "react";
import { CourierService } from "@/lib/api";

interface ServicePageProps {
  data: CourierService[];
  loading: boolean;
}

export default function ServicePage({ data, loading }: ServicePageProps) {
  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hizmet Talepleri</h2>
      <div className="text-gray-600">
        Toplam {data.length} hizmet talebi bulunmaktadır.
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500">
          Henüz hizmet talebi bulunmamaktadır.
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map((service) => (
            <div key={service.id} className="border rounded-lg p-4">
              <h3 className="font-bold">{service.companyName}</h3>
              <p>İletişim: {service.contactName} - {service.contactEmail}</p>
              <p>Durum: {service.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
