import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { useInvoiceStore } from "@/store/invoice.store";
import { fetchItemsByCode } from "@/services/item";
import { Check, User, Package, FileText, Plus, Trash2 } from "lucide-react";

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

const useDebouncedValue = <T,>(value: T, delay = 500) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default function WizardStep2() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const items = useInvoiceStore((state) => state.items);
  const updateItem = useInvoiceStore((state) => state.updateItem);
  const addItem = useInvoiceStore((state) => state.addItem);
  const removeItem = useInvoiceStore((state) => state.removeItem);

  const [searchTarget, setSearchTarget] = useState<{
    id: string;
    code: string;
  } | null>(null);
  const debouncedCode = useDebouncedValue(searchTarget?.code ?? "", 500);

  const { data, isFetching } = useQuery({
    queryKey: ["item-search", searchTarget?.id, debouncedCode],
    enabled: Boolean(searchTarget?.id && debouncedCode.trim()),
    queryFn: async ({ signal }) => {
      return fetchItemsByCode({ code: debouncedCode.trim(), signal });
    },
    keepPreviousData: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (!data || !searchTarget) return;
    const currentItem = items.find((item) => item.id === searchTarget.id);
    if (!currentItem || currentItem.code.trim() !== debouncedCode.trim())
      return;

    const item = data[0];
    if (!item) return;

    updateItem(searchTarget.id, {
      name: item.name,
      price: item.price,
      total: currentItem.qty * item.price,
    });
  }, [data, debouncedCode, items, searchTarget, updateItem]);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  const handleCodeChange = (id: string, value: string) => {
    updateItem(id, { code: value, name: "", price: 0, total: 0 });
    setSearchTarget({ id, code: value });
  };

  const handleQtyChange = (id: string, value: string) => {
    const qty = Number(value) || 1;
    updateItem(id, { qty });
  };

  const handleNext = () => {
    router.push("/wizard/step-3");
  };

  const handleBack = () => {
    router.push("/wizard/step-1");
  };

  const summaryLabel = useMemo(() => {
    if (!searchTarget) return "Ketik kode barang untuk mencari item master.";
    if (isFetching) return "Mencari item...";
    if (debouncedCode.trim() && data?.length === 0)
      return "Item tidak ditemukan untuk kode ini.";
    if (data?.length)
      return `Item terdeteksi: ${data[0].name} (Harga otomatis terisi)`;
    return "Ketik kode barang untuk mencari item master.";
  }, [data, debouncedCode, isFetching, searchTarget]);

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
              const isActive = index === 1;
              const isCompleted = index === 0;

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
            <div className="h-2 w-2/3 rounded-full bg-primary transition-all duration-300"></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Data Barang</CardTitle>
            <CardDescription>{summaryLabel}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Kode Barang
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Nama Barang
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Harga
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted">
                      <td className="px-4 py-3">
                        <Input
                          value={item.code}
                          onChange={(e) =>
                            handleCodeChange(item.id, e.target.value)
                          }
                          placeholder="Kode barang"
                          className="w-full"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.name}
                          readOnly
                          placeholder="Nama otomatis"
                          className="w-full"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            handleQtyChange(item.id, e.target.value)
                          }
                          className="w-20"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.price > 0 ? item.price.toString() : ""}
                          readOnly
                          placeholder="Harga otomatis"
                          className="w-full"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        Rp {item.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Barang
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Kembali
                </Button>
                <Button type="button" onClick={handleNext}>
                  Lanjut ke Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
