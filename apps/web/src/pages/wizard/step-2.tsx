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
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { useInvoiceStore } from "@/store/invoice.store";
import { fetchItemsByCode } from "@/services/item";
import {
  Check,
  User,
  Package,
  FileText,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { Item } from "@/types/api";
import { useAuthStore } from "@/store/auth.store";

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
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default function WizardStep2() {
  const router = useRouter();

  const items = useInvoiceStore((state) => state.items);
  const updateItem = useInvoiceStore((state) => state.updateItem);
  const addItem = useInvoiceStore((state) => state.addItem);
  const removeItem = useInvoiceStore((state) => state.removeItem);
  const resetInvoice = useInvoiceStore((state) => state.resetInvoice);
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [searchQueryByItemId, setSearchQueryByItemId] = useState<
    Record<string, string>
  >({});

  const activeSearchText = activeItemId
    ? (searchQueryByItemId[activeItemId] ?? "")
    : "";
  const debouncedCode = useDebouncedValue(activeSearchText, 500);

  const { data = [], isFetching } = useQuery<Item[]>({
    queryKey: ["item-search", activeItemId, debouncedCode],
    enabled: Boolean(activeItemId),
    queryFn: ({ signal }) =>
      fetchItemsByCode({
        code: debouncedCode.trim(),
        signal,
      }),
    staleTime: 0,
  });

  const handleQtyChange = (id: string, value: string) => {
    const qty = Math.max(1, Number(value) || 1);
    updateItem(id, { qty });
  };

  const handleNext = () => router.push("/wizard/step-3");
  const handleBack = () => router.push("/wizard/step-1");

  const isValid =
    items.length > 0 &&
    items.some((item) => item.code.trim() && item.name.trim());

  const summaryLabel = useMemo(() => {
    if (!activeSearchText) return "Ketik kode barang untuk mencari item.";
    if (isFetching) return "Mencari item...";
    if (debouncedCode && data.length === 0) return "Item tidak ditemukan.";
    if (data.length === 1) return `Item ditemukan: ${data[0].name}`;
    if (data.length > 1)
      return `${data.length} item ditemukan. Pilih dari dropdown.`;

    return "";
  }, [activeSearchText, debouncedCode, data, isFetching]);

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
              const isActive = index === 1;
              const isCompleted = index === 0;

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
            <div className="h-2 w-2/3 rounded-full bg-primary transition-all duration-300"></div>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle>Data Barang</CardTitle>
            <CardDescription>{summaryLabel}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto rounded-lg border bg-background">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b bg-muted text-foreground">
                  <tr>
                    <th className="px-2 py-3 font-medium text-xs sm:px-4 sm:text-sm">
                      Kode Barang
                    </th>
                    <th className="px-2 py-3 font-medium text-xs sm:px-4 sm:text-sm">
                      Nama Barang
                    </th>
                    <th className="px-2 py-3 font-medium text-xs sm:px-4 sm:text-sm">
                      Jumlah
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
                    <th className="px-2 py-3 font-medium text-xs sm:px-4 sm:text-sm">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.uuid} className="hover:bg-muted">
                      <td className="px-2 py-3 sm:px-4">
                        <Combobox
                          value={item.itemId ? item.code : ""}
                          onValueChange={(value) => {
                            const selected = data.find((d) => d.code === value);
                            if (!selected) return;

                            updateItem(item.uuid, {
                              itemId: selected.id,
                              code: selected.code,
                              name: selected.name,
                              price: selected.price,
                            });

                            setSearchQueryByItemId((prev) => ({
                              ...prev,
                              [item.uuid]: selected.code,
                            }));
                          }}
                        >
                          <ComboboxInput
                            value={
                              searchQueryByItemId[item.uuid] ?? item.code ?? ""
                            }
                            placeholder="Cari kode barang"
                            onFocus={() => {
                              setActiveItemId(item.uuid);
                            }}
                            onChange={(e) => {
                              const value = e.target.value;

                              setActiveItemId(item.uuid);
                              setSearchQueryByItemId((prev) => ({
                                ...prev,
                                [item.uuid]: value,
                              }));

                              updateItem(item.uuid, {
                                itemId: undefined,
                                code: value,
                                name: "",
                                price: 0,
                              });
                            }}
                            className="w-full min-w-[120px]"
                          />
                          <ComboboxContent>
                            <ComboboxList>
                              {isFetching ? (
                                <ComboboxEmpty>Mencari...</ComboboxEmpty>
                              ) : data.length ? (
                                data.map((result, i) => (
                                  <ComboboxItem
                                    key={`${result.id}-${result.code}`}
                                    value={result.code}
                                    index={i}
                                  >
                                    <div className="flex justify-between gap-4">
                                      <div>
                                        <div className="font-medium">
                                          {result.code}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {result.name}
                                        </div>
                                      </div>
                                      <span className="whitespace-nowrap">
                                        Rp {result.price.toLocaleString()}
                                      </span>
                                    </div>
                                  </ComboboxItem>
                                ))
                              ) : (
                                <ComboboxEmpty>Tidak ditemukan</ComboboxEmpty>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </td>
                      <td className="px-2 py-3 sm:px-4">
                        <Input
                          value={item.name}
                          readOnly
                          placeholder="Nama otomatis"
                          className="w-full min-w-[120px]"
                        />
                      </td>
                      <td className="px-2 py-3 sm:px-4">
                        <Input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            handleQtyChange(item.uuid, e.target.value)
                          }
                          className="w-16 sm:w-20"
                        />
                      </td>

                      {role === "Admin" && (
                        <td className="px-2 py-3 sm:px-4">
                          <Input
                            value={item.price > 0 ? item.price.toString() : ""}
                            readOnly
                            placeholder="Harga otomatis"
                            className="w-full min-w-[100px]"
                          />
                        </td>
                      )}

                      {role === "Admin" && (
                        <td className="px-2 py-3 font-medium sm:px-4">
                          Rp {(item.qty * item.price).toLocaleString()}
                        </td>
                      )}

                      <td className="px-2 py-3 sm:px-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.uuid)}
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

            <div className="flex flex-col gap-4 rounded-lg border bg-muted p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Barang
              </Button>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto gap-2"
                >
                  Kembali
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isValid}
                  className="w-full sm:w-auto gap-2"
                >
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
