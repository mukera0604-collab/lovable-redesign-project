import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth, rtdb } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [mode, setMode] = useState<"reset" | "signup">("reset");
  const navigate = useNavigate();
  const { signUp, checkEmailExists } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("oobCode");
    const emailParam = params.get("email");
    const modeParam = params.get("mode") as "signup" | null;

    if (emailParam) {
      setEmail(emailParam);
      // If no code is present, check if we should be in signup mode
      if (!code) {
        checkEmailExists(emailParam).then(exists => {
          if (!exists || modeParam === "signup") {
            setMode("signup");
          } else {
            // If user exists and no code, it's an invalid/expired reset attempt
            setInvalid(true);
          }
        });
      }
    }

    if (code) {
      setOobCode(code);
      verifyPasswordResetCode(auth, code)
        .then((verifiedEmail) => {
          setMode("reset");
          if (!emailParam) setEmail(verifiedEmail);
        })
        .catch(() => setInvalid(true));
    } else if (!emailParam) {
      setInvalid(true);
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) {
      toast.error("Please fill in both fields");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
   

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        await signUp(email, password, "User");
         toast.success("Password reset successfully!");
        navigate("/dashboard");
      } else {
        if (!oobCode) throw new Error("Missing reset code");
        await confirmPasswordReset(auth, oobCode, password);
        toast.success("Password reset successfully!");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Reset/Signup error:", error);
      toast.error(error.message || "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (invalid) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-16">
        <div className="card-glass p-10 w-full max-w-md text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Invalid Link</h1>
          <p className="text-muted-foreground">This reset link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-16">
      <div className="card-glass p-10 w-full max-w-md glow-purple">
        <h1 className="text-3xl font-display font-bold text-foreground text-center mb-2">
          {mode === "signup" ? "Set Password" : "Reset Password"}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {email ? `${mode === "signup" ? "Create a password for" : "Set a new password for"} ${email}` : "Set your password"}
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg gradient-cta text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
