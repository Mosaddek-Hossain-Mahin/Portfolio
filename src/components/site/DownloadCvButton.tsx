/**
 * "Download CV" pill button (site button style, download icon).
 * Rendered ONLY when a CV is set in Admin → Settings (settings.cvUrl) —
 * the same hidden-until-real rule as the projects' live-site button.
 * Callers check `settings.cvUrl` before rendering this.
 */
export default function DownloadCvButton({ cvUrl }: { cvUrl: string }) {
  return (
    <a className="pill-btn live-btn magnetic" href={cvUrl} download>
      <span className="mag-in" style={{ display: "inline-flex", alignItems: "center", gap: ".5em" }}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v12" />
          <path d="m6 11 6 6 6-6" />
          <path d="M4 21h16" />
        </svg>
        Download CV
      </span>
    </a>
  );
}
