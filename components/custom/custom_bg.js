import React from "react";
import styles from "./RandomImageBackground.module.css";

const images = [
  "/images/b1r.png",
  "/images/b2r.png",
  "/images/b3r.png",
  "/images/b4r.png",
  "/images/b5r.png",
  "/images/b6r.png",
  "/images/b7r.png",
  "/images/b8r.png",
  "/images/b9r.png",
];

// Hàm lặp lại danh sách ảnh
const repeatImages = (imageList, times) => {
  let repeatedImages = [];
  for (let i = 0; i < times; i++) {
    repeatedImages = repeatedImages.concat(imageList);
  }
  return repeatedImages;
};

// Tạo danh sách vị trí ngẫu nhiên không trùng lặp
const generateUniquePositions = (count) => {
  const positions = [];
  
  while (positions.length < count) {
    const randomTop = Math.random() * 90; // Random top percentage (0% to 90%)
    const randomLeft = Math.random() * 90; // Random left percentage (0% to 90%)
    
    // Kiểm tra vị trí này đã tồn tại chưa
    const isOverlap = positions.some(pos => 
      Math.abs(pos.top - randomTop) < 10 && Math.abs(pos.left - randomLeft) < 10
    );

    if (!isOverlap) {
      positions.push({ top: randomTop, left: randomLeft });
    }
  }

  return positions;
};

const RandomImageBackground = () => {
  const repeatedImages = repeatImages(images, 5); // Lặp lại hình ảnh 3 lần
  const positions = generateUniquePositions(repeatedImages.length); // Tạo danh sách vị trí không trùng

  return (
    <div className={styles.background}>
      {repeatedImages.map((src, index) => {
        const randomRotation = Math.floor(Math.random() * 360);
        const position = positions[index]; // Lấy vị trí ngẫu nhiên nhưng không trùng

        return (
          <img
            key={index}
            src={src}
            alt={`image-${index}`}
            className={styles.image}
            style={{
              transform: `rotate(${randomRotation}deg)`,
              top: `${position.top}%`,
              left: `${position.left}%`,
            }}
          />
        );
      })}
    </div>
  );
};

export default RandomImageBackground;
