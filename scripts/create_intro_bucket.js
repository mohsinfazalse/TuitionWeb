import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

// Load environment variables (Supabase URL and service‑role key must be set)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('[❌] Missing SUPABASE_URL or SERVICE_ROLE_KEY. Set them in .env.local.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createBucket() {
  console.log('[🛠️] Creating "intro-videos" bucket...');
  const { data, error } = await supabase.storage.createBucket('intro-videos', {
    public: false,
    fileSizeLimit: 50 * 1024 * 1024, // 50 MB
    allowedMimeTypes: ['video/mp4', 'video/webm'],
  });
  if (error) {
    if (error.status === 409) {
      console.warn('[⚠️] Bucket already exists.');
    } else {
      console.error('[❌] Failed to create bucket:', error.message);
      process.exit(1);
    }
  } else {
    console.log('[✅] Bucket created successfully:', data);
  }
}

createBucket()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[❌] Unexpected error:', e);
    process.exit(1);
  });
