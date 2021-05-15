import React, {useState, useEffect} from 'react';
import socketIOClient from 'socket.io-client';
import Login from './components/Login';

//url to server
const ENDPOINT= "http://127.0.0.1:8888";

function App() {

  const [response, setResponse]=useState("");

  useEffect(()=>{
    const socket=socketIOClient.connect(ENDPOINT,{transports:['websocket']});

    socket.on("joined",(message)=>{
    setResponse(message);
    console.log("welcome: "+message);
  });
  
  },[]);
  return (
    <div className="App">
      <Login/>
    <h1>{response}</h1>
    </div>
  );
}

export default App;
