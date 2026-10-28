import { EntityManager, PROJECT_CONFIG } from "../_components/entities";

export default function Page() {
  return <EntityManager config={PROJECT_CONFIG} />;
}
