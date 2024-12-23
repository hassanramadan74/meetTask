"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if token is available
    const token = Cookies.get('token');
    const tokenExpiration = Cookies.get('token_expiration');

    // If there's no token or if token has expired
    if (!token || new Date(tokenExpiration) < new Date()) {
      setError('Session expired or not authenticated.');
      setLoading(false);
      router.push('/');
      return;
    }

    const fetchUserInfo = async () => {
      const email = Cookies.get('email');
      const password = Cookies.get('password');

      try {
        const response = await fetch(`https://api-yeshtery.dev.meetusvr.com/v1/user/info?email=${email}&password=${password}&isEmployee=true`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserInfo({ id: data.id, name: data.name });
        } else {
          setError(data.message || 'Failed to fetch user info.');
        }
      } catch (err) {
        setError(`An error occurred while fetching user info. ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('email');
    Cookies.remove('password');
    Cookies.remove('token_expiration');
    router.push('/');
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!userInfo) {
    return <div className="text-center text-xl">No user information found. Please login again.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 via-purple-100 to-pink-100 p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-lg p-6">
        <h1 className="text-3xl font-semibold text-center text-purple-600 mb-6">Dashboard</h1>
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-800">
            <strong>ID:</strong> {userInfo.id}
          </p>
          <p className="text-lg font-medium text-gray-800">
            <strong>Name:</strong> {userInfo.name}
          </p>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
