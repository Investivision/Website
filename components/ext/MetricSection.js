import { createElement } from "react";

export default function MetricSection({
  allData,
  allGlobal,
  component,
  props = {},
  propTransform = () => {},
}) {
  const children = [];

  for (let i = 0; i < allData.length; i++) {
    const elementProps = { ...props, ...allData[i], ...allGlobal[i] };
    const element = createElement(component, {
      ...elementProps,
      ...propTransform(elementProps),
    });
    children.push(<div>{element}</div>);
  }

  return <div>{children}</div>;
}
