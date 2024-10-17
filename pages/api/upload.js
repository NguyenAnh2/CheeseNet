import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Thiếu hình ảnh." });
    }
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: "cheese_net",
      });

      res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ error: "Lỗi khi upload lên Cloudinary." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
