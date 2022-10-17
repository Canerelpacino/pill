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

    if(mintAmount > 1){
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
    document.getElementById("connectbtn2").style.display = "none";
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
        <a href="https://twitter.com/pillagersnft" target="_blank">
          <img src="/config/images/twitterp.png" style={{ width: '55px', position: 'absolute', top: '17px', left: '30px', zIndex: '10' }} className="tw"></img>
        </a>
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
        {/*<img src="/config/images/click.gif" style={{ position: 'absolute', width: '3%', top: '69vh', right: '35vw' }}></img>*/}

        {/* <div id="text1" onClick={changeText1} style={{ display: 'flex', flexDirection: 'row', width: '45%', position: 'absolute', height: '50%', top: '30vh', cursor: 'pointer' }}>
          <div>
            <h1 style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '4em', textShadow: '5px 5px black' }}>What is Rare Ape Yacht Club?</h1>
            <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '2em', textShadow: '5px 5px black', padding: '2vh' }}>Let's put it this way. The greats paved the way for us. We are the new kids on the block... chain.
              Not just a deriv but a hand picked community created from the ground up making way towards an expansive future in web 3. <br></br><br></br>
              Beyond getting a high quality profile picture with full IP rights, owning a Rare Ape YC grants you access to a holder's
              only Discord which is loaded with private tracking tools where we will align collaborations, alpha calls, and partnerships for our holders. </p>
          </div>
        </div>

        <div id="text2" onClick={changeText2} style={{ display: 'none', flexDirection: 'row', width: '45%', position: 'absolute', height: '50%', top: '27vh', cursor: 'pointer' }}>
          <div>
            <h1 style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '4em', textShadow: '5px 5px black' }}>Roadmap</h1>
            <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '2em', textShadow: '5px 5px black', padding: '2vh' }}>- 0% / Handpick members from the BAYC, MAYC, Rare Apepe, and other relative communities for our free WL mint <br></br><br></br>
              - 25% / We'll get excited that people are getting the most amazing profile pictures to hit web3 since BAYC <br></br><br></br>
              - 50% / What are those flesh eating zombies? <br></br><br></br>
              - 75% / Ok time to call in the big guys <br></br><br></br>
              - 100% / Allow holder's to access our invite only Discord </p>
          </div>
        </div>

        <div id="text3" onClick={changeText3} style={{ display: 'none', flexDirection: 'row', width: '45%', position: 'absolute', height: '50%', top: '18vh', cursor: 'pointer' }}>
          <div>
            <h1 style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '4em', textShadow: '5px 5px black' }}>Future</h1>
            <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '2em', textShadow: '5px 5px black', padding: '2vh' }}>The future of Rare Ape YC in the immediate sense will be to
              find common goals within our community to achieve. Grant all holder's their intellectual property rights for unlimited personal and commercial use.
              Setup ranking system within Discord based off holder participation. <br></br><br></br> Hire alpha callers, moderators, and collab managers. Get the best of the
              best collaborations for our holders. Lastly, we feel that the NFT space is ever changing and moves quick. We love web3 and the NFT
              community as a whole, we will stay adaptive with the latest trends in the space, technology, and crypto providing a true "alpha" ecosystem
              as we build Rare Ape from an NFT project to a recognized brand. This is so much more than your typical "degen" play and the ride
              is about to begin! Oh yea, and beware of those flesh eating zombies. </p>
          </div>
        </div> */}


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
        <div id="connectbtn2" style={{}}
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
        <div className="mint2">
          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
            <>
              <div
                className="soldout" style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '5em', textShadow: '5px 5px black' }}
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
                      style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '5em', cursor: 'pointer', textShadow: '5px 5px black' }}
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
                        fontSize: '5em',
                        textAlign: "center",
                        color: '#687F8E', fontFamily: "'Press Start 2P', cursive", textShadow: '5px 5px black'
                      }}
                    >
                      {mintAmount}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <btn className="round-button"
                      style={{ fontFamily: "'Press Start 2P', cursive", color: '#687F8E', fontSize: '5em', cursor: 'pointer', textShadow: '5px 5px black' }}
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
                    <div className="mintbtn"
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                      }}
                    >
                      <p>MINT</p>
                    </div>
                  </s.Container>
                </>
              )}
            </>
          )}
        </div>
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
background-image: url("/config/images/bg.jpg");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
@media (orientation: landscape) {
  display: none;
}
`;

export default App;
