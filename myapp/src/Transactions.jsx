import * as React from 'react';
import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
// import {Link} from "react-router-dom";
import './App.css'
import { useParams } from 'react-router-dom';
const { Alchemy, Network } = require("alchemy-sdk");


const setting = {
  apiKey: "REPLACE_THIS_WITH_YOUR_API_KEY",
  Network: Network.ETH_MAINNET,
};


const provider = new Alchemy(setting);


export default function Tran() {
  const myStyle = {
    backgroundImage: `url(/back1.jpg)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',}

    const [showSecondDiv, setShowSecondDiv] = useState(false);
    const [to, setTo] = useState('');
    const [from, setFrom] = useState('');
    const [gasUsed,setGasused] = useState('');
    const [confirmations, setConfirmations] = useState('');
    const [transactionIndex, setTransactionIndex] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [logs, setLogs] = useState([]); 
    const [blockNumber, setBlockNumber] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [cummulativeGasUsed, setCummulativeGasUsed] = useState('');
    const [effectiveGasPrice, setEffectiveGasPrice] = useState('');
    const [transactions1,setTransactions] = useState([]);
    const {number} = useParams();

    const handleButtonClick = (x) => {
      let i =0;
      setShowSecondDiv(true);
      if(i<1){
      gettransactionReceipt(x);   
      i++;} 
    };

    getTransactions();
    async function getTransactions(){
      let tra = [];
      const r = await provider.core.getBlockWithTransactions(number);
      for(let i=0;i<r.transactions.length;i++){
      tra.push(r.transactions[i].hash);
    }
      
      setTransactions(tra);

    }

    async function gettransactionReceipt(x){
      const r = await provider.core.getTransactionReceipt(x);
      console.log(r);
      setFrom(r.from);
      setTo(r.to != null ? r.to: "Null");
      setBlockNumber(r.blockNumber);
      setGasused(r.gasUsed._hex);
      setConfirmations(r.confirmations);
      setCummulativeGasUsed(parseInt(r.cumulativeGasUsed._hex, 16))
      setEffectiveGasPrice(parseInt(r.effectiveGasPrice._hex, 16))
      setLogs(r.logs.length);
      setStatus(r.status);
      setTransactionHash(r.transactionHash);
      setTransactionIndex(r.transactionIndex);
      setType(r.type);
    }
  
    const renderSecondDiv = () => {
      if (showSecondDiv) {
        return (
          <div class="block-info">
            <div class="block-label1" style={{fontSize: '18px'}}>
            <p>From: </p>
            <p >To: </p>
            <p>Confirmations: </p>
            <p>Transaction Index: </p>
            <p>Gas Used: </p>
            <p>Transaction Hash: </p>
            <p>Logs: </p>
            <p>Block Number: </p>
            <p>Type: </p>
            <p>Status: </p>
            <p>Cumulative Gas Used: </p>
            <p>Effective Gas Price: </p>
            </div>
            <div className="block-values1">
              {from && <p>{from}</p>}
              {to && <p style={{paddingTop: '5px'}}>{to}</p>}
              {confirmations &&<p style={{paddingTop: '2px'}}>{confirmations}</p>}
              {transactionIndex && <p style={{paddingTop: '2px'}}>{transactionIndex}</p>}
              {gasUsed && <p style={{paddingTop: '2px'}}>{gasUsed}</p>}
              {transactionHash && <p style={{fontSize: '12.3px',color:'yellow',fontWeight: 'bold',paddingTop: '10px'}}>{transactionHash}</p>}
              {logs && <p style={{paddingTop: '5px'}}>{logs}</p>}
              {blockNumber && <p>{blockNumber}</p>}
              {type && <p style={{paddingTop: '7px'}}>{type}</p>}
              {status && <p>{status}</p>}
              {cummulativeGasUsed && <p style={{paddingTop: '10px'}}>{cummulativeGasUsed}</p>}
              {effectiveGasPrice && <p style={{paddingTop: '23px'}}>{effectiveGasPrice}</p>}
            </div>
          </div>
        );
      }
      return null;
    };


  return (
    <div style={myStyle}>
    <Container>
  <Card style={{ height: '4rem', border: 'none', background: 'transparent'}}></Card>
        <Row>
        <Col>
            <Card border="dark" style={{ width: '38rem',height: '40rem',background: 'black',opacity: 0.9,color: 'white',border: '1px solid white'}}>
            <Card.Header style={{fontWeight: 'bold'}}>Transactions</Card.Header>
            <Card.Body>
            <div class="card1">
          {transactions1.map((hash, index) => (
            <div key={index}>
              <button class = "btn1" onClick={() => handleButtonClick(hash)} id="btnval">{hash}</button>
            <hr className="hash-divider" />   
            </div>         
          ))}
            </div>
            </Card.Body>
            </Card>
        </Col>
            <Col>
                <Card border="dark" style={{ width: '40rem',height: '40rem',background: 'black',opacity: 0.9,border: '1px solid white',color:'white' }}>
                <Card.Header style={{fontWeight: 'bold'}}>Transaction Details</Card.Header>
                <Card.Body style={{justifyContent: 'space-evenly'}}>
                {renderSecondDiv()}
                </Card.Body>
                </Card>
        </Col>
      </Row>
      </Container>
      <Card style={{ height: '5.7rem', border: 'none', background: 'transparent'}}></Card>
    </div>
  );
}
