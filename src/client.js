// src/client.js
import { createClient } from '@supabase/supabase-js'

// Use the environment variables from the .env file
const URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(URL, API_KEY);
