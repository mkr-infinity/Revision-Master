import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Edit2,
  Rocket,
  Palette,
  UserCircle,
  Check,
} from "lucide-react";
import { useAppContext, Theme } from "../context/AppContext";

const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAQAzSy1N7-v9EkBm_6K44hARrmv4qU1MASMqZrTK2JCHG2aSdGb1H9ba3faYDpzIL5myFtegPYyixWxSu9lTcJdGEJPhgIOJrgHWig4o6aAfkHZyNtCS2q87qXVEY6ISnObJ6g0G-zumq7aQorL-tsvxPrDue4Z87YBPQwunoZExetyBrthB-bF3zMLsfshWlOMw6V_gr4g0GObphW2Wy8iV2cPCcYcfPbExNuJJG_Op-C7EZZKRC9cfT6WhTXQGsTCDpvDH_kqqzo",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBvvL3uVDvZSzz_HvzYbce0CxB8MKoxgIIALuFJ_cR2DWKDOCSb5R082peOBeSZOup1iRCrX6A_pGnOPPlBUKosgS3iOUL1AvKs8VK9AQfeUUllNkihY6MPO9W0TtK5wc-rX0n8Eo-kjqN1Gks-17HETUVJknwRjvKxPXAYF_fRZxx4w3CTn6Er0A383CJlPzLvPsJ-lSHkWThLNX3tY5IUFk8g41911wEx_-tXr5Wn4oo7iFw2YPABWw4ZSnBRm90_gSLrE7WFRjhT",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA287toKxr1hsvM2yNR3VkBd8tZVb-fd8AC7ENlc6O3tdlPeXM29zI37LSU_H2iqGCh71srYNROUJaeijY4HYOfMzFbMUae0hCOvRYZhnXx6ATaIl0V_yc_4mkrcJ7rZ2S_rVeeAevnP6-0YWIoTM2ubG13bjf2yO7-XSpN-xbRTWbMIM8ns4zA9Rh3WHwQO7U2bwBpE6KTYpOjvkE4TkZjV-JpQ3CF9nRP2oBPI5uJbj8Pwv_AsnVpdxumtWtu3fmD3PSLBUlixs8B",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDRTbkzJ87KKJB9KOylTEK5ygxbA2cjlIzjSivGYmBFSzWIVu4AFC-Hb4cIof0O83Iw15xMqVHp8keRT3ogN54iHYn--yL0MvqE-q2vXE4mM9ts1CEEGXdb1kaFEPbVtRoaOIFguVwpNrM1QjYpgxxAsyM5Qv7-yh8fqlvw9_gpJo7YNb7k0mkhMbqyN7W3QR0PS2cxu0xc7TPl4Unu4KBWAjUH9EgrpY9RGcHqQ9yJISMHEBwoNOezT9Z3tNuGeBONcRq37EWfsXRA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBGXbpUe5avPDYP0KO_alA6HfhzjJacaxVY0dRwoZPtWvYei3hpmmFCfJ4qmHWCdfwfOSUkjLxOfWFh4qWzsf_3isMbL8gOvmahi1-I6KLKhsAjVONhlATA26xssvCy6DPgRUPDWjsxlPBVO4XQ2ad2HDFwDLFB175T_zTOU9cca7CpxahTwxOmTY2B4N5p0smrFarGrTxFYWHAGZuBE8PdIqwKZGlOB6wc-7IUUsNhni_25tUo0Wj4iMLMc2ZeLQz3sM1NovhVbeBt",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCsO-uVQeB6vlvy-u3Z7V6zRWJODQJ-kJ9LF3Axsbz8vWO7gV9BEvJ1jbA1BzRkLyCHd1i5RW3A3J4clKnRp9cmKaq-L0cGGIVWKmXZDWIUiW9B-AbO-X6RgjU2FInV5HrDuyagmkgmX1XtZuTf7u5ecyCBdnf8WWgp7KA4GYTeY1sW9cgMBEC4fhh6Pd4o23lsTIJ0_Sab43BO1fmj7IgYQoBicBJDmKQwYxMnmrkdqrj70AbK4ZPElugYNyN2XqZJ8eV3CEqsUIj7",
];

const themes: { id: Theme; name: string; colors: string }[] = [
  { id: "light", name: "Light", colors: "bg-white border-slate-200" },
  { id: "dark", name: "Dark", colors: "bg-slate-900 border-primary" },
  { id: "neon", name: "Neon", colors: "bg-black border-fuchsia-500" },
  { id: "green", name: "Green", colors: "bg-[#0a1a0a] border-emerald-500" },
];

const Onboarding = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const { state, updateUser } = useAppContext();

  const currentStep = parseInt(step || "1", 10);

  const handleNext = () => {
    if (currentStep < 3) {
      navigate(`/onboarding/${currentStep + 1}`);
    } else {
      updateUser({ onboardingCompleted: true });
      navigate("/");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/onboarding/${currentStep - 1}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <div className="flex items-center p-4 justify-between">
        {currentStep > 1 ? (
          <button
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="size-10"></div>
        )}
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
          Revision Master
        </h2>
      </div>

      <div className="flex flex-col gap-3 p-6">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
            Onboarding Progress
          </p>
          <p className="text-primary text-sm font-bold">
            Step {currentStep} of 3
          </p>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(127,19,236,0.6)] transition-all duration-500"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-4 pb-8 flex flex-col">
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-10 flex flex-col items-center">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <GraduationCap size={40} />
              </div>
              <h1 className="text-3xl font-bold leading-tight mb-2">
                Welcome, Scholar!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                Let's personalize your revision journey.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter Name
                </label>
                <input
                  type="text"
                  value={state.user.name}
                  onChange={(e) => updateUser({ name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter Age
                </label>
                <input
                  type="number"
                  value={state.user.age}
                  onChange={(e) => updateUser({ age: e.target.value })}
                  placeholder="Your age"
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="mt-auto pt-8">
              <button
                onClick={handleNext}
                disabled={!state.user.name}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(127,19,236,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold leading-tight mb-2">
                Select Your Target
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                Which exam are we mastering today?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["NEET", "JEE", "CUET", "Boards"].map((exam) => (
                <div
                  key={exam}
                  onClick={() => updateUser({ examTarget: exam })}
                  className={`relative group cursor-pointer border-2 rounded-xl transition-all ${state.user.examTarget === exam ? "border-primary bg-primary/10" : "border-transparent bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10"}`}
                >
                  <div className="relative flex flex-col items-center justify-center p-6">
                    <span className="text-lg font-bold">{exam}</span>
                    {state.user.examTarget === exam && (
                      <div className="absolute top-2 right-2">
                        <Check size={16} className="text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="col-span-2 mt-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">
                  Other / Custom Exam
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={
                      !["NEET", "JEE", "CUET", "Boards"].includes(
                        state.user.examTarget,
                      )
                        ? state.user.examTarget
                        : ""
                    }
                    onChange={(e) => updateUser({ examTarget: e.target.value })}
                    placeholder="e.g. GATE, SAT, UPSC..."
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40">
                    <Edit2 size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <button
                onClick={handleNext}
                disabled={!state.user.examTarget}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(127,19,236,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold leading-tight mb-2">
                Final Touches
              </h1>
            </div>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="text-primary" size={20} />
                <h2 className="text-lg font-bold">Choose Your Theme</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => updateUser({ theme: t.id })}
                    className="relative group cursor-pointer"
                  >
                    <div
                      className={`aspect-[4/3] rounded-xl border-2 p-3 flex flex-col justify-between overflow-hidden ${t.colors} ${state.user.theme === t.id ? "border-primary ring-2 ring-primary/20" : "border-slate-200 dark:border-white/10"}`}
                    >
                      {state.user.theme === t.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium text-center ${state.user.theme === t.id ? "text-primary font-bold" : ""}`}
                    >
                      {t.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserCircle className="text-primary" size={20} />
                  <h2 className="text-lg font-bold">Pick Your Avatar</h2>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                {avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    onClick={() => updateUser({ avatar })}
                    className={`flex-none w-24 h-24 rounded-full border-2 p-1 cursor-pointer relative ${state.user.avatar === avatar ? "bg-primary/20 border-primary" : "bg-primary/5 border-transparent"}`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${idx + 1}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                    {state.user.avatar === avatar && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-background-dark">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-auto pt-4">
              <button
                onClick={handleNext}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(127,19,236,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Complete Setup</span>
                <Rocket
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-4">
                You can change these preferences anytime in settings.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
