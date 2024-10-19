// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   pages: {
//     signIn: "/api/auth/nextauth", // Chỉ định đường dẫn đăng nhập nếu cần
//   },
//   callbacks: {
//     async jwt(token, account) {
//       if (account?.accessToken) {
//         token.accessToken = account.accessToken;
//       }
//       return token;
//     },
//     async session(session, token) {
//       session.accessToken = token.accessToken;
//       return session;
//     },
//   },
// });
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/api/auth/nextauth", // Chỉ định đường dẫn đăng nhập nếu cần
  },
});
