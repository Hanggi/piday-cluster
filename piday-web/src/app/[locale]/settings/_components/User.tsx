"use client";

import Image from "next/image";

import { ElementRef, useRef } from "react";

export const User = () => {
  const uploadRef = useRef<ElementRef<"input">>(null);
  return (
    <div>
      <Image
        alt="cover"
        className="w-full"
        height={120}
        src={`/img/settings/cover.png`}
        width={1280}
      />
      <div
        className="w-fit relative mx-auto -translate-y-1/2 ring-1 ring-white rounded-full"
        role="button"
        onClick={() => uploadRef.current?.click()}
      >
        <input hidden pattern="image/*" ref={uploadRef} type="file" />
        <Image
          alt="avatar"
          className="brightness-50"
          height={100}
          src={`/img/profile/avatar.png`}
          width={100}
        />
        <Image
          alt="cover"
          className="absolute inset-0 m-auto"
          height={32}
          src={`/img/settings/camera.svg`}
          width={26}
        />
      </div>
    </div>
  );
};
