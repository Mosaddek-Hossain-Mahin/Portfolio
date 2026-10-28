import { connection } from "next/server";
import NavLinks from "./_components/NavLinks";
import LogoutButton from "./_components/LogoutButton";
import MobileMenuClient from "./_components/MobileMenuClient";
import { getSettings } from "@/lib/site";

// Admin pages must always render at request time (session cookies + live DB).
export const instant = false;

/** Admin shell: dark sidebar + content area (portfolio accent #455ce9). */
export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen bg-[#f4f4f2] text-[#161c26]">
      <aside className="hidden w-[260px] shrink-0 flex-col bg-[#101012] p-5 md:flex">
        <div className="flex items-center gap-3 px-2 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#455ce9] font-heading text-[18px] font-semibold text-white">
            {(settings.siteName || "M").charAt(0)}
          </span>
          <span className="font-heading text-[17px] font-semibold text-white">
            {settings.siteName} Admin
          </span>
        </div>
        <div className="mt-4 flex-1">
          <NavLinks />
        </div>
        <LogoutButton />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between bg-[#101012] px-5 py-3.5 md:hidden">
          <span className="font-heading text-[16px] font-semibold text-white">
            {settings.siteName} Admin
          </span>
          <MobileMenuClient />
        </div>
        <main className="mx-auto w-full max-w-[1080px] flex-1 px-5 py-8">{children}</main>
      </div>
    </div>
  );
}
