import React from "react";
import "./ProgramWrapper.css";
import ToolTip from "../Tooltip/ToolTip";

type Props = {
  children: string | JSX.Element | JSX.Element[],
  title: string,
  programId: string,
  programAccount: string,
  description: string | JSX.Element,
};

const ProgramWrapper: React.FC<Props> = (
  { children, programId, programAccount, description, title }
) => {
  return (
    <div className="programWrapper">
      <h2>{title}</h2>
      <div style={{ position: 'relative' }}>
        Program ID: <a
          href={`https://solscan.io/account/${programId}?cluster=devnet`}
          target="_blank"
        >{programId}</a>
        <ToolTip text="Program account, that executes transaction" />
      </div>
      <div>
        Data Account: <a
          href={`https://solscan.io/account/${programAccount}?cluster=devnet`}
          target="_blank"
        >{programAccount}</a>
        <ToolTip text="Account, that stores data" />
      </div>
      <div className="programDescription">Description: {description}</div>
      <div>
        {children}
      </div>
    </div>
  );
}

export default ProgramWrapper;
