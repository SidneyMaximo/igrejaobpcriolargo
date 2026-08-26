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
  const password = process.env.FTP_PASSWORD || process.env.FTP_PASS;
  const remoteDir = '/';

  console.log('🚀 ==============================================');
  console.log('🚀 Iniciando processo de Deploy para Hostinger...');
  console.log('==============================================\n');

  if (!host || !user || !password) {
    console.error('❌ ERRO DE CONFIGURAÇÃO: Credenciais FTP incompletas!');
    console.log(`   - Servidor (FTP_SERVER / FTP_HOST): ${host ? '✅ Presente (' + host + ')' : '❌ Ausente'}`);
    console.log(`   - Usuário (FTP_USERNAME / FTP_USER): ${user ? '✅ Presente (' + user + ')' : '❌ Ausente'}`);
    console.log(`   - Senha (FTP_PASSWORD): ${password ? '✅ Presente' : '❌ Ausente'}`);
    console.log('\n👉 No GitHub, cadastre em Settings > Secrets and variables > Actions > Repository secrets:');
    console.log('   FTP_SERVER (ou FTP_HOST) = seu IP ou host FTP');
    console.log('   FTP_USERNAME (ou FTP_USER) = seu usuário FTP');
    console.log('   FTP_PASSWORD = sua senha FTP\n');
    process.exit(1);
  }

  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ A pasta dist/ não foi encontrada. O comando npm run build deve ser executado antes.');
    process.exit(1);
  }

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    console.log(`📡 Conectando ao servidor FTP (${host})...`);
    await client.access({
      host: host.trim(),
      user: user.trim(),
      password: password.trim(),
      secure: false
    });
    console.log('✅ Conexão FTP autenticada com sucesso!\n');

    const cleanRemoteDir = remoteDir.trim();
    if (cleanRemoteDir && cleanRemoteDir !== '.' && cleanRemoteDir !== './' && cleanRemoteDir !== '/') {
      console.log(`📁 Acessando diretório remoto: ${cleanRemoteDir}...`);
      await client.ensureDir(cleanRemoteDir);
    } else {
      console.log('📁 Acessando diretório raiz do FTP (./)...');
    }

    console.log(`📤 Enviando arquivos de produção da pasta dist/ para ${cleanRemoteDir}...`);
    client.trackProgress(info => {
      console.log(`   -> Enviando: ${info.name} (${(info.bytes / 1024).toFixed(1)} KB)`);
    });

    await client.uploadFromDir(distPath);

    console.log('\n🎉 ==============================================');
    console.log('✨ DEPLOY CONCLUÍDO COM SUCESSO NA HOSTINGER!');
    console.log('🌐 Todos os arquivos estáticos e o .htaccess foram publicados.');
    console.log('==============================================\n');
  } catch (err) {
    console.error('\n❌ Falha na conexão ou upload FTP:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
