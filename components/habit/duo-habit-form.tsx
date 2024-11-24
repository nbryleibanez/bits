"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  duo: z.string()
});

export default function DuoHabitForm({ Item }: { Item: any }) {
  const router = useRouter();
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      duo: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const input = {
      title: values.title,
      duoId: values.duo,
      type: "duo",
    }

    const res = await fetch(`${window.location.origin}/api/habits/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const error = await res.json()

      return toast({
        variant: "destructive",
        title: error.error,
        description: "We're fixing this, Houston.",
      })
    }

    toast({
      title: "Success",
      description: "Habit Request successfully sent.",
    })

    router.push(`/`)
    router.refresh()
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    Item.friends.L.map((f: any) => (
                      <SelectItem key={f.M.user_id.S} value={f.M.user_id.S}>{f.M.full_name.S}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={() => setLoading(false)} disabled={loading} className="w-full" type="submit">
          {loading ? <LoadingSpinner /> : "Submit"}
        </Button>
      </form>
    </Form>
  )
}
