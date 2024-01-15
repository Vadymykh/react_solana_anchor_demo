import styled from "styled-components";

export const LargestAccountsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 30px;

  h3 {
    margin-bottom: 0;
  }

  .small-button {
    margin-left: 10px;
  }

  .account {
    width: fit-content;
    display: grid;
    column-gap: 20px;
    grid-template-columns: 1fr 100px;
    align-items: center;
    row-gap: 20px;

    @media (max-width: 700px) {
      grid-template-columns: 1fr;
    }
  }
`;