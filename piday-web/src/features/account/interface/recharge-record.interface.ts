export interface RechargeRecordInterface {
  id: number;

  amount: number;
  reason: string;
  externalID: string;

  createdAt: Date;
}
