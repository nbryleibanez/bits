"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { revalidateMe } from "@/app/actions";
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
  username: z.string().min(1, { message: "Username is required" }),
});

export default function EditUsernameForm({ username }: { username: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: username,
    },
  });

  const onSubmit = async () => {
    const newUsername = form.getValues().username;

    // Check if username has changed
    if (newUsername === username) {
      toast({
        variant: "destructive",
        title: "No changes detected",
        description: "Please modify the username before submitting.",
      });
      return;
    }

    setLoading(true);
    const input = {
      username: newUsername,
    };

    try {
      const res = await fetch(`${window.location.origin}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const error = await res.json();
        toast({
          variant: "destructive",
          title: error.error,
          description: "We're fixing this, Houston.",
        });
        setLoading(false);
        return;
      }

      await revalidateMe();
      router.push("/user/me");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
      setLoading(false);
    }
  };

  const hasChanged = form.watch("username") !== username;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 w-full h-full flex flex-col justify-between sm:space-y-6"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} className="h-12 text-md" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={loading || !hasChanged}
          className="w-full h-12"
          type="submit"
        >
          {loading ? <LoadingSpinner /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
