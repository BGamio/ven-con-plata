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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, UserRole } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("emisor");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert("El correo electrónico ya está registrado.");
      return;
    }

    const newUser = { email, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("session", JSON.stringify(newUser));

    if (role === "emisor") {
      router.push("/dashboard");
    } else {
      router.push("/dashboard-investor");
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
          <CardDescription>Ingrese sus datos para registrarse.</CardDescription>
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
            <div className="grid gap-2">
              <Label>Rol</Label>
              <RadioGroup
                defaultValue={role}
                onValueChange={(value: UserRole) => setRole(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emisor" id="r1" />
                  <Label htmlFor="r1">Emisor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inversor" id="r2" />
                  <Label htmlFor="r2">Inversionista</Label>
                </div>
              </RadioGroup>
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
