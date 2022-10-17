import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, isconnected } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';



const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function App() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;

    if (mintAmount > 1) {
      cost = 3000000000000000;
    }

    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Have some patience...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `You got it!!!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };


  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const connected = () => {
    document.getElementById("connectbtn").style.display = "none";
    document.getElementById("text-1").style.display = "none";
    /*  document.getElementById("text1").style.display = "none";
     document.getElementById("text2").style.display = "none";
     document.getElementById("text3").style.display = "none"; */
  };

  /*  const changeText1 = () => {
     document.getElementById("text1").style.display = "none";
     document.getElementById("text2").style.display = "flex";
     document.getElementById("text3").style.display = "none";
   };
 
   const changeText2 = () => {
     document.getElementById("text1").style.display = "none";
     document.getElementById("text2").style.display = "none";
     document.getElementById("text3").style.display = "flex";
   };
 
   const changeText3 = () => {
     document.getElementById("text1").style.display = "flex";
     document.getElementById("text2").style.display = "none";
     document.getElementById("text3").style.display = "none";
   }; */

  return (
    <div>
      <div className="home">

        <img src="/config/images/backgr.gif" style={{ width: '100%', height: '100vh' }}></img>

        {/*Socials*/}
        <div style={{width: '100%', display: 'flex', flexDirection: 'row-reverse', position: 'absolute'}}>
          <a href="https://twitter.com/pillagersnft" target="_blank">
          <img className="icon" style={{width: '60px', marginRight: '10px', marginTop: '15px', cursor: 'pointer'}} src="/config/images/twitterp.png"></img>
          </a>
          <a href="https://opensea.io/collection/pillagers" target="_blank">
          <img className="icon" style={{width: '47.5px', marginRight: '8px', marginTop: '20px', cursor: 'pointer'}} src="/config/images/opensea.png"></img>
          </a>
        </div>

        <div id="text-1" style={{ position: 'absolute', width: '45%', lineHeight: '25px', top: '33vh' }}>
          <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '1.2em', textShadow: '2px 2px black' }}>For what is right, for what is wrong, we will pillage on. 13 factions over 100 traits. Choose wisely young swordsman.</p>
        </div>
        <div id="connectbtn" style={{}}
          onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
            getData();
            connected();
          }}
        >
          CONNECT
        </div>

      


        {/*Mint Section*/}
        <div className="mint">
          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
            <>
              <div
                className="soldout" style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '3em', textShadow: '5px 5px black' }}
              >
                SOLD OUT!
              </div>
              <s.SpacerSmall />
            </>
          ) : (
            <>
              <s.SpacerXSmall />
              <s.SpacerSmall />
              {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                <s.Container ai={"center"} jc={"center"}>
                  <s.SpacerSmall />

                  {blockchain.errorMsg !== "" ? (
                    <>
                      <s.SpacerSmall />
                    </>
                  ) : null}
                </s.Container>
              ) : (
                <>
                  <div onLoad={connected()}></div>
                  <s.SpacerMedium />
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <btn id="roundbtn" className="round-button"
                      style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '3em', cursor: 'pointer', textShadow: '5px 5px black' }}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        decrementMintAmount();
                      }}
                    >
                      -
                    </btn>
                    <s.SpacerMedium />
                    <s.TextDescription id="mint-amount"
                      style={{
                        fontSize: '3em',
                        textAlign: "center",
                        color: '#687F8E', fontFamily: "'Press Start 2P', cursive", textShadow: '5px 5px black'
                      }}
                    >
                      {mintAmount}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <btn className="round-button"
                      style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '3em', cursor: 'pointer', textShadow: '5px 5px black' }}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        incrementMintAmount();
                      }}
                    >
                      +
                    </btn>
                  </s.Container>
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <div className="mintbtn" style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '3em', cursor: 'pointer', textShadow: '5px 5px black', marginTop: '10px', marginLeft: '8px' }}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                      }}
                    >
                      MINT
                    </div>
                  </s.Container>
                </>
              )}
            </>
          )}
        </div>
      </div>


      <Phone>

      </Phone>
    </div>
  );
}

export const Home = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 100vh; 
minWidth: 100%;
background-image: url("/config/images/bg.jpg");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
`;

export const Phone = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 100vh;
minWidth: 100%;
background-image: url("/config/images/backgr.gif");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
@media (orientation: landscape) {
  display: none;
}
`;

export default App;
