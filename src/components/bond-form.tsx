"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { BondFormValues } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Calculator } from "lucide-react";

const formSchema = z.object({
  faceValue: z.coerce.number().positive({ message: "Must be positive" }),
  couponRate: z.coerce
    .number()
    .min(0, { message: "Cannot be negative" })
    .max(100, { message: "Cannot exceed 100" }),
  maturityDate: z.date({ required_error: "A maturity date is required." }),
  paymentFrequency: z.enum([
    "annually",
    "semi-annually",
    "quarterly",
    "monthly",
  ]),
  gracePeriodType: z.enum(["none", "partial", "total"]),
  gracePeriodDuration: z.coerce.number().int().min(0),
});

interface BondFormProps {
  onCalculate: (data: BondFormValues) => void;
}

export function BondForm({ onCalculate }: BondFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      faceValue: 100000,
      couponRate: 5.0,
      paymentFrequency: "annually",
      gracePeriodType: "none",
      gracePeriodDuration: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onCalculate(values);
  };

  const gracePeriodType = form.watch("gracePeriodType");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bond Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="faceValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Face Value ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="couponRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Coupon Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 5.0"
                      step="0.1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maturityDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Maturity Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gracePeriodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grace Period</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grace period type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="partial">Partial (Interest-only)</SelectItem>
                      <SelectItem value="total">Total (Capitalized)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {gracePeriodType !== 'none' && (
              <FormField
                control={form.control}
                name="gracePeriodDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grace Period Duration (periods)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} />
                    </FormControl>
                     <FormDescription>
                      Number of initial payments under grace period terms.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" size="lg">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Cash Flow
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
