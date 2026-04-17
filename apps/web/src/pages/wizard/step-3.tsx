import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import { useInvoiceStore } from "@/store/invoice.store";
import { submitInvoice } from "@/services/invoice";
import type { InvoicePayload } from "@/types/api";
import {
  Check,
  User,
  Package,
  FileText,
  Printer,
  ArrowLeft,
  Send,
} from "lucide-react";

const steps = [
  {
    title: "Data Klien",
    description: "Informasi pengirim & penerima",
    icon: User,
  },
  {
    title: "Data Barang",
    description: "Daftar item yang dikirim",
    icon: Package,
  },
  {
    title: "Review & Cetak",
    description: "Konfirmasi dan cetak invoice",
    icon: FileText,
  },
];

export default function WizardStep3() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const client = useInvoiceStore((state) => state.client);
  const items = useInvoiceStore((state) => state.items);
  const resetInvoice = useInvoiceStore((state) => state.resetInvoice);

  const mutation = useMutation({
    mutationFn: async (payload: InvoicePayload) => {
      return submitInvoice(payload);
    },
    onSuccess: () => {
      alert("Invoice berhasil dikirim!");
      resetInvoice();
      router.replace("/dashboard");
    },
    onError: (error) => {
      console.error(error);
      alert("Gagal mengirim invoice. Silakan coba lagi.");
    },
  });

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  const payload = useMemo(() => {
    const transformedItems = items
      .filter((item) => item.code.trim() !== "")
      .map((item) => {
        const base = {
          code: item.code,
          name: item.name,
          qty: item.qty,
        } as {
          code: string;
          name: string;
          qty: number;
          price?: number;
          total?: number;
        };

        if (user?.role === "Admin") {
          base.price = item.price;
          base.total = item.total;
        }

        return base;
      });

    return {
      sender: client.sender,
      senderAddress: client.senderAddress,
      receiver: client.receiver,
      items: transformedItems,
    } as InvoicePayload;
  }, [client, items, user]);

  const totalInvoice = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items],
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Buat Invoice Pengiriman
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ikuti langkah-langkah untuk membuat invoice dengan mudah
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon || Check;
              const isActive = index === 2;
              const isCompleted = index < 2;

              return (
                <div key={step.title} className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? "border-green-500 bg-green-500 text-white"
                        : isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <div
                      className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 h-2 rounded-full bg-muted">
            <div className="h-2 w-full rounded-full bg-primary transition-all duration-300"></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Review & Cetak Invoice</CardTitle>
            <CardDescription>
              Periksa kembali data sebelum mengirim. Payload akan disesuaikan
              menurut role Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-muted p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Data Klien
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-foreground">
                      Pengirim:
                    </span>
                    <p className="text-foreground">{client.sender || "-"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Alamat:</span>
                    <p className="text-foreground">
                      {client.senderAddress || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Penerima:
                    </span>
                    <p className="text-foreground">{client.receiver || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Informasi Role
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-foreground">Role:</span>
                    <p className="text-foreground">{user?.role ?? "-"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Payload:
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {user?.role === "Kerani"
                        ? "Harga dan total akan disembunyikan dari payload sebelum dikirim."
                        : "Admin mengirim payload lengkap."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border bg-background">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Daftar Barang
                </h2>
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b bg-muted text-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Kode</th>
                      <th className="px-4 py-3 font-medium">Nama</th>
                      <th className="px-4 py-3 font-medium">Qty</th>
                      <th className="px-4 py-3 font-medium">Harga</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted">
                        <td className="px-4 py-3 text-foreground">
                          {item.code || "-"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {item.name || "-"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {item.qty}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {item.price > 0
                            ? `Rp ${item.price.toLocaleString()}`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {item.total > 0
                            ? `Rp ${item.total.toLocaleString()}`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border bg-muted p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoice</p>
                <p className="text-3xl font-bold text-foreground">
                  Rp {totalInvoice.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.print()}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Cetak Invoice
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/wizard/step-2")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
                <Button
                  type="button"
                  onClick={() => mutation.mutate(payload)}
                  disabled={mutation.isLoading}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {mutation.isLoading ? "Mengirim..." : "Submit Invoice"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
