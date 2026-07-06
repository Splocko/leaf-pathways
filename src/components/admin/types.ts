import type { EventDatePrecision, EventStatus } from '@/lib/events'

export interface CommunityMember {
  id: string
  created_at: string
  full_name: string
  email: string
  age: number
  location: string
  race_ethnicity: string
  year_group: string
  industry: string
  pathway: string
  // Widening Participation Fields
  first_gen_university?: boolean | null
  free_school_meals?: boolean | null
  care_experience?: boolean | null
  postcode_area?: string | null
  referral_source?: string | null
}

export interface Event {
  id: string
  title: string
  date: string
  location: string
  description?: string
  short_description: string
  full_description?: string | null
  event_type: 'In-Person' | 'Virtual'
  image_url?: string | null
  link: string | null
  is_active: boolean
  is_published?: boolean
  is_sold_out?: boolean
  event_date_precision?: EventDatePrecision | null
  event_status?: EventStatus | 'past' // 'past' kept for backward compat, maps to 'completed'
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image_url: string | null
  category: string
  author_name: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Webinar {
  id: string
  title: string
  description: string | null
  speaker_name: string | null
  speaker_title: string | null
  thumbnail_url: string | null
  video_url: string | null
  duration_minutes: number | null
  topic: string | null
  is_published: boolean
  webinar_date: string | null
  created_at: string
}
