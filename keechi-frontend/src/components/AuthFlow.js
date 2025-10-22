// src/components/AuthFlow.js - Login/Signup Component
"use client";

import { useState } from "react";
import { Phone, Mail, ArrowRight, CheckCircle, Loader } from "lucide-react";
import { Input, Button, Card } from "@/components";
import Link from "next/link";

export default function AuthFlow() {
  const [step, setStep] = useState("mode"); // mode | phone | otp | guest
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      // Store token and redirect
      localStorage.setItem("userToken", "demo-token-" + phone);
      window.location.href = "/salons";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-400 rounded-2xl mb-4">
            <span className="text-3xl">💇</span>
          </div>
          <h1 className="text-4xl font-bold text-charcoal-900 font-display mb-2">
            Keechi
          </h1>
          <p className="text-charcoal-600">
            Book your perfect salon visit
          </p>
        </div>

        {/* Mode Selection */}
        {step === "mode" && (
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={Phone}
              onClick={() => setStep("phone")}
              className="text-lg"
            >
              Login with Phone
            </Button>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => setStep("guest")}
            >
              Continue as Guest
            </Button>

            <p className="text-center text-sm text-charcoal-600">
              No account needed. Quick & easy booking.
            </p>
          </div>
        )}

        {/* Phone Entry */}
        {step === "phone" && (
          <Card elevated className="p-8">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-6 font-display">
              Enter Your Phone
            </h2>

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+880 1700 000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
              required
              helpText="We'll send you a verification code"
            />

            <div className="mt-6 space-y-3">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleSendOTP}
                loading={loading}
              >
                Send OTP
              </Button>

              <Button
                variant="ghost"
                fullWidth
                onClick={() => setStep("mode")}
              >
                Back
              </Button>
            </div>

            <p className="text-xs text-charcoal-600 mt-4 text-center">
              By continuing, you agree to our Terms of Service
            </p>
          </Card>
        )}

        {/* OTP Verification */}
        {step === "otp" && (
          <Card elevated className="p-8">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-2 font-display">
              Verify OTP
            </h2>
            <p className="text-charcoal-600 mb-6">
              Enter the code sent to <span className="font-semibold">{phone}</span>
            </p>

            <div className="grid grid-cols-6 gap-2 mb-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  placeholder="0"
                  value={otp[i] || ""}
                  onChange={(e) => {
                    const newOtp = otp.split("");
                    newOtp[i] = e.target.value;
                    setOtp(newOtp.join(""));
                  }}
                  className="input-field text-center text-2xl font-bold"
                />
              ))}
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleVerifyOTP}
                loading={loading}
                disabled={otp.length !== 6}
              >
                Verify & Continue
              </Button>

              <Button
                variant="ghost"
                fullWidth
                onClick={() => setStep("phone")}
              >
                Back
              </Button>
            </div>

            <p className="text-xs text-charcoal-600 mt-4 text-center">
              Didn't receive code?{" "}
              <button className="text-gold-600 font-semibold hover:text-gold-700">
                Resend
              </button>
            </p>
          </Card>
        )}

        {/* Guest Mode */}
        {step === "guest" && (
          <Card elevated className="p-8">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-6 font-display">
              Welcome!
            </h2>

            <div className="space-y-4 mb-6">
              <Input
                label="Full Name"
                placeholder="Your name"
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+880 1700 000000"
                required
                helpText="We'll use this to confirm your booking"
              />
            </div>

            <div className="space-y-3">
              <Link href="/salons">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                >
                  Start Booking
                </Button>
              </Link>

              <Button
                variant="ghost"
                fullWidth
                onClick={() => setStep("mode")}
              >
                Back
              </Button>
            </div>

            <p className="text-xs text-charcoal-600 mt-4 text-center">
              No login required for guest users
            </p>
          </Card>
        )}

        {/* Footer Links */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-charcoal-600">
            Are you a salon owner?{" "}
            <Link href="/admin" className="text-gold-600 font-semibold hover:text-gold-700">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
