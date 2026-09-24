import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { 
  ArrowLeft, Sprout, User as UserIcon, Lock, Wheat, ShoppingBag, 
  CheckCircle2, ArrowRight, Mail, Eye, EyeOff, AlertCircle, Loader2, X, KeyRound
} from "lucide-react";
import { validateEmail, sanitizeEmail } from "../../utils/validation";

export function Login() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const [lang, setLang] = useState<"EN" | "HI" | "MR">("EN");
  const [role, setRole] = useState<"FARMER" | "CUSTOMER">("FARMER");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Touched and Error States
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Forgot Password Modal States
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState<string | null>(null);
  const [resetSuccessNotice, setResetSuccessNotice] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleRoleSwitch = (newRole: "FARMER" | "CUSTOMER") => {
    if (newRole !== role) {
      setRole(newRole);
      setEmail("");
      setPassword("");
      setTouched({});
      setEmailError(null);
      setPasswordError(null);
      setLoginError(null);
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    const v = validateEmail(email);
    setEmailError(v.error);
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    if (!password) setPasswordError("Please enter your password");
    else setPasswordError(null);
  };

  const isFormValid = email.trim().length > 0 && validateEmail(email).isValid && password.length > 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error);
      setTouched(prev => ({ ...prev, email: true }));
      return;
    }
    if (!password) {
      setPasswordError("Please enter your password");
      setTouched(prev => ({ ...prev, password: true }));
      return;
    }

    setIsSigningIn(true);

    try {
      const cleanEmail = sanitizeEmail(email);
      // Attempt Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      // Fetch profile from Firestore to navigate according to saved role
      const profileRef = doc(db, "users", firebaseUser.uid);
      const profileSnap = await getDoc(profileRef);

      let userRole = role;
      if (profileSnap.exists()) {
        const profileData = profileSnap.data();
        if (profileData.role) {
          userRole = profileData.role;
        }
      }

      if (userRole === "FARMER") navigate("/farmer");
      else navigate("/");
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      let errorMessage = "Email or password is incorrect.";
      if (error?.code === "auth/invalid-credential" || error?.code === "auth/user-not-found" || error?.code === "auth/wrong-password") {
        errorMessage = "Email or password is incorrect.";
      } else if (error?.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error?.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      setLoginError(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetEmailError(null);
    setResetSuccessNotice(null);

    const v = validateEmail(resetEmail);
    if (!v.isValid) {
      setResetEmailError(v.error);
      return;
    }

    setIsSendingReset(true);

    try {
      const cleanEmail = sanitizeEmail(resetEmail);
      await sendPasswordResetEmail(auth, cleanEmail);
      setResetSuccessNotice("Password reset instructions have been sent to your email.");
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      let msg = "Unable to send password reset email. Please verify the email address.";
      if (error?.code === "auth/user-not-found") {
        msg = "Password reset instructions have been sent to your email.";
      } else if (error?.message) {
        msg = error.message;
      }
      setResetEmailError(msg);
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8F4] flex flex-col items-center py-6 px-3 sm:px-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-[#D5E5D8]">
        
        {/* Top Header */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
          <Link to="/register" className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-700" title="Go to Registration">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-[#1B4332] rounded-full flex items-center justify-center text-white">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-[#1B4332]">AGRICHAIN</span>
          </div>

          <div className="flex items-center bg-[#EBF4EE] rounded-full p-0.5 text-xs font-bold text-[#1B4332]">
            <button type="button" onClick={() => setLang("EN")} className={`px-2 py-0.5 rounded-full transition ${lang === "EN" ? "bg-[#1B4332] text-white" : "hover:opacity-75"}`}>EN</button>
            <button type="button" onClick={() => setLang("HI")} className={`px-2 py-0.5 rounded-full transition ${lang === "HI" ? "bg-[#1B4332] text-white" : "hover:opacity-75"}`}>हिंदी</button>
            <button type="button" onClick={() => setLang("MR")} className={`px-2 py-0.5 rounded-full transition ${lang === "MR" ? "bg-[#1B4332] text-white" : "hover:opacity-75"}`}>मराठी</button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E2F2E5] text-[#1B4332] rounded-full text-xs font-bold mb-2">
              <Sprout className="w-3.5 h-3.5" />
              <span>FARM-TO-HOME DIRECT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1B4332] leading-tight">
              {lang === "MR" ? "AGRICHAIN लॉगिन" : lang === "HI" ? "AGRICHAIN लॉगिन" : "Welcome to AGRICHAIN"}
            </h1>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Enter your Email and Password to access your account.</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleSwitch("FARMER")}
              className={`p-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-bold transition text-sm border-2 ${role === "FARMER" ? "bg-[#1B4332] text-white border-[#1B4332] shadow-md" : "bg-[#F4F8F4] text-[#1B4332] border-[#D5E5D8] hover:bg-[#EBF4EE]"}`}
            >
              <Wheat className="w-5 h-5 text-amber-400" />
              <div className="text-left leading-tight">
                <div>शेतकरी</div>
                <div className="text-[11px] opacity-80 font-normal">Farmer</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch("CUSTOMER")}
              className={`p-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-bold transition text-sm border-2 ${role === "CUSTOMER" ? "bg-[#1B4332] text-white border-[#1B4332] shadow-md" : "bg-[#F4F8F4] text-[#1B4332] border-[#D5E5D8] hover:bg-[#EBF4EE]"}`}
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <div className="text-left leading-tight">
                <div>ग्राहक</div>
                <div className="text-[11px] opacity-80 font-normal">Customer</div>
              </div>
            </button>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            {/* Email Address Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (ईमेल आयडी) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onBlur={handleEmailBlur}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) setEmailError(validateEmail(e.target.value).error);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="sumit@gmail.com"
                  className={`w-full bg-[#EBF4EE]/50 border ${touched.email && emailError ? "border-red-500 bg-red-50/20" : "border-[#D5E5D8]"} rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                  required
                />
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              </div>
              {touched.email && emailError && (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700">Password (पासवर्ड) <span className="text-red-500">*</span></label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] font-bold text-[#1B4332] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onBlur={handlePasswordBlur}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="Enter your password"
                  className={`w-full bg-[#EBF4EE]/50 border ${touched.password && passwordError ? "border-red-500 bg-red-50/20" : "border-[#D5E5D8]"} rounded-xl pl-9 pr-10 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                  required
                />
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && passwordError && (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{passwordError}</p>
              )}
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSigningIn}
              className={`w-full py-3 rounded-2xl font-extrabold text-sm shadow-lg transition flex items-center justify-center gap-2 mt-2 ${
                isFormValid && !isSigningIn
                  ? "bg-[#1B4332] hover:bg-[#122e22] text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-80"
              }`}
            >
              {isSigningIn ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in...</span></>
              ) : (
                <><span>Sign In / लॉगिन करा</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="text-center mt-2 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-extrabold text-[#1B4332] hover:underline ml-1">
                  Register Here / नोंदणी करा
                </Link>
              </p>
            </div>
          </form>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#D5E5D8] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1B4332]">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-base font-heading">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setResetSuccessNotice(null);
                  setResetEmailError(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 font-medium">
              Enter your registered email address below. We will send password reset instructions.
            </p>

            <form onSubmit={handleSendPasswordReset} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="sumit@gmail.com"
                    className="w-full bg-[#EBF4EE]/50 border border-[#D5E5D8] rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    required
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                </div>
                {resetEmailError && (
                  <p className="text-[11px] text-red-600 font-bold mt-1">{resetEmailError}</p>
                )}
              </div>

              {resetSuccessNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800">
                  ✓ {resetSuccessNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingReset || !resetEmail.trim()}
                className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 ${
                  isSendingReset || !resetEmail.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#1B4332] hover:bg-[#122e22] text-white"
                }`}
              >
                {isSendingReset ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending...</span></>
                ) : (
                  <span>SEND RESET LINK</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
