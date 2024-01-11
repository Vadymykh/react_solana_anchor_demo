import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import "./ToolTip.css";

type Props = { text: string };

const ToolTip: React.FC<Props> = ({ text }) => {
  return (
    <span className="tooltip-top" data-tooltip={ text }>
      <FontAwesomeIcon
        icon={faInfoCircle}
        color="rgb(255, 115, 0)"
      />
    </span>
  );
}

export default ToolTip;
