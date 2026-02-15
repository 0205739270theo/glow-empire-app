import { createClient } from '@supabase/supabase-js'

// 👇 COPY "Project URL" from your screenshot and paste it here
const supabaseUrl = 'https://vkwmupxjiitcfnxkwuhm.supabase.co'

// 👇 COPY "Publishable Key" (starting with sb_publishable...) and paste it here
const supabaseKey = 'sb_publishable_OFyBR4P3FSpGc6ktF-aFUw_fmB7mMRo'

export const supabase = createClient(supabaseUrl, supabaseKey)