# How to run the app (the easy way)

You only do Steps 1 and 2 **once**. After that, you just use `start-app.bat`
whenever you want to run the app.

## Step 1 — Install the tools
1. Open the project folder in File Explorer:
   `C:\Users\Acer\Documents\GitHub\Capstone-Project`
2. Double-click **`1-install-tools.bat`**.
3. When Windows asks *"Do you want to allow this app to make changes?"*, click
   **Yes** (it may ask a few times).
4. Wait for it to finish, then **restart your computer**.

> If it says *winget was not found*: open the Microsoft Store, search
> **App Installer**, install/update it, then run the file again.

## Step 2 — Set up the project
1. After restarting, double-click **`2-setup-project.bat`**.
2. Let it run (the frontend part can take a few minutes). Done when it says
   **STEP 2 DONE!**

## Step 3 — Run it (use this every time)
1. Double-click **`start-app.bat`**.
2. Two black windows open (backend + frontend) — leave them open.
3. Your browser opens to **http://localhost:5173**.
4. Click **Log in → Sign up**, create an account, and you're in.

To stop the app: close the two black windows.

---

## If something goes wrong
- **"Python was not found" in Step 2** → You probably didn't restart after
  Step 1. Restart your computer and run Step 2 again.
- **Browser shows "Could not reach the API"** → Make sure the two black windows
  from `start-app.bat` are still open. The backend one should say
  *"Running on http://127.0.0.1:5000"*.
- **MongoDB errors** → MongoDB installs as a background service automatically.
  If it didn't start, open the Windows "Services" app, find **MongoDB**, and
  click **Start**.
- **Anything else** → Copy the red/error text from the black window and paste it
  into our chat. I'll tell you exactly what to do.

## What these files are
| File | What it does |
|------|--------------|
| `1-install-tools.bat` | Installs Python, Node.js, Git, MongoDB, VS Code |
| `2-setup-project.bat` | Sets up the backend + frontend (one time) |
| `start-app.bat` | Starts the whole app and opens it in your browser |
