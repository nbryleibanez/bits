"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <div className="w-full max-w-md">
      <ArrowLeft
        className="w-8 h-8 cursor-pointer"
        onClick={() => router.back()}
      />
    </div>
  );
}
