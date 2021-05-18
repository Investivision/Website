import ***REMOVED*** useState ***REMOVED*** from "react";
import ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import styles from "./index.module.css";
import Button from "@material-ui/core/Button";

const navBarLinks = [
  ***REMOVED***
    name: "Features",
    path: "/",
  ***REMOVED***,
  ***REMOVED*** name: "Analysis", path: "/analysis" ***REMOVED***,
  ***REMOVED*** name: "FAQ", path: "/analysis" ***REMOVED***,
  ***REMOVED*** name: "Pricing", path: "/account" ***REMOVED***,
  ***REMOVED*** name: "Account", path: "/account" ***REMOVED***,
];

export default function NavBar() ***REMOVED***
  const router = useRouter();

  return (
    <div className=***REMOVED***styles.container***REMOVED***>
      <a className=***REMOVED***styles.logoContainer***REMOVED*** href="/">
        <img src="/logo.png"></img>
        <h1>Investivision</h1>
      </a>
      <div className=***REMOVED***styles.linksContainer***REMOVED***>
        ***REMOVED***navBarLinks.map((link) => ***REMOVED***
          return (
            <a href=***REMOVED***link.path***REMOVED*** className=***REMOVED***styles.link***REMOVED***>
              ***REMOVED***link.name***REMOVED***
            </a>
          );
        ***REMOVED***)***REMOVED***
      </div>
      <div className=***REMOVED***styles.rightContainer***REMOVED***>
        <Button variant="outlined" color="secondary" className="loginButton">
          Login
        </Button>
      </div>
    </div>
  );
***REMOVED***
