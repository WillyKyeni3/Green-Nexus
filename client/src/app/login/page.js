import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LeafIcon, UserIcon, LockIcon, MailIcon } from 'lucide-react';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would handle authentication here
    router.push('/'); // Navigate to dashboard (homepage in Next.js)
  };

    return (
    <div className="flex h-screen bg-primary-light">
      {/* Left side - Nature illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-br from-primary-dark/70 to-primary/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80"
          alt="Nature"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-white text-center max-w-md px-6">
          <LeafIcon size={48} className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">GreenNexus</h1>
          <p className="text-lg">
            Track, reduce, and offset your carbon footprint with our all-in-one
            sustainability platform.
          </p>
        </div>
      </div>

        {/* Right side - Login/Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2">
              <LeafIcon size={32} className="text-primary mr-2" />
              <h1 className="text-3xl font-bold text-primary-dark">
                GreenNexus
              </h1>
            </div>
            <p className="text-gray-600">
              Your personal sustainability companion
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-gray p-8">
            <div className="flex mb-6">
              <button
                className={`flex-1 py-2 font-medium border-b-2 ${isLogin ? 'border-primary text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 font-medium border-b-2 ${!isLogin ? 'border-primary text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-neutral-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder={isLogin ? '••••••••' : 'Minimum 8 characters'}
                    required
                  />
                </div>
              </div>

              <Button type="submit" fullWidth>
                {isLogin ? 'Login' : 'Create Account'}
              </Button>
              
              {isLogin && (
                <div className="mt-4 text-center">
                  <a
                    href="#forgot-password"
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Forgot your password?
                  </a>
                </div>
              )}
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            By continuing, you agree to GreenNexus's{' '}
            <a href="#terms" className="text-primary hover:text-primary-dark">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#privacy" className="text-primary hover:text-primary-dark">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
              

    );
};

export default LoginPage;