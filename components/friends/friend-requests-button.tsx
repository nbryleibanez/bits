"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

export default function FriendRequestButtons({ index }: { index: number }) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const acceptFriendRequest = async () => {
    setLoading(true)
    // Accept friend request
    const res = await fetch(`${window.location.origin}/friends/accept`, {
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
    const res = await fetch(`${window.location.origin}/friends/decline`, {
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
        title: 'Something went wrong',
        description: "We're fixing it, Houston.",
      })
    }
  }

  return (
    <div className='flex'>
      <Button
        className='rounded-full'
        onClick={acceptFriendRequest}
        disabled={loading}
      >
        <CheckIcon />
      </Button>
      <Button
        className='rounded-full'
        onClick={declineFriendRequest}
        disabled={loading}
      >
        <Cross2Icon />
      </Button>
    </div>
  )
}
