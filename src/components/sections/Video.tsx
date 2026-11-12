"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { video } from "@/content/video";

export function Video() {
  const [playing, setPlaying] = useState(false);

  if (!video.src) return null;

  return (
    <section id="video" className="!pt-0">
      <Container>
        <h2>Se hur en bokning går till</h2>
        <div className="relative mt-[34px] aspect-[16/8] overflow-hidden rounded-r max-[960px]:aspect-[16/10]">
          {playing ? (
            <video
              src={video.src}
              poster={video.poster}
              preload="none"
              controls
              autoPlay
              playsInline
              className="h-full w-full bg-black object-cover"
            />
          ) : (
            <>
              <Image
                src={video.poster}
                alt="Städare i arbete"
                fill
                sizes="(max-width: 960px) 100vw, 1200px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="absolute inset-0 z-[2] grid cursor-pointer place-items-center border-0 bg-[rgba(0,0,0,.38)] p-0 focus-visible:outline-white focus-visible:-outline-offset-[6px]"
              >
                <span className="grid h-[84px] w-[84px] place-items-center rounded-full bg-white before:ml-[6px] before:border-y-[15px] before:border-l-[24px] before:border-y-transparent before:border-l-ink before:content-['']" />
                <span className="sr-only">Spela videon</span>
              </button>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
