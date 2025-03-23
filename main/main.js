const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { callOllamaAPI } = require("./ollama");
const CHAT_HISTORY_FILE = path.join(__dirname, "../sessions/chat-history.json");
console.log("Starting electron");
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    win.loadURL("http://localhost:3000"); // React dev server
}

app.whenReady().then(() => {
    if (!fs.existsSync(CHAT_HISTORY_FILE)) {
        fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify([]));
    }
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("send-message", async (event, message) => {
    // const diag = await diagnostics();
    // if (!diag.ok) {
    //     return { error: diag.message };
    // }

    if (!fs.existsSync(CHAT_HISTORY_FILE)) {
        fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify([]));
    }
    const userNow = new Date().toISOString();
    const history = JSON.parse(fs.readFileSync(CHAT_HISTORY_FILE));
    const windowedHistory = history.slice(-5);

    const response = await callOllamaAPI(message, windowedHistory);

    const now = new Date().toISOString(); // String timestamp
    const userMsg = { sender: "user", text: message, timestamp: userNow };
    const aiMsg = { sender: "ai", text: response, timestamp: now };

    const updatedHistory = [...history, userMsg, aiMsg];
    fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify(updatedHistory, null, 2));
    console.log(
        "Raw history types:",
        updatedHistory.map((msg) => typeof msg.timestamp)
    );

    return { aiResponse: response, updatedHistory };
});

ipcMain.handle("load-history", () => {
    if (!fs.existsSync(CHAT_HISTORY_FILE)) {
        fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify([]));
    }
    const history = JSON.parse(fs.readFileSync(CHAT_HISTORY_FILE));
    return history;
});
