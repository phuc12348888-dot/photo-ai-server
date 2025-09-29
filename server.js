import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// 🟢 Route test để kiểm tra server chạy
app.get("/", (req, res) => {
  res.send("✅ Server AI Photo đang hoạt động!");
});

// 🟢 Route chat demo
app.post("/chat", (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).send("❌ Thiếu prompt");
  }
  // Đây chỉ là trả lời giả, sau này bạn sẽ tích hợp OpenAI vào đây
  res.send(`🤖 AI nhận được: "${prompt}" và sẽ gợi ý chỉnh sửa ảnh.`);
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server đang lắng nghe tại cổng " + PORT);
});
