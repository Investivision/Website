import ***REMOVED*** useState, useEffect ***REMOVED*** from "react";
import ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import ***REMOVED*** auth ***REMOVED*** from "/utils/firebase";
import ***REMOVED*** socketIOEndpoint ***REMOVED*** from "/utils/constants";
import ***REMOVED*** io ***REMOVED*** from "socket.io-client";

import NavBar from "../../components/NavBar";

// const socket = io(socketIOEndpoint);

let socket;

export default function Explore() ***REMOVED***
  const models = ***REMOVED***
    Prophet: 10,
    Range: 15,
    Arima: 8,
  ***REMOVED***;

  const [selectedModel, setSelectedModel] = useState(Object.keys(models)[0]);
  const [symbol, setSymbol] = useState("");
  const [messages, setMessages] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);

  auth.onAuthStateChanged((user) => ***REMOVED***
    setUserLoaded(true);
  ***REMOVED***);

  useEffect(() => ***REMOVED***
    console.log("inside use state", userLoaded);
    if (userLoaded) ***REMOVED***
      if (socket) ***REMOVED***
        socket.disconnect();
      ***REMOVED***
      socket = io(socketIOEndpoint);

      socket.on("connect", async () => ***REMOVED***
        if (auth.currentUser) ***REMOVED***
          const token = await auth.currentUser.getIdToken(true);
          socket.emit("authenticate", ***REMOVED***
            token: token,
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***);

      socket.on("message", (data) => ***REMOVED***
        console.log(data);
        setMessages([...messages, JSON.stringify(data)]);
      ***REMOVED***);
    ***REMOVED***
    return () => ***REMOVED***
      if (socket) ***REMOVED***
        socket.disconnect();
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***, [userLoaded]);

  const getData = () => ***REMOVED***
    console.log(socket);
    socket.emit("getData", ***REMOVED***
      model: selectedModel,
      symbol: symbol,
    ***REMOVED***);
  ***REMOVED***;

  return (
    <div>
      <NavBar />
      <h1>Explore</h1>
      <select
        onChange=***REMOVED***(event) => ***REMOVED***
          setSelectedModel(event.target.value);
        ***REMOVED******REMOVED***
        defaultValue=***REMOVED***selectedModel***REMOVED***
      >
        ***REMOVED***Object.keys(models).map((model) => ***REMOVED***
          return <option value=***REMOVED***model***REMOVED***>***REMOVED***model***REMOVED***</option>;
        ***REMOVED***)***REMOVED***
      </select>
      <p>***REMOVED***selectedModel***REMOVED***</p>
      <p>symbol</p>
      <input
        type="text"
        value=***REMOVED***symbol***REMOVED***
        onChange=***REMOVED***(event) => ***REMOVED***
          setSymbol(event.target.value);
        ***REMOVED******REMOVED***
      />
      <p>***REMOVED***symbol***REMOVED***</p>
      <h4 onClick=***REMOVED***getData***REMOVED***>Compute</h4>
      ***REMOVED***messages.map((message) => ***REMOVED***
        return <p>***REMOVED***message***REMOVED***</p>;
      ***REMOVED***)***REMOVED***
    </div>
  );
***REMOVED***
