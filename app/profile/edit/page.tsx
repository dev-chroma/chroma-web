import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import EditProfileForm from "@/components/profile/EditProfileForm";

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const serializedUser = JSON.parse(JSON.stringify(user));

  return (
    <main className="min-h-screen bg-cream-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-950/40 font-bold">
            Profile Settings
          </span>

          <h1 className="mt-3 text-5xl font-serif font-bold text-emerald-950">
            Edit Profile
          </h1>

          <p className="mt-4 text-emerald-950/60">
            Update your personal information and public profile details.
          </p>
        </div>

        <EditProfileForm user={serializedUser} />
      </div>
    </main>
  );
}
