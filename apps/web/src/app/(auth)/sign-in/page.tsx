"use client";

import { useStackApp } from "@stackframe/stack";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { OtpInput } from "@/components/ui/otp-input";

export default function SignInPage() {
  const app = useStackApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const safeReturnUrl =
    returnUrl?.startsWith("/") && !returnUrl.startsWith("//") ? returnUrl : null;

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [nonce, setNonce] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSendMagicLink = async (
    source: "initial" | "resend" = "initial",
  ) => {
    if (source === "resend" && resendCooldown > 0) return;

    if (!email) {
      addToast({ title: "Please enter your email address.", color: "danger" });
      return;
    }

    setIsEmailLoading(true);

    try {
      const result = await app.sendMagicLinkEmail(email);
      if (result.status === "error") {
        addToast({
          title: "Could not send verification code. Please try again.",
          color: "danger",
        });
      } else {
        setNonce(result.data.nonce);
        setOtp("");
        setStep("otp");
        setResendCooldown(20);
        addToast({
          title: "Verification code sent! Check your email.",
          color: "success",
        });
      }
    } catch {
      addToast({
        title: "Something went wrong. Please try again.",
        color: "danger",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  useEffect(() => {
    if (step !== "otp" || resendCooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [step, resendCooldown]);

  useEffect(() => {
    if (otp.length !== 6 || isVerifying) return;

    const verify = async () => {
      setIsVerifying(true);
      try {
        const result = await app.signInWithMagicLink(otp + nonce);
        if (result.status === "error") {
          addToast({
            title: "Invalid code. Please try again.",
            color: "danger",
          });
          setOtp("");
        } else {
          router.replace(safeReturnUrl ?? "/overview");
        }
      } catch {
        addToast({
          title: "Something went wrong. Please try again.",
          color: "danger",
        });
        setOtp("");
      } finally {
        setIsVerifying(false);
      }
    };

    void verify();
  }, [otp, nonce, isVerifying, app, router, safeReturnUrl]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome to Meyoo</h1>
        <p className="mt-2 text-sm text-default-500">
          {step === "email"
            ? "Enter your email to continue"
            : `We sent a code to ${email}`}
        </p>
      </div>

      {step === "email" ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSendMagicLink("initial");
          }}
        >
          <Input
            fullWidth
            placeholder="you@example.com"
            startContent={
              <Icon
                className="text-default-400"
                icon="ph:envelope"
                width={20}
              />
            }
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            color="primary"
            fullWidth
            isLoading={isEmailLoading}
            spinner={<Spinner color="current" size="sm" />}
            type="submit"
          >
            {isEmailLoading ? "Sending..." : "Continue with Email"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-5 pt-1">
          <p className="text-center text-sm text-default-500">
            Enter the 6-character code from your email
          </p>
          <OtpInput
            disabled={isVerifying}
            value={otp}
            onChange={(value) => setOtp(value.toUpperCase())}
          />
          {isVerifying ? (
            <div className="flex items-center gap-2 text-sm text-default-500">
              <Spinner color="current" size="sm" />
              Verifying...
            </div>
          ) : null}
          <div className="flex flex-col items-center gap-2 text-sm">
            <p className="text-xs text-default-400">
              {resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : "Didn't get the code?"}
            </p>
            <button
              className="text-default-500 transition-colors hover:text-foreground disabled:opacity-50"
              disabled={isEmailLoading || resendCooldown > 0}
              type="button"
              onClick={() => void handleSendMagicLink("resend")}
            >
              {isEmailLoading ? "Sending..." : "Resend code"}
            </button>
            <button
              className="text-default-500 transition-colors hover:text-foreground"
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setNonce("");
                setResendCooldown(0);
              }}
            >
              Use a different email
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Divider className="flex-1" />
        <span className="text-xs text-default-400">OR</span>
        <Divider className="flex-1" />
      </div>

      <Button
        fullWidth
        isLoading={isGoogleLoading}
        spinner={<Spinner color="current" size="sm" />}
        variant="ghost"
        onPress={async () => {
          setIsGoogleLoading(true);
          await app.signInWithOAuth("google");
          setIsGoogleLoading(false);
        }}
      >
        {!isGoogleLoading && <Icon icon="logos:google-icon" width={18} />}
        {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
      </Button>

      <p className="text-center text-xs text-default-400">
        &copy; {new Date().getFullYear()} Meyoo. All rights reserved.
      </p>
    </div>
  );
}
