/** Shared admin UI primitives (server-safe). */

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-black/10 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-heading text-[26px] font-semibold text-[#161c26]">{title}</h1>
        {sub && <p className="mt-1 text-[14.5px] text-[#797f89]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] font-semibold text-[#161c26]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12.5px] text-[#797f89]">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "h-11 w-full rounded-lg border border-black/15 bg-white px-3.5 text-[14.5px] text-[#161c26] outline-none focus:border-[#455ce9]";

export const textareaCls =
  "w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-[14.5px] text-[#161c26] outline-none focus:border-[#455ce9]";

export function PrimaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className="rounded-lg bg-[#181c20] px-6 py-2.5 text-sm font-semibold text-white hover:shadow-md disabled:opacity-60"
      {...rest}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
      {...rest}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700 border-blue-200",
    READ: "bg-amber-50 text-amber-700 border-amber-200",
    ARCHIVED: "bg-gray-50 text-gray-600 border-gray-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
    REVIEWED: "bg-amber-50 text-amber-700 border-amber-200",
    HANDLED: "bg-green-50 text-green-700 border-green-200",
  };
  const cls = styles[status] ?? "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-block rounded-full border px-3 py-0.5 text-[12px] font-semibold ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <Card>
      <p className="py-8 text-center text-[14.5px] text-[#797f89]">{text}</p>
    </Card>
  );
}
