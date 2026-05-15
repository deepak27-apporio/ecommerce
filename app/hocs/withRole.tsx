import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

type WithChildrenProps = {
  children?: React.ReactNode;
};

export function withRole<T extends WithChildrenProps>(
  WrappedComponent: React.ComponentType<T>,
  allowedRoles: string[],
  redirectTo = "/"
) {
  return function ProtectedComponent(props: T) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace("/login");
        } else if (!allowedRoles.includes(user.role)) {
          router.replace(redirectTo);
        } else {
          setAuthorized(true);
        }
      }
    }, [user, loading]);

    if (loading) return <div className="h-full w-full flex justify-center "><Loader/></div>;
    if (!authorized) return null;

    return <WrappedComponent {...props} />;
  };
}