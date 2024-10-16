import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlus,
  faClose,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Confetti from "react-confetti";
import { useAuth } from "./auth";
import Link from "next/link";
import PinterestSearch from "./custom/search_pinterest";

export default function AddPost({}) {
  const [isPost, setIsPost] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [isPostSuccess, setIsPostSuccess] = useState(false);
  const [error, setError] = useState();
  const contentPostRef = useRef();
  const { userId } = useAuth();

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: userId,
      content: contentPostRef.current.value,
      file: selectedImage,
      likes: [],
      timestamp: Date.now(),
    };

    try {
      if (selectedImage) {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file: selectedImage }),
        });

        const uploadData = await uploadResponse.json();

        if (uploadResponse.ok) {
          newPost.image = uploadData.imageUrl;

          const postResponse = await fetch("/api/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPost),
          });

          if (postResponse.ok) {
            setIsPost(!isPost);
            setSelectedImage(null);
            setIsPostSuccess(true);
          } else {
            setError(postResponse.json());
            console.error("Error sending post:", await postResponse.json());
          }
        } else {
          console.error("Error uploading image:", uploadData.error);
          setError(uploadData.error);
        }
      } else {
        const postResponse = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        });

        if (postResponse.ok) {
          setIsPost(!isPost);
          setSelectedImage(null);
          setIsPostSuccess(true);
        } else {
          setError(postResponse.json());
          console.error("Error sending post:", await postResponse.json());
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      setError(error);
    }
  };

  const handlePostModalSuccess = () => {
    window.location.href = "/";
    setIsPostSuccess(false);
  };

  const handleClosePost = () => {
    setIsPost(!isPost);
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
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (image) => {
    setModalImage(image); // Cập nhật ảnh được chọn cho modal
  };

  const closeModal = () => {
    setModalImage(null); // Đóng modal
  };

  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    const fetchAccessToken = async () => {
      const response = await fetch(`/api/pinterest/user?code=${code}`);

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.accessToken;
        const expiresAt = data.expiresAt;

        localStorage.setItem("pinterestAccessToken", accessToken);
        localStorage.setItem("expiresAt", expiresAt);
      } else {
        console.error("Failed to fetch access token");
      }
    };

    fetchAccessToken();
  }, [code]);

  return (
    <div className="mobile-w-full relative flex justify-center">
      {isPostSuccess && (
        <div className="absolute top-2/4 w-[370px] h-[140px] border shadow-md bg-white rounded-lg px-3 py-3 z-[10000]">
          <p className="font-bold text-xl">
            Bài viết của bạn đã được đăng lên CheeseNet!!!❤️❤️❤️
          </p>
          <button
            onClick={handlePostModalSuccess}
            className="border px-3 py-2 rounded text-blue-500 bg-slate-600 absolute right-2 bottom-2 font-semibold"
          >
            Hiểu rồi!
          </button>
        </div>
      )}

      {isPostSuccess && <Confetti />}
      {userId && (
        <div className="sm:w-fit">
          {!isPost && (
            <div className="relative left-2/4 -translate-x-2/4 w-fit flex items-center border rounded-md shadow my-6 z-[100]">
              <div
                className="flex flex-col border-r px-3 py-2 md:mr-3 cursor-pointer"
                title="Thêm bài viết"
                onClick={(e) => setIsPost(!isPost)}
              >
                <FontAwesomeIcon icon={faPlus} />
                <p className="hidden md:block">Bài viết</p>
              </div>
              <p className="md:font-serif hidden md:block">Hay</p>
              <Link
                href="/diary"
                className="flex flex-col border-l px-3 py-2 md:ml-3 cursor-pointer"
                title="Thêm nhật ký"
              >
                <FontAwesomeIcon icon={faPencil} />
                <p className="hidden md:block">Nhật ký</p>
              </Link>
            </div>
          )}

          {isPost && (
            <div className="relative flex flex-col justify-between border rounded-md sm:m-5 mt-5 pr-2 sm:pr-6 pb-16 pt-6 z-[102] bg-white">
              <form onSubmit={(e) => handleSubmitPost(e)}>
                <textarea
                  ref={contentPostRef}
                  rows="2"
                  className="lg:w-[325px] md:w-[246px] w-full overflow-auto text-left p-2 outline-neutral-400 resize-none"
                  placeholder="Này hôm nay của bạn ra sao?"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      e.preventDefault();
                      handleSubmitPost(e);
                    }
                  }}
                />
                <button
                  onSubmit={handleSubmitPost}
                  className=" absolute text-pink-500 font-bold bottom-9 right-2"
                >
                  Đăng
                </button>
              </form>
              <PinterestSearch />

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
                className="absolute left-2 bottom-10 text-pink-500 cursor-pointer"
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
                  className="fixed inset-x-[-116%] inset-y-custom-modal pt-40 flex items-center justify-center bg-black bg-opacity-70 z-[100] cursor-pointer"
                  onClick={closeModal} // Đóng modal khi nhấp bên ngoài
                >
                  <img
                    src={modalImage}
                    alt="Modal Preview"
                    className="max-w-full max-h-full rounded"
                    onClick={(e) => e.stopPropagation()}
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
        </div>
      )}
    </div>
  );
}
