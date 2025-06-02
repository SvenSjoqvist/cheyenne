"use client";

import { useState } from "react";
import CancellationsTable from "./CancellationsTable";

type CancelledOrder = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  createdAt: Date;
  cancelledAt: Date;
  reason: string;
  totalAmount: number;
  currency: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
};

type CancellationsWrapperProps = {
  cancellations: CancelledOrder[];
  maxSelection?: number;
};

export default function CancellationsWrapper({ 
  cancellations,
  maxSelection = 5 
}: CancellationsWrapperProps) {
  const [selectedCancellations, setSelectedCancellations] = useState<Set<string>>(new Set());

  const handleSelectionChange = (selectedIds: Set<string>) => {
    setSelectedCancellations(selectedIds);
  };

  return (
    <CancellationsTable
      cancellations={cancellations}
      onSelectionChange={handleSelectionChange}
      selectedCancellations={selectedCancellations}
      maxSelection={maxSelection}
    />
  );
} 