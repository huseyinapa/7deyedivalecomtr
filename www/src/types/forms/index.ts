// Form related types (mostly legacy for backward compatibility)

// Legacy application form structure
export interface ApplicationData {
  applicationType: {
    workPeriod: string | null;
    exist: boolean;
    vehicleType: string | null;
    model?: string | null;
    motorcycleType?: string | null;
  };
  personalInformation: {
    firstName: string | null;
    lastName: string | null;
    nationality: string | null;
    idNumber: string | null;
    gender: string | null;
    birthDate: string | null;
    maritalStatus: string | null;
    militaryStatus: string | null;
    education: string | null;
    licenseClass: string | null;
  };
  contactInformation: {
    phoneNumber: string | null;
    email: string | null;
    city: string | null;
    districts: string | null;
    address: string | null;
  };
  jobExperiences: {
    courierExperience: string;
    workExperiences: string;
    workplaces: any[];
  };
  notes: {
    referenceName: string;
    referenceArea: string;
    heardFrom: string;
    note: string;
  };
}

// Legacy service form structure
export interface ServiceFormData {
  contactInfo: ServiceContactInfo;
  companyInfo: ServiceCompanyInfo;
}

export interface ServiceContactInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  district: string;
}

export interface ServiceCompanyInfo {
  sector: string;
  companyName: string;
  branchCount: string;
  startDate: string;
  courierType: string;
  courierCount: string;
  additionalNotes: string;
}

// Modern form types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}
