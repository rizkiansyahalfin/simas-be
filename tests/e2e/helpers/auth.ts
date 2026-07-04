import { APIRequestContext } from "@playwright/test"

export async function login(
  request: APIRequestContext
) {
  const response = await request.post(
    "/api/auth/login",
    {
      data: {
        email: "superadmin@mail.com",
        password: "password123",
      },
    }
  )

  const body = await response.json()

  return body.data.accessToken
}