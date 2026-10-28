import { EntityManager, GALLERY_CONFIG } from "../_components/entities";

export default function Page() {
  return <EntityManager config={GALLERY_CONFIG} />;
}
