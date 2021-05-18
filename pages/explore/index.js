import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "/utils/firebase";
import { socketIOEndpoint } from "/utils/constants";
import { io } from "socket.io-client";

import NavBar from "../../components/NavBar";

// const socket = io(socketIOEndpoint);

let socket;

export default function Explore() {
  const [selectedModel, setSelectedModel] = useState(undefined);
  const [symbol, setSymbol] = useState("");
  const [messages, setMessages] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const [models, setModels] = useState(undefined);

  auth.onAuthStateChanged((user) => {
    setUserLoaded(true);
  });

  useEffect(() => {
    console.log("inside use state", userLoaded);
    if (userLoaded) {
      console.log(socket);
      if (socket) {
        socket.disconnect();
      }
      socket = io(socketIOEndpoint);

      socket.on("connect", async () => {
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken(true);
          socket.emit("authenticate", {
            token: token,
          });
        }
      });

      socket.on("message", (data) => {
        console.log(data);
        setMessages([...messages, JSON.stringify(data)]);
        if ("models" in data) {
          console.log(models, selectedModel);
          if (!models) {
            setSelectedModel(selectedModel || Object.keys(data.models)[0]);
          }
          setModels(data.models);
        }
      });

      socket.on("message2", (data) => {
        console.log(data);
        setMessages([...messages, JSON.stringify(data)]);
      });
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userLoaded]);

  const getData = () => {
    console.log(socket);
    socket.emit("getData", {
      model: selectedModel,
      symbol: symbol,
    });
  };

  if (!models) {
    return (
      <div>
        <NavBar />
        <p>have not received model menu</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <h1>Explore</h1>
      <select
        onChange={(event) => {
          setSelectedModel(event.target.value);
        }}
        defaultValue={selectedModel}
      >
        {Object.keys(models).map((model) => {
          return <option value={model}>{model}</option>;
        })}
      </select>
      <p>{selectedModel}</p>
      <p>symbol</p>
      <input
        type="text"
        value={symbol}
        onChange={(event) => {
          setSymbol(event.target.value);
        }}
      />
      <p>{symbol}</p>
      <h4 onClick={getData}>Compute</h4>
      {messages.map((message) => {
        return <p>{message}</p>;
      })}
    </div>
  );
}
