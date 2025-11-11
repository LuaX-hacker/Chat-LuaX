
const supabase = supabaseClient();
async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);
  alert('Conta criada! Agora faça login.');
  window.location.href = 'login.html';
}
function supabaseClient() {
  return window.supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');
}
