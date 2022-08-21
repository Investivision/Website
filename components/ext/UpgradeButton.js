import Button from "@mui/material/Button";
import { useRouter } from "next/router";
export default function UpgradeButton(props) {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      // color="secondary"
      onClick={() => {
        if (props.port) {
          props.port.postMessage({
            message: "see pricing",
          });
        } else {
          router.prefetch("/pricing");
          router.push("/pricing");
        }
      }}
    >
      Upgrade to Unlock
    </Button>
  );
}
