import { EntityManager, EXPERIENCE_CONFIG } from "../_components/entities";

export default function Page() {
  return <EntityManager config={EXPERIENCE_CONFIG} />;
}
