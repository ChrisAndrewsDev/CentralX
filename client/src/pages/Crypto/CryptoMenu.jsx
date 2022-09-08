import React, { useEffect, useState } from 'react';

// Import npm packages
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';   //Error box

// Import components
import MenuList from '../../components/features/Menus/MenuList';
import ErrorPage from '../../components/common/ErrorPage';
import Loader from '../../components/common/Loader';

const CryptoMenu = () => {
  // HOOK: SETTING COMPONENT STATE (& init values)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // HOOK: ON-LOAD SIDE EFFECTS
  useEffect(() => {
    fetchCrypto();
    setLoading(false);
  }, []);

  // COMPONENT FUNCTIONS
  async function fetchCrypto() {
    try {
      // External API Request: CoinGecko
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
      console.log(response);
      const data = await response.data;

      // SUCCESS: Output overrides intiial data state
      setData(data);

    } catch (err) {
      console.log(err)
      setError(true); 
      toast.error("Internal Server Error - Cannot retrieve data"); 
    }
  }

  // CONDITIONAL LOAD: ERROR
  if (error) {
    return (
      <Container className="text-center">
        <ErrorPage />
      </Container>
    )
  }

  // CONDITIONAL LOAD: LOADING
  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    )
  }

  // DEFAULT LOAD: SUCCESS API CALL
  return (
    <Container>
      <h1>Cryptocurrency Information &amp; Prices</h1>
      <p>CentralX is the easiest way to buy, sell and trade your favourite cryptocurrencies - from everything Bitcoin to Ethereum, we have all the coins you need to succeed</p>

      {/* SECTION: Crypto Menu */}
      {/* REFACTOR (A): Our return ONLY concerned with the success render condition AND all moving parts are abstracted out (SEE FEATURES COMPONENTS) */}
      {data.length > 0 && <MenuList title="Cryptocurrency" coins={data} />}
    </Container>
  )
};

export default CryptoMenu