import { createClient } from '@supabase/supabase-js'

// Supabaseのプロジェクトごとに一意な公開情報。実際のアクセス制御は
// データベース側のRow Level Security（supabase/schema.sql）で行うため、
// この値自体を秘匿する必要はない。
const SUPABASE_URL = 'https://gtsbboiuthhwtbiknyfl.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0c2Jib2l1dGhod3RiaWtueWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NDE5MzYsImV4cCI6MjA5OTQxNzkzNn0.NRX3_i95YFInRe6erjOVDmDyCJ6NYKckg3mMHxJbzh8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
