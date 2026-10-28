import { EntityManager, CERT_CONFIG } from "../_components/entities";

export default function Page() {
  return <EntityManager config={CERT_CONFIG} />;
}
