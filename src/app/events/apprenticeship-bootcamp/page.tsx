import { EventDetailShell } from "@/components/event-detail";
import { getEventProgramme } from "@/lib/events";

export const metadata = {
  title: "Apprenticeship Bootcamp | LEAF Pathways",
  description: "Comprehensive training for aspiring apprentices in tech and business.",
};

export default function ApprenticeshipBootcamp() {
  const programme = getEventProgramme("apprenticeship-bootcamp")!;
  return <EventDetailShell programme={programme} />;
}
