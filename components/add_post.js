import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faImage, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import Button from "./custom/button";
import ButtonAdd from "./custom/button-add";
import { useGlobal } from "./global_context";

export default function AddPost({}) {
  // #region Biến
  const [isPost, setIsPost] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [isPostSuccess, setIsPostSuccess] = useState(false);
  const [visibility, setVisibility] = useState("friends");
  const [isFindingImage, setIsFindingImage] = useState(false);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const contentPostRef = useRef();
  const { userId } = useGlobal();

  // #region Hàm xử lý
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
            setIsLoading(false);
          } else {
            setError(postResponse.json());
            console.error("Error sending post:", await postResponse.json());
            setIsLoading(false);
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
          setIsLoading(false);
        } else {
          setError(postResponse.json());
          console.error("Error sending post:", await postResponse.json());
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      setError(error);
      setIsLoading(false);
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
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const [searchValueImage, setSearchValueImage] = useState();
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/unsplash?keyword=${searchValueImage}&page=${page}&per_page=10`
    );
    const data = await response.json();
    if (data) {
      setPhotos((prevPhotos) =>
        page === 1 ? data.results : [...prevPhotos, ...data.results]
      );
    }
    setLoading(false);
  };

  const searchOnUnsplash = async (e) => {
    e.preventDefault();
    setPage(1);
    setPhotos([]);
    fetchPhotos();
  };

  const loadMorePhotos = () => {
    setPage((prevPage) => prevPage + 1);
    fetchPhotos();
  };

  const handleChooseImageSearch = (photoUrls) => {
    setPhotos([]);
    setSelectedImage(photoUrls);
    setIsFindingImage(false);
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
            <div className="relative flex flex-col justify-between border rounded-md sm:m-5 mt-5 pr-2 sm:pr-6 pb-32 pt-6 z-[102] bg-galaxy-2">
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

                <div className="absolute bottom-[88px] left-10 ">
                  <select
                    className="block appearance-none w-full bg-galaxy text-[#001F3F] font-bold py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-blue-300 cursor-pointer"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option className="py-2 cursor-pointer" value="public">
                      Công khai
                    </option>
                    <option className="py-2 cursor-pointer" value="friends">
                      Bạn bè
                    </option>
                  </select>
                </div>
                {!isLoading ? (
                  <button
                    className="btn absolute translate-y-[100%] top-[6px] left-[100%] translate-x-[-100%] "
                    onSubmit={handleSubmitPost}
                  >
                    Đăng
                  </button>
                ) : (
                  <div className="bg-yellow-600 absolute top-2/4 w-[100%] h-[150px] border shadow-md text-white rounded-lg px-3 py-3 z-[10000] flex justify-center items-center">
                    <p className="absolute font-bold text-xl ">
                      Bài viết đang tải lên CheeseNet...
                    </p>
                  </div>
                )}
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
                className="absolute left-2 bottom-24 text-pink-500 cursor-pointer"
                onClick={handleAddImage}
              />

              <div className="absolute bottom-12 left-0">
                <span className="text-sm font-semibold text-[#001F3F]">
                  Nếu chưa có ảnh? Hãy thử{" "}
                </span>
                <button
                  className="text-blue-500"
                  onClick={() => setIsFindingImage(!isFindingImage)}
                >
                  Tìm kiếm
                </button>
                <br />
                {isFindingImage && (
                  <form onSubmit={(e) => searchOnUnsplash(e)}>
                    <input
                      className="inputSearch absolute left-2"
                      type="text"
                      name="findingimage"
                      placeholder="Tìm kiếm hình ảnh..."
                      onChange={(e) => setSearchValueImage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute right-6 top-[65%] translate-x-[-100%] translate-y-[50%] text-white text-lg"
                    >
                      <FontAwesomeIcon icon={faSearch} width={20} height={20} />
                    </button>
                  </form>
                )}
              </div>
              <div>
                {isFindingImage && photos && (
                  <div
                    className={`relative w-full top-[40px] flex flex-wrap gap-3 ${photos && "mb-20"} 
                  ${selectedImage && "mb-0"}`}
                  >
                    {photos.map((photo) => (
                      <div className="relative w-[30%] hover:scale-[2.5] transition-transform z-[10] hover:z-[11]">
                        <img
                          key={photo.id}
                          src={photo.urls.small}
                          alt={photo.alt_description}
                          title="Chọn"
                          className="cursor-pointer block h-full object-cover "
                          onClick={() =>
                            handleChooseImageSearch(photo.urls.small)
                          }
                        />
                      </div>
                    ))}
                    {loading ? (
                      <p>Đang tải...</p>
                    ) : (
                      photos.length > 0 && (
                        <button
                          onClick={loadMorePhotos}
                          className="mt-4 btn h-fit"
                        >
                          Tải thêm
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {selectedImage && (
                <div
                  className={`w-fit relative ${photos ? "mt-16" : "mt-0"} mb-2`}
                >
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
