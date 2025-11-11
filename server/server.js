import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post('/upload', async (req, res) => {
  try {
    const { name, base64 } = req.body;
    const buffer = Buffer.from(base64, 'base64');
    const { data, error } = await supabase.storage
      .from('chat_luax')
      .upload(`uploads/${Date.now()}-${name}`, buffer, {
        contentType: 'image/png',
        upsert: false
      });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('chat_luax').getPublicUrl(data.path);
    res.json({ url: urlData.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Chat_LuaX rodando na porta ${PORT}`));
