
"use server"
import { cookies } from "next/headers";
import { jwtDecode } from 'jwt-decode';

export const login = async (values: {username: string, password: string}): Promise<{status: boolean, error: any, token: string|undefined}>  => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_SERVER!}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  })
    .then((res) => res.json())
    .then((res) => {
      setAuthCookie(res.token)
      return { status: true, error: null, token: res.token };
    })
    .catch((err) => {
      console.log("res err", JSON.stringify(err));
      if (err !== null && err instanceof Error) {
        return { status: false, error: JSON.stringify(err.message), token: undefined };
      }
      return { status: false, error: err, token: undefined };
    });
}

const setAuthCookie = (token: string) => {
  if (token) {
    cookies().set({
      name: "Authorization",
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(jwtDecode(token).exp! * 1000),
    });
  }
};
