"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../auth.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Admin login successful', data);
        toast.success('Admin login Successful');
        router.push('/pages/addworkout');
      } else {
        const errorMessage = data?.message || response.statusText || 'Unknown error occurred';
        console.error('Admin login failed', response.status, errorMessage);
        toast.error('Admin login Failed: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error during login', error);
      toast.error('An error occurred during login');
    }
  };

  return (
    <div className="formpage">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default LoginPage;
