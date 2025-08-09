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
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Kurye Hizmeti Al</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Firma</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Yetkili</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Şehir</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">İlçe</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kurye Tipi</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kurye Sayısı</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data && data.length > 0 ? (
            data.map((row: any) => (
              <tr key={row.id}>
                <td className="px-4 py-2">{row.companyName}</td>
                <td className="px-4 py-2">{row.contactName}</td>
                <td className="px-4 py-2">{row.contactPhone}</td>
                <td className="px-4 py-2">{row.contactEmail}</td>
                <td className="px-4 py-2">{row.city}</td>
                <td className="px-4 py-2">{row.district}</td>
                <td className="px-4 py-2">{row.courierType}</td>
                <td className="px-4 py-2">{row.courierCount}</td>
                <td className="px-4 py-2">{row.status}</td>
                <td className="px-4 py-2">{row.createdAt ? new Date(row.createdAt).toLocaleString('tr-TR') : ''}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-4 text-gray-500">Henüz hizmet talebi bulunmamaktadır.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
