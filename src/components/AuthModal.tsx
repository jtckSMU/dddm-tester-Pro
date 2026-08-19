import React, { useState } from 'react';
import { X, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsDone(true);
      setTimeout(() => {
        onSuccess(email);
        onClose();
        setIsDone(false);
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-100">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div 
        id="auth-modal-dialog"
        className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E0E3EB] z-10 animate-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6A6D78] hover:text-[#181c21] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#089981] mx-auto animate-bounce" />
            <h3 className="font-bold text-xl text-[#181c21]">Welcome to MarketView</h3>
            <p className="text-sm text-[#6A6D78]">Your precision trading workspace is ready.</p>
          </div>
        ) : (
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#2962ff] rounded flex items-center justify-center text-white">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-bold text-xl text-[#181c21] tracking-tight">
                MarketView
              </span>
            </div>

            <h3 className="font-bold text-2xl text-[#181c21] mb-1">
              {mode === 'signin' ? 'Sign in to MarketView' : 'Create your account'}
            </h3>
            <p className="text-xs sm:text-sm text-[#6A6D78] mb-6">
              {mode === 'signin' 
                ? 'Access your custom watchlists, real-time alerts and technical indicators.' 
                : 'Join over 50 million traders and investors exploring global markets.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#181c21] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#f7f9ff] border border-[#E0E3EB] rounded-lg focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#181c21] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@marketview.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#f7f9ff] border border-[#E0E3EB] rounded-lg focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181c21] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#f7f9ff] border border-[#E0E3EB] rounded-lg focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2962ff] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0049db] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{mode === 'signin' ? 'Sign In' : 'Get Started Free'}</span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E0E3EB] text-center text-xs text-[#6A6D78]">
              {mode === 'signin' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-[#0049db] font-semibold hover:underline"
                  >
                    Get started
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="text-[#0049db] font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
