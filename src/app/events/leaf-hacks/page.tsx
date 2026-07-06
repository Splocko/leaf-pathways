import { EventDetailShell } from "@/components/event-detail";
import { getEventProgramme } from "@/lib/events";

export const metadata = {
  title: "LEAF Hacks | LEAF Pathways",
  description: "A 24-hour hackathon bringing together builders, designers, and creators.",
};

export default function LeafHacks() {
  const programme = getEventProgramme("leaf-hacks")!;
  return <EventDetailShell programme={programme} />;
}
