import Link from "next/link";
import {
  PenTool,
  CheckCircle2,
  AlertCircle,
  Send,
  UserPlus,
  Edit3,
  Mail,
} from "lucide-react";

const SubmissionGuidelinesPage = () => {
  const categories = [
    {
      name: "Feature Articles",
      limit: "Max 1600 words",
      icon: <Edit3 className="w-5 h-5" />,
    },
    {
      name: "Essays",
      limit: "Max 1600 words",
      icon: <PenTool className="w-5 h-5" />,
    },
    {
      name: "Stories",
      limit: "Max 1000 words",
      icon: <Edit3 className="w-5 h-5" />,
    },
    {
      name: "Poems",
      limit: "8–25 lines",
      icon: <Edit3 className="w-5 h-5" />,
    },
    {
      name: "Translations",
      limit: "No word limit",
      icon: <Edit3 className="w-5 h-5" />,
    },
    {
      name: "Reviews",
      limit: "No word limit",
      icon: <Edit3 className="w-5 h-5" />,
    },
    {
      name: "Travelogues",
      limit: "No word limit",
      icon: <Edit3 className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-cream-50 min-h-screen py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* HERO */}

        <header className="mb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-emerald-950 mb-8 leading-tight">
            ChromaDiaries –
            <br />
            <span className="italic font-normal text-emerald-800">
              Submission Guidelines
            </span>
          </h1>

          <p className="text-lg text-emerald-950/60 font-medium max-w-3xl mx-auto leading-relaxed">
            ChromaDiaries is an Islamic English-language web magazine for
            readers under 18. We welcome original, creative, and meaningful
            works from children and teens.
          </p>
        </header>

        {/* WHO CAN SUBMIT */}

        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-950 text-cream-50 rounded-full flex items-center justify-center font-serif text-xl font-bold">
              1
            </div>

            <h2 className="text-3xl font-serif font-bold text-emerald-950">
              Who Can Submit
            </h2>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5">
            <ul className="space-y-6 text-emerald-950/70 font-medium leading-relaxed">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />

                <span>Students under 18 years of age.</span>
              </li>

              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />

                <span>Submissions must be original and unpublished.</span>
              </li>

              <li className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-red-500 mt-1 shrink-0" />

                <span className="text-red-700 font-bold">
                  Plagiarized content will be detected and rejected.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* CATEGORIES */}

        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-950 text-cream-50 rounded-full flex items-center justify-center font-serif text-xl font-bold">
              2
            </div>

            <h2 className="text-3xl font-serif font-bold text-emerald-950">
              What Can You Submit
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-lg shadow-emerald-950/5 flex flex-col items-center text-center group hover:bg-emerald-950 hover:text-cream-50 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-emerald-950/5 rounded-xl flex items-center justify-center mb-4 text-emerald-950 group-hover:bg-white/10 group-hover:text-cream-50 transition-colors">
                  {cat.icon}
                </div>

                <h3 className="font-serif font-bold text-xl mb-2">
                  {cat.name}
                </h3>

                <p className="text-sm opacity-60 font-bold uppercase tracking-widest">
                  {cat.limit}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-emerald-950/50 font-medium italic">
            * All content should be suitable for young readers.
          </p>
        </section>

        {/* REQUIREMENTS */}

        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-950 text-cream-50 rounded-full flex items-center justify-center font-serif text-xl font-bold">
              3
            </div>

            <h2 className="text-3xl font-serif font-bold text-emerald-950">
              Submission Requirements
            </h2>
          </div>

          <div className="bg-emerald-950 text-cream-50 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />

            <p className="text-lg mb-10 font-medium opacity-80">
              Create an <strong>Author Profile</strong> on the ChromaDiaries
              website, including:
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
              {[
                "First Name",
                "Surname",
                "Email",
                "Phone Number",
                "Institution/School",
                "Bio",
                "Website",
                "Location",
                "Date of Birth",
                "Password",
              ].map((field, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />

                  <span className="font-medium text-sm lg:text-base">
                    {field}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center gap-8 justify-between">
              <p className="text-emerald-400 font-bold italic">
                Once your profile is created, you can submit your work through
                your account.
              </p>

              <Link
                href="/auth"
                className="flex items-center gap-4 px-10 py-5 bg-white text-emerald-950 rounded-full font-bold text-xs tracking-[0.2em] hover:bg-emerald-50 transition-all shadow-2xl active:scale-95 whitespace-nowrap"
              >
                <UserPlus className="w-5 h-5" />
                CREATE PROFILE
              </Link>
            </div>
          </div>
        </section>

        {/* NOTIFICATION + EDITING */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* NOTIFICATION */}

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-950 text-cream-50 rounded-full flex items-center justify-center font-serif text-xl font-bold">
                4
              </div>

              <h2 className="text-2xl font-serif font-bold text-emerald-950">
                Acceptance Notification
              </h2>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 h-full">
              <ul className="space-y-6 text-emerald-950/70 font-medium">
                <li className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-emerald-950 mt-1" />

                  <span>
                    Authors will receive an acceptance letter within{" "}
                    <strong>1 week</strong> of submission.
                  </span>
                </li>

                <li className="flex items-start gap-4 text-sm italic opacity-60">
                  <span>
                    * Only selected works will be published on ChromaDiaries.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* EDITING */}

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-950 text-cream-50 rounded-full flex items-center justify-center font-serif text-xl font-bold">
                5
              </div>

              <h2 className="text-2xl font-serif font-bold text-emerald-950">
                Editing Process
              </h2>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 h-full space-y-8">
              <div>
                <h4 className="font-serif font-bold text-lg text-emerald-950 mb-3">
                  Initial Review
                </h4>

                <p className="text-sm text-emerald-950/60 leading-relaxed font-medium">
                  The editorial team checks for originality, authenticity,
                  language, and suitability for young readers.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-emerald-950 mb-3">
                  Editing
                </h4>

                <p className="text-sm text-emerald-950/60 leading-relaxed font-medium">
                  Minor edits may be made for clarity, readability, grammar,
                  punctuation, and spelling.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}

        <section className="text-center">
          <Link
            href="/submit-piece"
            className="group inline-flex items-center gap-6 px-16 py-6 bg-emerald-950 text-cream-50 rounded-full font-bold text-sm tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
            SUBMIT WORK
          </Link>
        </section>
      </div>
    </div>
  );
};

export default SubmissionGuidelinesPage;
