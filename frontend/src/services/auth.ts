import { api } from "@/lib/api";

export const loginApi = async (data: {
  username: string;
  password: string;
}) => {
  const res = await api.post("/login", data);
  return res.data;
};
