import i18nConfig from "@/i18nConfig";
import TranslationsProvider from "@/src/components/TranslationsProvider";
import SessionProviderWrapper from "@/src/utils/SessionProviderWrapper";
import ReduxProviderWrapper from "@/src/utils/redux/ReduxProviderWrapper";
import ThemeRegistry from "@src/components/ThemeRegistry/ThemeRegistry";
import { dir } from "i18next";
import type { Metadata } from "next";

import { Inter } from "next/font/google";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import initTranslations from "../i18n";
import Footer from "./_components/layout/Footer";
import Header from "./_components/layout/Header";
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
  const { t, options } = await initTranslations(locale, ["home"]);

  return (
    <html dir={dir(locale)} lang={locale}>
      <body className={inter.className}>
        <ThemeRegistry>
          <SessionProviderWrapper>
            <ReduxProviderWrapper>
              <TranslationsProvider
                locale={locale}
                namespaces={options.ns as string[]}
              >
                <Header />
                <main className="mt-40 relative z-10">{children}</main>
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
