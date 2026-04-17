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

export type Invoice = {
  id: string;
  InvoiceNumber: string;
  SenderName: string;
  SenderAddress: string;
  ReceiverName: string;
  ReceiverAddress: string;
  TotalAmount: number;
  Details: Array<{
    ID: number;
    ItemID: number;
    Quantity: number;
    Price: number;
    Subtotal: number;
  }>;
};

export type InvoiceItemInput = {
  uuid: string;
  itemId?: number;
  code: string;
  name: string;
  qty: number;
  price: number;
};

export type InvoicePayloadItem = {
  item_id: number;
  quantity: number;
};

export type InvoicePayloadItemAdmin = {
  item_id: number;
  quantity: number;
  price: number;
  total: number;
};

export type InvoicePayload = {
  sender_name: string;
  sender_address: string;
  receiver_name: string;
  receiver_address?: string;
  receiver: string;
  items: InvoicePayloadItem[];
};
