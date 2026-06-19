import { Link } from "react-router";
import { Sparkles, ShieldCheck, NotebookPen } from "lucide-react";

const AuthShell = ({ title, subtitle, footerText, footerLink, footerLabel, children }) => {
  return (
    <div className="min-h-screen overflow-hidden bg-base-200 text-base-content">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,255,157,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(0,255,157,0.08),_transparent_22%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-100/80 px-4 py-2 text-sm text-base-content/70 shadow-sm backdrop-blur">
            <Sparkles className="size-4 text-primary" />
            Optional JWT auth for your notes
          </div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-base-content sm:text-5xl">
              Keep private notes, or stay in guest mode.
            </h1>
            <p className="max-w-lg text-base leading-7 text-base-content/70">{subtitle}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-5 shadow-lg backdrop-blur">
              <ShieldCheck className="size-6 text-primary" />
              <p className="mt-3 font-semibold">Token-backed access</p>
              <p className="mt-2 text-sm text-base-content/65">
                Sign in to isolate your own note feed without breaking guest usage.
              </p>
            </div>
            <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-5 shadow-lg backdrop-blur">
              <NotebookPen className="size-6 text-primary" />
              <p className="mt-3 font-semibold">Same editor, same flow</p>
              <p className="mt-2 text-sm text-base-content/65">
                Write, summarize, and improve notes with the existing dark UI.
              </p>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-3xl" />
          <div className="relative card border border-base-content/10 bg-base-100/90 shadow-2xl backdrop-blur">
            <div className="card-body p-8 sm:p-10">
              <div className="mb-5 space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="text-sm text-base-content/60">{subtitle}</p>
              </div>
              {children}
              <p className="mt-5 text-sm text-base-content/60">
                {footerText} <Link to={footerLink} className="font-semibold text-primary">{footerLabel}</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthShell;