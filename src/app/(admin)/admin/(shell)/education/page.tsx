import { EntityManager, EDUCATION_CONFIG } from "../_components/entities";

export default function Page() {
  return <EntityManager config={EDUCATION_CONFIG} />;
}
