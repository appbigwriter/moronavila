import fs from 'fs';

let content = fs.readFileSync('mac-server.ts', 'utf8');

// Normalizar quebras de linha
content = content.replace(/\r\n/g, '\n');

// 1. Substituir bloco de inicialização do dotenv e supabase
const oldInitPattern = /dotenv\.config\(\{\s*path:\s*'\.env\.local'\s*\}\);[\s\S]*?const supabase = createClient\([\s\S]*?\);/;

const newInit = `// Carregar variaveis de ambiente (.env padrao e .env.local se existir)
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const execPromise = promisify(exec);
const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Admin Client com fallbacks seguros
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://supabase-control-tower-api.fbr.news';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'service-key-placeholder';
const supabaseSchema = process.env.CONTROL_TOWER_SCHEMA_NAME || process.env.VITE_SUPABASE_SCHEMA || 'custom_moronavila';

if (!process.env.SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
    console.warn('⚠️ [Aviso] Nenhuma SUPABASE_URL ou VITE_SUPABASE_URL definida no ambiente.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    db: {
        schema: supabaseSchema
    }
});`;

content = content.replace(oldInitPattern, newInit);

// 2. Adicionar rota /health se nao existir
if (!content.includes("app.get('/health'")) {
    const healthRoute = `
// --- HEALTH CHECK (EASYPANEL / CONTROL TOWER CONTRACT) ---
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'moronavila',
        schema: process.env.CONTROL_TOWER_SCHEMA_NAME || 'custom_moronavila',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'moronavila',
        schema: process.env.CONTROL_TOWER_SCHEMA_NAME || 'custom_moronavila',
        timestamp: new Date().toISOString()
    });
});
`;
    content = content.replace("app.use(express.json({ limit: '1mb' }));", "app.use(express.json({ limit: '1mb' }));\n" + healthRoute);
}

fs.writeFileSync('mac-server.ts', content, 'utf8');
console.log('mac-server.ts atualizado com sucesso!');
