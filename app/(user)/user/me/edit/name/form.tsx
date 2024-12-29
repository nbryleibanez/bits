"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { revalidateUser } from "@/app/actions";
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
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

export default function EditNameForm({
  firstName,
  lastName,
  username,
}: {
  firstName: string;
  lastName: string;
  username: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
    },
  });

  const onSubmit = async () => {
    const newFirstName = form.getValues().firstName;
    const newLastName = form.getValues().lastName;

    if (newFirstName === firstName && newLastName === lastName) {
      toast({
        variant: "destructive",
        title: "No changes detected",
        description: "Please modify before submitting.",
      });
      return;
    }

    setLoading(true);
    const input = {
      firstName: newFirstName,
      lastName: newLastName,
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

      await revalidateUser(username);
      router.push("/user/me");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
      setLoading(false);
    }
  };

  const [watchedFirstName, watchedLastName] = form.watch([
    "firstName",
    "lastName",
  ]);
  const hasChanged =
    watchedFirstName !== firstName || watchedLastName !== lastName;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 w-full h-full flex flex-col gap-4 sm:space-y-6"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input {...field} className="h-12 text-md" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input {...field} className="h-12 text-md" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={loading || !hasChanged}
          className="w-full h-12 mt-auto"
          type="submit"
        >
          {loading ? <LoadingSpinner /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
