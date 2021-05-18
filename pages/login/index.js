import { useState } from "react";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import { auth, functions } from "/utils/firebase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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
      <p>First Name</p>
      <input
        type="text"
        value={firstName}
        onChange={(event) => {
          setFirstName(event.target.value);
        }}
      />
      <p>Last Name</p>
      <input
        type="text"
        value={lastName}
        onChange={(event) => {
          setLastName(event.target.value);
        }}
      />
      <p>Phone Number</p>
      <input
        type="text"
        value={phoneNumber}
        onChange={(event) => {
          setPhoneNumber(event.target.value);
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
      <p>confirm password</p>
      <input
        type="text"
        value={confirmPassword}
        onChange={(event) => {
          setConfirmPassword(event.target.value);
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
        onClick={() => {
          functions
            .httpsCallable("signup")({
              email,
              password,
              firstName,
              lastName,
              confirmPassword,
              phoneNumber,
            })
            .then(async (result) => {
              try {
                await auth.signInWithEmailAndPassword(email, password);
              } catch (e) {
                alert(e.message);
              }
            })
            .catch((e) => {
              alert(e.message);
            });
        }}
      >
        Signup
      </h4>
    </div>
  );
}
