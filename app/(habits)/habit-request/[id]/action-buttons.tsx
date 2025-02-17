"use client";

import { useTransition } from "react";
import AcceptButton from "./accept-button";
import DeclineButton from "./decline-button";

interface Props {
  habitId: string;
  title: string;
  ownerId: string;
  ownerUsername: string;
  ownerFullName: string;
  ownerAvatarUrl: string;
  myId: string;
  myUsername: string;
}

export default function ActionButtons({
  habitId,
  title,
  ownerId,
  ownerUsername,
  ownerFullName,
  ownerAvatarUrl,
  myId,
  myUsername,
}: Props) {
  const [isAccepting, startAcceptingTransition] = useTransition();
  const [isDeclining, startDecliningTransition] = useTransition();

  return (
    <div className="w-full flex flex-col gap-2 mt-auto">
      <AcceptButton
        habitId={habitId}
        title={title}
        ownerId={ownerId}
        ownerUsername={ownerUsername}
        ownerFullName={ownerFullName}
        ownerAvatarUrl={ownerAvatarUrl}
        myId={myId}
        myUsername={myUsername}
        isLoading={isAccepting}
        isOtherActionRunning={isDeclining}
        onAction={(callback) => startAcceptingTransition(callback)}
      />
      <DeclineButton
        habitId={habitId}
        ownerUsername={ownerUsername}
        myUsername={myUsername}
        myId={myId}
        isLoading={isDeclining}
        isOtherActionRunning={isAccepting}
        onAction={(callback) => startDecliningTransition(callback)}
      />
    </div>
  );
}
