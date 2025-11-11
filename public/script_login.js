
const supabase = supabaseClient();
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  window.location.href = 'chat.html';
}
function supabaseClient() {
  return window.supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');
}
