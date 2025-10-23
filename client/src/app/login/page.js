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
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/70 to-primary/50 z-10"></div>
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

    );
};

export default LoginPage;