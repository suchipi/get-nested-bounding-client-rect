// @flow
import React from "react";
import ReactDOM from "react-dom";
import getNestedBoundingClientRect, { type DOMRect } from "../..";

window.getNestedBoundingClientRect = getNestedBoundingClientRect;

window.drawBoxAtRect = function(rect: DOMRect) {
  const div = document.createElement("div");
  Object.assign(div.style, {
    boxSizing: "border-box",
    position: "fixed",
    // top: rect.top + "px",
    bottom: rect.bottom + "px",
    right: rect.right + "px",
    // left: rect.left + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    backgroundColor: "rgba(255, 0, 255, 0.5)",
    border: "1px solid black",
  });
  document.body.appendChild(div);
};

class Iframe extends React.Component {
  componentDidMount() {
    this.root = document.createElement("div");
    this.frame.contentDocument.body.appendChild(this.root);
    ReactDOM.render(this.props.children, this.root);
  }
  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.root);
  }
  render() {
    var { children, ...props } = this.props; // eslint-disable-line no-unused-vars
    return <iframe ref={(frame) => (this.frame = frame)} {...props} />;
  }
}

const Block = ({ color, ...otherProps }) => (
  <div
    {...otherProps}
    style={{
      width: 200,
      height: 200,
      backgroundColor: color,
      border: "3px solid black",
      ...otherProps.style,
    }}
    className={color}
  />
);

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

ReactDOM.render(
  <div id="blocks">
    <Block color="red" />
    <Iframe style={{ width: 500, height: 500 }}>
      <Block color="blue" style={{ boxSizing: "border-box" }} />
      <Iframe style={{ width: 500, height: 500 }} frameBorder="0">
        <Block color="green" />
      </Iframe>
    </Iframe>
  </div>,
  root
);
