import styled, { keyframes } from "styled-components";

const pulse = keyframes`
0% {
    transform: scale(1);
    filter: brightness(100%);
  }
  100% {
    transform: scale(1.1);
    filter: brightness(200%);
  }
`;
export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  animation: ${pulse} 0.7s infinite;
  animation-direction: alternate;
  #logo {
    img {
      width: calc(15vh + 6vw);
    }
    p {
      font-size: calc(3vw + 32px);
    }
  }
`;
