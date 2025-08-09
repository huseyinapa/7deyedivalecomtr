import React from "react";
import { CallCourier } from "@/lib/api";

interface CallPageProps {
  data: CallCourier[];
  loading: boolean;
}

export default function CallPage({ data, loading }: CallPageProps) {
  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Kurye Çağır</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gönderen</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Adres</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alıcı</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Adres</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paket</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ağırlık (kg)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Değer (₺)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data && data.length > 0 ? (
            data.map((row: any) => (
              <tr key={row.id}>
                <td className="px-4 py-2">{row.senderName}</td>
                <td className="px-4 py-2">{row.senderPhone}</td>
                <td className="px-4 py-2">{row.senderAddress}</td>
                <td className="px-4 py-2">{row.receiverName}</td>
                <td className="px-4 py-2">{row.receiverPhone}</td>
                <td className="px-4 py-2">{row.receiverAddress}</td>
                <td className="px-4 py-2">{row.packageType}</td>
                <td className="px-4 py-2">{row.weight}</td>
                <td className="px-4 py-2">{row.value}</td>
                <td className="px-4 py-2">{row.status}</td>
                <td className="px-4 py-2">{row.createdAt ? new Date(row.createdAt).toLocaleString('tr-TR') : ''}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="text-center py-4 text-gray-500">Henüz çağrı bulunmamaktadır.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
