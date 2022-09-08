// Import react modules
import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

// Import npm packages
import styled from 'styled-components';

// Import components
import Header from './Header';
import Footer from './Footer';

const AppWrap = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  flex: 1;
`;

const Layout = (props) => (
  <Fragment>
    <Header />
    {/* Wrap all content in column-direction flexbox */}
    <AppWrap>
      {/* REPLACE: {props.children} */}
      <Outlet />
    </AppWrap>
    <Footer />
  </Fragment>
);

export default Layout