"use client";

import { i18n as I18N } from "i18next";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

import initTranslations from "../app/i18n";

let i18n: I18N;

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
}: {
  children: ReactNode;
  locale: string;
  namespaces: string[];
}) {
  const [instance, setInstance] = useState(i18n);

  useEffect(() => {
    const init = async () => {
      if (!i18n) {
        const newInstance = (await initTranslations(
          locale,
          namespaces,
        )) as I18N;
        i18n = newInstance;
        setInstance(newInstance);
      } else {
        if (i18n.language !== locale) {
          i18n.changeLanguage(locale);
        }
      }
    };

    init();
  }, [locale, namespaces]);

  if (!instance) {
    return null;
  }

  return (
    <I18nextProvider defaultNS={namespaces[0]} i18n={instance}>
      {children}
    </I18nextProvider>
  );
}
