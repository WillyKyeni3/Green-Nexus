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
    <div className="min-h-screen flex items-center justify-center bg-gray-100"></div>

    );
};

export default LoginPage;