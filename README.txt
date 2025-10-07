Como abrir no VSCode e rodar:

1) Extraia esta pasta para um caminho simples (ex.: C:\dev\casamento-andre-marilene)
   (Evite caracteres acentuados no caminho, para não dar erro em algumas ferramentas.)

2) No VSCode: File > Open Folder... e selecione a pasta do projeto.

3) No terminal do VSCode:
   - Instale Node LTS 20.x (https://nodejs.org/) se ainda não tiver.
   - Rode:
       npm install
       npm run dev
   - Acesse http://localhost:3000

Se o npm 'cancelar' (npm ERR! canceled):
- Feche outros terminais e rode de novo.
- Limpe o cache:  npm cache verify  &&  npm cache clean --force
- Aumente timeout:  npm set fetch-retries 5  &&  npm set fetch-retry-maxtimeout 120000  &&  npm set fetch-timeout 120000
- Garanta que o projeto está em um caminho sem acentos (ex.: C:\dev\...).
- Tente com o Yarn ou PNPM:  corepack enable  &&  pnpm install  (ou  yarn)
