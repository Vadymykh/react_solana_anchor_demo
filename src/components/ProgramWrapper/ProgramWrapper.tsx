import React, { ReactElement } from "react";
import { ProgramWrapperStyled } from "./ProgramWrapper.styled";
import ToolTip from "../Tooltip/ToolTip";
import { accountLink } from "../../solana/helpers";

type Props = {
  children: ReactElement | (ReactElement | undefined)[],
  title: string,
  programId: string,
  programAccount?: string,
  description: string | JSX.Element,
};

/**
 * Just explanational info wrapper. No blockchain functionality
 */
const ProgramWrapper: React.FC<Props> = (
  { children, programId, programAccount, description, title }
) => {
  return (
    <ProgramWrapperStyled>
      <h2>{title}</h2>
      <div style={{ position: 'relative' }}>
        Program ID: {accountLink(programId)}
        <ToolTip text="Program account, that executes transaction" />
      </div>
      {programAccount && <div>
        Data Account: {accountLink(programAccount)}
        <ToolTip text="Account, that stores data" />
      </div>}
      <div className="programDescription">Description: {description}</div>
      <div>
        {children}
      </div>
    </ProgramWrapperStyled>
  );
}

export default ProgramWrapper;
