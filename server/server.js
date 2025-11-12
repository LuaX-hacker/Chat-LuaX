import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";

// ---------- CONFIG BÁSICA ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public"))); // serve HTML, CSS, JS

// ---------- SUPABASE ----------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ---------- ROTAS DE PÁGINA ----------

// Página principal → login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Página de registro
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

// Página do chat
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/chat.html"));
});

// ---------- ROTAS DE API ----------

// Registrar usuário
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, email, password }]);

    if (error) throw error;
    res.status(200).json({ message: "Usuário registrado com sucesso!", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) throw new Error("Credenciais inválidas");
    res.status(200).json({ message: "Login realizado com sucesso", user: data });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// ---------- START ----------
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
