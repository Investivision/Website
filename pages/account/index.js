import ***REMOVED*** useState, useEffect ***REMOVED*** from "react";
import ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import ***REMOVED*** auth ***REMOVED*** from "/utils/firebase";

import NavBar from "../../components/NavBar";

export default function Home() ***REMOVED***
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLoaded, setUserLoaded] = useState(false);

  const router = useRouter();

  auth.onAuthStateChanged((user) => ***REMOVED***
    if (user) ***REMOVED***
      setUserLoaded(true);
    ***REMOVED*** else ***REMOVED***
      router.replace("/login");
    ***REMOVED***
  ***REMOVED***);

  if (!userLoaded) ***REMOVED***
    return null;
  ***REMOVED***

  return (
    <div>
      <NavBar />
      <p>User data: ***REMOVED***JSON.stringify(auth.currentUser)***REMOVED***</p>
      <h4
        onClick=***REMOVED***() => ***REMOVED***
          auth.signOut();
        ***REMOVED******REMOVED***
      >
        Logout
      </h4>
    </div>
  );
***REMOVED***
