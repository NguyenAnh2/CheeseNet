import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlus,
  faClose,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./auth";
import { database } from "../firebase/firebaseConfig";
import { ref, child, set, push } from "firebase/database";

export default function AddPost() {
  const [isPost, setIsPost] = useState(false);
  const [isDiary, setIsDiary] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const contentPostRef = useRef();
  const contentDiaryRef = useRef();
  const { userId } = useAuth();

  const handleSubmitPost = (e) => {
    e.preventDefault();

    const postRef = child(ref(database), `posts/${userId}/post`);
    console.log(postRef);

    // Tạo một ID tự động cho post
    const newDiaryRef = push(postRef);

    if (selectedImage || contentPostRef.current.value) {
      const newPost = {
        userId: userId,
        content: contentPostRef.current.value,
        image: selectedImage,
        timestamp: Date.now(),
      };

      set(newDiaryRef, newPost)
        .then(() => {
          setIsPost(!isPost);
          setSelectedImage(null);
          alert("Ồ bài viết của bạn hay thực sự. ❤️❤️❤️");
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error sending post: ", error);
        });
    }
  };

  const handleSubmitDiary = (e) => {
    e.preventDefault();
    const diaryRef = child(ref(database), `diary/${userId}`);
    console.log(diaryRef);

    // Tạo một ID tự động cho post
    const newDiaryRef = push(diaryRef);

    if (contentDiaryRef.current.value) {
      const newDiary = {
        userId: userId,
        content: contentDiaryRef.current.value,
        timestamp: Date.now(),
      };

      set(newDiaryRef, newDiary)
        .then(() => {
          setIsDiary(!isDiary);
          setSelectedImage(null);
          alert("Tôi sẽ giữ kín bí mật này giữa chúng ta. 😍");
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error sending post: ", error);
        });
    }
  };

  const handleClosePost = () => {
    setIsPost(!isPost);
  };

  const handleCloseDiary = () => {
    setIsDiary(!isDiary);
  };

  const handleAddImage = () => {
    setSelectedImage(null);
    document.getElementById("fileImages").click();
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Lưu URL ảnh để preview
      };
      reader.readAsDataURL(file); // Đọc nội dung của file ảnh
    }
  };

  const openModal = (image) => {
    setModalImage(image); // Cập nhật ảnh được chọn cho modal
  };

  const closeModal = () => {
    setModalImage(null); // Đóng modal
  };

  return (
    <div>
      {userId && (
        <div className="w-fit">
          {!isPost && !isDiary && (
            <div className="flex items-center border rounded-md shadow my-6">
              <div
                className="flex flex-col border-r px-3 py-2 mr-3 cursor-pointer"
                onClick={(e) => setIsPost(!isPost)}
              >
                <FontAwesomeIcon icon={faPlus} />
                <p>Bài viết</p>
              </div>
              <p className="font-serif">Hay</p>
              <div
                className="flex flex-col border-l px-3 py-2 ml-3 cursor-pointer"
                onClick={() => setIsDiary(!isDiary)}
              >
                <FontAwesomeIcon icon={faPencil} />
                <p>Nhật ký</p>
              </div>
            </div>
          )}

          {isPost && (
            <div className="flex flex-col justify-between relative border rounded-md m-5 pr-6 pb-8 pt-6">
              <form onSubmit={(e) => handleSubmitPost(e)} className="">
                <textarea
                  ref={contentPostRef}
                  rows="2"
                  className="w-[324px] overflow-auto text-left p-2 outline-neutral-400 resize-none"
                  placeholder="Cùng chia sẻ ngày hôm nay của bạn nhé!"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitPost(e);
                    }
                  }}
                />
                <button
                  onSubmit={handleSubmitPost}
                  className=" absolute text-pink-500 font-bold bottom-2 right-2"
                >
                  Đăng
                </button>
              </form>

              <input
                id="fileImages"
                name="imageToPost"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleChangeFile(e)}
                multiple
              />
              <FontAwesomeIcon
                icon={faImage}
                className="absolute left-2 bottom-2 text-pink-500 cursor-pointer"
                onClick={handleAddImage}
              />
              {selectedImage && (
                <div className="w-fit relative mt-4">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className=" mx-3 w-16 h-16 object-cover cursor-pointer rounded"
                    onClick={() => openModal(selectedImage)}
                  />
                  <FontAwesomeIcon
                    icon={faClose}
                    onClick={clearImage}
                    className="absolute top-0 right-3 mb-3 cursor-pointer"
                  />
                </div>
              )}

              {modalImage && (
                <div
                  className="fixed inset-x-[-116%] -inset-y-full pt-40 flex items-center justify-center bg-black bg-opacity-70 z-[100] cursor-pointer"
                  onClick={closeModal} // Đóng modal khi nhấp bên ngoài
                >
                  <img
                    src={modalImage}
                    alt="Modal Preview"
                    className="max-w-full max-h-full rounded"
                    onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click từ ảnh
                  />
                  <FontAwesomeIcon
                    icon={faClose}
                    className="absolute text-white z-[100] text-2xl top-[34%] right-3 cursor-pointer"
                  />
                </div>
              )}

              <FontAwesomeIcon
                icon={faClose}
                className="absolute right-2 top-2 cursor-pointer"
                onClick={handleClosePost}
              />
            </div>
          )}

          {isDiary && (
            <div className="flex justify-between relative border rounded-md m-5 pr-6 py-6">
              <form onSubmit={(e) => handleSubmitDiary(e)}>
                <textarea
                  ref={contentDiaryRef}
                  rows="2"
                  className="w-[324px] overflow-auto text-left p-2 outline-neutral-400 resize-none"
                  placeholder="Hoặc lưu lại một chút câu chuyện! Yên tâm là không ai có thể đọc chúng. &#x1F609;"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitDiary(e);
                    }
                  }}
                />
                <button
                  onSubmit={handleSubmitDiary}
                  className="absolute text-pink-500 font-bold right-2 bottom-2"
                >
                  Gửi gắm
                </button>
              </form>
              <FontAwesomeIcon
                icon={faClose}
                className="absolute right-2 top-2 cursor-pointer"
                onClick={handleCloseDiary}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
