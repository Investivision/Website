export default function InfoScreen(props) {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: 20,
        opacity: 1,
      }}
    >
      <img className={props.styles.loadingLogo} src="/images/logo.svg" />
      <p
        style={{
          fontSize: 18,
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        {props.text}
      </p>
      {props.message ? (
        <Button
          variant="contained"
          onClick={() => {
            port.postMessage({
              message: "see pricing",
            });
          }}
        >
          Upgrade for Unlimited Coverage
        </Button>
      ) : null}
    </div>
  );
}
