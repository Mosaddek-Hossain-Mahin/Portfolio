import { EntityManager, TESTIMONIAL_CONFIG } from "../_components/entities";

export default function Page() {
  return <EntityManager config={TESTIMONIAL_CONFIG} />;
}
