// Courier call related types
export interface CallCourier {
  id: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  packageDescription?: string;
  packageWeight?: number;
  packageValue?: number;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  uid?: string;
}

export interface CreateCallCourierDto {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  packageDescription?: string;
  packageWeight?: number;
  packageValue?: number;
  notes?: string;
  uid?: string;
}

export interface UpdateCallCourierDto {
  status?: string;
  notes?: string;
}

export interface SenderInfo {
  name: string;
  phone: string;
  address: string;
}

export interface ReceiverInfo {
  name: string;
  phone: string;
  address: string;
}

export interface PackageDetails {
  description?: string;
  weight?: number;
  value?: number;
  width?: number;
  height?: number;
  length?: number;
  notes?: string;
}
