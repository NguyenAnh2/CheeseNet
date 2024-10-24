import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faImage } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import Confetti from "react-confetti";
import Button from "./custom/button";
import { useGlobal } from "./global_context";
import ButtonAdd from "./custom/button-add";

export default function AddPost({}) {
  const [isPost, setIsPost] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [isPostSuccess, setIsPostSuccess] = useState(false);
  const [visibility, setVisibility] = useState("friends");
  const [error, setError] = useState();
  const contentPostRef = useRef();
  const { userId } = useGlobal();

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    const newPost = {
      userId: userId,
      content: contentPostRef.current.value,
      image: selectedImage,
      likes: [],
      visibility: visibility,
      timestamp: Date.now(),
    };

    console.log(newPost);
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

          const postResponse = await fetch("/api/posts/post", {
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
        const postResponse = await fetch("/api/posts/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        });

        if (postResponse.ok) {
          setIsPost(!isPost);
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
    window.location.reload();
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

  return (
    <div className="mobile-w-full relative flex justify-center">
      {isPostSuccess && (
        <div className="bg-galaxy-2 absolute top-2/4 w-[370px] h-[140px] border shadow-md text-white rounded-lg px-3 py-3 z-[10000]">
          <p className="font-bold text-xl">
            Bài viết đã có mặt tại CheeseNet! ❤️
          </p>
          <div
            className="absolute right-2 bottom-2"
            onClick={handlePostModalSuccess}
          >
            <Button text={"Xác nhận"} />
          </div>
        </div>
      )}

      {isPostSuccess && <Confetti />}

      {userId && (
        <div className="sm:w-fit">
          {!isPost && (
            <div className="relative left-2/4 -translate-x-2/4 w-fit flex items-center border rounded-md shadow my-6 z-[100]">
              <div
                className=" cursor-pointer"
                title="Thêm bài viết"
                onClick={(e) => setIsPost(!isPost)}
              >
                <ButtonAdd />
              </div>
            </div>
          )}

          {isPost && (
            <div className="relative flex flex-col justify-between border rounded-md sm:m-5 mt-5 pr-2 sm:pr-6 pb-16 pt-6 z-[102] bg-galaxy-2">
              <form className="" onSubmit={(e) => handleSubmitPost(e)}>
                <textarea
                  ref={contentPostRef}
                  rows="2"
                  className="bg-galaxy-2 lg:w-[325px] md:w-[246px] w-full overflow-auto text-left p-2 outline-neutral-400 resize-none text-black font-normal border"
                  placeholder="Ngày hôm nay của bạn ra sao? Nếu không có ý tưởng hãy thử Chatbox AI."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      e.preventDefault();
                      handleSubmitPost(e);
                    }
                  }}
                />

                <div className="absolute bottom-8 left-10 ">
                  <select
                    className="block appearance-none w-full bg-galaxy text-[#001F3F] font-bold py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-blue-300 cursor-pointer"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option
                      className="py-2 cursor-pointer"
                      value="public"
                    >
                      Công khai
                    </option>
                    <option
                      className="py-2 cursor-pointer"
                      value="friends"
                    >
                      Bạn bè
                    </option>
                  </select>
                </div>
                <button
                  className="btn absolute translate-y-[100%] top-[6px] left-[100%] translate-x-[-100%] "
                  onSubmit={handleSubmitPost}
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
                width={18}
                height={18}
                icon={faImage}
                className="absolute left-2 bottom-10 text-pink-500 cursor-pointer"
                onClick={handleAddImage}
              />

              {selectedImage && (
                <div className="w-fit relative mt-0 mb-2">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="mx-3 w-16 h-16 object-cover cursor-pointer rounded"
                    onClick={() => openModal(selectedImage)}
                  />
                  <FontAwesomeIcon
                    width={18}
                    height={18}
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
                    width={18}
                    height={18}
                    icon={faClose}
                    className="absolute text-white z-[100] text-2xl top-[34%] right-3 cursor-pointer"
                  />
                </div>
              )}

              <FontAwesomeIcon
                width={18}
                height={18}
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
