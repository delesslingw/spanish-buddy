// File: main/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    sendMessage: (msg) => ipcRenderer.invoke("send-message", msg),
    loadHistory: () => ipcRenderer.invoke("load-history"),
});
