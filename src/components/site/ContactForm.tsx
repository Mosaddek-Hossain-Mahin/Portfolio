"use client";

import { useRef, useState } from "react";

/**
 * Contact form — demo UX (same fields, validation messages and success
 * state), wired to POST /api/contact which validates, spam-guards and
 * saves the message. The hidden "website" field is a honeypot: humans
 * never see or fill it; bots that do are silently dropped server-side.
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [errorShow, setErrorShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      org: String(fd.get("org") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      website: String(fd.get("website") || ""),
    };
    const ok =
      payload.name.length > 1 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) &&
      payload.message.length > 3;
    if (!ok) {
      setError("Please fill in your name, a valid email and a message.");
      setErrorShow(true);
      return;
    }
    setErrorShow(false);
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Something went wrong — please try again.");
        setErrorShow(true);
        setSending(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error — please check your connection and try again.");
      setErrorShow(true);
      setSending(false);
    }
  };

  const again = () => {
    formRef.current?.reset();
    setSent(false);
    setSending(false);
    setErrorShow(false);
  };

  return (
    <div>
      {!sent && (
        <form id="contactForm" noValidate ref={formRef} onSubmit={submit}>
          <div className="c-field">
            <span className="no">01</span>
            <div>
              <label htmlFor="fName">What&apos;s your name?</label>
              <input id="fName" name="name" type="text" placeholder="Your name *" autoComplete="name" required />
            </div>
          </div>
          <div className="c-field">
            <span className="no">02</span>
            <div>
              <label htmlFor="fEmail">What&apos;s your email?</label>
              <input id="fEmail" name="email" type="email" placeholder="you@company.com *" autoComplete="email" required />
            </div>
          </div>
          <div className="c-field">
            <span className="no">03</span>
            <div>
              <label htmlFor="fOrg">What&apos;s the name of your organization?</label>
              <input id="fOrg" name="org" type="text" placeholder="Company or studio" autoComplete="organization" />
            </div>
          </div>
          <div className="c-field">
            <span className="no">04</span>
            <div>
              <label htmlFor="fMsg">Your message</label>
              <textarea id="fMsg" name="message" rows={4} placeholder="Tell me about the project — goals, timeline, budget… *" required></textarea>
            </div>
          </div>
          {/* Honeypot — hidden from humans, tempting to bots. */}
          <div className="sr" aria-hidden="true">
            <label htmlFor="fWebsite">Website (leave empty)</label>
            <input id="fWebsite" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <p className={`form-error${errorShow ? " show" : ""}`} id="formError" role="alert">
            {error || "Please fill in your name, a valid email and a message."}
          </p>
          <div className="form-foot">
            <button type="submit" className="round-btn magnetic" id="sendBtn" disabled={sending}>
              <span className="mag-in">{sending ? "Sending…" : "Send it!"}</span>
            </button>
          </div>
        </form>
      )}
      <div className={`form-success${sent ? " show" : ""}`} id="formSuccess" role="status" style={sent ? undefined : { display: "none" }}>
        <h3>Message received — thank you.</h3>
        <p>
          Thanks for reaching out. I&apos;ll get back to you within one working day with next
          steps and a few times for a short intro call.
        </p>
        <button className="text-btn" id="againBtn" onClick={again}>
          Send another message <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
