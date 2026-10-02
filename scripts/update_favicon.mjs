import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('mac-server.ts', 'utf8');
content = content.replace(/\r\n/g, '\n');

const oldFaviconPattern = /\/\/ Rota de Favicon explícita[\s\S]*?app\.use\(express\.static\(path\.join\(__dirname, 'dist'\)\)\);/;

const newFavicon = `// Rota de Favicon explícita (dist ou public)
app.get('/favicon.ico', (req, res) => {
    const candidatePaths = [
        path.resolve(__dirname, 'dist', 'favicon.ico'),
        path.resolve(__dirname, 'dist', 'favicon.png'),
        path.resolve(__dirname, 'public', 'favicon.ico'),
        path.resolve(__dirname, 'public', 'favicon.png')
    ];
    for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
            return res.sendFile(p);
        }
    }
    return res.status(204).end();
});

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));`;

content = content.replace(oldFaviconPattern, newFavicon);

fs.writeFileSync('mac-server.ts', content, 'utf8');
console.log('Favicon handler robusto atualizado com sucesso!');
