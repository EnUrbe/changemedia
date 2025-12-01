"use client";

import { useEffect, useMemo, useState } from "react";
import { SERVICES } from "@/lib/portraitServices";

export type PortraitInquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  school: string | null;
  session_type: string | null;
  service_type: string | null;
  source: string | null;
  status: string | null;
  created_at: string;
  mercury_payment_id: string | null;
};

const STATUS_OPTIONS = [
  "ALL",
  "NEW",
  "CONTACTED",
  "PAYMENT_PENDING",
  "DEPOSIT_PAID",
  "SCHEDULED",
  "SHOT_DONE",
  "GALLERY_SENT",
] as const;

const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(SERVICES).map(([key, value]) => [key, value.label])
);

type Props = {
  inquiries: PortraitInquiry[];
  serviceDepositMap: Record<string, number>;
};

export default function PortraitInquiriesDashboard({ inquiries, serviceDepositMap }: Props) {
  const [rows, setRows] = useState<PortraitInquiry[]>(inquiries);
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, { url: string; copied?: boolean }>>({});

  useEffect(() => {
    setRows(inquiries);
  }, [inquiries]);

  const serviceOptions = useMemo(() => {
    const set = new Set<string>(["ALL", ...Object.keys(SERVICE_LABELS)]);
    rows.forEach((inq) => {
      if (inq.service_type) set.add(inq.service_type);
    });
    return Array.from(set);
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((inq) => {
      const matchesService = serviceFilter === "ALL" || (inq.service_type || "portrait_general") === serviceFilter;
      const matchesStatus = statusFilter === "ALL" || (inq.status || "NEW") === statusFilter;
      return matchesService && matchesStatus;
    });
  }, [rows, serviceFilter, statusFilter]);

  async function handleCreateDeposit(inquiry: PortraitInquiry) {
    setLoadingId(inquiry.id);
    try {
      const defaultAmount = serviceDepositMap[inquiry.service_type || "portrait_general"] || 10000;
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId: inquiry.id, amountCents: defaultAmount }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Failed to create payment");
      }

      setMessages((prev) => ({
        ...prev,
        [inquiry.id]: { url: json.paymentUrl, copied: false },
      }));
      setRows((prev) =>
        prev.map((row) =>
          row.id === inquiry.id
            ? { ...row, status: "PAYMENT_PENDING", mercury_payment_id: "pending" }
            : row
        )
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) => ({
        ...prev,
        [inquiry.id]: { url: "", copied: false },
      }));
      alert(error instanceof Error ? error.message : "Unable to create payment link");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCopy(url: string, inquiryId: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessages((prev) => ({
        ...prev,
        [inquiryId]: { ...prev[inquiryId], copied: true },
      }));
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [inquiryId]: { ...prev[inquiryId], copied: false },
        }));
      }, 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <label className="text-sm text-white/60">
          Service
          <select
            value={serviceFilter}
            onChange={(event) => setServiceFilter(event.target.value)}
            className="mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
          >
            {serviceOptions.map((option) => (
              <option key={option} value={option} className="bg-neutral-900 text-white">
                {option === "ALL" ? "All services" : SERVICE_LABELS[option] || option}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-white/60">
          Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option} className="bg-neutral-900 text-white">
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/40">
            <tr>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Session</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((inquiry) => {
              const message = messages[inquiry.id];
              const created = new Date(inquiry.created_at).toLocaleString();
              const amountLabel = serviceDepositMap[inquiry.service_type || "portrait_general"] ?? 10000;
              const currencyLabel = (amountLabel / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              });
              return (
                <tr key={inquiry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{inquiry.full_name}</div>
                    <div className="text-xs text-white/60">{inquiry.email}</div>
                    {inquiry.phone && <div className="text-xs text-white/60">{inquiry.phone}</div>}
                    {inquiry.school && <div className="text-xs text-white/40">{inquiry.school}</div>}
                  </td>
                  <td className="px-4 py-3 text-white/80">{SERVICE_LABELS[inquiry.service_type || "portrait_general"] || inquiry.service_type || "Portraits"}</td>
                  <td className="px-4 py-3 text-white/80">{inquiry.session_type || "—"}</td>
                  <td className="px-4 py-3 text-white/80">{inquiry.source || "direct"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/80 bg-white/5">
                      {inquiry.status || "NEW"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/60">{created}</td>
                  <td className="px-4 py-3">
                    {message?.url ? (
                      <div className="flex flex-col gap-2">
                        <a
                          href={message.url}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate text-sm text-white underline decoration-white/40 hover:decoration-white"
                        >
                          {message.url}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopy(message.url, inquiry.id)}
                          className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                        >
                          {message.copied ? "Copied" : "Copy link"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCreateDeposit(inquiry)}
                        disabled={loadingId === inquiry.id}
                        className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-50 hover:bg-white/90 transition-colors"
                      >
                        {loadingId === inquiry.id ? "Creating…" : `Create deposit (${currencyLabel})`}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-white/40">No inquiries match the current filters.</p>
        )}
      </div>
    </section>
  );
}
