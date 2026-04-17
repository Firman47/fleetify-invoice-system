import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/auth.store";

export default function WizardIndex() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else {
      router.replace("/wizard/step-1");
    }
  }, [router, token]);

  return null;
}
