import { createElement } from "react";
import styles from "./metricSection.module.css";

export default function MetricSection({
  allData,
  allGlobal,
  component,
  props = {},
  propTransform = () => {},
  children,
  style,
  className,
  noDivider,
}) {
  if (children && children.length == 1) {
    return children;
  }

  let newChildren = children
    ? children.map((element) => <div className={styles.element}>{element}</div>)
    : [];

  // console.log("metric section children", props.children);
  if (!children) {
    for (let i = 0; i < allData.length; i++) {
      let elementProps = { ...props, data: allData[i], global: allGlobal[i] };
      elementProps = {
        ...elementProps,
        ...propTransform(elementProps),
      };
      console.log("Growth props elementProps", elementProps);
      const element = createElement(component, elementProps);
      newChildren.push(<div className={styles.element}>{element}</div>);
    }
  }

  return (
    <div className={`${styles.container} ${className || ""}`} style={style}>
      {newChildren.map((element, i) => {
        return (
          <>
            {element}
            {i == newChildren.length - 1 ? null : (
              <div
                className={styles.divider}
                style={{
                  opacity: noDivider ? 0 : 1,
                }}
              />
            )}
          </>
        );
      })}
    </div>
  );
}
