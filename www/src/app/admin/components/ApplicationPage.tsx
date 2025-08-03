import {
  Copy,
  File,
  ListFilter,
  MoreHorizontal,
  MoreVertical,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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

// Use CourierApplication type alias for better readability
type Application = CourierApplication;

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

interface ApplicationPageProps {
  data: Application[];
  loading: boolean;
}

export default function ApplicationPage({ data: applicationsData, loading }: ApplicationPageProps) {
  const [tab, setTab] = useState<string>('week'); // Sekme durumu
  const [applications, setApplications] = useState<Application[]>(applicationsData || []);
  const [selectedApp, setSelectedApp] = useState<Application | {}>({});
  const { updateApplication } = useCourierApplicationMutations();

  useEffect(() => {
    if (applicationsData) {
      setApplications(applicationsData);
    }
  }, [applicationsData]);

  // Filtre ve tarih formatlama fonksiyonlarını buraya ekleyebilirsiniz
  const dateFormatter = (dateStr: string) => {
    const date = new Date(parseInt(dateStr));
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = new Intl.DateTimeFormat("tr-TR", options).format(date);
    return formattedDate;
  };

  const filterByWeek = (apps: Application[]) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return apps.filter(
      (app) => new Date(parseInt(app.createdAt)) >= startOfWeek
    );
  };

  const filterByMonth = (apps: Application[]) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return apps.filter(
      (app) => new Date(parseInt(app.createdAt)) >= startOfMonth
    );
  };

  const filterByYear = (apps: Application[]) => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    return apps.filter(
      (app) => new Date(parseInt(app.createdAt)) >= startOfYear
    );
  };

  const calculateCompletionRate = (app: Application) => {
    let totalFields = 0;
    let filledFields = 0;

    // Temel Bilgiler
    totalFields += 8; // firstName, lastName, email, phone, city, birthDate, gender, address
    if (app.firstName) filledFields++;
    if (app.lastName) filledFields++;
    if (app.email) filledFields++;
    if (app.phone) filledFields++;
    if (app.city) filledFields++;
    if (app.birthDate) filledFields++;
    if (app.gender) filledFields++;
    if (app.address) filledFields++;

    // Ek Bilgiler
    totalFields += 5; // idNumber, nationality, education, licenseClass, vehicleType
    if (app.idNumber) filledFields++;
    if (app.nationality) filledFields++;
    if (app.education) filledFields++;
    if (app.licenseClass) filledFields++;
    if (app.vehicleType) filledFields++;

    // İş Deneyimi ve Notlar
    totalFields += 3; // workExperiences, courierExperience, notes
    if (app.workExperiences) filledFields++;
    if (app.courierExperience) filledFields++;
    if (app.notes) filledFields++;

    // Çalışma Periyodu
    totalFields += 1; // workPeriod
    if (app.workPeriod) filledFields++;

    return (filledFields / totalFields) * 100;
  };

  const countStatus = (status: string, apps: Application[]) => {
    return apps.filter(app => app.status === status).length;
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const success = await updateApplication(id, { status: newStatus });
      if (success) {
        setApplications(prev =>
          prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
          )
        );
        toast.success(`Başvuru durumu "${newStatus}" olarak güncellendi`);
      } else {
        toast.error("Durum güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Durum güncellenirken bir hata oluştu");
    }
  };

  const exportApplications = () => {
    const headers = ["ID", "Ad", "Soyad", "E-posta", "Telefon", "Çalışma Periyodu", "Durum", "Tarih"];
    const data = applications.map(app => [
      app.id,
      app.firstName || "",
      app.lastName || "",
      app.email || "",
      app.phone || "",
      app.workPeriod || "",
      app.status || "",
      dateFormatter(app.createdAt)
    ]);

    exportToCSV("başvurular.csv", [headers, ...data]);
  };

  // Filtreli veri
  const getFilteredData = () => {
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

  const filteredData = getFilteredData();

  // İstatistik verisi
  const statusData: ChartData<'pie'> = {
    labels: ['Beklemede', 'İnceleniyor', 'Onaylandı', 'Reddedildi'],
    datasets: [
      {
        data: [
          countStatus('Beklemede', filteredData),
          countStatus('İnceleniyor', filteredData),
          countStatus('Onaylandı', filteredData),
          countStatus('Reddedildi', filteredData)
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const applicationTypeData: ChartData<'bar'> = {
    labels: ['Yarı Zamanlı', 'Tam Zamanlı'],
    datasets: [
      {
        label: 'Başvuru Sayısı',
        data: [
          filteredData.filter(app => app.workPeriod === 'Yarı Zamanlı').length,
          filteredData.filter(app => app.workPeriod === 'Tam Zamanlı').length
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ]
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Başvurular</h2>
          <p className="text-muted-foreground">Kurye başvurularını yönetin.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportApplications} variant="outline" size="sm">
            <File className="h-4 w-4 mr-2" />
            Dışa Aktar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtreler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={true}>
                Tüm Başvurular
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Beklemede</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>İnceleniyor</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Onaylandı</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Reddedildi</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="week">Bu Hafta</TabsTrigger>
          <TabsTrigger value="month">Bu Ay</TabsTrigger>
          <TabsTrigger value="year">Bu Yıl</TabsTrigger>
          <TabsTrigger value="all">Tümü</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Başvuru Durumları</CardTitle>
                <CardDescription>Haftalık başvuru durumları dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Pie data={statusData} options={{ maintainAspectRatio: false }} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Başvuru Türleri</CardTitle>
                <CardDescription>Haftalık başvuru türleri dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar data={applicationTypeData} options={{ maintainAspectRatio: false }} />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Tüm Başvurular</CardTitle>
              <CardDescription>
                Toplam {filterByWeek(applications).length} başvuru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Başvuran</TableHead>
                      <TableHead>İletişim</TableHead>
                      <TableHead>Başvuru Türü</TableHead>
                      <TableHead>Tamamlanma</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterByWeek(applications).map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">
                            {application.firstName && application.lastName
                              ? `${application.firstName} ${application.lastName}`
                              : "İsim Belirtilmemiş"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {application.email ? (
                            <div className="flex flex-col">
                              <span>{application.email}</span>
                              <span className="text-muted-foreground">
                                {application.phone}
                              </span>
                            </div>
                          ) : (
                            "İletişim Belirtilmemiş"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span>{application.workPeriod}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Progress
                              value={calculateCompletionRate(application)}
                              className="h-2"
                            />
                            <span className="text-xs text-muted-foreground">{`${Math.round(
                              calculateCompletionRate(application)
                            )}% Tamamlandı`}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              application.status === "Onaylandı"
                                ? "success"
                                : application.status === "Reddedildi"
                                  ? "destructive"
                                  : application.status === "İnceleniyor"
                                    ? "outline"
                                    : "secondary"
                            }
                          >
                            {application.status || "Beklemede"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {dateFormatter(application.createdAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menü</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => setSelectedApp(application)}
                              >
                                Detayları Görüntüle
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(application.id, "Beklemede")}>
                                Beklemede
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(application.id, "İnceleniyor")}>
                                İnceleniyor
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(application.id, "Onaylandı")}>
                                Onayla
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(application.id, "Reddedildi")}>
                                Reddet
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filterByWeek(applications).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Bu hafta için başvuru bulunamadı.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="month" className="space-y-4">
          {/* Month tab content - similar structure to week tab */}
          {/* ... */}
        </TabsContent>
        <TabsContent value="year" className="space-y-4">
          {/* Year tab content - similar structure to week tab */}
          {/* ... */}
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          {/* All tab content - similar structure to week tab */}
          {/* ... */}
        </TabsContent>
      </Tabs>

      {Object.keys(selectedApp).length > 0 && (
        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Başvuru Detayları</CardTitle>
              <CardDescription>
                ID: {(selectedApp as Application).id}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setSelectedApp({})}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Kişisel Bilgiler
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-semibold">Ad Soyad:</span>{" "}
                      {(selectedApp as Application).firstName && (selectedApp as Application).lastName
                        ? `${(selectedApp as Application).firstName} ${(selectedApp as Application).lastName}`
                        : "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">TC Kimlik No:</span>{" "}
                      {(selectedApp as Application).idNumber || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">Doğum Tarihi:</span>{" "}
                      {(selectedApp as Application).birthDate || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">Cinsiyet:</span>{" "}
                      {(selectedApp as Application).gender || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">Telefon:</span>{" "}
                      {(selectedApp as Application).phone || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">Şehir:</span>{" "}
                      {(selectedApp as Application).city || "Belirtilmemiş"}
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold">Adres:</span>{" "}
                      {(selectedApp as Application).address || "Belirtilmemiş"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-indigo-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    İletişim Bilgileri
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-semibold">E-posta:</span>{" "}
                      {(selectedApp as Application).email || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">Telefon:</span>{" "}
                      {(selectedApp as Application).phone || "Belirtilmemiş"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-rose-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    İş Deneyimi
                  </p>
                  <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-semibold">İş Deneyimi:</span>{" "}
                      {(selectedApp as Application).workExperiences || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">Kurye Deneyimi:</span>{" "}
                      {(selectedApp as Application).courierExperience || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">Referanslar:</span>{" "}
                      {(selectedApp as Application).references || "Belirtilmemiş"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-amber-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Başvuru Bilgileri
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-semibold">Çalışma Periyodu:</span>{" "}
                      {(selectedApp as Application).workPeriod || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">Başvuru Durumu:</span>{" "}
                      <Badge
                        variant={
                          (selectedApp as Application).status === "Onaylandı"
                            ? "success"
                            : (selectedApp as Application).status === "Reddedildi"
                              ? "destructive"
                              : (selectedApp as Application).status === "İnceleniyor"
                                ? "outline"
                                : "secondary"
                        }
                      >
                        {(selectedApp as Application).status || "Beklemede"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-semibold">Başvuru Tarihi:</span>{" "}
                      {dateFormatter((selectedApp as Application).createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:pb-0">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Notlar</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedApp as Application).notes || "Not eklenmemiş."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                const textToCopy = `
Başvuru ID: ${(selectedApp as Application).id}
Ad Soyad: ${(selectedApp as Application).firstName && (selectedApp as Application).lastName
                    ? `${(selectedApp as Application).firstName} ${(selectedApp as Application).lastName}`
                    : "Belirtilmemiş"
                  }
E-posta: ${(selectedApp as Application).email || "Belirtilmemiş"}
Telefon: ${(selectedApp as Application).phone || "Belirtilmemiş"}
Çalışma Periyodu: ${(selectedApp as Application).workPeriod || "Belirtilmemiş"}
Durum: ${(selectedApp as Application).status || "Beklemede"}
Tarih: ${dateFormatter((selectedApp as Application).createdAt)}
                `;
                navigator.clipboard.writeText(textToCopy);
                toast.success("Başvuru bilgileri kopyalandı");
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Başvuru Bilgilerini Kopyala
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleStatusChange((selectedApp as Application).id, "İnceleniyor")}
              >
                İnceleniyor
              </Button>
              <Button
                variant="default"
                onClick={() => handleStatusChange((selectedApp as Application).id, "Onaylandı")}
                className="bg-green-600 hover:bg-green-700"
              >
                Onayla
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusChange((selectedApp as Application).id, "Reddedildi")}
              >
                Reddet
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
