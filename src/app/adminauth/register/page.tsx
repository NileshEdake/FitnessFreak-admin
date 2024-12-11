"use client";

import React, { useState } from 'react'; 
import '../auth.css';
import { ToastContainer, toast } from 'react-toastify';  // Ensure this import is correct
import 'react-toastify/dist/ReactToastify.css';  // Ensure styles are imported

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.ok) {
        console.log('Admin registration successful', data);
        toast.success('Admin Registration Successful', {
          position: 'top-center',  // Use string directly for testing
        });
      } else {
        // Handle conflict (409 error)
        if (response.status === 409) {
          console.error('Admin registration failed: Conflict (409)', data.message);
          toast.error('Admin already exists with this email.', {
            position: 'top-center',  // Use string directly for testing
          });
        } else {
          const errorMessage = response.statusText || 'Unknown error occurred';
          console.error('Admin registration failed', response.status, errorMessage);
          toast.error('Admin Registration Failed', {
            position: 'top-center',  // Use string directly for testing
          });
        }
      }
      
    } catch (error) {
      console.error('Error during registration', error);
      toast.error('An error occurred during registration', {
        position: 'top-center',  // Use string directly for testing
      });
    }
  };

  return (
    <div className="formpage">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
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
      
      <button onClick={handleSignup}>Signup</button>
      
      {/* Ensure ToastContainer is rendered */}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default SignupPage;
