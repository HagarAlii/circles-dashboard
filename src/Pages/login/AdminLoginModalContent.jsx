import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BlurText from "../../components/ui/blurTxt/BlurText";
import { useAdmin } from "../../Context/useAdmin";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLoginModalContent({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAdmin } = useAdmin();

  const ADMIN_CREDENTIALS = {
    email: "circle@atomicmail.io",
    password: "circle123$",
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    const auth = getAuth();

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if this is the admin
      if (user.email === ADMIN_CREDENTIALS.email) {
        setAdmin(true); // set context
        toast.success("Welcome, Admin!");
        onClose();
        navigate("/dashboard");
      } else {
        toast.error("You are not authorized as admin.");
        await auth.signOut();
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Invalid credentials or login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-full rounded-[var(--rounded-rounded)] bg-gradient-main shadow-lg mx-auto">
      <BlurText
        text="Admin Login"
        delay={150}
        animateBy="words"
        direction="top"
        className="text-2xl mb-8 bg-clip-text text-white text-shadow-soft font-bold"
      />

      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`btn-primary flex items-center justify-center gap-3 w-full py-3 font-semibold shadow-md ${
          loading ? "cursor-wait opacity-70" : "cursor-pointer"
        }`}
        aria-busy={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </div>
  );
}
