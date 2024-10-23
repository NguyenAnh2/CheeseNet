import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Layout from "../../components/layout";

export default function ShortsPage({}) {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const videoRefs = useRef([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // const fetchVideos = async () => {
  //   try {
  //     const response = await fetch(`/api/youtube/search`, {
  //       method: "GET",
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);
  //       setVideos(data.items);
  //     } else {
  //       const errorData = await response.json();
  //       setError(errorData.error);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //     setError("Lỗi khi tải dữ liệu");
  //   }
  // };
  const fetchVideo = async (index) => {
    try {
      const response = await fetch(`/api/youtube/search?index=${index}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setVideos((prevVideos) => [...prevVideos, ...data.items]); // Thêm video mới vào danh sách
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Lỗi khi tải dữ liệu");
    }
  };
  useEffect(() => {
    fetchVideo(currentVideoIndex);
  }, [currentVideoIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target;
          if (entry.isIntersecting) {
            videoElement.src += "&autoplay=1"; // Thêm autoplay khi video vào viewport
          } else {
            videoElement.src = videoElement.src.replace("&autoplay=1", ""); // Dừng autoplay khi ra khỏi viewport
          }
        });
      },
      { threshold: 0.5 } // Tỉ lệ hiển thị của video (50%)
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);

  // const handleKeyDown = (event) => {
  //   if (event.key === "ArrowDown") {
  //     setCurrentVideoIndex((prevIndex) => {
  //       let nextIndex = prevIndex + 1;
  //       return nextIndex < videos.length ? nextIndex : prevIndex; // Tránh vượt quá giới hạn
  //     });
  //   } else if (event.key === "ArrowUp") {
  //     setCurrentVideoIndex((prevIndex) => {
  //       let newIndex = prevIndex - 1;
  //       return newIndex >= 0 ? newIndex : prevIndex; // Tránh vượt quá giới hạn
  //     });
  //   }
  // };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1); // Tăng chỉ số video
    } else if (event.key === "ArrowUp") {
      setCurrentVideoIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Giảm chỉ số video
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Layout>
      <Head>
        <title>Shorts</title>
        <link rel="icon" href="/icon.png"/>
      </Head>
      <div className="flex justify-center items-center flex-col relative mt-[64px] left-2/4 -translate-x-2/4 sm:w-[30%] w-[90%]">
        <p className="font-semibold text-2xl text-purple-600 my-4">
          Trending YouTube Shorts
        </p>
        <div className="flex flex-wrap gap-[20px]">
          {videos.map((video, index) => (
            <div key={video.id.videoId} className="w-full">
              <iframe
                ref={(el) => (videoRefs.current[index] = el)}
                width="450"
                height="450"
                src={`https://www.youtube.com/embed/${video.id.videoId}?enablejsapi=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.snippet.title}
              ></iframe>
              <h3>{video.snippet.title}</h3>
              <p>{video.snippet.channelTitle}</p>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="flex justify-center items-center flex-col relative mt-[64px] left-2/4 -translate-x-2/4 sm:w-[30%] w-[90%]">
        <p className="font-semibold text-2xl text-purple-600 my-4">
          Trending YouTube Shorts
        </p>
        <div className="flex flex-wrap gap-[20px]">
          {videos.length > 0 && (
            <div key={videos[currentVideoIndex].id.videoId} className="w-full">
              <iframe
                ref={(el) => (videoRefs.current[currentVideoIndex] = el)}
                width="450"
                height="450"
                src={`https://www.youtube.com/embed/${videos[currentVideoIndex].id.videoId}?enablejsapi=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videos[currentVideoIndex].snippet.title}
              ></iframe>
              <h3>{videos[currentVideoIndex].snippet.title}</h3>
              <p>{videos[currentVideoIndex].snippet.channelTitle}</p>
            </div>
          )}
        </div>
      </div> */}
    </Layout>
  );
}
