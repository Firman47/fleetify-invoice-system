import { api } from "@/lib/api";
import type { InvoicePayload } from "@/types/api";

export const getInvoice = async (invoiceId: string) => {
  const response = await api.get(`/invoices/${invoiceId}`);
  return response.data;
};

export const fetchInvoices = async () => {
  const response = await api.get("/invoices");
  return response.data;
};

export const submitInvoice = async (payload: InvoicePayload) => {
  const response = await api.post("/invoices", payload);
  return response.data;
};
