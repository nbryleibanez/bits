"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function InstallButton() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  //
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      console.log("Before install prompt");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  //
  const onClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  // if (!supportsPWA) {
  //   return null;
  // }

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full h-12 rounded-xl"
    >
      Install App
    </Button>
  );
}
