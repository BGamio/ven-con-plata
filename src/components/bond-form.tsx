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
  companyName: z.string().min(1, { message: "Nombre es requerido" }),
  costOfCapital: z.coerce
    .number()
    .min(0, "No puede ser negativo")
    .max(100, "No puede exceder 100"),
  marketValue: z.coerce.number().positive("Debe ser positivo"),
  faceValue: z.coerce.number().positive("Debe ser positivo"),
  startDate: z.date({ required_error: "Fecha de inicio es requerida." }),
  termInYears: z.coerce
    .number()
    .int("Debe ser un entero")
    .positive("Debe ser positivo"),
  couponRate: z.coerce
    .number()
    .min(0, "No puede ser negativo")
    .max(100, "No puede exceder 100"),
  issuerInitialCosts: z.coerce
    .number()
    .min(0, "No puede ser negativo")
    .max(100, "No puede exceder 100"),
  redemptionPremium: z.coerce
    .number()
    .min(0, "No puede ser negativo")
    .max(100, "No puede exceder 100"),
  paymentFrequency: z.enum([
    "annually",
    "semi-annually",
    "quadrimester",
    "quarterly",
    "bimonthly",
    "monthly",
  ]),
  totalGracePeriods: z.coerce.number().int().min(0, "Debe ser 0 o mayor"),
  partialGracePeriods: z.coerce.number().int().min(0, "Debe ser 0 o mayor"),
  currency: z.enum(["USD", "PEN", "EUR"]),
});

interface BondFormProps {
  onCalculate: (data: BondFormValues) => void;
}

export function BondForm({ onCalculate }: BondFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "Mi Empresa S.A.C.",
      costOfCapital: 10.0,
      marketValue: 100000,
      faceValue: 100000,
      startDate: new Date(),
      termInYears: 5,
      couponRate: 8.0,
      issuerInitialCosts: 2.0,
      redemptionPremium: 1.0,
      paymentFrequency: "annually",
      totalGracePeriods: 0,
      partialGracePeriods: 0,
      currency: "USD",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onCalculate(values);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mi Empresa S.A.C." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="PEN">PEN</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="faceValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Nominal</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Comercial</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Fecha de Inicio</FormLabel>
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
                              <span>Elija una fecha</span>
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
                name="termInYears"
                render={({ field }) => (
                  <FormItem className="pt-2">
                    <FormLabel>Plazo (años)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paymentFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia de Pago</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="annually">Anual</SelectItem>
                      <SelectItem value="semi-annually">Semestral</SelectItem>
                      <SelectItem value="quadrimester">Cuatrimestral</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="bimonthly">Bimestral</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="couponRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa Cupón (TNA %)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costOfCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>COK Anual (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issuerInitialCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costos Iniciales Emisor (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormDescription>Del valor comercial.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="redemptionPremium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prima de Vencimiento (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormDescription>Del valor nominal.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="partialGracePeriods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodos Gracia Parcial</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalGracePeriods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodos Gracia Total</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Calculator className="mr-2 h-4 w-4" />
              Guardar y Calcular Bono
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
