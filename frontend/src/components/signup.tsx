import { useState } from "react";
import { auth } from "../firebase-config";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Background from "./background";

export default function Signup() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError("Google sign-in failed");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <Background>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="backdrop-blur-md p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center text-white drop-shadow">Sign {isSignup ? "Up" : "In"} to AI Sales Agent</h2>
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="enter your email"
              className="p-2 rounded text-blue-950 bg-white bg-opacity-60 focus:outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="enter your password"
              className="p-2 rounded text-blue-950 bg-white bg-opacity-60 focus:outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <button
            onClick={handleGoogleSignIn}
            className="w-full mt-4 cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Sign in with Google
          </button>
          <div className="mt-4 text-center">
            <button
              className="text-white underline cursor-pointer hover:text-blue-200"
              onClick={() => setIsSignup(!isSignup)}
              type="button"
            >
              {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
          {error && <div className="mt-2 text-red-200 text-center">{error}</div>}
        </div>
      </div>
    </Background>
  );
}