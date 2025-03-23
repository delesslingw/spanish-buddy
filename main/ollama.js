const { exec } = require("child_process");

const callOllamaAPI = async (message, previousMessages) => {
    const contextMessages = previousMessages.map((msg) => `${msg.sender}: ${msg.text}`).join("\n");
    const fullPrompt = contextMessages + `\nuser: ${message}`;

    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama3.2:latest",
            prompt: fullPrompt,
            stream: false,
        }),
    });

    const data = await response.json();
    const aiReply = data.response || "No response from AI.";
    return aiReply;
};

// const diagnostics = async () => {
//     try {
//         const ollamaInstalled = await new Promise((resolve) => {
//             exec("ollama --version", (error, stdout, stderr) => {
//                 resolve(!error);
//             });
//         });

//         if (!ollamaInstalled) {
//             return { ok: false, message: "Ollama is not installed. Please install it from https://ollama.com." };
//         }

//         const serverResponse = await fetch("http://localhost:11434");
//         if (!serverResponse.ok) {
//             return { ok: false, message: "Ollama server is not running. Please run `ollama serve`." };
//         }

//         const tagsResponse = await fetch("http://localhost:11434/api/tags");
//         const tagsData = await tagsResponse.json();
//         const modelAvailable = tagsData.models.some((m) => m.name === "llama3.2:latest");

//         if (!modelAvailable) {
//             return { ok: false, message: "Model llama3.2:latest not found. Please run `ollama pull llama3.2`." };
//         }

//         return { ok: true };
//     } catch (err) {
//         return { ok: false, message: "Error checking Ollama: " + err.message };
//     }
// };

module.exports = { callOllamaAPI };
