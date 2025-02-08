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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  cueType: z.enum(["implementation-intention", "time-based"]),
  implementationIntention: z.string().optional(),
  time: z.string().optional(),
});

export default function CueHabitForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      cueType: "implementation-intention",
      implementationIntention: "",
      time: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const input = {
      title: values.title,
      type: "cue",
      cueType: values.cueType,
      cue:
        values.cueType === "implementation-intention"
          ? values.implementationIntention
          : values.time,
    };

    try {
      const res = await fetch(`${window.location.origin}/api/habits/cue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      const { habitId, habitType } = await res.json();
      router.push(`/habit/${habitId}?type=${habitType}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error instanceof Error ? error.message : "An error occurred",
        description: "We're fixing this, Houston.",
      });
    } finally {
      setLoading(false);
    }
  };

  const cueType = form.watch("cueType");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 w-full h-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Title</FormLabel>
              <FormControl>
                <Input {...field} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cueType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cue Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a type of cue" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="implementation-intention">
                    Implementation Intention
                  </SelectItem>
                  <SelectItem value="time-based" disabled>
                    Time-based Reminder
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {cueType === "implementation-intention" && (
          <FormField
            key="implementation-intention"
            control={form.control}
            name="implementationIntention"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Implementation Intention</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-12"
                    placeholder="Ex: After I eat my lunch"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {cueType === "time-based" && (
          <FormField
            key="time-based"
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          disabled={loading}
          className="w-full h-12 mt-auto rounded-lg sm:rounded"
          type="submit"
        >
          {loading ? <LoadingSpinner /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
