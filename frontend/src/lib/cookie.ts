import Cookies from "js-cookie";

export const authCookie = {
  setToken: (token: string) =>
    Cookies.set("token", token, { expires: 7, path: "/" }),

  getToken: () => Cookies.get("token"),

  removeToken: () => Cookies.remove("token"),
};
