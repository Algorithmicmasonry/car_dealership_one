"use server"

import { cookies } from "next/headers"

// Hardcoded credentials - in a real app, you would use a database
const VALID_EMAIL = "rickdealership@gmail.com"
const VALID_PASSWORD = "password123"

export async function authenticate(email: string, password: string) {
  // Simple validation against hardcoded credentials
  const isValid = email === VALID_EMAIL && password === VALID_PASSWORD

  if (isValid) {
    // Set a cookie to maintain the session
    cookies().set("authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return true
  }

  return false
}
