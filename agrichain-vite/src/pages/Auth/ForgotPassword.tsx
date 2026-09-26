import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Sprout, Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { validateEmail, mapFirebaseAuthError } from "../../utils/validation";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setErrorMessage(emailVal.error || "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setSuccessMessage("Password reset link has been sent to your email. Please check your inbox or spam folder.");
      setEmail("");
    } catch (err: any) {
      const friendlyMsg = mapFirebaseAuthError(err?.code || "");
      setErrorMessage(friendlyMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8 bg-background">
      <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-outline shadow-xl text-on-surface">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-primary" />
            <span className="font-heading font-black text-sm tracking-tight text-primary">AGRICHAIN</span>
          </div>
        </div>

        <h2 className="font-heading text-2xl font-black text-on-surface tracking-tight mb-2">
          Reset Your Password
        </h2>
        <p className="text-xs text-on-surface-variant font-medium mb-6 leading-relaxed">
          Enter the email address registered with your AgriChain account. We will send you an email link to reset your password.
        </p>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-xs font-bold">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-2xl text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span className="text-xs font-bold">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Registered Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-on-surface-variant" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-variant border border-outline rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-extrabold text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <span>Send Password Reset Link</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline pt-6">
          <p className="text-xs text-on-surface-variant">
            Remember your password?{" "}
            <Link to="/login" className="font-extrabold text-primary hover:underline ml-1">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
