import { useState, useEffect } from "react";
import { alterHsl } from "tsparticles";

const extId = "lfmnoeincmlialalcloklfkmfcnhfian";

export default function Ext() {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [tabId, setTabId] = useState(undefined);

  useEffect(() => {
    if (!tabId) {
      window.chrome.runtime.sendMessage(
        extId,
        { message: "getTabId" },
        function (tab) {
          console.log("tabid", tab);
          setTabId(tab);
        }
      );
    } else {
      console.log("second tabid", tabId);
      const port = chrome.runtime.connect(extId, { name: "" + tabId });
      port.onMessage.addListener(function (data) {
        if (data.status == "loading") {
          setLoading(true);
        } else {
          console.log("got data", data);
          setLoading(false);
          setData(data);
        }
      });
    }
  }, [tabId]);

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden",
        overflowY: "scroll",
        padding: 20,
        opacity: loading ? 0.3 : 1,
      }}
    >
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}
