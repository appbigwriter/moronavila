import fs from 'fs';

let content = fs.readFileSync('mac-server.ts', 'utf8');
content = content.replace(/\r\n/g, '\n');

if (!content.includes("import fs from 'fs';")) {
    content = "import fs from 'fs';\n" + content;
}

fs.writeFileSync('mac-server.ts', content, 'utf8');
console.log('import fs adicionado com sucesso!');
