import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://wethrtnxdiloeolzxzyd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldGhydG54ZGlsb2VvbHp4enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyMjM2NTUsImV4cCI6MjAzNzc5OTY1NX0.22Ie6AnvJG9ZFNR5EQb0y-SWjr5mY1B2qKu7h03Wpz4'
);