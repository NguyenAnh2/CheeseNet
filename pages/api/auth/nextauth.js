import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Pinterest({
      clientId: process.env.NEXT_PUBLIC_PINTEREST_APP_ID,
      clientSecret: process.env.NEXT_PUBLIC_PINTEREST_APP_SECRET,
      authorizationUrl: "https://www.pinterest.com/oauth/",
    }),
  ],
  callbacks: {
    async jwt(token, user, account) {
      // Lưu access_token vào token
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    async session(session, token) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
