"use client";

import { useTransition } from "react";
import LogHabitButton from "@/components/habit/log-habit-button";
import SkipHabitButton from "@/components/habit/skip-habit-button";
import DeleteHabitButton from "@/components/habit/delete-habit-button";

interface Props {
  userId: string;
  owner: string;
  isLogged: boolean;
  username: string;
}

export default function ActionButtons({
  userId,
  username,
  owner,
  isLogged,
}: Props) {
  const [isLogging, startLogTransition] = useTransition();
  const [isSkipping, startSkipTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  return (
    <div className="w-full flex flex-col gap-2">
      <LogHabitButton
        userId={userId}
        username={username}
        isLogged={isLogged}
        isLoading={isLogging}
        isOtherActionRunning={isSkipping || isDeleting}
        onAction={(callback) => startLogTransition(callback)}
      />
      <SkipHabitButton
        userId={userId}
        username={username}
        isLogged={isLogged}
        isLoading={isSkipping}
        isOtherActionRunning={isLogging || isDeleting}
        onAction={(callback) => startSkipTransition(callback)}
      />
      <DeleteHabitButton
        userId={userId}
        username={username}
        owner={owner}
        isLoading={isDeleting}
        isOtherActionRunning={isLogging || isSkipping}
        onAction={(callback) => startDeleteTransition(callback)}
      />
    </div>
  );
}
