"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCourierApplications, useCourierApplicationMutations } from "@/hooks/useCourierApplication";
import { CourierApplication } from "@/lib/api";

import { Pie, Bar } from "react-chartjs-2";
import { Chart, registerables, ChartData } from "chart.js";

Chart.register(...registerables);

//! EXPORT 
const exportToCSV = (filename: string, rows: string[][]) => {
  const csvContent = "data:text/csv;charset=utf-8,"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
//! EXPORT END

export default function ApplicationPageNew() {
  const { applications, isLoading, isError, refresh } = useCourierApplications();
  const { updateApplication } = useCourierApplicationMutations();

  const [tab, setTab] = useState<string>('week');
  const [selectedApp, setSelectedApp] = useState<CourierApplication | null>(null);

  // Date filter functions
  const filterByWeek = (apps: CourierApplication[]) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return apps.filter(app => new Date(app.createdAt) >= oneWeekAgo);
  };

  const filterByMonth = (apps: CourierApplication[]) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return apps.filter(app => new Date(app.createdAt) >= oneMonthAgo);
  };

  const filterByYear = (apps: CourierApplication[]) => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return apps.filter(app => new Date(app.createdAt) >= oneYearAgo);
  };

  // Get filtered data based on current tab
  const getFilteredData = () => {
    if (!applications.length) return [];

    switch (tab) {
      case 'week':
        return filterByWeek(applications);
      case 'month':
        return filterByMonth(applications);
      case 'year':
        return filterByYear(applications);
      default:
        return applications;
    }
  };

  // Count status function
  const countStatus = (status: string, apps: CourierApplication[]) => {
    return apps.filter(app => app.status === status).length;
  };

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateApplication(id, { status: newStatus });
      await refresh();
      toast.success("Durum başarıyla güncellendi!");
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error("Durum güncellenirken hata oluştu!");
    }
  };

  // Chart data preparation
  const prepareChartData = (apps: CourierApplication[]) => {
    const statusCounts = {
      pending: countStatus('pending', apps),
      approved: countStatus('approved', apps),
      rejected: countStatus('rejected', apps),
    };

    const pieData: ChartData<'pie'> = {
      labels: ['Beklemede', 'Onaylandı', 'Reddedildi'],
      datasets: [{
        data: [statusCounts.pending, statusCounts.approved, statusCounts.rejected],
        backgroundColor: ['#FFC107', '#28A745', '#DC3545'],
        borderWidth: 1,
      }]
    };

    const barData: ChartData<'bar'> = {
      labels: ['Beklemede', 'Onaylandı', 'Reddedildi'],
      datasets: [{
        label: 'Başvuru Sayısı',
        data: [statusCounts.pending, statusCounts.approved, statusCounts.rejected],
        backgroundColor: ['#FFC107', '#28A745', '#DC3545'],
        borderWidth: 1,
      }]
    };

    return { pieData, barData };
  };

  // Export functions
  const handleExport = () => {
    const filteredData = getFilteredData();
    const rows = [
      ['Ad Soyad', 'E-posta', 'Telefon', 'Şehir', 'İlçe', 'Durum', 'Tarih'],
      ...filteredData.map(app => [
        `${app.firstName} ${app.lastName}`,
        app.email,
        app.phone,
        app.city || '',
        app.district || '',
        app.status,
        new Date(app.createdAt).toLocaleDateString('tr-TR')
      ])
    ];

    exportToCSV(`courier-applications-${tab}.csv`, rows);
    toast.success('Veriler başarıyla dışa aktarıldı!');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Veri yüklenirken hata oluştu!</div>
      </div>
    );
  }

  const filteredData = getFilteredData();
  const { pieData, barData } = prepareChartData(filteredData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kurye Başvuruları</h2>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Dışa Aktar
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">Bu Hafta</TabsTrigger>
          <TabsTrigger value="month">Bu Ay</TabsTrigger>
          <TabsTrigger value="year">Bu Yıl</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Beklemede</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {countStatus('pending', filteredData)}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Onaylandı</h3>
              <p className="text-2xl font-bold text-green-600">
                {countStatus('approved', filteredData)}
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800">Reddedildi</h3>
              <p className="text-2xl font-bold text-red-600">
                {countStatus('rejected', filteredData)}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Durum Dağılımı</h3>
              <div className="h-64">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Başvuru İstatistikleri</h3>
              <div className="h-64">
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Şehir</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {`${application.firstName} ${application.lastName}`}
                    </TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.phone}</TableCell>
                    <TableCell>{application.city}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {application.status === 'pending' ? 'Beklemede' :
                          application.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(application.createdAt).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pending">Beklemede</option>
                        <option value="approved">Onayla</option>
                        <option value="rejected">Reddet</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
