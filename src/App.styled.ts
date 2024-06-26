import styled from "styled-components";

export const AppStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .programContainer {
    width: 100%;
    padding: 0 50px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }

  a {
    color: #61dafb;
  }


  button {
    background-color: rgb(81, 45, 168);
    border: none;
    border-radius: 5px;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;  
    font-family: sans-serif;
    font-weight: 600;
    transition: 0.5s;
    cursor: pointer;
    flex-shrink: 0;
  }

  button:hover {
    background-color: rgb(104, 53, 224);
  }

  .small-button {
    background-color: #19a5cc;
    padding: 5px;
  }

  .small-button:hover {
    background-color: #00607b;
  }

  button:disabled {
    cursor: no-drop;
    background-color: #a4a4a4;
  }

  input {
    font-family: 'Roboto', sans-serif;
    color: #333;
    font-size: 16px;  
    font-weight: 600;
    padding: 15px;
    border-radius: 0.2rem;
    border: none;
  }

  .text-info {
    font-size: 16px;  
    font-family: sans-serif;
    font-weight: 600;
    padding: 15px 0;
  }

  .text-value {
    font-family: monospace;
    color: rgb(255, 115, 0);
    font-size: 18px;
  }

  .horizontal-container {
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 10px 0;
  }

  .two-columns-container {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
`;