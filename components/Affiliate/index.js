import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Affiliate() {
  const router = useRouter();
  useEffect(() => {
    const stored = window.localStorage.getItem("am");
    if (!stored) {
      const am = router.query.am;
      if (am) {
        window.localStorage.setItem("am", am);
      }
    }
  }, []);
  return null;
}
