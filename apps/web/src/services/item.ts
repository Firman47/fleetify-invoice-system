import { api } from "@/lib/api";
import type { Item, ApiResponse } from "@/types/api";

export const fetchItemsByCode = async ({
  code,
  signal,
}: {
  code: string;
  signal?: AbortSignal;
}): Promise<Item[]> => {
  const response = await api.get<ApiResponse<Item[]>>("/items", {
    params: { code },
    signal,
  });

  const res = response.data;

  if (!res.success) {
    throw new Error(res.message);
  }

  return res.data;
};
