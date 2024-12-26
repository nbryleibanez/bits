"use client";

import { useTransition } from "react";
import LogHabitButton from "@/components/habit/log-habit-button";
import SkipHabitButton from "@/components/habit/skip-habit-button";
import DeleteHabitButton from "@/components/habit/delete-habit-button";

interface Props {
  owner: string;
  isLogged: boolean;
}

export default function ActionButtons({ owner, isLogged }: Props) {
  const [isLogging, startLogTransition] = useTransition();
  const [isSkipping, startSkipTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  return (
    <div className="w-full flex flex-col gap-2">
      <LogHabitButton
        isLogged={isLogged}
        isLoading={isLogging}
        isOtherActionRunning={isSkipping || isDeleting}
        onAction={(callback) => startLogTransition(callback)}
      />
      <SkipHabitButton
        isLogged={isLogged}
        isLoading={isSkipping}
        isOtherActionRunning={isLogging || isDeleting}
        onAction={(callback) => startSkipTransition(callback)}
      />
      <DeleteHabitButton
        owner={owner}
        isLoading={isDeleting}
        isOtherActionRunning={isLogging || isSkipping}
        onAction={(callback) => startDeleteTransition(callback)}
      />
    </div>
  );
}
