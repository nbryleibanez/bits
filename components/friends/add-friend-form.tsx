"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";

const FormSchema = z.object({
  username: z.string()
});

export default function AddFriendForm({ token }: { token: string }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true)

    const res = await fetch(`${window.location.origin}/api/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })

    setLoading(false)
    form.reset()

    if (!res.ok) {
      const { error, message } = await res.json()

      return toast({
        variant: "destructive",
        title: error,
        description: message || "Something went wrong",
      })

      return toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "We're fixing this, Houston.",
      })
    }

    toast({
      title: "Friend request successfully sent",
    })
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md flex gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
              <FormControl></FormControl>
              <Input
                {...field}
                className="h-full rounded-lg bg-background pl-9 text-md mt-0"
                type="search"
                placeholder="Search"
              />
            </FormItem>
          )}
        />
        <Button
          className="w-1/4 min-w-min"
          disabled={loading}
          type="submit"
        >
          {loading ? <LoadingSpinner /> : "Add Friend"}
        </Button>
      </form>
    </Form>
  )
}
