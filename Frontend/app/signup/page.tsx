"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const router = useRouter();

  // Client-side password strength checker
  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) {
      setPasswordStrength("");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const isLongEnough = pwd.length >= 8;

    const strength = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, isLongEnough].filter(Boolean).length;

    if (strength <= 2) setPasswordStrength("Weak");
    else if (strength === 3 || strength === 4) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  };

  // Client-side validation
  const validateForm = (): boolean => {
    // Clear previous errors
    setError("");

    // Validate name
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }

    if (name.trim().length > 50) {
      setError("Name is too long (max 50 characters)");
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      setError("Name can only contain letters and spaces");
      return false;
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate password
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setError("Password must contain uppercase, lowercase, number, and special character");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password 
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard
      if (data.user?.id) {
        router.push(`/dashboard/${data.user.id}`);
      } else {
        router.push('/dashboard');
      }

    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === "Weak") return "text-red-600";
    if (passwordStrength === "Medium") return "text-yellow-600";
    if (passwordStrength === "Strong") return "text-green-600";
    return "text-gray-500";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm">Gisul</p>
        </div>
        
        {error && (
          <div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md mb-6"
            role="alert"
          >
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
            {password && (
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Password strength: 
                  <span className={`ml-1 font-semibold ${getPasswordStrengthColor()}`}>
                    {passwordStrength}
                  </span>
                </p>
              </div>
            )}
            <ul className="mt-2 text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <span className={password.length >= 8 ? "text-green-600" : "text-gray-400"}>
                  {password.length >= 8 ? "✓" : "○"}
                </span>
                <span className="ml-2">At least 8 characters</span>
              </li>
              <li className="flex items-center">
                <span className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-green-600" : "text-gray-400"}>
                  {/[A-Z]/.test(password) && /[a-z]/.test(password) ? "✓" : "○"}
                </span>
                <span className="ml-2">Uppercase & lowercase letters</span>
              </li>
              <li className="flex items-center">
                <span className={/[0-9]/.test(password) ? "text-green-600" : "text-gray-400"}>
                  {/[0-9]/.test(password) ? "✓" : "○"}
                </span>
                <span className="ml-2">At least one number</span>
              </li>
              <li className="flex items-center">
                <span className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : "text-gray-400"}>
                  {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✓" : "○"}
                </span>
                <span className="ml-2">Special character (!@#$%...)</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-3 hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="text-purple-600 font-semibold hover:text-purple-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}