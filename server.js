const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const OpenAI = require("openai");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Kết nối OpenAI API
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // nhớ tạo biến môi trường trong Render
});

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>AI Chat</title></head>
      <body style="font-family: sans-serif;">
        <h2>💬 Chat with AI</h2>
        <div id="chat" style="border:1px solid #ccc; padding:10px; height:300px; overflow:auto;"></div>
        <input id="msg" style="width:80%;" placeholder="Type a message..." />
        <button onclick="send()">Send</button>

        <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
        <script>
          const socket = io();
          const chatBox = document.getElementById("chat");
          const msgInput = document.getElementById("msg");

          function send(){
            const text = msgInput.value;
            if(text.trim() === "") return;
            chatBox.innerHTML += "<div><b>You:</b> " + text + "</div>";
            socket.emit("chat", text);
            msgInput.value = "";
          }

          socket.on("reply", (data)=>{
            chatBox.innerHTML += "<div><b>AI:</b> " + data + "</div>";
          });
        </script>
      </body>
    </html>
  `);
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("chat", async (msg) => {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }]
      });
      const aiText = response.choices[0].message.content;
      socket.emit("reply", aiText);
    } catch (err) {
      console.error(err);
      socket.emit("reply", "❌ Error: API key missing or request failed.");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
