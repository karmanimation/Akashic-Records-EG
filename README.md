# Entre Galáxias — Ficha de Personagem
### Tutorial completo: do zero ao site no ar

---

## O QUE O SISTEMA FAZ

- Cada usuário cria uma conta com e-mail e senha
- **Mestre** cria uma mesa → recebe um código de 6 letras
- **Jogador** usa o código para entrar na mesa
- Jogador cria e edita sua ficha dentro daquela mesa
- Mestre vê todas as fichas da mesa em tempo real
- Jogadores não veem fichas uns dos outros
- Um jogador pode estar em várias mesas com fichas diferentes

---

## PARTE 1 — CONFIGURAR O FIREBASE (gratuito)

### 1.1 Criar o projeto

1. Acesse https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Nomeie como `ficha-entre-galaxias` (ou o que quiser)
4. Desative o Google Analytics (não precisa) → **Criar projeto**
5. Aguarde e clique em **Continuar**

---

### 1.2 Ativar Authentication (login por e-mail)

1. No menu lateral esquerdo, clique em **Authentication**
2. Clique em **Começar**
3. Na aba **"Sign-in method"**, clique em **E-mail/senha**
4. Ative a primeira opção (E-mail/senha) → **Salvar**

---

### 1.3 Criar o banco de dados (Firestore)

1. No menu lateral, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Selecione **"Iniciar no modo de produção"** → **Próximo**
4. Escolha a região **southamerica-east1 (São Paulo)** → **Ativar**
5. Aguarde a criação

**Agora configure as regras de segurança:**

No Firestore, clique na aba **"Regras"** e substitua todo o conteúdo por:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Mesas: qualquer usuário logado pode ler e criar
    // Só o mestre pode atualizar os dados da mesa
    match /mesas/{mesaId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.mestreId == request.auth.uid ||
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['jogadoresIds', 'jogadores'])
      );

      // Fichas: jogador só acessa a própria, mestre acessa todas
      match /fichas/{userId} {
        allow read: if request.auth != null && (
          request.auth.uid == userId ||
          get(/databases/$(database)/documents/mesas/$(mesaId)).data.mestreId == request.auth.uid
        );
        allow write: if request.auth != null && request.auth.uid == userId;
      }

      // NPCs: apenas o mestre da mesa lê e gerencia
      match /npcs/{npcId} {
        allow read: if request.auth != null && (
          get(/databases/$(database)/documents/mesas/$(mesaId)).data.mestreId == request.auth.uid
        );
        allow write: if request.auth != null &&
          get(/databases/$(database)/documents/mesas/$(mesaId)).data.mestreId == request.auth.uid;
      }

      // Resumos públicos da mesa: jogadores leem só o resumo; ficha/NPC completos continuam privados
      match /resumos/{resumoId} {
        allow read: if request.auth != null && (
          request.auth.uid in get(/databases/$(database)/documents/mesas/$(mesaId)).data.jogadoresIds ||
          get(/databases/$(database)/documents/mesas/$(mesaId)).data.mestreId == request.auth.uid
        );
        allow write: if request.auth != null && (
          request.auth.uid == resumoId ||
          get(/databases/$(database)/documents/mesas/$(mesaId)).data.mestreId == request.auth.uid
        );
      }
    }
  }
}
```

Clique em **"Publicar"**.

---

### 1.4 Pegar as credenciais

1. Clique no ícone de engrenagem ⚙️ no topo do menu lateral → **Configurações do projeto**
2. Role até **"Seus aplicativos"**
3. Clique no ícone `</>` (Web)
4. Dê um apelido ao app (ex: `ficha-web`) → clique em **Registrar app**
5. Você verá um objeto assim:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ficha-entre-galaxias.firebaseapp.com",
  projectId: "ficha-entre-galaxias",
  storageBucket: "ficha-entre-galaxias.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**Copie esses valores** — você vai precisar deles no próximo passo.

---

## PARTE 2 — CONFIGURAR O PROJETO

### 2.1 Instalar o Node.js

Se ainda não tem:
- Acesse https://nodejs.org
- Baixe a versão **LTS** e instale normalmente

Para verificar: abra o terminal e digite:
```bash
node -v
```
Deve aparecer algo como `v20.x.x`.

---

### 2.2 Extrair e configurar o projeto

1. Extraia o arquivo `.zip` em uma pasta de sua preferência
2. Abra a pasta `ficha-eg` no seu editor de código (recomendo VS Code: https://code.visualstudio.com)
3. Abra o arquivo `src/firebase/config.js`
4. Substitua os valores de placeholder pelos que você copiou do Firebase:

```js
const firebaseConfig = {
  apiKey: "SEU_VALOR_AQUI",
  authDomain: "SEU_VALOR_AQUI",
  projectId: "SEU_VALOR_AQUI",
  storageBucket: "SEU_VALOR_AQUI",
  messagingSenderId: "SEU_VALOR_AQUI",
  appId: "SEU_VALOR_AQUI"
}
```

5. Salve o arquivo.

---

### 2.3 Instalar e rodar

Abra o terminal **dentro da pasta `ficha-eg`** e execute:

```bash
npm install
```

Aguarde (pode demorar 1-2 minutos na primeira vez). Depois:

```bash
npm run dev
```

Acesse no navegador: **http://localhost:5173**

O site está rodando localmente. Qualquer alteração no código atualiza automaticamente.

---

## PARTE 3 — PUBLICAR NA INTERNET (gratuito)

### 3.1 Criar conta no GitHub

1. Acesse https://github.com e crie uma conta gratuita
2. Clique em **"New repository"**
3. Nomeie como `ficha-entre-galaxias`
4. Deixe como **Public** → **Create repository**

### 3.2 Enviar o código para o GitHub

No terminal, dentro da pasta `ficha-eg`:

```bash
git init
git add .
git commit -m "primeira versão"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ficha-entre-galaxias.git
git push -u origin main
```

(Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub)

---

### 3.3 Publicar no Vercel

1. Acesse https://vercel.com e clique em **"Sign Up"**
2. Faça login com o GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório `ficha-entre-galaxias`
5. O Vercel detecta o Vite automaticamente
6. Clique em **"Deploy"**

Após 1-2 minutos, seu site estará disponível em um link como:
**`https://ficha-entre-galaxias.vercel.app`**

Compartilhe esse link com sua comunidade.

---

### 3.4 Domínio personalizado (opcional, gratuito)

Se quiser um link personalizado tipo `fichaentregalaxias.com`:
- Compre um domínio no https://registro.br (domínios `.com.br` são baratos)
- No painel do Vercel, vá em **Domains** e adicione o domínio comprado
- Siga as instruções de configuração DNS

---

## COMO USAR

**Para o Mestre:**
1. Crie uma conta no site
2. Clique em **"+ CRIAR MESA"** e dê um nome
3. Um código de 6 letras aparece na tela
4. Compartilhe esse código com os jogadores
5. Clique na mesa para ver todas as fichas em tempo real

**Para o Jogador:**
1. Crie uma conta no site
2. Clique em **"↗ ENTRAR EM MESA"** e digite o código recebido
3. Clique na mesa para abrir e editar sua ficha
4. Clique em **"◈ SALVAR"** para salvar

---

## ATUALIZAR O SITE

Toda vez que você editar o código e quiser publicar:

```bash
git add .
git commit -m "descrição da mudança"
git push
```

O Vercel publica automaticamente em segundos.

---

## ESTRUTURA DO PROJETO

```
src/
  firebase/config.js     ← suas credenciais Firebase
  data/sistema.js        ← classes, perícias, elementos, etc.
  hooks/
    useAuth.js           ← login, registro, logout
    useMesas.js          ← criar/entrar em mesas
    useFicha.js          ← ficha do jogador + fichas do mestre
  components/
    Login.jsx            ← tela de login/registro
    Lobby.jsx            ← lista de mesas + criar/entrar
    Ficha.jsx            ← ficha completa do jogador (6 abas)
    PainelMestre.jsx     ← visão do mestre com todas as fichas
    UI.jsx               ← componentes reutilizáveis
  App.jsx                ← orquestra tudo
  index.css              ← estética global
```
