import { detectLanguage } from "../i18n";
import * as I18n from "i18next";

function bail(message) {
  throw new Error(message);
}

const onInit = async () => {
  const React = await import("react");
  const { render } = await import("react-dom");
  const { PasswordReset } = await import("./password_reset");
  const node = document.createElement("DIV");
  node.id = "root";
  document.body.appendChild(node);

  const reactElem = React.createElement(PasswordReset, {});
  const domElem = document.getElementById("root");

  return (domElem) ? render(reactElem, domElem) : bail("Add a div with id `root` to the page first.");
};


detectLanguage().then(async config => I18n.init(config, onInit));
