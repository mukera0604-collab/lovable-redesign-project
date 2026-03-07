import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();
  const { signUp, checkEmailExists } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");

    if (emailParam) {
      setEmail(emailParam);
      checkEmailExists(emailParam).then(exists => {
        // In this flow, we either reset an existing or create a new one
        // If no email is provided, it's invalid.
      });
    } else {
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
      // In this specialized flow, we always 'signUp' which handles both
      // Or we can call it 'updatePassword' if user exists?
      // For now, let's stick to the user's request: redirect to dashboard
      await signUp(email, password, "User", true);
      toast.success("Password reset successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Reset error:", error);
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
          <p className="text-muted-foreground">This link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-16">
      <div className="card-glass p-10 w-full max-w-md glow-purple">
        <h1 className="text-3xl font-display font-bold text-foreground text-center mb-2">
          Set Password
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {email ? `Set a password for ${email}` : "Set your password"}
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
            {isSubmitting ? "Resetting..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
