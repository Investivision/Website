import ***REMOVED*** useState ***REMOVED*** from "react";
import ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import NavBar from "../../components/NavBar";
import ***REMOVED*** auth ***REMOVED*** from "/utils/firebase";

export default function Home() ***REMOVED***
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  auth.onAuthStateChanged((user) => ***REMOVED***
    if (user) ***REMOVED***
      router.push("/");
    ***REMOVED***
  ***REMOVED***);

  return (
    <div>
      <NavBar />
      <h1>Sign up</h1>
      <p>email</p>
      <input
        type="text"
        value=***REMOVED***email***REMOVED***
        onChange=***REMOVED***(event) => ***REMOVED***
          setEmail(event.target.value);
        ***REMOVED******REMOVED***
      />
      <p>password</p>
      <input
        type="text"
        value=***REMOVED***password***REMOVED***
        onChange=***REMOVED***(event) => ***REMOVED***
          setPassword(event.target.value);
        ***REMOVED******REMOVED***
      />
      <h4
        onClick=***REMOVED***async () => ***REMOVED***
          try ***REMOVED***
            await auth.createUserWithEmailAndPassword(email, password);
          ***REMOVED*** catch (e) ***REMOVED***
            alert(e.message);
          ***REMOVED***
        ***REMOVED******REMOVED***
      >
        Sign Up
      </h4>
      <h4
        onClick=***REMOVED***() => ***REMOVED***
          router.replace("/login");
        ***REMOVED******REMOVED***
      >
        Login
      </h4>
    </div>
  );
***REMOVED***
