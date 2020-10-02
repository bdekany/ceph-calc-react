import React from "react";
import { Notification } from "react-bulma-components";
import "./ToolTip.css";

/* 
<ToolTip>Help Me</ToolTip>
<ToolTip warning>Warn Me</ToolTip>
*/

export default function HelpToolTip(props) {
  let label = props.warning ? "warning" : "help";
  let emoji = props.warning ? "⚠️" : "❓";

  return (
    <span className="tooltip" role="img" aria-label={label}>
      {emoji}
      <Notification className="tooltiptext" color="light">
        {props.children}
      </Notification>
    </span>
  );
}
