import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import User from "@/models/User";

import EditProfileForm from "@/components/profile/EditProfileForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditProfilePage({ params }: Props) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth");
  }

  if (currentUser.role !== "Admin") {
    redirect(`/profile/${currentUser._id}`);
  }

  const { id } = await params;

  await connectDB();

  const user = await User.findById(id).select("-password");

  if (!user) {
    redirect("/dashboard");
  }

  const serializedUser = JSON.parse(JSON.stringify(user));

  return (
    <main className="min-h-screen bg-cream-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-950/40 font-bold">
            Admin Panel
          </span>

          <h1 className="mt-3 text-5xl font-serif font-bold text-emerald-950">
            Edit User Profile
          </h1>

          <p className="mt-4 text-emerald-950/60">
            Editing profile of {user.firstName} {user.surname}
          </p>
        </div>

        <EditProfileForm user={serializedUser} adminMode={true} />
      </div>
    </main>
  );
}
