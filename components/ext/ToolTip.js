import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { Translate } from "@material-ui/icons";

export default styled(({ className, ...props }) => {
  if (!props.title) {
    return props.children;
  }
  return <Tooltip {...props} classes={{ popper: className }} />;
})({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 190,
    fontSize: 12,
    lineHeight: "140%",
    fontWeight: 400,
  },
});
