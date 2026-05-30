"use client";

import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import AvatarCropModal from "./profile/AvatarCropModal";

export default function ProfileAvatarUpload() {
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setCropImage(previewUrl);
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("avatar", file);

      const uploadRes = await fetch("/api/users/avatar", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Upload failed");
      }

      const updateRes = await fetch("/api/users/avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: uploadData.url,
          avatarPublicId: uploadData.publicId,
        }),
      });

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        throw new Error(updateData.message || "Failed to update avatar");
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to upload avatar");
    } finally {
      setUploading(false);
      setCropImage(null);
    }
  };

  return (
    <>
      <label className="absolute -bottom-4 -right-4 z-30 cursor-pointer">
        <div className="w-14 h-14 rounded-2xl bg-white text-emerald-950 flex items-center justify-center shadow-xl hover:scale-105 transition-all">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </div>

        <input hidden type="file" accept="image/*" onChange={handleUpload} />
      </label>

      {cropImage && (
        <AvatarCropModal
          image={cropImage}
          onCancel={() => setCropImage(null)}
          onCropComplete={uploadAvatar}
        />
      )}
    </>
  );
}
