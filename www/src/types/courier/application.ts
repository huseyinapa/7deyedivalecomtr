// Courier application related types
export interface CourierApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  idNumber?: string;
  maritalStatus?: string;
  militaryStatus?: string;
  education?: string;
  licenseClass?: string;
  vehicleType?: string;
  workPeriod?: string;
  hasVehicle?: boolean;
  courierExperience?: string;
  workExperiences?: string;
  references?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  uid?: string;
}

export interface CreateCourierApplicationDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  idNumber?: string;
  maritalStatus?: string;
  militaryStatus?: string;
  education?: string;
  licenseClass?: string;
  vehicleType?: string;
  workPeriod?: string;
  hasVehicle?: boolean;
  courierExperience?: string;
  workExperiences?: string;
  references?: string;
  notes?: string;
  uid?: string;
}

export interface UpdateCourierApplicationDto {
  status?: string;
  notes?: string;
}
