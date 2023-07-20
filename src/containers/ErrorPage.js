import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
`;

const ErrorText = styled.h1`
  color: #333;
  font-size: 2em;
`;

const ErrorPage = () => {
  return (
    <ErrorContainer>
      <ErrorText>
        Oops! You do not have the right permissions to access this page.
      </ErrorText>
    </ErrorContainer>
  );
};

export default ErrorPage;
