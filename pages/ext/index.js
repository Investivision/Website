import ***REMOVED*** useState, useEffect ***REMOVED*** from "react";
import ***REMOVED*** alterHsl ***REMOVED*** from "tsparticles";

const extId = "lfmnoeincmlialalcloklfkmfcnhfian";

export default function Ext() ***REMOVED***
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [tabId, setTabId] = useState(undefined);

  useEffect(() => ***REMOVED***
    if (!tabId) ***REMOVED***
      window.chrome.runtime.sendMessage(
        extId,
        ***REMOVED*** message: "getTabId" ***REMOVED***,
        function (tab) ***REMOVED***
          console.log("tabid", tab);
          setTabId(tab);
        ***REMOVED***
      );
    ***REMOVED*** else ***REMOVED***
      console.log("second tabid", tabId);
      const port = chrome.runtime.connect(extId, ***REMOVED*** name: "" + tabId ***REMOVED***);
      port.onMessage.addListener(function (data) ***REMOVED***
        if (data.status == "loading") ***REMOVED***
          setLoading(true);
        ***REMOVED*** else ***REMOVED***
          console.log("got data", data);
          setLoading(false);
          setData(data);
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [tabId]);

  return (
    <div
      style=***REMOVED******REMOVED***
        backgroundColor: "white",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden",
        overflowY: "scroll",
        padding: 20,
        opacity: loading ? 0.3 : 1,
      ***REMOVED******REMOVED***
    >
      <p>***REMOVED***JSON.stringify(data)***REMOVED***</p>
    </div>
  );
***REMOVED***
