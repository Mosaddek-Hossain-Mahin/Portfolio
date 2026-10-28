import { EntityManager, TECHNOLOGY_CONFIG } from "../_components/entities";

export default function Page() {
  return <EntityManager config={TECHNOLOGY_CONFIG} />;
}
