'use client';

import { SignInButton } from "@clerk/nextjs";
import { useState } from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
        <SignInButton mode="modal">
          <button className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
            Sign In
          </button>
        </SignInButton>
      </div>
    </div>
  );
} 