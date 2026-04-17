import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
import { Check, User, Package, FileText } from "lucide-react";

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

export default function WizardStep1() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const client = useInvoiceStore((state) => state.client);
  const setClient = useInvoiceStore((state) => state.setClient);

  const [form, setForm] = useState(client);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  useEffect(() => {
    setForm(client);
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = {
      ...form,
      [e.target.id]: e.target.value,
    };
    setForm(next);
    setClient(next);
  };

  const handleNext = () => {
    setClient(form);
    router.push("/wizard/step-2");
  };

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
              const isActive = index === 0;
              const isCompleted = false;

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
            <div className="h-2 w-1/3 rounded-full bg-primary transition-all duration-300"></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Data Klien</CardTitle>
            <CardDescription>
              Masukkan informasi pengirim dan penerima untuk invoice pengiriman
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sender">Nama Pengirim</Label>
                <Input
                  id="sender"
                  value={form.sender}
                  onChange={handleChange}
                  placeholder="Masukkan nama pengirim"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver">Nama Penerima</Label>
                <Input
                  id="receiver"
                  value={form.receiver}
                  onChange={handleChange}
                  placeholder="Masukkan nama penerima"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderAddress">Alamat Pengirim</Label>
              <Input
                id="senderAddress"
                value={form.senderAddress}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap pengirim"
                required
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} size="lg">
                Lanjut ke Data Barang
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
