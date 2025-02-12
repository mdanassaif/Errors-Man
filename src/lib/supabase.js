import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://dprwyniwxizmisxkjzng.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcnd5bml3eGl6bWlzeGtqem5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4ODg4OTQsImV4cCI6MjA1MTQ2NDg5NH0.uXOUOKQ67NvnuvVdXbXNF9GgMyor4ZrUEzLFFPsQoIw'
);