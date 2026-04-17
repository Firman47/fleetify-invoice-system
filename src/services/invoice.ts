import { api } from "@/lib/api";
import type { InvoicePayload } from "@/types/api";

export const submitInvoice = async (payload: InvoicePayload) => {
  const response = await api.post("/invoices", payload);
  return response.data;
};
