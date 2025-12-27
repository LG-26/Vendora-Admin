"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/admin",
    });
  }

  return (
    <form action={handleLogin}>
      <h1>Admin Login</h1>

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
      />

      <button type="submit">Login</button>
    </form>
  );
}
