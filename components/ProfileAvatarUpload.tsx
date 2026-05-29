"use client";

import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileAvatarUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);

      // Upload new avatar
      const formData = new FormData();
      formData.append("avatar", file);
      const uploadRes = await fetch("/api/users/avatar", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.message);
      }

      // Update user avatar
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
        throw new Error(updateData.message);
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
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
  );
}
