import i18nConfig from "@/i18nConfig";
import SessionProviderWrapper from "@/src/utils/SessionProviderWrapper";
import ReduxProviderWrapper from "@/src/utils/redux/ReduxProviderWrapper";
import ThemeRegistry from "@src/components/ThemeRegistry/ThemeRegistry";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import "remixicon/fonts/remixicon.css";

import { Inter } from "next/font/google";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { authOptions } from "../api/auth/[...nextauth]/auth-options";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Piday",
  description: "Piday app",
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.roles.includes("PIDAY_ADMIN")) {
    console.log("Not admin");
  } else {
    console.log("Admin!!");
  }

  return (
    <html>
      <body className={inter.className}>
        <ThemeRegistry>
          <SessionProviderWrapper>
            <ReduxProviderWrapper>
              <main>
                <div className="flex min-h-dvh">
                  <Header />
                  <Sidebar />
                  {children}
                </div>
              </main>
            </ReduxProviderWrapper>
          </SessionProviderWrapper>
        </ThemeRegistry>
        <ToastContainer />
      </body>
    </html>
  );
}
