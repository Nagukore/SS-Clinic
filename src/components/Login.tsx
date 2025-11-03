import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Heart, CheckCircle, XCircle } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // ✅ Password validation helper
  const checkPassword = (password: string) => {
    return {
      length: password.length >= 8,
      upperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
      number: /(?=.*\d)/.test(password),
      special: /(?=.*[!@#$%^&*])/.test(password),
    };
  };

  const passwordCheck = checkPassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { user } = await signIn(email, password);
        if (user) {
          navigate("/home");
        } else {
          setError("Invalid email or password");
        }
      } else {
        // ✅ Validation before creating account
        if (!fullName.trim()) {
          setError("Please enter your full name");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (
          !(
            passwordCheck.length &&
            passwordCheck.upperLower &&
            passwordCheck.number &&
            passwordCheck.special
          )
        ) {
          setError(
            "Password must include uppercase, lowercase, number, special character, and be at least 8 characters long."
          );
          setLoading(false);
          return;
        }

        const { user } = await signUp(email, password, fullName);
        if (!user) {
          setError("Failed to create account");
          return;
        }

        alert("Account created successfully! Please log in now.");
        setIsLogin(true);
        setFullName("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderRule = (label: string, condition: boolean) => (
    <div className="flex items-center text-sm">
      {condition ? (
        <CheckCircle size={16} className="text-green-500 mr-2" />
      ) : (
        <XCircle size={16} className="text-red-400 mr-2" />
      )}
      <span className={condition ? "text-green-600" : "text-gray-600"}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-xl border border-blue-100 shadow-2xl rounded-3xl p-8 transition-all">
        <div className="text-center mb-8">
          <img
            src="/images/logo.jpg"
            alt="Srishakthi Clinic Logo"
            className="h-16 w-16 rounded-full mx-auto mb-3 shadow-md"
          />
          <h1 className="text-3xl font-semibold text-gray-800">
            Srishakthi Clinic
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Healing with Heart & Science
          </p>
        </div>

        {/* Login / Sign Up Toggle */}
        <div className="flex mb-6 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 font-medium rounded-lg transition-all ${
              isLogin ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 font-medium rounded-lg transition-all ${
              !isLogin ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password Rules (visible in Sign-Up mode) */}
          {!isLogin && password && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
              {renderRule("At least 8 characters long", passwordCheck.length)}
              {renderRule(
                "Contains uppercase and lowercase letters",
                passwordCheck.upperLower
              )}
              {renderRule("Contains a number", passwordCheck.number)}
              {renderRule("Contains a special character (!@#$%^&*)", passwordCheck.special)}
            </div>
          )}

          {/* Confirm Password Field */}
          {!isLogin && (
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              (!isLogin &&
                (!passwordCheck.length ||
                  !passwordCheck.upperLower ||
                  !passwordCheck.number ||
                  !passwordCheck.special ||
                  password !== confirmPassword))
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <Heart size={16} className="inline text-blue-500 mr-1" />
          <span className="text-sm italic">
            Empowering holistic healing every day.
          </span>
        </div>
      </div>
    </div>
  );
}
