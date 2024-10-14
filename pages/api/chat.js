import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKeyGenimi = process.env.API_KEY_GEMINI;
console.log("Run API key");

const genAI = new GoogleGenerativeAI(apiKeyGenimi);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const test = req.body;
    res.status(200).json(test.message);
  } else if (req.method === "POST") {
    const prompt = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
      const result = await model.generateContent(prompt.message);
      const response = result.response;
      const text = response.text();

      res.status(200).json({ text });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: `Đã xảy ra lỗi khi xử lý yêu cầu. ${error}` });
    }
  } else {
    // Phương thức không được hỗ trợ
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
