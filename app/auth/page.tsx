"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Lock, ArrowRight, School, Calendar } from "lucide-react";
import { api } from "@/services/api";
import Image from "next/image";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    school: "",
    dateOfBirth: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4 py-20">
      <div className="max-w-md w-full bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-950/5 rounded-full blur-3xl -mr-16 -mt-16" />

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
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-950/20" />
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-emerald-950/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all placeholder:text-emerald-950/20"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-950/20" />
                  <input
                    type="text"
                    placeholder="Surname"
                    className="w-full bg-emerald-950/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all placeholder:text-emerald-950/20"
                    value={formData.surname}
                    onChange={(e) =>
                      setFormData({ ...formData, surname: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-950/20" />
                <input
                  type="text"
                  placeholder="Your School/Institution"
                  className="w-full bg-emerald-950/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all placeholder:text-emerald-950/20"
                  value={formData.school}
                  onChange={(e) =>
                    setFormData({ ...formData, school: e.target.value })
                  }
                  required
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-950/20" />
                <input
                  type="date"
                  className="w-full bg-emerald-950/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all text-emerald-950/40"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-emerald-950/20 pointer-events-none">
                  Birthday
                </span>
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-950/20" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-emerald-950/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all placeholder:text-emerald-950/20"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-950/20" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-emerald-950/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all placeholder:text-emerald-950/20"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

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

        <div className="mt-10 pt-10 border-t border-emerald-950/5 text-center">
          <p className="text-sm text-emerald-950/40 font-medium mb-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950 hover:underline underline-offset-8 decoration-emerald-950/20 transition-all"
          >
            {isLogin ? "Join the collective" : "Enter your studio"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
