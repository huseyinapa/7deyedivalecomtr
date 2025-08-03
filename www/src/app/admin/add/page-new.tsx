"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth, useRegister } from "@/hooks/useAuth";

interface AdminUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function AdminAddPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { register } = useRegister();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<AdminUser>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/admin/login");
    }
  }, [mounted, authLoading, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error("Tüm alanları doldurun!");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Yeni admin başarıyla eklendi!");

      // Reset form
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
    } catch (error: any) {
      console.error("Admin creation error:", error);
      toast.error(error.message || "Admin eklenirken hata oluştu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Router.push will handle the redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Yeni Admin Ekle
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Sisteme yeni yönetici ekleyin
              </p>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1"
                minLength={6}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin")}
              >
                İptal
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isSubmitting ? "Ekleniyor..." : "Admin Ekle"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
