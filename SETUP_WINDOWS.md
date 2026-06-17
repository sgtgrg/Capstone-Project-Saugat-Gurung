# Windows Setup Guide 

Follow this once, top to bottom. Copy-paste the commands exactly. When a step
says "new terminal", open a fresh terminal so the backend and frontend can run
at the same time.

> Tip: In VS Code, open a terminal with **Ctrl + `** (the key above Tab).
> You can open a second terminal with the **+** icon in the terminal panel.

---

## 1. Install the tools (one time)

Install these four, in order. Accept default options unless noted.

1. **VS Code** — https://code.visualstudio.com/
2. **Python 3.11+** — https://www.python.org/downloads/
   -  On the first install screen, **tick "Add python.exe to PATH"** before
     clicking Install. This matters.
3. **Node.js (LTS)** — https://nodejs.org/ (the left "LTS" button).
4. **MongoDB** — pick ONE option:
   - **Easiest (recommended): MongoDB Atlas (free cloud).** No install.
     See section 4 below.
   - **Local install:** MongoDB Community Server +
     https://www.mongodb.com/try/download/community — runs on
     `mongodb://localhost:27017`.

### Verify installs
Open a new terminal and run each line; you should see version numbers, not errors:

```bash
python --version
node --version
npm --version
git --version
```

---

## 2. Open the project & install VS Code extensions

1. In VS Code: **File → Open Folder →** select `D:\Capstone Project`.
2. Install these extensions (click the Extensions icon on the left, search each):
   - **Python** (ms-python.python)
   - **Pylance**
   - **Tailwind CSS IntelliSense**
   - **ESLint**
   - **Prettier**
   - **MongoDB for VS Code**
   - **Thunder Client** (for testing API endpoints, like Postman)

---

## 3. Set up & run the backend (Flask)

In a terminal:

```bash
cd "D:\Capstone Project\backend"

REM create an isolated Python environment
python -m venv .venv

REM activate it (Windows)
.venv\Scripts\activate

REM install dependencies
pip install -r requirements.txt

REM create your .env from the template
copy .env.example .env
```

Open `backend\.env` and set real values (especially `MONGO_URI` — see section 4,
and change the two secret keys to any long random text).

Start the API:

```bash
python run.py
```

You should see it running on **http://localhost:5000**. Leave this terminal open.
Test it: open http://localhost:5000/api/health in your browser — you should see
JSON with `"status": "ok"`.

> When you come back another day, you only need:
> `cd "D:\Capstone Project\backend"` → `.venv\Scripts\activate` → `python run.py`

---

## 4. MongoDB connection string

### Option A — MongoDB Atlas (free cloud, recommended)
1. Create a free account at https://www.mongodb.com/atlas and make a free
   (M0) cluster.
2. **Database Access:** create a database user + password.
3. **Network Access:** add your IP (or `0.0.0.0/0` for development only).
4. **Connect → Drivers → Python:** copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net`
5. Paste it into `backend\.env` as `MONGO_URI=` (replace `<user>`/`<password>`).

### Option B — Local MongoDB
Leave `MONGO_URI=mongodb://localhost:27017` and make sure the MongoDB service
is running.

---

## 5. Set up & run the frontend (React)

Open a **new terminal** (keep the backend running):

```bash
cd "D:\Capstone Project\frontend"

REM install dependencies (first time only; takes a few minutes)
npm install

REM create your .env from the template
copy .env.example .env

REM start the dev server
npm run dev
```

Open the URL it prints (usually **http://localhost:5173**). On the Home page you
should see **"✓ Connected to API"** — that confirms frontend ↔ backend ↔ database
are all wired up.

> Coming back another day: `cd "D:\Capstone Project\frontend"` → `npm run dev`

---

## 6. Push to your GitHub repo

You said you already have a repo. From the project root:

```bash
cd "D:\Capstone Project"

git init
git add .
git commit -m "Day 0: project scaffold (Flask + React + MongoDB)"
git branch -M main

REM connect to YOUR repo (replace the URL with yours)
git remote add origin https://github.com/<your-username>/<your-repo>.git

git push -u origin main
```

If the repo already has commits and Git refuses the push, tell me and I'll give
you the safe merge steps (we'll likely use `git pull --rebase origin main` first).

### Daily routine after Day 0
At the end of each day's work:

```bash
cd "D:\Capstone Project"
git add .
git commit -m "Day N: <what you built>"
git push
```

---

## Troubleshooting

- **"python is not recognized"** → Python wasn't added to PATH. Reinstall and
  tick "Add python.exe to PATH", or restart VS Code.
- **`.venv\Scripts\activate` blocked (PowerShell)** → run
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or use the
  **Command Prompt (cmd)** terminal instead of PowerShell.
- **Home page shows "✗ Could not reach the API"** → the backend terminal isn't
  running, or the database string in `.env` is wrong.
- **`npm install` errors** → make sure Node LTS is installed; close and reopen
  the terminal so it's on PATH.

When in doubt, copy the exact error text into our chat and I'll walk you through
it.
