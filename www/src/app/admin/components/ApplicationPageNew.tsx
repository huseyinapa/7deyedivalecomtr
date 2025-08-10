"use client";

import { useState, useMemo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import toast from "react-hot-toast";
import { useAdminApplications, useAdminApplicationMutations } from "@/hooks/useCourierApplication";
import type { ApplicationFilters } from "@/lib/api/admin.service";
import type { CourierApplication } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ExtendedCourierApplication extends CourierApplication {
  age?: number;
  experience?: string;
  licenseNumber?: string;
  completionRate?: number;
}

export default function ApplicationPageNew() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<ExtendedCourierApplication | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filters: ApplicationFilters = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: statusFilter || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  }), [currentPage, itemsPerPage, searchTerm, statusFilter]);

  const { applications, pagination, isLoading, isError, refresh } = useAdminApplications(filters);
  const { updateStatus } = useAdminApplicationMutations();

  const sortedApplications = useMemo(() => {
    if (!applications) return [];
    return [...applications].sort((a, b) => {
      const at = new Date(a.createdAt).getTime();
      const bt = new Date(b.createdAt).getTime();
      return bt - at;
    });
  }, [applications]);

  const formatDate = (value?: string) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value || "—";
    }
  };

  const display = (value?: string | number | null) =>
    value === undefined || value === null || value === "" ? "—" : String(value);

  const copy = async (text?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Kopyalandı");
    } catch (e) {
      console.error(e);
      toast.error("Kopyalanamadı");
    }
  };

  const isInitialLoading = isLoading && (!applications || applications.length === 0);

  console.log("Debug: ApplicationPageNew", { selectedApplication });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Kurye Başvuruları</h1>

      {isError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center justify-between">
          <span>Başvurular yüklenirken bir hata oluştu.</span>
          <button onClick={() => refresh()} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs">
            Tekrar Dene
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Ad, soyad, email ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg flex-1 min-w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Tüm Durumlar</option>
          <option value="interviewed">Görüşmeye Çağrılan</option>
          <option value="pending">Bekleyen</option>
          <option value="approved">Onaylanan</option>
          <option value="rejected">Reddedilen</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-2 bg-gray-100 text-sm text-gray-600 flex items-center gap-3">
          <span>Debug: {applications?.length ?? 0} başvuru bulundu</span>
          {isLoading && <span className="text-gray-400">(Yükleniyor...)</span>}
        </div>
        {isInitialLoading ? (
          <div className="px-6 py-12 text-center text-gray-500">Yükleniyor...</div>
        ) : sortedApplications && sortedApplications.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedApplications.map((app) => {
                return (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.firstName} {app.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.phone} {app.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button
                            className={cn(`inline-flex items-center gap-2 px-2 py-1 text-xs font-semibold rounded-full transition`,
                              {
                                "data-state": app.status,
                                "bg-red-100 text-red-800 hover:bg-red-200": app.status.includes("Reddedildi") || app.status === "rejected",
                                "bg-yellow-100 text-yellow-800 hover:bg-yellow-200": app.status.includes("Beklemede") || app.status === "pending",
                                "bg-gray-100 text-gray-800 hover:bg-gray-200": app.status.includes("Görüşmeye Çağırıldı") || app.status === "interviewed",
                                "bg-green-100 text-green-800 hover:bg-green-200": app.status.includes("approved") || app.status === "approved",
                              }
                            )}
                          >
                            {app.status === "pending" && "Beklemede"}
                            {app.status === "approved" && "Onaylandı"}
                            {app.status === "rejected" && "Reddedildi"}
                            {app.status === "interviewed" && "Görüşmeye Çağırıldı"}
                            <svg className="w-3 h-3 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.957a.75.75 0 111.08 1.04l-4.24 4.52a.75.75 0 01-1.08 0l-4.24-4.52a.75.75 0 01.02-1.06z"
                                clipRule="evenodd" />
                            </svg>
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            side="bottom"
                            align="start"
                            sideOffset={6}
                            className="z-[60] min-w-40 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
                          >
                            {(["pending", "approved", "rejected", "interviewed"] as const).map((status) => (
                              <DropdownMenu.Item
                                key={status}
                                onSelect={async () => {
                                  console.log(`Updating status to ${status} for application ${app.id}`);
                                  if (updatingId) return;
                                  try {
                                    setUpdatingId(app.id);
                                    await updateStatus(app.id, status);
                                    await refresh();
                                  } catch (err) {
                                    console.error("Status update error", err);
                                  } finally {
                                    setUpdatingId(null);
                                  }
                                }}
                                disabled={updatingId === app.id}
                                className={`cursor-pointer select-none rounded-sm px-3 py-2 text-sm outline-none data-[highlighted]:bg-gray-50 data-[disabled]:opacity-50 ${app.status === status ? "text-blue-600 font-medium" : "text-gray-700"}`}
                              >
                                {status === "pending" ? "Beklemede" : status === "approved" ? "Onayla" : status === "interviewed" ? "Görüşmeye Çağır" : "Reddet"}
                                {updatingId === app.id && <span className="float-right text-xs text-gray-400">...</span>}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(app.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                      >
                        Detay
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <div className="text-base">Başvuru bulunamadı</div>
            {(searchTerm || statusFilter) && (
              <div className="text-sm mt-2">Arama kriterlerinizi değiştirmeyi deneyin</div>
            )}
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {pagination.total} başvurunun {((pagination.page - 1) * pagination.limit) + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)} arası gösteriliyor
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Önceki
            </button>
            <span className="px-4 py-2 text-sm">
              {currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Başvuru Detayları</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedApplication.firstName} {selectedApplication.lastName} - {selectedApplication.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-200 rounded-full"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kişisel Bilgiler */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Kişisel Bilgiler
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                        <p className="flex-1 text-sm text-gray-900 bg-white p-2 rounded border font-mono">{display(selectedApplication.email)}</p>
                        {selectedApplication.email && (
                          <button onClick={() => copy(selectedApplication.email)} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Kopyala</button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <p className="flex-1 text-sm text-gray-900 bg-white p-2 rounded border font-mono">{display(selectedApplication.phone)}</p>
                        {selectedApplication.phone && (
                          <button onClick={() => copy(selectedApplication.phone)} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Kopyala</button>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{selectedApplication.birthDate ? new Date(selectedApplication.birthDate).toLocaleDateString('tr-TR') : '—'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.gender)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Uyruk</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.nationality)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border font-mono">{display(selectedApplication.idNumber)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medeni Durum</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.maritalStatus)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Askerlik Durumu</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.militaryStatus)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim Durumu</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.education)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Adres Bilgileri
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.city)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.district)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                        <p className="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">{display(selectedApplication.address)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Çalışma Bilgileri
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Türü</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.workPeriod)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kurye Tecrübesi</label>
                        <p className="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">{display(selectedApplication.courierExperience)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genel Tecrübe</label>
                        <p className="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">{display(selectedApplication.experience)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">İş Tecrübeleri</label>
                        <p className="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">{display(selectedApplication.workExperiences)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Referanslar</label>
                        <p className="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">{display(selectedApplication.references)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      Araç & Ehliyet
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ehliyet Sınıfı</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.licenseClass)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ehliyet No</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border font-mono">{display(selectedApplication.licenseNumber)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Araç Türü</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{display(selectedApplication.vehicleType)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Araç Sahipliği</label>
                        {selectedApplication.hasVehicle === undefined ? (
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">—</p>
                        ) : (
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${selectedApplication.hasVehicle ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedApplication.hasVehicle ? 'Aracı Var' : 'Aracı Yok'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                      Başvuru Durumu
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                        <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${selectedApplication.status === 'approved' ? 'bg-green-100 text-green-800' : selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedApplication.status === 'approved' ? 'Onaylandı' : selectedApplication.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tamamlanma Oranı</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{selectedApplication.completionRate !== undefined ? `%${selectedApplication.completionRate}` : '—'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başvuru Tarihi</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{formatDate(selectedApplication.createdAt)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Son Güncelleme</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">{formatDate(selectedApplication.updatedAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başvuru UID</label>
                        <p className="flex-1 text-xs text-gray-900 font-mono bg-white p-2 rounded border break-all">{display(selectedApplication.uid)}</p>
                        {selectedApplication.uid && (
                          <button onClick={() => copy(selectedApplication.uid)} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Kopyala</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
                    </svg>
                    Notlar
                  </h3>
                  <p className="text-sm text-gray-700 bg-white p-4 rounded-md border whitespace-pre-wrap">{display(selectedApplication.notes)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  ID: <span className="font-mono">{selectedApplication.id}</span>
                  <button onClick={() => copy(selectedApplication.id)} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Kopyala</button>
                </span>
                {selectedApplication.email && (
                  <a
                    href={`mailto:${selectedApplication.email}?subject=${encodeURIComponent("7de Yedi Vale - Kurye Başvurunuz Hakkında")}&body=${encodeURIComponent(`Merhaba ${selectedApplication.firstName} ${selectedApplication.lastName},\n\n7de Yedi Vale kurye başvurunuz değerlendirilmiştir.\n\n${selectedApplication.status === 'approved' ? 'Başvurunuz olumlu sonuçlanmıştır. İşe alım sürecinin bir sonraki adımı için aşağıdaki bilgileri dikkate alınız:' : selectedApplication.status === 'rejected' ? 'Üzgünüz, başvurunuz olumsuz sonuçlanmıştır. İlginiz için teşekkür ederiz.' : 'Başvurunuz halen değerlendirme aşamasındadır.'}\n\n${selectedApplication.status === 'approved' ? 'Oryantasyon eğitimimiz XX.XX.202X tarihinde gerçekleşecektir. Lütfen bu tarihte hazır olunuz ve gerekli evraklarınızı yanınızda getiriniz.' : ''}\n\nSorularınız için bizimle iletişime geçebilirsiniz.\n\nSaygılarımızla,\n7de Yedi Vale Ekibi`)}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    E-posta Gönder
                  </a>
                )}
                {selectedApplication.email && (
                  <button onClick={() => copy(selectedApplication.email)} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">E-posta Kopyala</button>
                )}
                {selectedApplication.phone && (
                  <a href={`tel:${selectedApplication.phone}`} className="text-sm text-green-600 hover:text-green-800 underline">Ara</a>
                )}
                {selectedApplication.phone && (
                  <button onClick={() => copy(selectedApplication.phone)} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Telefon Kopyala</button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Yazdır
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
