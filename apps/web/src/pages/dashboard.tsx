import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Dashboard() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    Cookies.remove("token");
    router.replace("/login");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* USER INFO */}
      <div className="p-4 border rounded">
        <p>username: {user?.username ?? "-"}</p>
        <p>Role: {user?.role ?? "-"}</p>
      </div>

      {/* NAVIGATION WIZARD */}
      <div className="space-y-2">
        <Button onClick={() => router.push("/wizard/step-1")}>
          Buat Resi (Wizard)
        </Button>

        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
