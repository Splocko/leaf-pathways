import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Read from environment; avoid hard crashes during static analysis.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Keep a single client instance in the browser global scope to avoid creating
// multiple GoTrueClient instances which warns about concurrent storage usage.
// Use a Symbol.for key to be robust across module reloads/HMR and multiple
// bundler realms.
const GLOBAL_KEY = Symbol.for('leaf.supabase.client') as unknown as string

function makeClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Not an error — the site degrades gracefully (empty states) until the
    // Supabase env vars are set. Warn once instead of erroring in the console.
    console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL / ANON_KEY not set — live data disabled')
    return null
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    })
  } catch (e) {
    console.error('[supabase] Failed to create client:', e)
    return null
  }
}

// Export a `supabase` instance that is stable across imports. On the server
// we create a fresh client (server-side usage should be infrequent here), but
// in the browser we reuse a global to avoid multiple instances.
let supabase: SupabaseClient | null = null
try {
  if (typeof window === 'undefined') {
    supabase = makeClient()
  } else {
    const g = globalThis as any
    if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = makeClient()
    supabase = g[GLOBAL_KEY]
  }
} catch (e) {
  console.error('[supabase] Module-level init error:', e)
}

export { supabase }

// Backwards-compatible getter — always safe to call from any context.
export const getSupabaseClient = (): SupabaseClient | null => {
  if (typeof window === 'undefined') return null
  try {
    const g = globalThis as any
    if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = makeClient()
    return g[GLOBAL_KEY] ?? null
  } catch {
    return null
  }
}

// Server-side helper: use the service role key only on server environments.
export function createServerSupabaseClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in server environment')
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  })
}

// Database Types
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
}

export interface Event {
  id: string
  created_at: string
  title: string
  date: string
  location: string
  description: string
  link: string | null
  is_active: boolean
}