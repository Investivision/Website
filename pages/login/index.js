import ***REMOVED*** useState ***REMOVED*** from "react";
import ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import NavBar from "../../components/NavBar";
import ***REMOVED*** auth, functions ***REMOVED*** from "/utils/firebase";

export default function Home() ***REMOVED***
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();

  auth.onAuthStateChanged((user) => ***REMOVED***
    if (user) ***REMOVED***
      router.push("/");
    ***REMOVED***
  ***REMOVED***);

  return (
    <div>
      <NavBar />
      <h1>login</h1>
      <p>email</p>
      <input
        type="text"
        value=***REMOVED***email***REMOVED***
        onChange=***REMOVED***(event) => ***REMOVED***
          setEmail(event.target.value);
        ***REMOVED******REMOVED***
      />
      <p>First Name</p>
      <input
        type="text"
        value=***REMOVED***firstName***REMOVED***
        onChange=***REMOVED***(event) => ***REMOVED***
          setFirstName(event.target.value);
        ***REMOVED******REMOVED***
      />
      <p>Last Name</p>
      <input
        type="text"
        value=***REMOVED***lastName***REMOVED***
        onChange=***REMOVED***(event) => ***REMOVED***
          setLastName(event.target.value);
        ***REMOVED******REMOVED***
      />
      <p>Phone Number</p>
      <input
        type="text"
        value=***REMOVED***phoneNumber***REMOVED***
        onChange=***REMOVED***(event) => ***REMOVED***
          setPhoneNumber(event.target.value);
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
      <p>confirm password</p>
      <input
        type="text"
        value=***REMOVED***confirmPassword***REMOVED***
        onChange=***REMOVED***(event) => ***REMOVED***
          setConfirmPassword(event.target.value);
        ***REMOVED******REMOVED***
      />
      <h4
        onClick=***REMOVED***async () => ***REMOVED***
          try ***REMOVED***
            await auth.signInWithEmailAndPassword(email, password);
          ***REMOVED*** catch (e) ***REMOVED***
            alert(e.message);
          ***REMOVED***
        ***REMOVED******REMOVED***
      >
        Login
      </h4>
      <h4
        onClick=***REMOVED***() => ***REMOVED***
          functions
            .httpsCallable("signup")(***REMOVED***
              email,
              password,
              firstName,
              lastName,
              confirmPassword,
              phoneNumber,
            ***REMOVED***)
            .then(async (result) => ***REMOVED***
              try ***REMOVED***
                await auth.signInWithEmailAndPassword(email, password);
              ***REMOVED*** catch (e) ***REMOVED***
                alert(e.message);
              ***REMOVED***
            ***REMOVED***)
            .catch((e) => ***REMOVED***
              alert(e.message);
            ***REMOVED***);
        ***REMOVED******REMOVED***
      >
        Signup
      </h4>
    </div>
  );
***REMOVED***
