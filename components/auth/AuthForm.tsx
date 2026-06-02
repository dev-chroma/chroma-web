"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Lock,
  Mail,
  Phone,
  School,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

interface FormDataState {
  firstName: string;
  surname: string;
  email: string;
  school: string;
  dateOfBirth: string;
  phone: string;
  password: string;
}

export default function AuthForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormDataState>({
    firstName: "",
    surname: "",
    email: "",
    school: "",
    dateOfBirth: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await api.auth.login({
          email: formData.email,
          password: formData.password,
        });

        if (response.token && response.user) {
          login(response.token, response.user);
          router.push("/dashboard");
        } else {
          setError(response.message || "Login failed");
        }
      } else {
        const response = await api.auth.register(formData);

        if (response.token && response.user) {
          login(response.token, response.user);

          router.push("/dashboard");
        } else {
          setError(response.message || "Registration failed");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <Image
          src="/icon.png"
          alt="Chroma Diaries"
          width={64}
          height={64}
          className="w-16 h-16 object-contain mx-auto mb-6"
        />

        <h1 className="text-3xl font-serif font-bold text-emerald-950 mb-2">
          {isLogin ? "Welcome Back" : "Create Profile"}
        </h1>

        <p className="text-emerald-950/40 text-sm font-medium uppercase tracking-[0.2em]">
          Chroma Diaries <span className="italic">Collector</span>
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-500/10 text-red-600 rounded-2xl text-xs font-bold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                icon={User}
                placeholder="First Name"
                value={formData.firstName}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: value,
                  }))
                }
              />

              <Input
                icon={User}
                placeholder="Surname"
                value={formData.surname}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    surname: value,
                  }))
                }
              />
            </div>

            <Input
              icon={School}
              placeholder="Your School/Institution"
              value={formData.school}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  school: value,
                }))
              }
            />
            <Input
              icon={Phone}
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  phone: value,
                }))
              }
            />

            <Input
              type="date"
              icon={Calendar}
              value={formData.dateOfBirth}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  dateOfBirth: value,
                }))
              }
            />
          </>
        )}

        <Input
          type="email"
          icon={Mail}
          placeholder="Email Address"
          value={formData.email}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              email: value,
            }))
          }
        />

        <Input
          type="password"
          icon={Lock}
          placeholder="Password"
          value={formData.password}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              password: value,
            }))
          }
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 bg-brand-main text-brand-dark rounded-full font-bold text-xs tracking-[0.3em] hover:bg-brand-accent hover:text-white transition-all shadow-xl shadow-brand-main/20 flex items-center justify-center gap-4 group active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin" />
          ) : (
            <>
              {isLogin ? "SIGN IN" : "REGISTER"}

              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="pt-10 text-center">
        <p className="text-sm text-emerald-950/40 font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>

        <button
          onClick={() => setIsLogin((prev) => !prev)}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950 underline underline-offset-2 cursor-pointer decoration-emerald-950/20 transition-all"
        >
          {isLogin ? "Join the collective" : "Enter your studio"}
        </button>
      </div>
    </>
  );
}

interface InputProps {
  icon: React.ElementType;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
}

function Input({
  icon: Icon,
  value,
  placeholder,
  type = "text",
  onChange,
}: InputProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-950/20" />

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-emerald-950/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all placeholder:text-emerald-950/20"
        required
      />
    </div>
  );
}
