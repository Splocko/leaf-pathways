import { EventDetailShell } from "@/components/event-detail";
import { getEventProgramme } from "@/lib/events";

export const metadata = {
  title: "Healthcare Bootcamp | LEAF Pathways",
  description: "UCAS prep, personal statements, work experience and application support.",
};

export default function HealthcareBootcamp() {
  const programme = getEventProgramme("healthcare-bootcamp")!;
  return <EventDetailShell programme={programme} />;
}
