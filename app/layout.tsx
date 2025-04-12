import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
// import SessionWrapper from "@/Providers/SessionWrapper";
import LayoutWrapper from "@/components/LayoutWrapper/LayoutWrapper";
import QueryProvider from "@/Providers/QueryProvider";
import FloatingButton from "./code-editor/components/FloatingButton";
import AuthProvider from "@/Providers/AuthProvider";


const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevelopersQuestions",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme='light'>
      <body
        className={`${poppins.className} antialiased `}>
        {/* <SessionWrapper> */}
        <AuthProvider>
          <QueryProvider>
            <Toaster />
            {/* <Navbar /> */}
            <div className=" bg-slate-950 text-white bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
              <LayoutWrapper>
                {children}
                <FloatingButton />
              </LayoutWrapper>
            </div>
          </QueryProvider>
        </AuthProvider>
        {/* </SessionWrapper> */}
      </body>
    </html>
  );
}
