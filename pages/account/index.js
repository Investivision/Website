import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "/utils/firebase";

import NavBar from "../../components/NavBar";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLoaded, setUserLoaded] = useState(false);

  const router = useRouter();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUserLoaded(true);
    } else {
      router.replace("/login");
    }
  });

  if (!userLoaded) {
    return null;
  }

  return (
    <div>
      <NavBar />
      <p>User data: {JSON.stringify(auth.currentUser)}</p>
      <h4
        onClick={() => {
          auth.signOut();
        }}
      >
        Logout
      </h4>
    </div>
  );
}
