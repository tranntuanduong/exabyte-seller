// ** React Imports
import { ReactNode, ReactElement, useEffect } from "react";

// ** Next Imports
import { useRouter } from "next/router";

// ** Hooks Import
import { useAuth } from "src/hooks/useAuth";
import authConfig from "src/configs/auth";
import { useLocalStorage } from "src/hooks/useLocalStorage";

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;

  return <>{children}</>;
};

export default AuthGuard;
