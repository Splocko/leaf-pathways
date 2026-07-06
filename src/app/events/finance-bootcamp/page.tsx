import { EventDetailShell } from "@/components/event-detail";
import { getEventProgramme } from "@/lib/events";

export const metadata = {
  title: "Finance Bootcamp | LEAF Pathways",
  description: "Master financial skills and launch your career in finance.",
};

export default function FinanceBootcamp() {
  const programme = getEventProgramme("finance-bootcamp")!;
  return <EventDetailShell programme={programme} />;
}
