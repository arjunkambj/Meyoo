"use client";

import { Button, Input, Separator, Spinner, toast } from "@heroui/react";
import { useStackApp } from "@stackframe/stack";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { OtpInput } from "@/components/shared/OtpInput";

export default function SignInPage() {
  const app = useStackApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const safeReturnUrl =
    returnUrl?.startsWith("/") && !returnUrl.startsWith("//")
      ? returnUrl
      : null;

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [nonce, setNonce] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const isAuthLoading = isEmailLoading || isVerifying || isGoogleLoading;

  const handleSendMagicLink = async (
    source: "initial" | "resend" = "initial",
  ) => {
    if (source === "resend" && resendCooldown > 0) return;

    if (!email) {
      toast.danger("Please enter your email address.");
      return;
    }

    setIsEmailLoading(true);

    try {
      const result = await app.sendMagicLinkEmail(email);
      if (result.status === "error") {
        toast.danger("Could not send verification code. Please try again.");
      } else {
        setNonce(result.data.nonce);
        setOtp("");
        setStep("otp");
        setResendCooldown(20);
        toast.success("Verification code sent! Check your email.");
      }
    } catch {
      toast.danger("Something went wrong. Please try again.");
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
          toast.danger("Invalid code. Please try again.");
          setOtp("");
        } else {
          router.replace((safeReturnUrl ?? "/overview") as Route);
        }
      } catch {
        toast.danger("Something went wrong. Please try again.");
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
        <p className="mt-2 text-sm text-muted">
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
            variant="secondary"
            className="h-10 w-full"
            disabled={isAuthLoading}
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />

          <Button
            variant="primary"
            className="h-10 w-full"
            isDisabled={isGoogleLoading || isVerifying}
            type="submit"
          >
            {isEmailLoading ? <Spinner color="current" size="sm" /> : null}
            {isEmailLoading ? "Sending..." : "Continue with Email"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-5 pt-1">
          <p className="text-center text-sm text-muted">
            Enter the 6-character code from your email
          </p>
          <OtpInput
            disabled={isVerifying}
            value={otp}
            onChange={(value) => setOtp(value.toUpperCase())}
          />
          {isVerifying ? (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Spinner color="current" size="sm" />
              Verifying...
            </div>
          ) : null}
          <div className="flex flex-col items-center gap-2 text-sm">
            <p className="text-xs text-muted">
              {resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : "Didn't get the code?"}
            </p>
            <Button
              className="h-8 px-2 text-muted hover:text-foreground"
              isDisabled={isGoogleLoading || isVerifying || resendCooldown > 0}
              size="sm"
              type="button"
              variant="tertiary"
              onPress={() => void handleSendMagicLink("resend")}
            >
              {isEmailLoading ? <Spinner color="current" size="sm" /> : null}
              {isEmailLoading ? "Sending..." : "Resend code"}
            </Button>
            <button
              className="text-muted transition-colors hover:text-foreground"
              disabled={isAuthLoading}
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
        <Separator className="flex-1" />
        <span className="text-xs text-muted">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button
        isDisabled={isEmailLoading || isVerifying}
        className="h-10 w-full"
        variant="tertiary"
        onPress={async () => {
          try {
            setIsGoogleLoading(true);
            await app.signInWithOAuth("google");
          } finally {
            setIsGoogleLoading(false);
          }
        }}
      >
        {isGoogleLoading ? (
          <Spinner color="current" size="sm" />
        ) : (
          <Icon icon="logos:google-icon" width={18} />
        )}
        {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
      </Button>

      <p className="text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} Meyoo. All rights reserved.
      </p>
    </div>
  );
}
