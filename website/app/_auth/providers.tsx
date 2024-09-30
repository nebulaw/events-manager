import { AuthProvider } from "@/app/_auth/auth-context";

export function Providers({ children }: React.PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
