import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Style from "./index.module.css";
import {Link} from "react-router-dom";
const { Alchemy, Network, Utils } = require("alchemy-sdk");


const setting = {
  apiKey: "REPLACE_THIS_WITH_YOUR_API_KEY",
  Network: Network.ETH_MAINNET,
};


const provider = new Alchemy(setting);

function Navigation() {
    const myStyle = {
      backgroundImage: `url(/back.jpg)`,
      backgroundSize: 'cover',
      opacity: 1.4,
      backgroundRepeat: 'no-repeat',}

      const [ethPrice,setEthprice] = useState('');
      const [ethBtc,setEthbtc] = useState('');
      const [totalNodes,setTotalnodes] = useState('');
      const [transaction,setTransaction] = useState([]);
      const [gasUsed,setGasused] = useState('');
      const [gasLimit,setGasLimit] = useState('');
      const [hash, setHash] = useState('');
      const [parentHash, setParenthash] = useState('');
      const [nonce, setNonce] = useState('');
      const [timestamp, setTimestamp] = useState('');
      const [number, setNumber] = useState('');
      const [extraData, setExtradata] = useState('');
      const [transactions, setTransactions] = useState('');
      const [miner,setMiner] = useState('');
      const [baseFeepergas, setBasefee] = useState('');
      const [showSecondDiv, setShowSecondDiv] = useState(false);
      const [sec,setSec] = useState({});
      const [tran,setTran] = useState({});
  
      function hexToString(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str.slice(1);
      }

    
      async function getBlock(num) {
            const r = await provider.core.getBlock(num);
            const r1 = await provider.core.getBlockWithTransactions(num);
            console.log(r1.transactions);
            setGasLimit(parseInt(r.gasLimit._hex, 16).toLocaleString())
            setGasused(parseInt(r.gasUsed._hex, 16).toLocaleString())
            setHash(r.hash);
            setParenthash(r.parentHash);
            setNonce(r.nonce);
            setNumber(r.number);
            setExtradata(hexToString(r.extraData));
            setMiner(r.miner);
            setTransactions(r.transactions.length);
            setTimestamp(formatTimestamp(r.timestamp));
            console.log(formatTimestamp(r.timestamp))
            const weiValue = parseInt(r.baseFeePerGas._hex,16); 
            const ethValue = Utils.formatEther(weiValue);
            setBasefee(ethValue);


            function formatTimestamp(transactionTime) {
              const currentTime = Math.floor(Date.now() / 1000); 
              const timeDifference = currentTime - transactionTime;
              const hours = Math.floor(timeDifference / 3600);
              const minutes = Math.floor((timeDifference % 3600) / 60);
              const seconds = timeDifference % 60;
              const formattedTimeDifference =
                (hours > 0 ? hours + ' hr ' : '') +
                (minutes > 0 ? minutes + ' mins ' : '0 mins ') +
                'ago';
              const transactionTimestamp = new Date(
                transactionTime * 1000
              ).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short',
              });
              setSec(seconds);
              return `${formattedTimeDifference} (${transactionTimestamp}+UTC)`;
            }
        }


      
    useEffect(() => {

      setTimeout(() => {
        getBlockNumber();
      }, 12000);
      
      async function getBlockNumber() {

        const response = await axios.get(
          'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=REPLACE_THIS_WITH_YOUR_API_KEY'
        );
        const res = await axios.get(
          'https://api.etherscan.io/api?module=stats&action=nodecount&apikey=REPLACE_THIS_WITH_YOUR_API_KEY')

      let tenBlock = [];
      let tr = {};
      let sc = {};
      try{
      const getCurrentBlock = await provider.core.getBlockNumber();
      const previousBlock = getCurrentBlock - 10;
      

      for (let i = getCurrentBlock; i > previousBlock; i--) {
        tenBlock.push(i);
        const v = await provider.core.getBlock(i);
        tr[i] = v.transactions.length;
        const currentTime = Math.floor(Date.now() / 1000);
          const seconds = (currentTime - v.timestamp);
          if(seconds > 60 && seconds >=120){
            sc[i] = `${Math.floor(seconds / 60)} mins ago`;
          }
          else if (seconds > 60) {
            sc[i] = `${Math.floor(seconds / 60)} min ago`; 
          } else {
            sc[i] = `${seconds} secs ago`;
        }}
      setTransaction(tenBlock);
      setTran(tr);
      setSec(sc);
    }
    catch(e){
      console.log(e);
    }
        var ethPrice = response.data.result.ethusd;
        const ethBtc = response.data.result.ethbtc;
        const totalNodes = res.data.result.TotalNodeCount;
        ethPrice = parseFloat(ethPrice).toFixed(2);

        const formattedNumber = parseFloat(ethPrice).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const ethBtc1 = Math.floor(ethBtc * Math.pow(10, 5)) / Math.pow(10, 5);
        setEthprice(formattedNumber); 
        setEthbtc(ethBtc1);
        setTotalnodes(totalNodes);
      }
    });
  

  const handleButtonClick = (x) => {
    let i =0;
    setShowSecondDiv(true);
    if(i<1){
    getBlock(x.el);   
    i++;} 
    


  };

  const renderSecondDiv = () => {
    if (showSecondDiv) {
      return (
        <div class="block-info">
          <div class="block-label">
            <p>Block Number: </p>
            <p>Timestamp: </p>
            <p>Transactions: </p>
            <p>Miner: </p>
            <p>Gas Used: </p>
            <p>Gas Limit: </p>
            <p>Base Fee Per Gas: </p>
            <p>Extra Data: </p>
            <p>Nonce: </p>
            <p>Hash: </p>
            <p>Parent Hash: </p>
          </div>
          <div className="block-values">
            {number && <p>{number}</p>}
            {timestamp && <p style={{fontSize: '17px'}}>🕓{timestamp}</p>}
            {transactions && (
              <p>
                <Link to={`/transactions/${number}`} style={{textDecoration: 'none',color: 'rgb(0, 110, 255)',backgroundColor:'black'}}>{transactions} transactions</Link>
              </p>
            )}
            {miner && <p>{miner}</p>}
            {gasUsed && <p>{gasUsed}</p>}
            {gasLimit && <p>{gasLimit}</p>}
            {baseFeepergas && <p>{baseFeepergas} ETH</p>}
            {extraData && <p>{extraData}</p>}
            {nonce && <p>{nonce}</p>}
            {hash && <p style={{fontSize: '12.3px',color:'yellow',fontWeight: 'bold',paddingTop: '3px'}}>{hash}</p>}
            {parentHash && <p style={{fontSize: '12.3px',color:'yellow',fontWeight: 'bold',paddingTop: '9px'}}>{parentHash}</p>}
          </div>
        </div>
      );
    }
    return null;
  };
    

  return (
    <div style={myStyle}>
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="#">Hexplorer</Navbar.Brand>
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <NavDropdown title="Network" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Ethereum Mainnet</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Sepolia Testnet
              </NavDropdown.Item>
              <NavDropdown.Item href="#action5">
                Goerli Testnet
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
      </Container>
    </Navbar>
    <Container>
    <Card style={{ height: '5rem',border: 'none', background: 'transparent'}}></Card>
    <Row>
    <Card style={{ width: '14rem',color: 'white',background: 'transparent',opacity: 0.7,alignItems: 'center' }}></Card>
    <Card style={{ width: '12rem',color: 'white',background: 'transparent',opacity: 0.7,alignItems: 'center' }}></Card>
    <Card style={{ width: '14rem',color: 'white',background: 'black',opacity: 0.8,alignItems: 'center',border: '1px solid white' }}>
      <Card.Img variant="top" src={process.env.PUBLIC_URL + '/logo1.png'} style={{height:'9rem', width: '9rem'}} />
      <Card.Body style={{fontSize: '18px'}}>
        <Card.Title style={{color:'gray'}} >ETHER PRICE</Card.Title>
        <Card.Text>
          {ethPrice}
        </Card.Text>
          {ethBtc} BTC
      </Card.Body>
    </Card>  
    <Card style={{ width: '3rem',color: 'white',background: 'transparent',opacity: 0.8,alignItems: 'center' }}></Card>
    <Card style={{ width: '14rem',color: 'white',background: 'black',opacity: 0.8,alignItems: 'center',border: '1px solid white' }}>
      <Card.Img variant="top" src={process.env.PUBLIC_URL + '/logo2.png'} style={{height:'9rem', width: '9rem'}} />
      <Card.Body>
        <Card.Title style={{color:'gray'}}>Total Number of Nodes</Card.Title>
        <Card.Text style={{fontWeight: 'bold',fontSize: '25px'}}>
          <p> </p>
          {totalNodes}
        </Card.Text>
      </Card.Body>
    </Card> 
    </Row>

    <Card style={{ height: '4rem', border: 'none', background: 'transparent'}}></Card>
        <Row>
        <Col>
            <Card border="dark" style={{ width: '38rem',height: '40rem',background: 'black',opacity: 0.9,color: 'white',border: '1px solid white'}}>
            <Card.Header style={{fontWeight: 'bold'}}>Latest Blocks</Card.Header>
            <Card.Body>
            <div className={Style.container__block}>
            {transaction.map((el, i) => (
              <div key={i + 1} className={Style.oneBlock}>
                <div className={Style.info}>
                  <p></p>
                  <div style={{display: 'flex',gap: '2rem'}}>
                    <img src={process.env.PUBLIC_URL + '/logo2.png'} style={{height: '40px', width:'40px'}}></img>            
                    <button class = "btn1" onClick={() => handleButtonClick({el})} id="btnval">{el}</button><br/><p></p>
                    <p style={{paddingTop: '2px',color: 'gray'}}>{sec[el]}</p><br/><p></p>
                  </div>
                </div>
              </div>))}
              </div>
            </Card.Body>
            </Card>
        </Col>
            <Col>
                <Card border="dark" style={{ width: '40rem',height: '40rem',background: 'black',opacity: 0.9,border: '1px solid white',color:'white' }}>
                <Card.Header style={{fontWeight: 'bold'}}>Block Details</Card.Header>
                <Card.Body style={{justifyContent: 'space-evenly'}}>
                {renderSecondDiv()}
                </Card.Body>
                </Card>
        </Col>
      </Row>
      </Container>
      <Card style={{ height: '10rem', border: 'none', background: 'transparent'}}></Card>

    </div>
  );
  } 


export default Navigation;
