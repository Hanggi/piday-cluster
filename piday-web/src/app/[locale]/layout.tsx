import i18nConfig from "@/i18nConfig";
import TranslationsProvider from "@/src/components/TranslationsProvider";
import SessionProviderWrapper from "@/src/utils/SessionProviderWrapper";
import ReduxProviderWrapper from "@/src/utils/redux/ReduxProviderWrapper";
import ThemeRegistry from "@src/components/ThemeRegistry/ThemeRegistry";
import { dir } from "i18next";
import type { Metadata } from "next";
import "remixicon/fonts/remixicon.css";

import { Inter } from "next/font/google";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import initTranslations from "../i18n";
import EnvironmentAlert from "./_components/layout/EnvironmentAlert";
import Footer from "./_components/layout/Footer";
import Header from "./_components/layout/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Happy Piday Happy World —— Piday Metaverse",
  description:
    "Piday world is a metaverse that mirrors the Earth's lands，allowing each pioneer to own their own digital land asset on the chain.",
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
  const { t, options } = await initTranslations(locale, ["home"]);

  return (
    <html dir={dir(locale)} lang={locale}>
      <body
        className={`${inter.className}  bg-[url('/img/background/honeycomb.svg')]`}
      >
        <ThemeRegistry options={{ key: "joy" }}>
          <SessionProviderWrapper>
            <ReduxProviderWrapper>
              <TranslationsProvider
                locale={locale}
                namespaces={options.ns as string[]}
              >
                <Header />
                <EnvironmentAlert env={process.env.ENV} />
                <main className="mt-10 relative z-10  min-h-[80vh]">
                  {children}
                </main>
                <Footer />
              </TranslationsProvider>
            </ReduxProviderWrapper>
          </SessionProviderWrapper>
        </ThemeRegistry>
        <ToastContainer />
      </body>
    </html>
  );
}
