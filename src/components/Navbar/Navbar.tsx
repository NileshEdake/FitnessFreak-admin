"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Navbar.css';
import logo from './logo.png';

const Navbar = () => {
  // State to manage authentication status
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const checkAdminAuthenticated = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/checklogin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if(response.ok){
        setIsAdminAuthenticated(true);
      }else{
        setIsAdminAuthenticated(false);
      }
  
      // Handle the response here, e.g., update state or redirect
    } catch (err) {
      console.error(err);
      setIsAdminAuthenticated(false);
    }
  };

  useEffect(()=>{
    checkAdminAuthenticated();
  },[]);
  return (
    <div className="navbar">
      <Image src={logo} alt="Logo" width={100} className="logo" />
      
      <div className="adminlinks">
        {isAdminAuthenticated ? (
          <Link href="/pages/addworkout">Add Workout</Link>
        ) : (
          <>
            {/* Show login/signup links for unauthenticated admin */}
            <Link href="/adminauth/login">Login</Link>
            <Link href="/adminauth/register">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
