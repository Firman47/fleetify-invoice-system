import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchInvoices } from "@/services/invoice";
import type { ApiResponse, Invoice } from "@/types/api";
import { LogOut, PlusCircle, FileText } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { data, isLoading, isError } = useQuery<ApiResponse<Invoice[]>>({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
  });

  const handleLogout = () => {
    logout();
    Cookies.remove("token");
    router.replace("/login");
  };

  const invoices = data?.data ?? [];

  return (
    <div className="min-h-screen max-w-5xl bg-background  mx-auto space-y-6  p-4 md:p-8">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage invoice & resi pengiriman
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/wizard/step-1")}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Buat Resi
          </Button>

          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* USER INFO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Info</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">Username:</span>{" "}
            {user?.username ?? "-"}
          </p>
          <p>
            <span className="text-muted-foreground">Role:</span>{" "}
            {user?.role ?? "-"}
          </p>
        </CardContent>
      </Card>

      {/* CONTENT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Daftar Invoice
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">
              Memuat data invoice...
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-500">
              Gagal memuat data invoice
            </div>
          ) : (
            <Table>
              <TableCaption>Daftar invoice yang telah dibuat.</TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Pengirim</TableHead>
                  <TableHead>Penerima</TableHead>
                  <TableHead className="text-center">Item</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invoices.length > 0 ? (
                  invoices.map((inv: Invoice) => (
                    <TableRow key={inv.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {inv.InvoiceNumber}
                      </TableCell>
                      <TableCell>{inv.SenderName}</TableCell>
                      <TableCell>{inv.ReceiverName ?? "-"}</TableCell>
                      <TableCell className="text-center">
                        {inv.Details?.reduce(
                          (sum, item) => sum + item.Quantity,
                          0,
                        ) || 0}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rp {inv.TotalAmount?.toLocaleString() ?? "0"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground"
                    >
                      Belum ada invoice yang dibuat
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
