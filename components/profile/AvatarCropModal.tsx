"use client";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";

interface Props {
  image: string;
  onCancel: () => void;
  onCropComplete: (file: File) => void;
}

export default function AvatarCropModal({
  image,
  onCancel,
  onCropComplete,
}: Props) {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    const img = new Image();

    img.src = image;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file = new File([blob], "avatar.jpg", {
          type: "image/jpeg",
        });

        onCropComplete(file);
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-emerald-950 mb-4">
          Crop Profile Photo
        </h2>

        <div className="relative h-[400px] rounded-2xl overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-emerald-950 mb-2">
            Zoom
          </label>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-emerald-950/10 hover:bg-emerald-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={createCroppedImage}
            className="px-6 py-3 rounded-xl bg-emerald-950 text-white hover:bg-emerald-900 transition"
          >
            Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );
}
