"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export default function OnboardingForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await fetch(`${origin}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
      }),
    });

    if (!res.ok) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "We're fixing this, Houston.",
      });
    }

    if (res.ok) {
      router.push("/");
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    className="h-12 border-[#aaaaaa] rounded-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    className="h-12 border-[#aaaaaa] rounded-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    className="h-12 border-[#aaaaaa] rounded-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="w-full h-12 rounded-3xl bg-primary">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
