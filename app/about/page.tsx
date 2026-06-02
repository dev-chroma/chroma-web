import Link from "next/link";
import { BookOpen, Heart, Users, Award } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="bg-cream-50 min-h-screen">
      {/* HERO */}

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-950/5 -skew-y-6 transform origin-top-right translate-y-24" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-emerald-950 mb-8 leading-tight">
            Where Stories Come
            <br />
            <span className="italic font-normal text-emerald-800">
              to Life and Voices Matter
            </span>
          </h1>

          <p className="text-xl text-emerald-950/60 max-w-3xl mx-auto leading-relaxed font-medium">
            ChromaDiaries is an English-language web magazine designed
            especially for readers under 18. It offers a friendly and creative
            platform where young learners can explore stories, poems, articles,
            and ideas written in simple, engaging English.
          </p>
        </div>
      </section>

      {/* STORY */}

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-serif font-bold text-emerald-950">
              Our Story
            </h2>

            <p className="text-lg text-emerald-950/70 leading-relaxed font-medium">
              The magazine encourages children and teens to read regularly,
              improve their vocabulary, and develop stronger writing and
              communication skills. By presenting a mix of creative content and
              thoughtful expression, ChromaDiaries aims to inspire imagination,
              build confidence, and help young minds grow into better
              storytellers and confident English users.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}

      <section className="py-24 bg-emerald-950/5 px-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-emerald-950 text-center mb-16">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* CARD */}

            <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-emerald-950/5 rounded-2xl flex items-center justify-center mx-auto text-emerald-950 mb-8 group-hover:bg-emerald-950 group-hover:text-cream-50 transition-colors">
                <Heart className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-serif font-bold text-emerald-950 mb-4">
                Creativity
              </h3>

              <p className="text-sm text-emerald-950/60 leading-relaxed font-medium">
                Encouraging young minds to express ideas freely through stories,
                poems, and art.
              </p>
            </div>

            {/* CARD */}

            <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-emerald-950/5 rounded-2xl flex items-center justify-center mx-auto text-emerald-950 mb-8 group-hover:bg-emerald-950 group-hover:text-cream-50 transition-colors">
                <BookOpen className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-serif font-bold text-emerald-950 mb-4">
                Learning
              </h3>

              <p className="text-sm text-emerald-950/60 leading-relaxed font-medium">
                Helping under-18 readers improve their English vocabulary,
                reading habits, and writing skills.
              </p>
            </div>

            {/* CARD */}

            <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-emerald-950/5 rounded-2xl flex items-center justify-center mx-auto text-emerald-950 mb-8 group-hover:bg-emerald-950 group-hover:text-cream-50 transition-colors">
                <Award className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-serif font-bold text-emerald-950 mb-4">
                Confidence
              </h3>

              <p className="text-sm text-emerald-950/60 leading-relaxed font-medium">
                Providing a safe platform where children and teens can share
                their voice without fear.
              </p>
            </div>

            {/* CARD */}

            <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-emerald-950/5 rounded-2xl flex items-center justify-center mx-auto text-emerald-950 mb-8 group-hover:bg-emerald-950 group-hover:text-cream-50 transition-colors">
                <Users className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-serif font-bold text-emerald-950 mb-4">
                Inclusivity
              </h3>

              <p className="text-sm text-emerald-950/60 leading-relaxed font-medium">
                Welcoming diverse thoughts, backgrounds, and perspectives to
                create a rich, supportive community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP */}

      <section className="py-24 bg-emerald-950 text-cream-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                Mentored by
                <br />
                <span className="italic font-normal text-emerald-400">
                  Academic Excellence
                </span>
              </h2>

              <p className="text-lg text-cream-50/60 leading-relaxed font-medium">
                ChromaDiaries is proudly supported and mentored by the esteemed
                faculty of Sabeelul Hidaya Islamic College. This ensures that
                young writers are guided by knowledge and professional editorial
                standards.
              </p>
            </div>

            <div className="w-full md:w-80 h-80 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center relative">
              <span className="text-7xl font-serif font-bold italic text-white/20">
                SH
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="py-32 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-8">
            Ready to define your era?
          </h2>

          <Link
            href="/auth"
            className="inline-flex px-12 py-5 bg-emerald-950 text-cream-50 rounded-full font-bold uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-950/20 active:scale-95"
          >
            Join the collective
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;