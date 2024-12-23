"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface LoginData {
  email: string;
  password: string;
  isEmployee: boolean;
}

const Home = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
const router = useRouter();
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (validateEmail(email) && password) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
  
    const loginData: LoginData = {
      email,
      password,
      isEmployee: true,
    };
  
    try {
      const response = await fetch('https://api-yeshtery.dev.meetusvr.com/v1/yeshtery/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', data);
        console.log('Token:', data.token);
  
        Cookies.set('token', data.token, { expires: 7, path: '' }); // 7 days expiry
        Cookies.set('email', email, { expires: 7, path: '' }); // Save email too, if needed
        Cookies.set('password', password, { expires: 7, path: '' }); // Save password securely (for demo)
  
        router.push('/dashboard');
        setLoading(false);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setError(`An error occurred. Please try again later. ${error}`);
    }
  };
  

  return (
    <>
      <div className="bg-gradient-to-l from-[#e0d8fc] via-[#f1d6fc] to-[#e2edfd]">
        <div className="container mx-auto lg:h-screen h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Left Section */}
            <div className="flex flex-col items-center justify-center col-span-1 px-14 lg:py-0 py-10">
              <h1 className="text-5xl font-medium text-center mb-4 font-mono">Welcome Back</h1>
              <p className="text-center text-base text-[#62626b] mb-8">
                Step Into Our Shopping Metaverse for an unforgettable shopping experience
              </p>
              <div className="space-y-4 w-full">
                <div className="relative w-full">
                  <i className="fa-regular fa-envelope absolute top-1/2 left-4 transform -translate-y-1/2 text-[#62626b]"></i>
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-white pl-12 p-4 bg-[#efeff9] rounded-lg focus:outline-none placeholder:text-[#62626b]"
                  />
                </div>
                <div className="relative w-full">
                  <i className="fas fa-lock absolute top-1/2 left-4 transform -translate-y-1/2 text-[#62626b]"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-white pl-12 p-4 bg-[#efeff9] rounded-lg focus:outline-none placeholder:text-[#62626b]"
                  />
                </div>
              </div>
              <div className="w-full">
                <button
                  onClick={handleLogin}
                  disabled={isButtonDisabled || loading}
                  className={`w-full py-3 rounded-lg mt-8 ${
                    isButtonDisabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9414FF] text-white'
                  }`}
                >
                  {loading ? 'Logging In...' : 'Login'}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p> // Display error message
              )}
              <div>
                <p className="text-center text-[#62626b] mt-8">
                  Don&apos;t have an account? <span className="text-[#9414FF]">Sign Up</span>
                </p>
              </div>
            </div>
            {/* Right Section */}
            <div className="col-span-2 flex flex-col items-center justify-center">
              <div>
                <Image src="/icon.png" alt="first icon" width={700} height={280} quality={100} />
              </div>
              <div className="mb-24">
                <h1 className="text-5xl font-mono font-medium flex items-center space-x-1">
                  <span className="tracking-tighter text-7xl">meetus</span>
                  <sup className="text-2xl font-sans tracking-wider">VR</sup>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
