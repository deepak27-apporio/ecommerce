"use client";

import { ReactElement } from "react";
import { redirect } from "next/navigation";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOnly,
  admin,
  redirectTo = "/",
}: Props) => {
  if (!isAuthenticated) redirect(redirectTo);
  if (adminOnly && !admin) redirect(redirectTo);

  return children ?? null;
};

export default ProtectedRoute;
