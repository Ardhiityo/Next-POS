import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const authSession = async function () {
  const session = await auth.api.getSession({
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

export const requirePermission = async (
  session: Awaited<ReturnType<typeof authSession>>,
  permissions: { [key: string]: string[] }
) => {
  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      permissions,
    },
  });

  if (!hasPermission.success) {
    redirect("/403");
  }
};