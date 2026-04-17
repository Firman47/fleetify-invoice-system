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
import { useInvoiceStore } from "@/store/invoice.store";
import { Check, User, Package, FileText, ArrowLeft } from "lucide-react";

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

  const client = useInvoiceStore((state) => state.client);
  const setClient = useInvoiceStore((state) => state.setClient);
  const resetInvoice = useInvoiceStore((s) => s.resetInvoice);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setClient({
      ...client,
      [name]: value,
    });
  };

  const handleNext = () => {
    router.push("/wizard/step-2");
  };

  const isValid = client.sender && client.receiver && client.senderAddress;

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
              const isActive = index === 0;
              const isCompleted = false;

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
            <div className="h-2 w-1/3 rounded-full bg-primary transition-all duration-300"></div>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle>Data Klien</CardTitle>
            <CardDescription>
              Masukkan informasi pengirim dan penerima
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="sender">Nama Pengirim</Label>
                <Input
                  name="sender"
                  value={client.sender}
                  onChange={handleChange}
                  placeholder="Masukkan nama pengirim"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="receiver">Nama Penerima</Label>
                <Input
                  name="receiver"
                  value={client.receiver}
                  onChange={handleChange}
                  placeholder="Masukkan nama penerima"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="senderAddress">Alamat Pengirim</Label>
              <Input
                name="senderAddress"
                value={client.senderAddress}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap pengirim"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleNext}
                disabled={!isValid}
                className="w-full sm:w-auto"
              >
                Lanjut
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
