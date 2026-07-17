import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const authSession = async function () {
  const session = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: await headers(),
  });

  return session;
};

export const authIsRequired = async function () {
  const session = await authSession();

  if (!session) {
    return redirect("/auth/sign-in");
  }

  return session;
};

export const authIsNotRequired = async function () {
  const session = await authSession();

  if (session) {
    return redirect("/admin");
  }

  return session;
};
