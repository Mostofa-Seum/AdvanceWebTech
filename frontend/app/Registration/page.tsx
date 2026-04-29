"use client";

import { useState, FormEvent, JSX } from "react";
import { z } from "zod";
import Layout from "@/components/Layout/layout";
import Title from "@/components/Layout/title";

// Zod schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    console.log(result.data);
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <>
      <Title page="Login" />
      <Layout>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p>{error}</p>}

          <button type="submit">Login</button>
        </form>
      </Layout>
    </>
  );
}

