"use client";

import { cn } from "@/src/utils/cn";

import Button from "@mui/joy/Button";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Footer() {
  const { t } = useTranslation("common");

  // 状态管理音频播放
  const [isPlaying, setIsPlaying] = useState(false);
  // 创建 audio 元素的引用
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState<boolean>(false);

  function isPWAInstalled() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window?.navigator as any)?.standalone
    );
  }

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  useEffect(() => {
    if (isPWAInstalled() && isMobileDevice()) {
      console.log("PWA 已安装并在移动设备上运行");
    } else if (isMobileDevice()) {
      console.log("用户在移动设备上，但 PWA 未安装");
      setShowInstallButton(true);
    } else {
      console.log("用户在桌面设备上");
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("用户接受了安装");
      } else {
        console.log("用户取消了安装");
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  // const togglePlay = () => {
  //   if (audioRef.current) {
  //     if (isPlaying) {
  //       audioRef.current?.pause();
  //     } else {
  //       audioRef.current?.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  // useEffect(() => {
  //   const audio = audioRef.current;

  //   if (audio) {
  //     audio.muted = true; // 确保初始状态静音以支持自动播放
  //     audio
  //       .play()
  //       .then(() => {
  //         console.log("Audio is playing automatically.");
  //       })
  //       .catch((error) => {
  //         console.error("AutoPlay failed:", error);
  //       });
  //   }
  // }, []);

  return (
    <section className="w-full  bg-[rgba(89,59,139,100)]">
      {showInstallButton && (
        <div className="fixed bottom-0 left-0 right-0 h-20 z-50 !bg-violet-600 opacity-80 px-8">
          <div className="py-4 flex justify-end">
            <Button onClick={handleInstallClick}>安装应用</Button>
          </div>
        </div>
      )}

      <div
        className={cn("top-0 w-full max-md:py-4 md:h-20", {
          // "absolute max-md:pt-0": navType === NavType.header,
        })}
      >
        {/* {navType === NavType.header && (
          <Image
            alt="banner"
            className="w-full md:hs-[240px] object-cover object-bottom -z-10 absolute "
            height={240}
            src={`/img/banner.png`}
            width={1024}
          />
        )} */}
        <nav
          className={cn(
            "container mx-auto px-4 h-full flex justify-between items-center",
          )}
        >
          <Link href="/">
            <div className={cn("relative h-12 w-12", {})}>
              <Image
                alt="logo"
                className="block"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src="/logo.png"
              />
            </div>
          </Link>

          <ul className="lg:flex items-center capitalize gap-4">
            <div className="inline-flex">
              <Button
                className="!text-slate-100 hover:!text-black"
                variant="plain"
              >
                <Link
                  className={cn(
                    "flex items-center gap-1.5 py-1 rounded px-5",
                    {},
                  )}
                  href="/market"
                >
                  <i className="ri-store-2-line text-xl"></i>
                  <p className="text-lg">{t("common:nav.store")}</p>
                </Link>
              </Button>
            </div>
            <div className="inline-flex">
              <Button
                className="!text-slate-100 hover:!text-black"
                variant="plain"
              >
                <Link
                  className={cn(
                    "flex items-center gap-1.5 py-1 rounded px-5",
                    {},
                  )}
                  href="/mining"
                >
                  <i className="ri-hammer-line text-xl"></i>
                  <p className="text-lg">{t("common:nav.mining")}</p>
                </Link>
              </Button>
            </div>
            <div className="inline-flex">
              <Button
                className="!text-slate-100 hover:!text-black"
                variant="plain"
              >
                <Link
                  className={cn(
                    "flex items-center gap-1.5 py-1 rounded px-5",
                    {},
                  )}
                  href="/my/balance"
                >
                  <i className="ri-wallet-3-line text-xl"></i>
                  <p className="text-lg">{t("common:nav.wallet")}</p>
                </Link>
              </Button>
            </div>

            <Button
              className="!text-slate-100 hover:!text-black"
              variant="plain"
            >
              <Link
                className={cn(
                  "flex items-center gap-1.5 py-1 rounded px-5",
                  {},
                )}
                href="/blog"
              >
                <i className="ri-news-line text-xl"></i>
                <p className="text-lg">{t("common:nav.blog")}</p>
              </Link>
            </Button>
            <Button
              className="!text-slate-100 hover:!text-black"
              variant="plain"
            >
              <Link
                className={cn(
                  "flex items-center gap-1.5 py-1 rounded px-5",
                  {},
                )}
                href="/about"
              >
                <i className="ri-team-line text-xl"></i>
                <p className="text-lg">{t("common:nav.about")}</p>
              </Link>
            </Button>
          </ul>

          <div className="flex items-center gap-5">
            <div>
              {socials.map((social) => (
                <Link href={social.href} key={social.href} target="_blank">
                  <i
                    className={cn("text-xl", "text-yellow-500", social.icon)}
                  />
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
      <hr className="opacity-50" />
      <center className="text-white py-4 text-sm font-normal">
        Copyright © Piday Metaverse 2024
      </center>

      <div className="container flex justify-end pb-2">
        <audio controls ref={audioRef} loop autoPlay>
          <source src="/bgm/summer.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </section>
  );
}

const socials = [
  // {
  //   icon: "ri-facebook-circle-fill",
  //   href: "https:facebook.com/",
  // },
  {
    icon: "ri-twitter-x-line",
    href: "https://x.com/PiDayAPP",
  },
  // {
  //   icon: "ri-linkedin-fill",
  //   href: "https:linkedin.com/in/",
  // },
  // {
  //   icon: "ri-instagram-line",
  //   href: "https:instagram.com/",
  // },
];
