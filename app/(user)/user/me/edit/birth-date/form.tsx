"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { revalidateMe } from "@/app/actions";
import { cn } from "@/lib/utils";
import { format, startOfDay } from "date-fns";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";

const FormSchema = z.object({
  birthDate: z
    .date({
      required_error: "Please select a date",
    })
    .transform((date) => startOfDay(date)),
});

export default function EditBirthDateForm({ birthDate }: { birthDate: Date }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      birthDate: birthDate,
    },
  });

  const onSubmit = async () => {
    const newBirthDate = form.getValues().birthDate;

    if (newBirthDate === birthDate) {
      toast({
        variant: "destructive",
        title: "No changes detected",
        description: "Please modify before submitting.",
      });
      return;
    }

    setLoading(true);
    const input = {
      birthDate: format(newBirthDate, "yyyy-MM-dd"),
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

  const hasChanged = form.watch("birthDate") !== birthDate;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 w-full h-full flex flex-col gap-4 sm:space-y-6"
      >
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start pl-3 text-left font-normal border border-gray-300",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "MMMM d, yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
