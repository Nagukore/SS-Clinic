import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg shadow-2xl border border-gray-200 rounded-3xl p-8 transform transition-all hover:scale-[1.02] duration-300">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Admin Dashboard Login
          </h2>
          <p className="mt-2 text-gray-600">
            Please sign in to access the appointments list.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col gap-4">
            <input
              id="email"
              type="email"
              placeholder="Email address"
              required
              className="px-4 py-3 w-full rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              id="password"
              type="password"
              placeholder="Password"
              required
              className="px-4 py-3 w-full rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SS Clinic. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
