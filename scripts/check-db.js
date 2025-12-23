const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
  console.log("Checking Supabase connection...");
  try {
    const { data, error } = await supabase.from('site_content').select('*');
    
    if (error) {
      console.error("Error connecting to site_content table:", error.message);
    } else {
      console.log("Connection successful. Rows found:", data.length);
      if (data.length > 0) {
        console.log("First row key:", data[0].key);
        console.log("First row updated_at:", data[0].updated_at);
      } else {
        console.log("Table is empty.");
      }
    }
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}

check();
