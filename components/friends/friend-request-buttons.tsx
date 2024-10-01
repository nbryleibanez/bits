"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

interface Props {
  sourceUserId: string
  sourceUsername: string
  sourceFullName: string
  sourceAvatarUrl: string
  targetUserId: string
  targetUsername: string
  targetFullName: string
  targetAvatarUrl: string
  index: number
}

export default function FriendRequestButtons({
  sourceUserId,
  sourceFullName,
  sourceAvatarUrl,
  sourceUsername,
  targetUserId,
  targetFullName,
  targetAvatarUrl,
  targetUsername,
  index
}: Props) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const acceptFriendRequest = async () => {
    setLoading(true)
    // Accept friend request
    const res = await fetch(`${window.location.origin}/api/friends/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceUserId,
        sourceFullName,
        sourceAvatarUrl,
        sourceUsername,
        targetUserId,
        targetFullName,
        targetUsername,
        targetAvatarUrl,
        index,
      })
    })

    setLoading(false)
    router.refresh()
    if (!res.ok) {
      return toast({
        variant: "destructive",
        title: 'Something went wrong',
        description: "We're fixing it, Houston.",
      })
    }

    toast({
      title: 'Friend request accepted',
      description: 'You are now friends with this user',
    })


  }

  const declineFriendRequest = async () => {
    setLoading(true)
    const res = await fetch(`${window.location.origin}/api/friends/decline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ index })
    })

    setLoading(false)
    router.refresh()
    if (!res.ok) {
      return toast({
        variant: "destructive",
        title: 'Something went wrong',
        description: "We're fixing it, Houston.",
      })
    }
  }

  return (
    <div className='flex gap-2'>
      <Button
        className='h-10 w-10 rounded-full'
        onClick={acceptFriendRequest}
        disabled={loading}
      >
        <CheckIcon className='h-8 w-8' />
      </Button>
      <Button
        className='h-10 w-10 rounded-full'
        onClick={declineFriendRequest}
        disabled={loading}
      >
        <Cross2Icon />
      </Button>
    </div>
  )
}
