
// =====================================
// PANDAWORLD - CONEXÃO SUPABASE
// =====================================

const SUPABASE_URL = "https://vdlrtaetrvvrroivmvok.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_skIJsHnnl-rwmHtK91KL_A_yg_8Bchx";

const pandaSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("🐼 PandaWorld conectado ao Supabase!");
