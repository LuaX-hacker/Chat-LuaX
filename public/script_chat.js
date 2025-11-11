
const supabase = supabaseClient();
const messagesContainer = document.getElementById('messages');

async function loadMessages() {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
  if (!error) {
    messagesContainer.innerHTML = '';
    data.forEach(msg => appendMessage(msg));
  }
}

function appendMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<strong>${msg.username}:</strong> ${msg.text || ''}`;
  if (msg.image_url) div.innerHTML += `<br><img src="${msg.image_url}" />`;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
  const message = document.getElementById('message').value;
  const fileInput = document.getElementById('image');
  let image_url = null;
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const base64 = await toBase64(file);
    const res = await fetch('/upload', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: file.name, base64 })
    });
    const data = await res.json();
    image_url = data.url;
  }
  await supabase.from('messages').insert([{ username: 'Usuário', text: message, image_url }]);
  document.getElementById('message').value = '';
  loadMessages();
}

function supabaseClient() {
  return window.supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
}

loadMessages();
supabase.channel('public:messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, loadMessages).subscribe();
