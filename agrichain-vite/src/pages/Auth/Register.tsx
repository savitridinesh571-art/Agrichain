import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { auth, db } from "../../lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  EmailAuthProvider,
  linkWithCredential
} from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  ArrowLeft, Sprout, Mic, User as UserIcon, MapPin, Navigation, Building2, Check,
  Wheat, ShoppingBag, ArrowRight, Sparkles, CheckCircle2, Clock, PhoneCall, Loader2,
  RefreshCw, Lock, Mail, Eye, EyeOff, AlertCircle, X
} from "lucide-react";
import {
  validateFullName, validateEmail, validateMobileNumber, validatePassword,
  validateConfirmPassword, validateFarmCluster, validatePrimaryCrops,
  validateDeliveryAddress, validateCityArea, validatePinCode,
  evaluatePasswordRequirements, evaluatePasswordStrength,
  sanitizeFullName, sanitizeEmail, sanitizeMobileNumber
} from "../../utils/validation";
import { getCoordinatesForLocation } from "../../lib/location";

export function Register() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const [lang, setLang] = useState<"EN" | "HI" | "MR">("EN");
  const [role, setRole] = useState<"FARMER" | "CUSTOMER">("FARMER");

  // Form Fields
  const [farmerForm, setFarmerForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    farmCluster: "Nashik - Dindori Cluster (नाशिक - दिंडोरी)",
    upiId: "",
    isOrganic: true,
    agreedToCharter: true,
    selectedCrops: ["Tomato", "Onion"]
  });

  const [customerForm, setCustomerForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    deliveryAddress: "",
    cityArea: "Mira Road, Thane",
    pinCode: "401107",
    deliverySlot: "Morning 7 AM - 10 AM (सकाळच्या वेळी)",
    agreedToTerms: true
  });

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field Touched & Error States
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  // Firebase Real Phone OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [mobileError, setMobileError] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try { recaptchaVerifierRef.current.clear(); } catch (e) { }
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const cropOptions = [
    { id: "Tomato", label: "टोमॅटो (Tomato)" },
    { id: "Onion", label: "कांदा (Onion)" },
    { id: "Grapes", label: "द्राक्षे (Grapes)" },
    { id: "Pomegranate", label: "डाळिंब (Pomegranate)" },
    { id: "Leafy Greens", label: "पालेभाज्या (Leafy Greens)" },
  ];

  const farmClusterOptions = [
    "Nashik - Dindori Cluster (नाशिक - दिंडोरी)",
    "Pune - Haveli Cluster (पुणे - हवेली)",
    "Mira-Bhayandar Cluster (मीरा-भाईंदर)",
    "Ratnagiri - Coastal Cluster (रत्नागिरी)",
    "Nagpur - Citrus Cluster (नागपूर)"
  ];

  const toggleCrop = (cropId: string) => {
    setFarmerForm(prev => {
      const updated = prev.selectedCrops.includes(cropId)
        ? prev.selectedCrops.filter(c => c !== cropId)
        : [...prev.selectedCrops, cropId];
      if (touched.selectedCrops) {
        const v = validatePrimaryCrops(updated);
        setFieldErrors(fe => ({ ...fe, selectedCrops: v.error }));
      }
      return { ...prev, selectedCrops: updated };
    });
  };

  const resetOtpState = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setConfirmationResult(null);
    setEnteredOtp(["", "", "", "", "", ""]);
    setOtpError(null);
    setOtpNotice(null);
  };

  const handleRoleSwitch = (newRole: "FARMER" | "CUSTOMER") => {
    if (newRole !== role) {
      setRole(newRole);
      setMobileError(null);
      setTouched({});
      setFieldErrors({});
      setSubmitError(null);
      resetOtpState();
    }
  };

  const markTouched = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName);
  };

  const currentForm = role === "FARMER" ? farmerForm : customerForm;

  const validateField = (fieldName: string) => {
    let err: string | null = null;
    if (fieldName === "fullName") {
      err = validateFullName(currentForm.fullName).error;
    } else if (fieldName === "email") {
      err = validateEmail(currentForm.email).error;
    } else if (fieldName === "mobileNumber") {
      err = validateMobileNumber(currentForm.mobileNumber).error;
    } else if (fieldName === "password") {
      err = validatePassword(currentForm.password).error;
    } else if (fieldName === "confirmPassword") {
      err = validateConfirmPassword(currentForm.password, currentForm.confirmPassword).error;
    } else if (role === "FARMER" && fieldName === "farmCluster") {
      err = validateFarmCluster(farmerForm.farmCluster).error;
    } else if (role === "FARMER" && fieldName === "selectedCrops") {
      err = validatePrimaryCrops(farmerForm.selectedCrops).error;
    } else if (role === "CUSTOMER" && fieldName === "deliveryAddress") {
      err = validateDeliveryAddress(customerForm.deliveryAddress).error;
    } else if (role === "CUSTOMER" && fieldName === "cityArea") {
      err = validateCityArea(customerForm.cityArea).error;
    } else if (role === "CUSTOMER" && fieldName === "pinCode") {
      err = validatePinCode(customerForm.pinCode).error;
    }
    setFieldErrors(prev => ({ ...prev, [fieldName]: err }));
    return err;
  };

  const validateAllFields = () => {
    const errors: Record<string, string | null> = {};
    errors.fullName = validateFullName(currentForm.fullName).error;
    errors.email = validateEmail(currentForm.email).error;
    errors.mobileNumber = validateMobileNumber(currentForm.mobileNumber).error;
    errors.password = validatePassword(currentForm.password).error;
    errors.confirmPassword = validateConfirmPassword(currentForm.password, currentForm.confirmPassword).error;

    if (role === "FARMER") {
      errors.farmCluster = validateFarmCluster(farmerForm.farmCluster).error;
      errors.selectedCrops = validatePrimaryCrops(farmerForm.selectedCrops).error;
    } else {
      errors.deliveryAddress = validateDeliveryAddress(customerForm.deliveryAddress).error;
      errors.cityArea = validateCityArea(customerForm.cityArea).error;
      errors.pinCode = validatePinCode(customerForm.pinCode).error;
    }

    setFieldErrors(errors);
    const allTouched: Record<string, boolean> = {};
    Object.keys(errors).forEach(k => { allTouched[k] = true; });
    setTouched(allTouched);

    return !Object.values(errors).some(e => e !== null);
  };

  const handleMobileChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (mobileError) setMobileError(null);
    resetOtpState();

    if (role === "FARMER") {
      setFarmerForm(prev => ({ ...prev, mobileNumber: digits }));
    } else {
      setCustomerForm(prev => ({ ...prev, mobileNumber: digits }));
    }

    if (touched.mobileNumber) {
      const v = validateMobileNumber(digits);
      setFieldErrors(fe => ({ ...fe, mobileNumber: v.error }));
    }
  };

  const getRecaptchaVerifier = () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }
    const envSiteKey = import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY;
    const isValidReCaptchaKey = envSiteKey && envSiteKey.length < 50 && (envSiteKey.startsWith("6L") || envSiteKey.startsWith("6e") || envSiteKey.startsWith("6F"));

    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      ...(isValidReCaptchaKey ? { sitekey: envSiteKey } : {}),
      callback: () => { },
      "expired-callback": () => {
        setOtpError("reCAPTCHA expired. Please click 'Send OTP' again.");
        setIsSendingOtp(false);
      }
    });

    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const handleSendFirebaseOtp = async () => {
    const currentMobile = role === "FARMER" ? farmerForm.mobileNumber : customerForm.mobileNumber;
    const mobileVal = validateMobileNumber(currentMobile);
    if (!mobileVal.isValid) {
      setMobileError(mobileVal.error);
      return;
    }

    setMobileError(null);
    setOtpError(null);
    setOtpNotice(null);
    setIsSendingOtp(true);

    try {
      const formattedPhone = `+91${currentMobile}`;
      const appVerifier = getRecaptchaVerifier();
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);

      setConfirmationResult(confirmation);
      setOtpSent(true);
      setOtpVerified(false);
      setEnteredOtp(["", "", "", "", "", ""]);
      setResendTimer(30);
      setOtpNotice(`OTP sent to +91 ${currentMobile.slice(0, 5)} ${currentMobile.slice(5)}`);
    } catch (error: any) {
      console.error("Firebase Phone Auth Error:", error);
      let errorMessage = "Failed to send SMS OTP.";

      if (error?.code === "auth/billing-not-allowed" || error?.code === "auth/billing-not-enabled") {
        errorMessage = "Real SMS delivery requires a Firebase Blaze plan (Pay-as-you-go). To test for FREE without adding a credit card, add your mobile number under Firebase Console -> Authentication -> Sign-in method -> Phone numbers for testing.";
      } else if (error?.code === "auth/operation-not-allowed") {
        errorMessage = "SMS Region Policy restriction in Firebase. Please enable India (+91) under Firebase Console -> Authentication -> Settings -> SMS Region Policy, OR add your phone number under 'Phone numbers for testing'.";
      } else if (error?.code === "auth/configuration-not-found") {
        errorMessage = "Phone Authentication is NOT enabled in your Firebase Console. Please go to Firebase Console -> Authentication -> Sign-in method -> Enable 'Phone'.";
      } else if (error?.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number (+91 " + currentMobile + "). Please check your mobile number.";
      } else if (error?.code === "auth/too-many-requests") {
        errorMessage = "Too many OTP requests from this IP/device. Please wait a few minutes before trying again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setOtpError(`Firebase Error (${error?.code || 'auth/error'}): ${errorMessage}`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyFirebaseOtp = async (codeToVerify?: string) => {
    const otpToVerify = codeToVerify || enteredOtp.join("");
    if (otpToVerify.length !== 6) {
      setOtpError("Please enter all 6 digits of the OTP received on your mobile");
      return;
    }
    if (!confirmationResult) {
      setOtpError("Verification session expired. Please request a new OTP.");
      return;
    }

    setOtpError(null);
    setIsVerifyingOtp(true);

    try {
      await confirmationResult.confirm(otpToVerify);
      setOtpVerified(true);
      setOtpNotice("✓ Mobile number verified successfully");
      setOtpError(null);
    } catch (error: any) {
      console.error("Firebase OTP confirmation error:", error);
      setOtpVerified(false);
      let errorMessage = "Invalid OTP. Please check the SMS and try again.";
      if (error?.code === "auth/code-expired" || error?.code === "auth/session-expired") {
        errorMessage = "OTP has expired. Please click 'Resend OTP' to receive a new code.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      setOtpError(errorMessage);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...enteredOtp];
    newOtp[index] = digit;
    setEnteredOtp(newOtp);
    if (otpError) setOtpError(null);

    if (digit && index < 5) {
      const nextInput = document.getElementById(`reg-otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    const joined = newOtp.join("");
    if (joined.length === 6) {
      handleVerifyFirebaseOtp(joined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !enteredOtp[index] && index > 0) {
      const prevInput = document.getElementById(`reg-otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleDetectGps = () => {
    setGpsStatus("📡 Requesting real-time GPS location from browser...");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            setGpsStatus(`✓ Farm location detected successfully: Lat ${lat.toFixed(4)}, Long ${lng.toFixed(4)}`);
          } else {
            setGpsStatus("⚠️ Detected location coordinates are out of valid range.");
          }
        },
        () => {
          setGpsStatus("Location permission was denied. You can add your location later.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsStatus("⚠️ Geolocation API is not supported by your browser.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const isFormValid = validateAllFields();
    if (!isFormValid) {
      setSubmitError("Please correct the highlighted errors in the form before submitting.");
      return;
    }

    if (!otpVerified) {
      setOtpError("Please verify your 6-digit Mobile OTP via Firebase Authentication before continuing.");
      return;
    }

    const isAgreed = role === "FARMER" ? farmerForm.agreedToCharter : customerForm.agreedToTerms;
    if (!isAgreed) {
      setSubmitError(role === "FARMER" ? "Please accept the Fair Trade Charter and supply terms to continue." : "Please accept terms to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanEmail = sanitizeEmail(currentForm.email);
      const cleanName = sanitizeFullName(currentForm.fullName);
      const cleanMobile = sanitizeMobileNumber(currentForm.mobileNumber);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error(
          "Firebase phone verification session was not found. Please verify your mobile number again."
        );
      }

      const emailCredential = EmailAuthProvider.credential(
        cleanEmail,
        currentForm.password
      );

      const userCredential = await linkWithCredential(
        currentUser,
        emailCredential
      );

      const firebaseUser = userCredential.user;

      if (role === "FARMER") {
        const farmerLoc = farmerForm.farmCluster.split(" ")[0] + ", MH";
        const farmerCoords = getCoordinatesForLocation(farmerLoc);

        const farmerProfile = {
          uid: firebaseUser.uid,
          name: cleanName,
          email: cleanEmail,
          phone: "+91 " + cleanMobile,
          role: "FARMER",
          farmName: `${cleanName.split(" ")[0]}'s Organic Farm`,
          location: farmerLoc,
          latitude: farmerCoords.latitude,
          longitude: farmerCoords.longitude,
          farmCluster: farmerForm.farmCluster,
          upiId: farmerForm.upiId,
          isOrganic: farmerForm.isOrganic,
          selectedCrops: farmerForm.selectedCrops,
          agreedToCharter: farmerForm.agreedToCharter,
          createdAt: new Date().toISOString()
        };

        await setDoc(
          doc(db, "users", firebaseUser.uid),
          farmerProfile,
          { merge: true }
        );

        login({
          id: firebaseUser.uid,
          name: cleanName,
          phone: "+91 " + cleanMobile,
          role: "FARMER",
          farmName: `${cleanName.split(" ")[0]}'s Organic Farm`,
          location: farmerLoc,
          latitude: farmerCoords.latitude,
          longitude: farmerCoords.longitude,
          email: cleanEmail
        });

        navigate("/farmer");
      } else {
        const custLoc = `${customerForm.deliveryAddress}, ${customerForm.cityArea}`;
        const custCoords = getCoordinatesForLocation(custLoc);

        const customerProfile = {
          uid: firebaseUser.uid,
          name: cleanName,
          email: cleanEmail,
          phone: "+91 " + cleanMobile,
          role: "CUSTOMER",
          location: custLoc,
          farmName: "",
          latitude: custCoords.latitude,
          longitude: custCoords.longitude,
          deliveryAddress: customerForm.deliveryAddress,
          cityArea: customerForm.cityArea,
          pinCode: customerForm.pinCode,
          deliverySlot: customerForm.deliverySlot,
          agreedToTerms: customerForm.agreedToTerms,
          createdAt: new Date().toISOString()
        };

        await setDoc(
          doc(db, "users", firebaseUser.uid),
          customerProfile,
          { merge: true }
        );

        login({
          id: firebaseUser.uid,
          name: cleanName,
          phone: "+91 " + cleanMobile,
          role: "CUSTOMER",
          location: custLoc,
          farmName: "",
          latitude: custCoords.latitude,
          longitude: custCoords.longitude,
          email: cleanEmail
        });

        navigate("/");
      }
    } catch (error: any) {
      console.error("Firebase Registration Error:", error);
      let msg = "Failed to create account. Please try again.";
      if (error?.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Please sign in instead.";
      } else if (error?.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (error?.code === "auth/weak-password") {
        msg = "Your password does not meet the required strength.";
      } else if (error?.code === "auth/network-request-failed") {
        msg = "Network connection failed. Please check your internet connection.";
      } else if (error?.message) {
        msg = error.message;
      }
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordReqs = evaluatePasswordRequirements(currentForm.password);
  const passwordStrength = evaluatePasswordStrength(currentForm.password);
  const isAgreed = role === "FARMER" ? farmerForm.agreedToCharter : customerForm.agreedToTerms;

  return (
    <div className="min-h-screen bg-[#F4F8F4] flex flex-col items-center py-6 px-3 sm:px-6 font-sans">
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-[#D5E5D8]">
        {/* Top Header */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
          <Link to="/login" className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-700" title="Go to Login">
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

        <div className="p-5 sm:p-6 flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-[#1B4332]">
              {lang === "MR" ? "नवीन नोंदणी करा" : lang === "HI" ? "नया पंजीकरण करें" : "Create AgriChain Account"}
            </h1>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Join AgriChain direct living soil network in under 2 minutes.</p>
          </div>

          {/* Role Switcher */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Select Account Type / खात्याचा प्रकार निवडा *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSwitch("FARMER")}
                className={`p-3.5 rounded-2xl text-left transition flex flex-col gap-1 border-2 ${role === "FARMER" ? "bg-white border-[#1B4332] shadow-md ring-2 ring-[#1B4332]/20" : "bg-[#F4F8F4] border-[#D5E5D8] hover:bg-[#EBF4EE]"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center"><Wheat className="w-5 h-5 text-amber-300" /></div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3 text-emerald-700" /> PRO</span>
                </div>
                <div className="mt-1">
                  <div className="font-extrabold text-sm text-[#1B4332]">Farmer</div>
                  <div className="text-xs text-gray-600 font-bold">शेतकरी</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch("CUSTOMER")}
                className={`p-3.5 rounded-2xl text-left transition flex flex-col gap-1 border-2 ${role === "CUSTOMER" ? "bg-white border-[#1B4332] shadow-md ring-2 ring-[#1B4332]/20" : "bg-[#F4F8F4] border-[#D5E5D8] hover:bg-[#EBF4EE]"}`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center"><ShoppingBag className="w-5 h-5" /></div>
                <div className="mt-1">
                  <div className="font-extrabold text-sm text-[#1B4332]">Customer</div>
                  <div className="text-xs text-gray-600 font-bold">ग्राहक</div>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name (पूर्ण नाव) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  value={currentForm.fullName}
                  onBlur={() => markTouched("fullName")}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (role === "FARMER") setFarmerForm(p => ({ ...p, fullName: val }));
                    else setCustomerForm(p => ({ ...p, fullName: val }));
                    if (touched.fullName) validateField("fullName");
                  }}
                  placeholder={role === "FARMER" ? "Ramesh Patil" : "Sumit Yadav"}
                  className={`w-full bg-[#EBF4EE]/50 border ${touched.fullName && fieldErrors.fullName ? "border-red-500 bg-red-50/20" : touched.fullName && !fieldErrors.fullName ? "border-emerald-500 bg-emerald-50/20" : "border-[#D5E5D8]"} rounded-xl pl-9 pr-9 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                  required
                />
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                {touched.fullName && !fieldErrors.fullName && <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />}
                {touched.fullName && fieldErrors.fullName && <X className="w-4 h-4 text-red-500 absolute right-3 top-3" />}
              </div>
              {touched.fullName && fieldErrors.fullName && (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (ईमेल आयडी) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="email"
                  value={currentForm.email}
                  onBlur={() => markTouched("email")}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (role === "FARMER") setFarmerForm(p => ({ ...p, email: val }));
                    else setCustomerForm(p => ({ ...p, email: val }));
                    if (touched.email) validateField("email");
                  }}
                  placeholder="sumit@gmail.com"
                  className={`w-full bg-[#EBF4EE]/50 border ${touched.email && fieldErrors.email ? "border-red-500 bg-red-50/20" : touched.email && !fieldErrors.email ? "border-emerald-500 bg-emerald-50/20" : "border-[#D5E5D8]"} rounded-xl pl-9 pr-9 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                {touched.email && !fieldErrors.email && <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />}
                {touched.email && fieldErrors.email && <X className="w-4 h-4 text-red-500 absolute right-3 top-3" />}
              </div>
              {touched.email && fieldErrors.email && (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.email}</p>
              )}
            </div>

            {/* Mobile Number & Real Firebase Phone OTP */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700">Mobile Number (मोबाईल क्रमांक - 10 Digits) <span className="text-red-500">*</span></label>
                {otpVerified && (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-700" /> Phone number verified ✓
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#EBF4EE] border border-[#D5E5D8] rounded-xl px-3 py-2.5 text-xs font-extrabold text-[#1B4332] shrink-0">+91</div>
                <input
                  type="tel"
                  maxLength={10}
                  disabled={otpVerified}
                  value={currentForm.mobileNumber}
                  onBlur={() => markTouched("mobileNumber")}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  placeholder="8102055722"
                  className={`flex-1 bg-[#EBF4EE]/50 border ${mobileError || (touched.mobileNumber && fieldErrors.mobileNumber) ? "border-red-500 ring-1 ring-red-500 bg-red-50/20" : otpVerified ? "border-emerald-500 bg-emerald-50/50" : "border-[#D5E5D8]"} rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332] disabled:opacity-75`}
                  required
                />

                {!otpVerified ? (
                  <button
                    type="button"
                    onClick={handleSendFirebaseOtp}
                    disabled={isSendingOtp || currentForm.mobileNumber.length !== 10}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center gap-1.5 shadow-sm ${isSendingOtp || currentForm.mobileNumber.length !== 10 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#1B4332] hover:bg-[#122e22] text-white"}`}
                  >
                    {isSendingOtp ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Sending...</span></> : <span>{otpSent ? "Resend OTP" : "Send OTP"}</span>}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetOtpState}
                    className="px-3 py-2.5 rounded-xl text-xs font-extrabold text-amber-800 bg-amber-100 hover:bg-amber-200 transition shrink-0 flex items-center gap-1"
                    title="Change mobile number and re-verify"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                )}
              </div>

              {(mobileError || (touched.mobileNumber && fieldErrors.mobileNumber)) && (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{mobileError || fieldErrors.mobileNumber}</p>
              )}

              {otpError && !otpSent && (
                <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 font-extrabold flex items-center gap-1.5 shadow-sm">
                  <span>⚠️ {otpError}</span>
                </div>
              )}
            </div>

            {/* REAL Firebase OTP Verification Section */}
            {otpSent && !otpVerified && (
              <div className="p-4 bg-[#F0F7F2] border border-[#CDE3D2] rounded-2xl flex flex-col gap-3 shadow-inner">
                {otpNotice && (
                  <div className="text-xs font-bold text-[#1B4332] flex items-center gap-1.5 bg-emerald-100/70 p-2 rounded-xl border border-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{otpNotice}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1B4332]">Enter 6-Digit OTP / ६-अंकी OTP प्रविष्ट करा <span className="text-red-500">*</span></label>
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {enteredOtp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`reg-otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className={`h-12 text-center font-extrabold text-lg bg-white border ${otpError ? "border-red-500 ring-1 ring-red-500" : "border-[#D5E5D8]"} rounded-xl text-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332] shadow-sm`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleVerifyFirebaseOtp()}
                  disabled={isVerifyingOtp || enteredOtp.join("").length !== 6}
                  className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm ${isVerifyingOtp || enteredOtp.join("").length !== 6 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1B4332] hover:bg-[#122e22] text-white"}`}
                >
                  {isVerifyingOtp ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying OTP via Firebase...</span></> : <><Check className="w-4 h-4" /><span>Verify OTP</span></>}
                </button>

                {otpError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-extrabold flex items-center gap-1.5">
                    <span>⚠️ {otpError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs mt-0.5 pt-2 border-t border-emerald-200/60">
                  <button
                    type="button"
                    onClick={handleSendFirebaseOtp}
                    disabled={resendTimer > 0 || isSendingOtp}
                    className={`flex items-center gap-1 font-bold ${resendTimer > 0 || isSendingOtp ? "text-gray-400 cursor-not-allowed" : "text-[#1B4332] underline hover:text-emerald-950"}`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}</span>
                  </button>
                  <span className="text-[11px] text-gray-500 font-medium">Real Firebase SMS</span>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password (पासवर्ड) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentForm.password}
                  onBlur={() => markTouched("password")}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (role === "FARMER") setFarmerForm(p => ({ ...p, password: val }));
                    else setCustomerForm(p => ({ ...p, password: val }));
                    if (touched.password) validateField("password");
                    if (touched.confirmPassword) validateField("confirmPassword");
                  }}
                  placeholder="e.g. Agri@2026"
                  className={`w-full bg-[#EBF4EE]/50 border ${touched.password && fieldErrors.password ? "border-red-500 bg-red-50/20" : touched.password && !fieldErrors.password ? "border-emerald-500 bg-emerald-50/20" : "border-[#D5E5D8]"} rounded-xl pl-9 pr-10 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                  required
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {currentForm.password && (
                <div className="mt-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-gray-600">Password Strength:</span>
                    <span className={passwordStrength === "Strong" ? "text-emerald-700 font-extrabold" : passwordStrength === "Medium" ? "text-amber-700 font-extrabold" : "text-red-600 font-extrabold"}>
                      {passwordStrength}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className={`h-full transition-all duration-300 ${passwordStrength === "Strong" ? "w-full bg-emerald-600" : passwordStrength === "Medium" ? "w-2/3 bg-amber-500" : "w-1/3 bg-red-500"}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold text-gray-600">
                    <div className={passwordReqs.length ? "text-emerald-700 flex items-center gap-1" : "text-gray-400 flex items-center gap-1"}><Check className="w-3 h-3" /> 8+ characters</div>
                    <div className={passwordReqs.uppercase ? "text-emerald-700 flex items-center gap-1" : "text-gray-400 flex items-center gap-1"}><Check className="w-3 h-3" /> Uppercase letter</div>
                    <div className={passwordReqs.lowercase ? "text-emerald-700 flex items-center gap-1" : "text-gray-400 flex items-center gap-1"}><Check className="w-3 h-3" /> Lowercase letter</div>
                    <div className={passwordReqs.number ? "text-emerald-700 flex items-center gap-1" : "text-gray-400 flex items-center gap-1"}><Check className="w-3 h-3" /> Number</div>
                    <div className={passwordReqs.special ? "text-emerald-700 flex items-center gap-1" : "text-gray-400 flex items-center gap-1"}><Check className="w-3 h-3" /> Special character</div>
                  </div>
                </div>
              )}
              {touched.password && fieldErrors.password && (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password (पासवर्डची पुष्टी करा) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={currentForm.confirmPassword}
                  onBlur={() => markTouched("confirmPassword")}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (role === "FARMER") setFarmerForm(p => ({ ...p, confirmPassword: val }));
                    else setCustomerForm(p => ({ ...p, confirmPassword: val }));
                    if (touched.confirmPassword) validateField("confirmPassword");
                  }}
                  placeholder="Re-enter password"
                  className={`w-full bg-[#EBF4EE]/50 border ${touched.confirmPassword && fieldErrors.confirmPassword ? "border-red-500 bg-red-50/20" : touched.confirmPassword && !fieldErrors.confirmPassword ? "border-emerald-500 bg-emerald-50/20" : "border-[#D5E5D8]"} rounded-xl pl-9 pr-10 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                  required
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Farmer Fields */}
            {role === "FARMER" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Farm Cluster / APMC Market Yard <span className="text-red-500">*</span></label>
                  <select
                    value={farmerForm.farmCluster}
                    onChange={(e) => setFarmerForm(prev => ({ ...prev, farmCluster: e.target.value }))}
                    className="w-full bg-[#EBF4EE]/50 border border-[#D5E5D8] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  >
                    {farmClusterOptions.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    className="w-full bg-[#EBF4EE] hover:bg-[#D9EBDC] border border-[#C2DEC8] text-[#1B4332] py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Navigation className="w-4 h-4 text-emerald-700" />
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Detect My Farm via GPS (शेत स्थान शोधा - OPTIONAL)</span>
                  </button>
                  {gpsStatus && <p className="text-[11px] text-emerald-800 font-bold mt-1 text-center">{gpsStatus}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary Crops (मुख्य पिके) <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-1.5">
                    {cropOptions.map((crop) => {
                      const isSelected = farmerForm.selectedCrops.includes(crop.id);
                      return (
                        <button
                          key={crop.id}
                          type="button"
                          onClick={() => toggleCrop(crop.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${isSelected ? "bg-[#1B4332] text-white shadow-sm" : "bg-[#EBF4EE] text-[#1B4332] hover:bg-[#D5E5D8]"}`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                          <span>{crop.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {touched.selectedCrops && fieldErrors.selectedCrops && (
                    <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.selectedCrops}</p>
                  )}
                </div>
              </>
            )}

            {/* Customer Fields */}
            {role === "CUSTOMER" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address (घरपोच पत्ता) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerForm.deliveryAddress}
                      onBlur={() => markTouched("deliveryAddress")}
                      onChange={(e) => {
                        setCustomerForm(p => ({ ...p, deliveryAddress: e.target.value }));
                        if (touched.deliveryAddress) validateField("deliveryAddress");
                      }}
                      placeholder="Flat 402, Green Heights, Sector 5"
                      className={`w-full bg-[#EBF4EE]/50 border ${touched.deliveryAddress && fieldErrors.deliveryAddress ? "border-red-500 bg-red-50/20" : "border-[#D5E5D8]"} rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                      required
                    />
                    <MapPin className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
                  </div>
                  {touched.deliveryAddress && fieldErrors.deliveryAddress && (
                    <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.deliveryAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City / Area <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={customerForm.cityArea}
                      onBlur={() => markTouched("cityArea")}
                      onChange={(e) => {
                        setCustomerForm(p => ({ ...p, cityArea: e.target.value }));
                        if (touched.cityArea) validateField("cityArea");
                      }}
                      placeholder="Mira Road"
                      className={`w-full bg-[#EBF4EE]/50 border ${touched.cityArea && fieldErrors.cityArea ? "border-red-500 bg-red-50/20" : "border-[#D5E5D8]"} rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                      required
                    />
                    {touched.cityArea && fieldErrors.cityArea && (
                      <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.cityArea}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Pincode (पिनकोड) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      maxLength={6}
                      value={customerForm.pinCode}
                      onBlur={() => markTouched("pinCode")}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setCustomerForm(p => ({ ...p, pinCode: digits }));
                        if (touched.pinCode) validateField("pinCode");
                      }}
                      placeholder="401107"
                      className={`w-full bg-[#EBF4EE]/50 border ${touched.pinCode && fieldErrors.pinCode ? "border-red-500 bg-red-50/20" : "border-[#D5E5D8]"} rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                      required
                    />
                    {touched.pinCode && fieldErrors.pinCode && (
                      <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.pinCode}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Checkbox Agreement */}
            <div className="flex items-start gap-2.5 mt-1">
              <input
                type="checkbox"
                id="charter"
                checked={isAgreed}
                onChange={(e) => {
                  const val = e.target.checked;
                  if (role === "FARMER") setFarmerForm(p => ({ ...p, agreedToCharter: val }));
                  else setCustomerForm(p => ({ ...p, agreedToTerms: val }));
                }}
                className="mt-0.5 w-4 h-4 text-[#1B4332] rounded focus:ring-[#1B4332] accent-[#1B4332]"
              />
              <label htmlFor="charter" className="text-xs text-gray-700 font-medium leading-tight">
                I agree to the <span className="font-bold text-[#1B4332] underline">Fair Trade Charter</span> and transparent direct supply terms.
              </label>
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={!otpVerified || !isAgreed || isSubmitting}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-base shadow-lg transition flex items-center justify-center gap-2 mt-1 ${otpVerified && isAgreed && !isSubmitting
                  ? "bg-[#1B4332] hover:bg-[#122e22] text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-80"
                }`}
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating Account...</span></>
              ) : (
                <><span>{role === "FARMER" ? "Register Farmer" : "Register Customer"}</span><ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            {!otpVerified && (
              <p className="text-[11px] text-amber-800 text-center font-bold -mt-2">
                🔒 Verify mobile number via Firebase SMS OTP to enable registration
              </p>
            )}
          </form>

          <div className="text-center text-xs text-gray-600 font-medium">
            <span>Already registered? </span>
            <Link to="/login" className="text-[#1B4332] font-extrabold underline ml-1 hover:text-black">
              Login here / लॉगिन करा
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
