"use client";

import { useState, FormEvent, JSX } from "react";
import { z } from "zod";

// Zod schema
const registrationSchema = z.object({
  fullName: z
  .string()
  .min(3, { message: "Name must be at least 3 characters long" })
  .max(50, { message: "Name cannot exceed 50 characters" }),

  age: z
  .coerce.number()
  .int({ message: "Age must be a whole number" })
  .min(18, { message: "You must be at least 18 years old to register" })
  .max(120, { message: "Please enter a valid age" }),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmpassword: z.string(),
})
.refine((data) => data.password === data.confirmpassword, {
  message: "Passwords do not match",
  path: ["confirmpassword"],
});

type RegistrationData = z.infer<typeof registrationSchema>;


export default function RegistrationPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const result = registrationSchema.safeParse({ fullName, age, email, password, confirmpassword });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setFullName("");
    setAge("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <>
        <center><h5 className="text-2xl font-bold mb-4">Registration</h5></center>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-gray-400 rounded px-3 py-2 w-full text-black mb-4 mt-1"/>
             </div>


            <div>
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              className="border border-gray-400 rounded px-3 py-2 w-full text-black mb-4 mt-1"/>
          </div>


          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 rounded px-3 py-2 w-full text-black mb-4 mt-1"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-400 rounded px-3 py-2 w-full text-black mb-4 mt-1"
            />
          </div>

            <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-400 rounded px-3 py-2 w-full text-black mb-4 mt-1"
            />
          </div>

          {error && <p>{error}</p>}

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Register</button>
        </form>
    </>
  );
}

