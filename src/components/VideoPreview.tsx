"use client";

import { useEffect, useRef, RefObject } from "react";
import { EditRecipe } from "@/lib/types";
import { getPresetById } from "@/lib/presets";
interface Props {
  file: File | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  recipe: EditRecipe;
}

export default function VideoPreview({ file, videoRef ,recipe }: Props) {
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!file) return;

    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    if (videoRef.current) videoRef.current.src = url;

    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [file, videoRef]);

  // sync mute state to video element
  useEffect(() => {
    if (!videoRef.current || !recipe) return;
    videoRef.current.muted = !recipe.keepAudio;
  }, [recipe, videoRef]);

  useEffect(() => {
    if (!videoRef.current || !recipe) return;
    videoRef.current.playbackRate = recipe.speed;
  }, [recipe, videoRef]);
  const preset =
    recipe.preset !== "custom"
      ? getPresetById(recipe.preset)
      : null;

  const previewWidth =
    recipe.preset === "custom"
      ? recipe.customWidth || 1920
      : preset?.width || 1920;

  const previewHeight =
    recipe.preset === "custom"
      ? recipe.customHeight || 1080
      : preset?.height || 1080;

  const aspectRatio = `${previewWidth}/${previewHeight}`;
  return (
    <div
      className="w-full rounded-lg overflow-hidden bg-[#0a0a0a]"
      style={{
        aspectRatio: `${previewWidth} / ${previewHeight}`,
      }}
    >
     
      <video
        ref={videoRef}
        controls
        className={`w-full h-full ${
          recipe.framing === "fill"
            ? "object-cover"
            : "object-contain"
        }`}
        playsInline
        muted={!recipe?.keepAudio}
      >
        <track kind="captions" />
      </video>
    </div>
  );
}
