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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  duo: z.string(),
});

export default function DuoHabitForm({ data }: { data: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [duoUsername, setDuoUsername] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      duo: "",
    },
  });

  const handleDuoSelect = (userId: string) => {
    // Find the selected friend's username
    const selectedFriend = data.friends.L.find(
      (f: any) => f.M.user_id.S === userId,
    );
    if (selectedFriend) {
      setDuoUsername(selectedFriend.M.username.S);
    }
    // Update the form value
    form.setValue("duo", userId);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const input = {
      title: values.title,
      duoId: values.duo,
      type: "duo",
    };

    const res = await fetch(`${window.location.origin}/api/habits/request`, {
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

    toast({
      title: "Success",
      description: "Habit Request successfully sent.",
    });

    router.push(`/`);
  };

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
          name="duo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duo</FormLabel>
              <Select
                onValueChange={handleDuoSelect}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.friends.L.map((f: any) => (
                    <SelectItem key={f.M.user_id.S} value={f.M.user_id.S}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={f.M.avatar_url.S}
                            alt={f.M.full_name.S}
                          />
                          <AvatarFallback>{f.M.full_name.S[0]}</AvatarFallback>
                        </Avatar>
                        <p>{f.M.full_name.S}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          onClick={() => setLoading(false)}
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
