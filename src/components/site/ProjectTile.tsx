import type { ProjectView } from "@/lib/site";

/** Project tile (demo tileHTML) — used on Home and the Work page. */
export default function ProjectTile({ project }: { project: ProjectView }) {
  return (
    <a
      className="tile"
      href={`/work/${project.slug}`}
      data-project={project.slug}
      data-label={project.title}
      aria-label={`View the ${project.title} case study`}
    >
      {project.thumb ? (
        <div className="thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.thumb} alt={project.thumbAlt} loading="lazy" />
          <span className="view">View case</span>
        </div>
      ) : (
        <div className="thumb motion-cover" role="img" aria-label={project.thumbAlt}>
          <div className="rings">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <span className="play">▶</span>
          <span className="mc-word">Showreel &rsquo;23</span>
        </div>
      )}
      <div className="meta">
        <h3>{project.title}</h3>
        <span className="yr">{project.year}</span>
      </div>
      <div className="sub">
        <span>{project.catLabel}</span>
      </div>
      <div className="rule"></div>
    </a>
  );
}
