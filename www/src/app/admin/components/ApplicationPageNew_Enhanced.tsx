'use client';

import { useState, useMemo } from 'react';
import { useAdminApplications } from '@/hooks/useCourierApplication';
import type { ApplicationFilters } from '@/lib/api/admin.service';
import type { CourierApplication } from '@/lib/api';

// Extended interface for application details with all possible fields
interface ExtendedCourierApplication extends CourierApplication {
  age?: number;
  experience?: string;
  licenseNumber?: string;
  completionRate?: number;
}

export default function ApplicationPageNew() {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<ExtendedCourierApplication | null>(null);

  // API filters
  const filters: ApplicationFilters = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: statusFilter || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }), [currentPage, itemsPerPage, searchTerm, statusFilter]);

  // API hooks
  const { applications, pagination, isLoading, isError, refresh } = useAdminApplications(filters);

  // Debug: Data'yı konsola yazdır
  console.log('ApplicationPageNew Debug:', {
    applications,
    applicationsLength: applications?.length,
    pagination,
    isLoading,
    isError,
    filters
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-lg text-red-500">Başvurular yüklenirken hata oluştu!</div>
        <button
          onClick={() => refresh()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Kurye Başvuruları</h1>

      {/* Arama ve Filtreler */}
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
          <option value="pending">Bekleyen</option>
          <option value="approved">Onaylanan</option>
          <option value="rejected">Reddedilen</option>
        </select>
      </div>

      {/* Başvuru Listesi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Debug bilgisi */}
        <div className="px-6 py-2 bg-gray-100 text-sm text-gray-600">
          Debug: {applications?.length || 0} başvuru bulundu
        </div>

        {applications && applications.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.firstName} {app.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {app.status === 'approved' ? 'Onaylandı' :
                        app.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
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

      {/* Pagination */}
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

      {/* Başvuru Detay Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Başvuru Detayları
                </h2>
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

            {/* Modal Content */}
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
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {selectedApplication.firstName} {selectedApplication.lastName}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border font-mono">
                          {selectedApplication.email}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border font-mono">
                          {selectedApplication.phone}
                        </p>
                      </div>

                      {selectedApplication.age && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Yaş</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.age}
                          </p>
                        </div>
                      )}

                      {selectedApplication.birthDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {new Date(selectedApplication.birthDate).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      )}

                      {selectedApplication.gender && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.gender}
                          </p>
                        </div>
                      )}

                      {selectedApplication.nationality && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Uyruk</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.nationality}
                          </p>
                        </div>
                      )}

                      {selectedApplication.idNumber && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border font-mono">
                            {selectedApplication.idNumber}
                          </p>
                        </div>
                      )}

                      {selectedApplication.maritalStatus && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Medeni Durum</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.maritalStatus}
                          </p>
                        </div>
                      )}

                      {selectedApplication.militaryStatus && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Askerlik Durumu</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.militaryStatus}
                          </p>
                        </div>
                      )}

                      {selectedApplication.education && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim Durumu</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.education}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Adres Bilgileri */}
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
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {selectedApplication.city}
                        </p>
                      </div>

                      {selectedApplication.district && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.district}
                          </p>
                        </div>
                      )}

                      {selectedApplication.address && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                          <p className="text-sm text-gray-900 bg-white p-3 rounded border">
                            {selectedApplication.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Çalışma ve Deneyim Bilgileri */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Çalışma Bilgileri
                    </h3>

                    <div className="space-y-4">
                      {selectedApplication.workPeriod && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Türü</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.workPeriod}
                          </p>
                        </div>
                      )}

                      {selectedApplication.courierExperience && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kurye Tecrübesi</label>
                          <p className="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">
                            {selectedApplication.courierExperience}
                          </p>
                        </div>
                      )}

                      {selectedApplication.experience && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Genel Tecrübe</label>
                          <p className="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">
                            {selectedApplication.experience}
                          </p>
                        </div>
                      )}

                      {selectedApplication.workExperiences && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">İş Tecrübeleri</label>
                          <p className="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">
                            {selectedApplication.workExperiences}
                          </p>
                        </div>
                      )}

                      {selectedApplication.references && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Referanslar</label>
                          <p className="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">
                            {selectedApplication.references}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Araç ve Ehliyet Bilgileri + Durum */}
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
                      {selectedApplication.licenseClass && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ehliyet Sınıfı</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.licenseClass}
                          </p>
                        </div>
                      )}

                      {selectedApplication.licenseNumber && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ehliyet No</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border font-mono">
                            {selectedApplication.licenseNumber}
                          </p>
                        </div>
                      )}

                      {selectedApplication.vehicleType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Araç Türü</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {selectedApplication.vehicleType}
                          </p>
                        </div>
                      )}

                      {selectedApplication.hasVehicle !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Araç Sahipliği</label>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${selectedApplication.hasVehicle ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {selectedApplication.hasVehicle ? 'Aracı Var' : 'Aracı Yok'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Başvuru Durumu ve Bilgileri */}
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
                        <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${selectedApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                          selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {selectedApplication.status === 'approved' ? 'Onaylandı' :
                            selectedApplication.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                        </span>
                      </div>

                      {selectedApplication.completionRate !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tamamlanma Oranı</label>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                            %{selectedApplication.completionRate}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başvuru Tarihi</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {new Date(selectedApplication.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Son Güncelleme</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {new Date(selectedApplication.updatedAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {selectedApplication.uid && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Başvuru UID</label>
                          <p className="text-xs text-gray-900 font-mono bg-white p-2 rounded border break-all">
                            {selectedApplication.uid}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notlar - Tam genişlik */}
              {selectedApplication.notes && (
                <div className="mt-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
                      </svg>
                      Notlar
                    </h3>
                    <p className="text-sm text-gray-700 bg-white p-4 rounded-md border whitespace-pre-wrap">
                      {selectedApplication.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  ID: <span className="font-mono">{selectedApplication.id}</span>
                </span>
                {selectedApplication.email && (
                  <a
                    href={`mailto:${selectedApplication.email}`}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    E-posta Gönder
                  </a>
                )}
                {selectedApplication.phone && (
                  <a
                    href={`tel:${selectedApplication.phone}`}
                    className="text-sm text-green-600 hover:text-green-800 underline"
                  >
                    Ara
                  </a>
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
                    // TODO: Durum değiştirme işlemi
                    console.log('Status change for:', selectedApplication.id);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Durum Değiştir
                </button>
                <button
                  onClick={() => {
                    // TODO: Detaylı rapor çıkarma
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
