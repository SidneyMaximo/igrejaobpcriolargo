import * as ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
  const host = process.env.FTP_HOST || process.env.FTP_SERVER;
  const user = process.env.FTP_USER || process.env.FTP_USERNAME;
  const password = process.env.FTP_PASSWORD;
  const remoteDir = process.env.FTP_REMOTE_DIR || 'public_html';

  console.log('🚀 Iniciando processo de Deploy para Hostinger...\n');

  if (!host || !user || !password) {
    console.error('❌ Erro: Credenciais FTP não encontradas no arquivo .env!');
    console.log('\n👉 Adicione as seguintes variáveis no seu arquivo .env:');
    console.log('FTP_HOST=seu-servidor-ftp.com');
    console.log('FTP_USER=seu-usuario-ftp');
    console.log('FTP_PASSWORD=sua-senha-ftp');
    console.log('FTP_REMOTE_DIR=public_html (opcional, padrão: public_html)\n');
    process.exit(1);
  }

  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ A pasta dist/ não foi encontrada. Rode "npm run build" antes de enviar.');
    process.exit(1);
  }

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    console.log(`📡 Conectando ao servidor FTP: ${host}...`);
    await client.access({
      host: host,
      user: user,
      password: password,
      secure: false
    });
    console.log('✅ Conexão FTP estabelecida com sucesso!');

    console.log(`📁 Navegando até o diretório remoto: ${remoteDir}...`);
    await client.ensureDir(remoteDir);

    console.log(`📤 Enviando arquivos de produção da pasta dist/ para ${remoteDir}/...`);
    client.trackProgress(info => {
      console.log(`   -> Enviando: ${info.name} (${(info.bytes / 1024).toFixed(1)} KB)`);
    });

    await client.uploadFromDir(distPath);

    console.log('\n🎉 ==============================================');
    console.log('✨ DEPLOY CONCLUÍDO COM SUCESSO NA HOSTINGER!');
    console.log('🌐 Seu site está online e atualizado.');
    console.log('==============================================\n');
  } catch (err) {
    console.error('\n❌ Erro durante o upload FTP:', err.message);
  } finally {
    client.close();
  }
}

deploy();
