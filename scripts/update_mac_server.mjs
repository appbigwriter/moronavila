import fs from 'fs';

let content = fs.readFileSync('mac-server.ts', 'utf8');
content = content.replace(/\r\n/g, '\n');

// 1. Garantir que o host e port estejam corretos no início
const oldInitPattern = /\/\/ Carregar variaveis de ambiente[\s\S]*?const supabase = createClient\([\s\S]*?\);\n\};?/m;

// Substituir porta e host
content = content.replace("const port = process.env.PORT || 4000;", "const port = process.env.PORT || 3000;\nconst host = process.env.HOST || '0.0.0.0';");
content = content.replace("const port = process.env.PORT || 3000;", "const port = process.env.PORT || 3000;\nconst host = process.env.HOST || '0.0.0.0';");

// 2. Adicionar suporte a favicon.ico
if (!content.includes("app.get('/favicon.ico'")) {
    const faviconRoute = `
// Rota de Favicon explícita
app.get('/favicon.ico', (req, res) => {
    const faviconPath = path.resolve(__dirname, 'dist', 'favicon.png');
    if (fs.existsSync(faviconPath)) {
        res.sendFile(faviconPath);
    } else {
        res.status(204).end();
    }
});
`;
    content = content.replace("app.use(express.static(path.join(__dirname, 'dist')));", faviconRoute + "\napp.use(express.static(path.join(__dirname, 'dist')));");
}

// 3. Substituir app.listen para escutar em host 0.0.0.0
const oldListenPattern = /app\.listen\(port,\s*\(\)\s*=>\s*\{[\s\S]*?\}\);/;
const newListen = `app.listen(Number(port), host, () => {
    console.log(\`--------------------------------------------------\`);
    console.log(\`MoronaVila (v1.5) rodando em http://\${host}:\${port}\`);
    console.log(\`Ambiente: \${process.env.NODE_ENV || 'production'}\`);
    console.log(\`Schema: \${process.env.CONTROL_TOWER_SCHEMA_NAME || 'custom_moronavila'}\`);
    console.log(\`--------------------------------------------------\`);
});`;

content = content.replace(oldListenPattern, newListen);

fs.writeFileSync('mac-server.ts', content, 'utf8');
console.log('mac-server.ts atualizado com host 0.0.0.0 e favicon handler!');
