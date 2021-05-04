import { useState } from "react";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import { auth } from "/utils/firebase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  auth.onAuthStateChanged((user) => {
    if (user) {
      router.push("/");
    }
  });

  return (
    <div>
      <NavBar />
      <h1>login</h1>
      <p>email</p>
      <input
        type="text"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <p>password</p>
      <input
        type="text"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <h4
        onClick={async () => {
          try {
            await auth.signInWithEmailAndPassword(email, password);
          } catch (e) {
            alert(e.message);
          }
        }}
      >
        Login
      </h4>
      <h4
        onClick={async () => {
          try {
            await auth.createUserWithEmailAndPassword(email, password);
          } catch (e) {
            alert(e.message);
          }
        }}
      >
        Signup
      </h4>
    </div>
  );
}
