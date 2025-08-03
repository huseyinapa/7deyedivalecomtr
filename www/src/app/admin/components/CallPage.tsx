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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Çağrılar</h2>
      <div className="text-gray-600">
        Toplam {data.length} çağrı bulunmaktadır.
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500">
          Henüz çağrı bulunmamaktadır.
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map((call) => (
            <div key={call.id} className="border rounded-lg p-4">
              <h3 className="font-bold">{call.senderName}</h3>
              <p>Telefon: {call.senderPhone}</p>
              <p>Alış: {call.senderAddress}</p>
              <p>Varış: {call.receiverAddress}</p>
              <p>Durum: {call.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
