import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing environment variables. Check .env.local for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const admins = [
  { email: 'ahmedds8355@gmail.com', password: 'Aham@2024' },
  { email: 'jaydenhughes402@gmail.com', password: 'MrMotion100!' },
  { email: 'dignairydvs@gmail.com', password: '192300' }
]

async function createAdmins() {
  console.log('Creating admin users...\n')
  
  for (const admin of admins) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      })

      if (error) {
        console.error(`❌ Error creating ${admin.email}:`, error.message)
      } else {
        console.log(`✅ Created admin: ${admin.email}`)
        console.log(`   User ID: ${data.user.id}`)
      }
    } catch (err) {
      console.error(`❌ Exception for ${admin.email}:`, err.message)
    }
  }
  
  console.log('\n✨ Admin creation process complete!')
}

createAdmins()
