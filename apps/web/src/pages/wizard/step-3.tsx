import { useMemo } from "react";
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
  Send,
  ArrowLeft,
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

  const user = useAuthStore((state) => state.user);
  const client = useInvoiceStore((state) => state.client);
  const items = useInvoiceStore((state) => state.items);
  const resetInvoice = useInvoiceStore((state) => state.resetInvoice);

  const role = user?.role;

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

  const payload = useMemo(() => {
    const transformedItems = items
      .filter((item) => item.code.trim() !== "")
      .map((item) => {
        const base = {
          item_id: item.itemId,
          quantity: item.qty,
        };

        // Kerani: hanya basic data
        if (role === "Kerani") {
          return base;
        }

        // Admin: kirim full data
        return {
          ...base,
          price: item.price,
          total: item.qty * item.price,
        };
      });

    return {
      sender_name: client.sender,
      sender_address: client.senderAddress,
      receiver_name: client.receiver,
      receiver_address: "",
      items: transformedItems,
    } as InvoicePayload;
  }, [client, items, role]);

  const totalInvoice = useMemo(
    () => items.reduce((sum, item) => sum + item.qty * item.price, 0),
    [items],
  );

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-8">
      <div className="mx-auto max-w-4xl lg:max-w-5xl">
        {/* Back Button & Header */}
        <div className="mb-3 sm:mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetInvoice();
              router.push("/dashboard");
            }}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2 sm:ml-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Buat Invoice Pengiriman
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Ikuti langkah-langkah untuk membuat invoice dengan mudah
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon || Check;
              const isActive = index === 2;
              const isCompleted = index < 2;

              return (
                <div
                  key={step.title}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? "border-green-500 bg-green-500 text-white"
                        : isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                  </div>
                  <div className="mt-2 sm:mt-3 text-center">
                    <div
                      className={`text-xs sm:text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
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
        <Card>
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle>Review & Cetak Invoice</CardTitle>
            <CardDescription>
              Periksa kembali data sebelum mengirim. Payload akan disesuaikan
              menurut role Anda.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted p-4 sm:p-6">
                <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-foreground">
                  Data Klien
                </h2>
                <div className="space-y-2 sm:space-y-3">
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

              <div className="rounded-lg border bg-muted p-4 sm:p-6">
                <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-foreground">
                  Ringkasan Invoice
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <span className="font-medium text-foreground">
                      Jumlah Item:
                    </span>
                    <p className="text-foreground">
                      {items.reduce((sum, item) => sum + item.qty, 0)}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-foreground">
                      Total Estimasi:
                    </span>
                    <p className="text-foreground">
                      Rp{" "}
                      {items
                        .reduce((sum, item) => sum + item.qty * item.price, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-foreground">
                Daftar Barang
              </h2>

              <div className="overflow-x-auto rounded-lg border bg-background">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b bg-muted text-foreground">
                    <tr>
                      <th className="px-2 py-3 font-medium text-xs sm:px-4 sm:text-sm">
                        Kode
                      </th>
                      <th className="px-2 py-3 font-medium text-xs sm:px-4 sm:text-sm">
                        Nama
                      </th>
                      <th className="px-2 py-3 font-medium text-xs sm:px-4 sm:text-sm">
                        Qty
                      </th>
                      {role === "Admin" && (
                        <th className="px-2 py-3 font-medium text-xs sm:px-4 sm:text-sm">
                          Harga
                        </th>
                      )}
                      {role === "Admin" && (
                        <th className="px-2 py-3 font-medium text-xs sm:px-4 sm:text-sm">
                          Total
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item) => (
                      <tr key={item.uuid} className="hover:bg-muted">
                        <td className="px-2 py-3 text-foreground sm:px-4">
                          {item.code || "-"}
                        </td>
                        <td className="px-2 py-3 text-foreground sm:px-4">
                          {item.name || "-"}
                        </td>
                        <td className="px-2 py-3 text-foreground sm:px-4">
                          {item.qty}
                        </td>
                        {role === "Admin" && (
                          <td className="px-2 py-3 text-foreground sm:px-4">
                            {item.price > 0
                              ? `Rp ${item.price.toLocaleString()}`
                              : "-"}
                          </td>
                        )}
                        {role === "Admin" && (
                          <td className="px-2 py-3 font-medium text-foreground sm:px-4">
                            {item.qty > 0 && item.price > 0
                              ? `Rp ${(item.qty * item.price).toLocaleString()}`
                              : "-"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border bg-muted p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Invoice
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                  Rp {totalInvoice.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      "/invoice-print",
                      "_blank",
                      "width=1200,height=800",
                    )
                  }
                  className="w-full sm:w-auto gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Cetak Invoice
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/wizard/step-2")}
                  className="w-full sm:w-auto"
                >
                  Kembali
                </Button>
                <Button
                  type="button"
                  onClick={() => mutation.mutate(payload)}
                  disabled={mutation.isPending}
                  className="w-full sm:w-auto gap-2"
                >
                  <Send className="h-4 w-4" />
                  {mutation.isPending ? "Mengirim..." : "Submit Invoice"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
