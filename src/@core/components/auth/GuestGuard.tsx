// ** React Imports
import { ReactNode, ReactElement, useEffect } from "react";

// ** Next Imports
import { useRouter } from "next/router";

// ** Hooks Import
import { useAuth } from "src/hooks/useAuth";
import authConfig from "src/configs/auth";
import { useLocalStorage } from "src/hooks/useLocalStorage";

interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();
  const [user] = useLocalStorage(authConfig.userData, null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (user) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route]);

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
