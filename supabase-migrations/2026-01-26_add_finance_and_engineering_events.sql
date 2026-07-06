-- Add Finance Bootcamp and Engineering Competition events
-- Run this migration via Supabase dashboard SQL editor or apply_migration tool

-- Finance Bootcamp 2026
INSERT INTO public.events (
  title,
  date,
  location,
  description,
  short_description,
  full_description,
  event_type,
  image_url,
  link,
  is_active,
  is_published
) VALUES (
  'LEAF | Finance Bootcamp 2026',
  '2026-03-14T13:00:00Z',
  'CEME Campus, Rainham, England',
  'The biggest finance event of the year, featuring speakers from Audit, Banking, Hedge Funds, and Investment Banking. Practical insight, interactive workshops, and financial literacy sessions sponsored by Vestorgrow.',
  'The biggest finance event of the year featuring speakers from Audit, Banking, Hedge Funds, and Investment Banking with interactive workshops and financial literacy sessions.',
  E'Interested in a career in Finance?\n\nLeaf Pathways presents our biggest finance event of the year, featuring speakers from all corners of the industry:\n\n• **Audit** (Luca Chigbo)\n• **Banking** (Juniour David)\n• **Hedge Funds** (Andrew Kwabena)\n• **Investment Banking** (Jade Marie)\n\nDesigned to give students practical insight and a stronger understanding of finance and its diverse opportunities.\n\nStudents will be exposed to authentic, game changing insight from current young professionals and senior experts, translating that through interactive workshops.\n\nAs well as covering personal finances, financial literacy and introductions to wealth creation through our event Sponsor, Vestorgrow!\n\n**Date:** Saturday, March 14, 2026\n**Time:** 1:00 PM - 4:30 PM GMT\n**Location:** CEME Campus, Marsh Way, Rainham RM13 8EU, UK\n**Ticket Price:** £8.99\n\nInterested in Finance? We will see you in London.',
  'In-Person',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
  'https://luma.com/uo2r3jof',
  true,
  true
);

-- Engineering Competition 2026 (Webinar announcement TBA)
INSERT INTO public.events (
  title,
  date,
  location,
  description,
  short_description,
  full_description,
  event_type,
  image_url,
  link,
  is_active,
  is_published
) VALUES (
  'LEAF Engineering Prospect Competition 2026',
  '2026-04-15T18:00:00Z',
  'Virtual',
  'A national engineering competition giving aspiring UK students early exposure to real-world engineering, industry professionals, and career pathways. Webinar announcement coming soon.',
  'A national engineering competition connecting UK students with real-world engineering challenges and industry professionals. Details announced in upcoming webinar.',
  E'**LEAF Engineering Prospect Competition 2026**\n\n_A national engineering competition giving aspiring UK students early exposure to real-world engineering, industry professionals, and career pathways._\n\n**How it works:**\n• Students respond to a real engineering challenge (virtual stage)\n• Top finalists are invited to an in-person, Dragons'' Den–style pitch at an engineering firm\n• Ideas are judged by engineers and technical leaders\n• One winner is crowned LEAF Engineering Prospect of the Year\n\n**Why it matters:**\n• Tackles the lack of early engineering exposure in the UK\n• Builds problem-solving, sustainability thinking & communication skills\n• Connects students directly with industry role models\n\n**Reach & impact:**\n• 2,500+ students nationwide\n• 50,000+ student audience across digital platforms\n\n**Eligibility:**\n• Students aged 16 and above in Years 11 to 13, on a gap year, or in university\n• Participants can enter individually or in duos\n• For students interested in the Engineering sector\n\n**Competition Structure:**\n\n**Round 1:** Choose one of four scenarios and develop a design proposal. There is no required format; however, your proposal should clearly explain your idea and how it works. Strong entries often include:\n• Brief introduction and problem definition\n• Key objectives or constraints\n• Explanation of how the design developed\n• Main features of the final solution with engineering considerations (feasibility, sustainability)\n• Short conclusion reflecting on impact and trade-offs\n\nYou may include supporting elements such as sketches, calculations, cost estimates, or CAD models. Submit in any format compatible with the submission form.\n\n**Round 2:** The top eight proposals will be invited to AtkinsRéalis'' Nova office in London to deliver a 5-minute pitch to a panel of engineering professionals (AtkinsRéalis engineers, recruiters, Oxbridge graduates, entrepreneurs, PhD engineers).\n\nAfter the pitch, participants attend a structured Insight Workshop including:\n• Introduction to AtkinsRéalis\n• Careers insight session with industry professionals\n• Networking opportunities\n• Celebratory lunch and networking with professionals\n\nThe individual or duo with the winning design proposal will be crowned the **#1 Engineering Prospect(s) in the UK**.\n\n_Where applicable, travel and other costs will be subsidised._\n\n**Partner involvement:**\n• Judge or mentor finalists\n• Sponsor the competition & student prizes\n• Engage with the next generation of engineering talent\n\n**Goal:** To turn engineering potential into opportunity.\n\n_Full competition details and registration will be announced in an upcoming webinar._',
  'Virtual',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
  null,
  true,
  true
);

-- Verify the inserts
SELECT id, title, date, location, event_type, is_active FROM public.events ORDER BY date DESC;
