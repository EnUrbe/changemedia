"use client";

import { useState } from "react";

export type PortraitInquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  school: string | null;
  session_type: string | null;
  service_type: string;
  source: string | null;
  status: string;
  created_at: string;
  mercury_payment_id: string | null;
};

type Props = {
  inquiries: PortraitInquiry[];
  serviceDepositMap: Record<string, number>;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NEW: "bg-blue-500/15 text-blue-400",
    CONTACTED: "bg-yellow-500/15 text-yellow-400",
    PAYMENT_PENDING: "bg-orange-500/15 text-orange-400",
    DEPOSIT_PAID: "bg-emerald-500/15 text-emerald-400",
    SCHEDULED: "bg-purple-500/15 text-purple-400",
    SHOT_DONE: "bg-teal-500/15 text-teal-400",
    GALLERY_SENT: "bg-green-500/15 text-green-400",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[status] ?? "bg-white/10 text-white/50"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function PortraitInquiriesDashboard({ inquiries, serviceDepositMap }: Props) {
  const [depositState, setDepositState] = useState<
    Record<string, { loading: boolean; url: string | null; error: string | null }>
  >({});

  if (inquiries.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 p-8 text-center text-sm text-white/40">
        No inquiries yet. Submissions from the grad page will appear here.
      </div>
    );
  }

  async function generateDeposit(inquiry: PortraitInquiry) {
    setDepositState((prev) => ({
      ...prev,
      [inquiry.id]: { loading: true, url: null, error: null },
    }));
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId: inquiry.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate deposit link");
      setDepositState((prev) => ({
        ...prev,
        [inquiry.id]: { loading: false, url: json.paymentUrl, error: null },
      }));
    } catch (err) {
      setDepositState((prev) => ({
        ...prev,
        [inquiry.id]: {
          loading: false,
          url: null,
          error: err instanceof Error ? err.message : "Error",
        },
      }));
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 font-medium">Name</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 font-medium">Contact</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 font-medium">School</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 font-medium">Session</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 font-medium">Status</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 font-medium">Date</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 font-medium">Deposit</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => {
            const ds = depositState[inquiry.id];
            const depositCents = serviceDepositMap[inquiry.service_type];
            const depositDollars = depositCents ? `$${depositCents / 100}` : null;
            const existingPaymentId = inquiry.mercury_payment_id;

            return (
              <tr
                key={inquiry.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 font-medium text-white">{inquiry.full_name}</td>
                <td className="px-4 py-3">
                  <div className="text-white/80">{inquiry.email}</div>
                  {inquiry.phone && (
                    <div className="text-white/40 text-xs mt-0.5">{inquiry.phone}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-white/60">{inquiry.school ?? "—"}</td>
                <td className="px-4 py-3 text-white/60">{inquiry.session_type ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={inquiry.status} />
                </td>
                <td className="px-4 py-3 text-white/40 whitespace-nowrap">{formatDate(inquiry.created_at)}</td>
                <td className="px-4 py-3">
                  {existingPaymentId && !ds?.url ? (
                    <span className="text-xs text-white/40 font-mono">{existingPaymentId.slice(0, 12)}…</span>
                  ) : ds?.url ? (
                    <a
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-emerald-400 hover:underline"
                    >
                      Open link ↗
                    </a>
                  ) : ds?.error ? (
                    <span className="text-xs text-red-400">{ds.error}</span>
                  ) : (
                    <button
                      type="button"
                      disabled={ds?.loading}
                      onClick={() => generateDeposit(inquiry)}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 hover:border-white/30 hover:text-white transition-colors disabled:opacity-40"
                    >
                      {ds?.loading
                        ? "Generating…"
                        : depositDollars
                        ? `Generate ${depositDollars} deposit`
                        : "Generate deposit"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
