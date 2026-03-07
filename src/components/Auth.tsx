import { useState } from 'react';
import { supabase } from '../lib/supabase'; 

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', isError: false });
    const cleanedEmail = email.trim(); 

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanedEmail, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email: cleanedEmail, password });
        if (error) throw error;
        setMessage({ text: 'สมัครสมาชิกสำเร็จ!', isError: false });
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'เกิดข้อผิดพลาดบางอย่าง', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage({ text: error.message, isError: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-black">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">{isLogin ? 'Login' : 'Register'}</h2>
        {message.text && <div className={`p-3 mb-4 rounded text-sm ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message.text}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Email" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Password (min 6 chars)" minLength={6} />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">{loading ? '...' : (isLogin ? 'Login' : 'Register')}</button>
        </form>
        <div className="mt-4 text-center text-sm">
          <button onClick={() => { setIsLogin(!isLogin); setMessage({ text: '', isError: false }); }} className="text-blue-600 hover:underline">
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
                <div className="mt-6 flex items-center justify-center space-x-2">
          <span className="h-px w-full bg-gray-300"></span>
          <span className="text-sm text-gray-500 font-medium">OR</span>
          <span className="h-px w-full bg-gray-300"></span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}