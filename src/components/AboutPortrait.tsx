"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface UserInfo {
  id: string;
  email: string;
  name?: string;
  profileImage?: string;
}

export default function AboutPortrait() {
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
    <div className="relative aspect-square max-w-md mx-auto lg:mx-0 bg-zinc-100 rounded-full overflow-hidden shadow-2xl">
      {user?.profileImage ? (
        <Image
          src={user.profileImage}
          alt="About Model Europa"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm md:text-base">
          [Portrait Placeholder]
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span className="text-white text-xl font-bold">About Model Europa</span>
      </div>
    </div>
  );
}