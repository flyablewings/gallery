"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface UserInfo {
  id: string;
  email: string;
  name?: string;
  profileImage?: string;
}

export default function PortraitSection() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/admin/check");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        // User not authenticated, keep user as null
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="flex-shrink-0">
      <div className="relative">
        <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-accent/20 shadow-2xl bg-gradient-to-br from-accent/10 via-accent/20 to-accent/30">
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            {/* Portrait Icon */}
            <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-accent/20 flex items-center justify-center mb-4 border-2 border-accent/30 overflow-hidden">
              {user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-accent"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              )}
            </div>

            {/* Portrait Text */}
            <div className="space-y-1">
              <div className="text-accent font-bold text-lg md:text-xl">{user?.name || "Model Europa"}</div>
              <div className="text-accent/80 text-sm md:text-base">{user?.email?.split('@')[0] || "Creative Director"}</div>
              <div className="text-accent/60 text-xs mt-2 px-3 py-1 bg-accent/10 rounded-full inline-block">
                {user?.profileImage ? "Portfolio Admin" : "Portrait Placeholder"}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-pulse shadow-lg"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/50 rounded-full animate-pulse shadow-md" style={{ animationDelay: '1s' }}></div>

        {/* Additional decorative border */}
        <div className="absolute inset-0 rounded-full border border-accent/10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}