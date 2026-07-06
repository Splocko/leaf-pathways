import { EventDetailShell } from "@/components/event-detail";
import { getEventProgramme } from "@/lib/events";

export const metadata = {
  title: "Engineering Innovation Competition | LEAF Pathways",
  description: "Showcase your engineering skills and solve real-world problems.",
};

export default function EngineeringInnovation() {
  const programme = getEventProgramme("engineering-innovation")!;
  return <EventDetailShell programme={programme} />;
}
