import { api } from "@/lib/api";
import type { Item } from "@/types/api";

export const fetchItemsByCode = async ({
  code,
  signal,
}: {
  code: string;
  signal?: AbortSignal;
}) => {
  const response = await api.get("/api/items", {
    params: { code },
    signal,
  });

  return response.data.data as Item[];
};
