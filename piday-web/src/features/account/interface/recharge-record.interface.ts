interface UserResponseRecordsDto {
  username: string;
  avatar?: string | null;
  email: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RechargeRecordInterface {
  id: number;
  amount: number; // Assuming Decimal is serialized as a string
  reason: string;
  externalID: string;
  createdAt: string; // ISO date string
  sender?: UserResponseRecordsDto;
  receiver?: UserResponseRecordsDto;
}
