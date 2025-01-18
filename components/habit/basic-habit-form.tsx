"use client";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export default function BasicHabitForm({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);

    const input = {
      title: form.getValues().title,
      type: "basic",
    };

    const res = await fetch(`${window.location.origin}/api/habits/basic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const error = await res.json();

      return toast({
        variant: "destructive",
        title: error.error,
        description: "We're fixing this, Houston.",
      });
    }

    const { habitId, habitType } = await res.json();
    router.push(`/habit/${habitId}?type=${habitType}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 w-full h-full flex flex-col justify-between sm:space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Title</FormLabel>
              <FormControl></FormControl>
              <Input {...field} className="h-12" />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          onClick={() => setLoading(false)}
          disabled={loading}
          className="w-full h-12 rounded-xl"
          type="submit"
        >
          {loading ? <LoadingSpinner /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
