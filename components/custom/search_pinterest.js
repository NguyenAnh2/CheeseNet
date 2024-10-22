// import { useEffect, useState } from "react";
// import Link from "next/link";

// const PinterestSearch = () => {
//   const [accessToken, setAccessToken] = useState(null);
//   const [expiresAt, setExpiresAt] = useState(null);
//   const [searchPinterest, setSearchPinterest] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("pinterestAccessToken");
//     const expiration = localStorage.getItem("expiresAt");

//     if (token && expiration > Date.now()) {
//       setAccessToken(token);
//       setExpiresAt(expiration);
//     } else {
//       setAccessToken(null);
//       setExpiresAt(null);
//     }
//   }, []);

//   const handleSubmitSearchPinterest = async (e) => {
//     e.preventDefault();
//     if (accessToken) {
//       try {
//         const response = await fetch(
//           `/api/pinterest/getpins?searchPinterest=${searchPinterest}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch search results");
//         }

//         const data = await response.json();
//         console.log("Search Results:", data);
//         setSearchResults(data.data);
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       }
//     } else {
//       console.log("Access Token has expired. Please log in again.");
//     }
//   };

//   return (
//     <div>
//       {accessToken ? (
//         <form onSubmit={handleSubmitSearchPinterest}>
//           <input
//             type="text"
//             name="SearchOnPinterest"
//             placeholder="Tìm kiếm trên Pinterest"
//             onChange={(e) => setSearchPinterest(e.target.value)}
//           />
//           <button type="submit">Tìm kiếm</button>
//         </form>
//       ) : (
//         <div className="absolute bottom-2 left-2 flex items-center">
//           <p className="text-sm">Nếu chưa có ảnh? Hãy để </p>
//           <Link href="/api/pinterest/auth">
//             <button className="mx-1 text-blue-500">Pinterest</button>
//           </Link>
//         </div>
//       )}

//       {searchResults && (
//         <div>
//           {searchResults.map((pin) => (
//             <div key={pin.id}>
//               <h3>{pin.title}</h3>
//               <img src={pin.image?.original?.url} alt={pin.title} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PinterestSearch;
