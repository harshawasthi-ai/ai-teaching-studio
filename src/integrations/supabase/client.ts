import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 
  "https://uvpwcmawvdcisiwjrwup.supabase.co"
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cHdjbWF3dmRjaXNpd2pyd3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzIwMzAsImV4cCI6MjA5NDEwODAzMH0.q-iqbAVO97fl1wEdkVchO9sm2CyedzFREFNfpm6da40"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
