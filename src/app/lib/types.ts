export enum ReturnStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum FitRating {
  RUNS_SMALL = "RUNS_SMALL",
  TRUE_TO_SIZE = "TRUE_TO_SIZE",
  RUNS_LARGE = "RUNS_LARGE",
}

export type ReturnWithItems = {
  id: string;
  orderId: string;
  orderNumber: number;
  customerEmail: string;
  customerId: string;
  status: ReturnStatus;
  additionalNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: ReturnItemType[];
};

export type ReturnItemType = {
  id: string;
  returnId: string;
  productName: string;
  variant: string;
  reason: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface ReturnFormData {
  orderId: string;
  orderNumber: number;
  customerEmail: string;
  customerId: string;
  items: {
    productName: string;
    variant: string;
    reason: string;
    quantity: number;
  }[];
  additionalNotes?: string;
}
