import { useEffect } from "react";
import { useInvoiceStore } from "@/store/invoice.store";
import { useAuthStore } from "@/store/auth.store";

export default function InvoicePrint() {
  const client = useInvoiceStore((state) => state.client);
  const items = useInvoiceStore((state) => state.items);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Trigger print dialog automatically
    window.print();
  }, []);

  const totalInvoice = items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  const handleBack = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-white p-0 print:p-0">
      {/* Print Area */}
      <div className="mx-auto max-w-4xl bg-white p-8">
        {/* Header */}
        <div className="mb-8 border-b-2 border-gray-900 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-sm text-gray-600 mt-1">Fleetify Logistics</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Tanggal:</span>{" "}
                {new Date().toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">User:</span> {user?.username}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Role:</span> {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-gray-900">
              Pengirim
            </h2>
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="text-sm font-semibold text-gray-900">
                {client.sender || "-"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {client.senderAddress || "-"}
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-gray-900">
              Penerima
            </h2>
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="text-sm font-semibold text-gray-900">
                {client.receiver || "-"}
              </p>
              <p className="text-sm text-gray-600 mt-1">-</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase text-gray-900">
            Detail Barang
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  No
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Kode Barang
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Nama Barang
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-900">
                  Qty
                </th>
                {user?.role === "Admin" && (
                  <>
                    <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Harga
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Total
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.uuid} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                    {item.code || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                    {item.name || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900">
                    {item.qty}
                  </td>
                  {user?.role === "Admin" && (
                    <>
                      <td className="border border-gray-300 px-4 py-2 text-right text-sm text-gray-900">
                        {item.price > 0
                          ? `Rp ${item.price.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900">
                        {item.qty > 0 && item.price > 0
                          ? `Rp ${(item.qty * item.price).toLocaleString()}`
                          : "-"}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mb-8 flex justify-end">
          <div className="w-full max-w-xs">
            <div className="space-y-2 border-t-2 border-gray-900 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Jumlah Item:</span>
                <span className="font-semibold text-gray-900">{totalQty}</span>
              </div>
              {user?.role === "Admin" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    Rp {totalInvoice.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-300 pt-2 text-lg">
                <span className="font-bold text-gray-900">Total Invoice:</span>
                <span className="font-bold text-gray-900">
                  {user?.role === "Admin"
                    ? `Rp ${totalInvoice.toLocaleString()}`
                    : "Dihitung di Backend"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6">
          <div className="flex justify-between text-xs text-gray-500">
            <div>
              <p>Fleetify Invoice System</p>
              <p>© {new Date().getFullYear()} - All rights reserved</p>
            </div>
            <div className="text-right">
              <p>Dicetak pada: {new Date().toLocaleString("id-ID")}</p>
              <p>Status: Berhasil dibuat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Only - Close Button */}
      <div className="print:hidden fixed bottom-4 right-4 flex gap-2">
        <button
          onClick={handleBack}
          className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-400"
        >
          Tutup
        </button>
      </div>

      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          * {
            box-sizing: border-box;
          }
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
