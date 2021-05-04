import ***REMOVED*** useState ***REMOVED*** from "react";
import ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import styles from "./index.module.css";

const navBarLinks = [
  ***REMOVED***
    name: "Home",
    path: "/",
  ***REMOVED***,
  ***REMOVED*** name: "Explore", path: "/explore" ***REMOVED***,
  ***REMOVED*** name: "Account", path: "/account" ***REMOVED***,
];

export default function NavBar() ***REMOVED***
  const router = useRouter();

  return (
    <div>
      ***REMOVED***navBarLinks.map((link) => ***REMOVED***
        return (
          <a href=***REMOVED***link.path***REMOVED*** className=***REMOVED***styles.link***REMOVED***>
            ***REMOVED***link.name***REMOVED***
          </a>
        );
      ***REMOVED***)***REMOVED***
    </div>
  );
***REMOVED***
