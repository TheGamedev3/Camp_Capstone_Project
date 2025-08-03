
import Gameplay from "@Gameplay/Looks/Gameplay";
import PageHeader from "@/components/PageHeader";

export default function PlayersPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="🌲 FOREST"
        subtitle="Gather wood! 🪵"
      />
      <Gameplay/>
    </div>
  );
}
