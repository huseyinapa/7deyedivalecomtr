'use client';

import { useState, useMemo } from 'react';
import { useAdminApplications } from '@/hooks/useCourierApplication';
import type { ApplicationFilters } from '@/lib/api/admin.service';

export default function ApplicationPageNew() {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Başvuru Detayları
              </h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kişisel Bilgiler */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Kişisel Bilgiler
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedApplication.firstName} {selectedApplication.lastName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">E-posta</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefon</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.phone}</p>
                  </div>

                  {selectedApplication.age && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yaş</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.age}</p>
                    </div>
                  )}

                  {selectedApplication.birthDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedApplication.birthDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  )}

                  {selectedApplication.gender && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.gender}</p>
                    </div>
                  )}

                  {selectedApplication.nationality && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Uyruk</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.nationality}</p>
                    </div>
                  )}

                  {selectedApplication.idNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">TC Kimlik No</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{selectedApplication.idNumber}</p>
                    </div>
                  )}

                  {selectedApplication.maritalStatus && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Medeni Durum</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.maritalStatus}</p>
                    </div>
                  )}

                  {selectedApplication.militaryStatus && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Askerlik Durumu</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.militaryStatus}</p>
                    </div>
                  )}

                  {selectedApplication.education && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Eğitim Durumu</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.education}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Şehir</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.city}</p>
                  </div>

                  {selectedApplication.district && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">İlçe</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.district}</p>
                    </div>
                  )}

                  {selectedApplication.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Adres</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.address}</p>
                    </div>
                  )}
                </div>

                {/* Çalışma Bilgileri */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Çalışma Bilgileri
                  </h3>

                  {selectedApplication.workPeriod && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Çalışma Türü</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.workPeriod}</p>
                    </div>
                  )}

                  {selectedApplication.courierExperience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kurye Tecrübesi</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.courierExperience}</p>
                    </div>
                  )}

                  {selectedApplication.workExperiences && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">İş Tecrübeleri</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                        {selectedApplication.workExperiences}
                      </p>
                    </div>
                  )}

                  {selectedApplication.references && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Referanslar</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                        {selectedApplication.references}
                      </p>
                    </div>
                  )}

                  {selectedApplication.licenseClass && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ehliyet Sınıfı</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.licenseClass}</p>
                    </div>
                  )}

                  {selectedApplication.experience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tecrübe</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.experience}</p>
                    </div>
                  )}

                  {selectedApplication.vehicleType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Araç Türü</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.vehicleType}</p>
                    </div>
                  )}

                  {selectedApplication.hasVehicle !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Araç Sahipliği</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${selectedApplication.hasVehicle ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {selectedApplication.hasVehicle ? 'Aracı Var' : 'Aracı Yok'}
                      </span>
                    </div>
                  )}

                  {selectedApplication.licenseNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ehliyet No</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.licenseNumber}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Durum</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${selectedApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {selectedApplication.status === 'approved' ? 'Onaylandı' :
                        selectedApplication.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Başvuru Tarihi</label>
                    <p className="mt-1 text-sm text-gray-900">
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
                    <label className="block text-sm font-medium text-gray-700">Son Güncelleme</label>
                    <p className="mt-1 text-sm text-gray-900">
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
                      <label className="block text-sm font-medium text-gray-700">UID</label>
                      <p className="mt-1 text-xs text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {selectedApplication.uid}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ek Bilgiler */}
              {selectedApplication.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                    Notlar
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedApplication.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Kapat
              </button>
              {/* <button
                onClick={() => {
                  // Burada durum değiştirme işlemi yapılabilir
                  console.log('Status change for:', selectedApplication.id);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Durum Değiştir
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
