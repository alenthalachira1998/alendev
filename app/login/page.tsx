'use client';

import { SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-center p-8 bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-white">Admin Access</h1>
        
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2 mx-auto">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <button 
            onClick={() => signOut(() => router.push('/'))}
            className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2 mx-auto"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </SignedIn>
      </div>
    </div>
  );
}         