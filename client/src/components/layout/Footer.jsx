// Import React modules
import React from 'react';
import styled from 'styled-components';

const MainFooter = styled.div`
  text-align: center;
  background: var(--complementary);
  color: var(--primary);
`;

const Footer = () => {
  // Dynamic Date Function
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <MainFooter className="py-3">
      &copy; {getCurrentYear()} CentralX
    </MainFooter>
  )
}

export default Footer