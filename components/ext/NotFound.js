import { useTheme } from "@mui/styles";

export default function NotFound(props) {
  const theme = useTheme();

  return (
    <div
      style={{
        background:
          theme.palette.mode == "dark"
            ? `rgba(255, 255, 255, 0.05)`
            : `rgba(0, 0, 0, 0.1)`,
        borderRadius: 12,
        width: "calc(100% - 20px)",
        padding: 30,
      }}
    >
      <p
        style={{
          opacity: 0.7,
          textAlign: "center",
          lineHeight: "150%",
          fontSize: 15,
        }}
      >
        {props.message || "Unavailable"}
      </p>
    </div>
  );
}
