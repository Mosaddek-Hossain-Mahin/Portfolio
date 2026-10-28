"use client";

import { useEffect, useState } from "react";

/** Footer local-time clock (demo: ticks every second, site timezone). */
export default function Clock({
  timezone,
  label,
}: {
  timezone: string;
  label: string;
}) {
  const [text, setText] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      try {
        const t = new Date().toLocaleTimeString("en-GB", {
          timeZone: timezone,
          hour12: false,
        });
        setText(`${t} — ${label}`);
      } catch {
        /* timezone unsupported: leave placeholder */
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [timezone, label]);
  return (
    <p className="clock" data-clock>
      {text}
    </p>
  );
}
