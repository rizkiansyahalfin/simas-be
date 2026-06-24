import {
  test,
  expect,
} from "@playwright/test"

test("login success", async ({
  request,
}) => {

  const response =
    await request.post(
      "/api/auth/login",
      {
        data: {
          email:
            "superadmin@mail.com",

          password:
            "password123",
        },
      }
    )


console.log(response.status())
console.log(await response.text())

  expect(
    response.status()
  ).toBe(200)

  const body =
    await response.json()

  expect(
    body.data.accessToken
  ).toBeTruthy()
})