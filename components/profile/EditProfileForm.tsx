"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileAvatarUpload from "@/components/ProfileAvatarUpload";

interface User {
  _id: string;
  firstName: string;
  surname: string;
  school: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
}

interface Props {
  user: User;
  adminMode?: boolean;
}

export default function EditProfileForm({ user, adminMode }: Props) {
  const router = useRouter();

  const endpoint = adminMode ? `/api/users/${user._id}` : "/api/users/me";

  const [form, setForm] = useState({
    firstName: user.firstName || "",
    surname: user.surname || "",
    phone: user.phone || "",
    school: user.school || "",
    bio: user.bio || "",
    dateOfBirth: user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      firstName: user.firstName || "",
      surname: user.surname || "",
      phone: user.phone || "",
      school: user.school || "",
      bio: user.bio || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
  }, [user]);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      router.push(`/profile/${user._id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Shared classes for a uniform, smooth glowing focus state
  const inputClasses =
    "w-full rounded-xl border border-emerald-950/10 px-4 py-3 outline-none transition-all duration-200 " +
    "focus:border-emerald-700 focus:ring-4 focus:ring-emerald-600/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-4xl border border-emerald-950/5 p-8 md:p-12 shadow-sm"
    >
      <div className="flex flex-col items-center mb-12">
        <div className="relative">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={`${user.firstName} ${user.surname}`}
            width={168}
            height={168}
            className="w-42 h-42 rounded-full object-cover border-4 border-white shadow-xl"
            unoptimized
          />

          <ProfileAvatarUpload />
        </div>

        <h2 className="mt-6 text-2xl font-serif font-bold text-emerald-950">
          {user.firstName} {user.surname}
        </h2>

        <p className="mt-1 text-sm text-emerald-950/50">
          {adminMode
            ? "Editing user profile"
            : "Update your profile information"}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-emerald-950">
            First Name
          </label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-emerald-950">
            Surname
          </label>
          <input
            name="surname"
            value={form.surname}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-emerald-950">
          School
        </label>
        <input
          name="school"
          value={form.school}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-emerald-950">
          Phone
        </label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-emerald-950">
          Date of Birth
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-emerald-950">
          Bio
        </label>
        <textarea
          name="bio"
          rows={5}
          value={form.bio}
          onChange={handleChange}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 rounded-xl bg-emerald-950 text-white font-medium hover:bg-emerald-900 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
