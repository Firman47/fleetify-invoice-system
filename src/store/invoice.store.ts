import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ClientData, InvoiceItemInput } from "@/types/api";

const createDefaultItem = (): InvoiceItemInput => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  code: "",
  name: "",
  qty: 1,
  price: 0,
  total: 0,
});

export type InvoiceStoreState = {
  client: ClientData;
  items: InvoiceItemInput[];
  setClient: (client: ClientData) => void;
  setItems: (items: InvoiceItemInput[]) => void;
  updateItem: (id: string, data: Partial<InvoiceItemInput>) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  resetInvoice: () => void;
};

export const useInvoiceStore = create<InvoiceStoreState>()(
  persist(
    (set) => ({
      client: {
        sender: "",
        senderAddress: "",
        receiver: "",
      },
      items: [createDefaultItem()],

      setClient: (client) => set({ client }),

      setItems: (items) => set({ items }),

      updateItem: (id, data) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;

            const updated = {
              ...item,
              ...data,
            };

            if (data.qty !== undefined || data.price !== undefined) {
              updated.total = updated.qty * updated.price;
            }

            return updated;
          }),
        })),

      addItem: () =>
        set((state) => ({
          items: [...state.items, createDefaultItem()],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      resetInvoice: () =>
        set({
          client: {
            sender: "",
            senderAddress: "",
            receiver: "",
          },
          items: [createDefaultItem()],
        }),
    }),
    {
      name: "invoice-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : null,
      ),
    },
  ),
);
