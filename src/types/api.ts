export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  error?: string;
};

export type LoginData = {
  id: number;
  username: string;
  role: "Admin" | "Kerani";
  token: string;
};

export type Item = {
  id: number;
  code: string;
  name: string;
  price: number;
};

export type User = {
  id: number;
  username: string;
  role: "Admin" | "Kerani";
};

export type ClientData = {
  sender: string;
  senderAddress: string;
  receiver: string;
};

export type InvoiceItemInput = {
  id: string;
  code: string;
  name: string;
  qty: number;
  price: number;
  total: number;
};

export type InvoicePayloadItem = {
  code: string;
  name: string;
  qty: number;
  price?: number;
  total?: number;
};

export type InvoicePayload = {
  sender: string;
  senderAddress: string;
  receiver: string;
  items: InvoicePayloadItem[];
};
