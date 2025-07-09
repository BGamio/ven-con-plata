"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // In a real app, you'd handle registration logic here
      router.push("/dashboard");
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg">
            <Landmark className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Calculadora de Bonos
          </h1>
        </div>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Crear una Cuenta</CardTitle>
          <CardDescription>
            Ingrese sus datos para registrarse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/" className="underline">
              Inicia Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
