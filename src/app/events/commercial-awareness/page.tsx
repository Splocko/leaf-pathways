import { EventDetailShell } from "@/components/event-detail";
import { getEventProgramme } from "@/lib/events";

export const metadata = {
  title: "Commercial Awareness Competition | LEAF Pathways",
  description: "Test your business acumen and compete for recognition and prizes.",
};

export default function CommercialAwareness() {
  const programme = getEventProgramme("commercial-awareness")!;
  return <EventDetailShell programme={programme} />;
}
