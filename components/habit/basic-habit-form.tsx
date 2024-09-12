"use client"

import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  title: z.string()
});

export default function BasicHabitForm() {
  const status = useFormStatus();
  const router = useRouter();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const input = {
      title: form.getValues().title,
      type: "basic"
    }

    const res = await fetch(`${window.location.origin}/api/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "We're fixing this, Houston.",
      })
    } else {
      toast({
        title: "Success",
        description: "Habit successfully created.",
      })

      router.push('/')
      router.refresh()
    }
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
        <Button disabled={status.pending} className="w-full" type="submit">Submit</Button>
      </form>
    </Form>
  )
}
