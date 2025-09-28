// src/pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.file",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  // --- THIS IS THE FIX ---
  // The callbacks block allows us to control the content of the JWT and session.
  callbacks: {
    async jwt({ token, user, account }) {
      // On the initial sign-in, the `user` and `account` objects are available.
      if (account && user) {
        return {
          ...token,
          // Persist the user's name and picture to the JWT
          name: user.name,
          picture: user.image,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // The session callback receives the JWT's content in the `token` object.
      // We add the custom properties to the session object here.
      session.user.name = token.name as string;
      session.user.image = token.picture as string;
      return session;
    },
  },
});
