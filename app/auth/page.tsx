import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4 py-20">
      <div className="max-w-md w-full bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-950/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <AuthForm />
      </div>
    </div>
  );
}
