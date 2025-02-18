"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function InstallButton() {
  // const [supportsPWA, setSupportsPWA] = useState(false);
  // const [promptInstall, setPromptInstall] = useState<any>(null);

  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // const handler = (e: any) => {
    //   e.preventDefault();
    //   console.log("Before install prompt");
    //   setSupportsPWA(true);
    //   setPromptInstall(e);
    // };
    //
    // window.addEventListener("beforeinstallprompt", handler);
    //
    // return () => window.removeEventListener("beforeinstallprompt", handler);
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  const onClick = async () => {
    // evt.preventDefault();
    // if (!promptInstall) return;
    //
    // const { outcome } = await promptInstall.prompt();
    // console.log(outcome);
    // setPromptInstall(null);

    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log(`User response to the install prompt: ${outcome}`);
    }
  };

  if (!isInstallable) {
    return null;
  }

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
