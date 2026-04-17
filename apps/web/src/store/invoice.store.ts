import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ClientData, InvoiceItemInput } from "@/types/api";

const createDefaultItem = (): InvoiceItemInput => ({
  uuid:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  itemId: undefined,
  code: "",
  name: "",
  qty: 1,
  price: 0,
});

const defaultClient: ClientData = {
  sender: "",
  senderAddress: "",
  receiver: "",
};

type InvoiceStoreState = {
  client: ClientData;
  items: InvoiceItemInput[];
  hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
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
      client: defaultClient,
      items: [],
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      setClient: (client) => set({ client }),

      setItems: (items) => set({ items }),

      updateItem: (id, data) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uuid === id
              ? {
                  ...item,
                  ...data,
                }
              : item,
          ),
        })),

      addItem: () =>
        set((state) => ({
          items: [...state.items, createDefaultItem()],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.uuid !== id),
        })),

      resetInvoice: () =>
        set({
          client: defaultClient,
          items: [],
        }),
    }),
    {
      name: "invoice-storage",
      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
