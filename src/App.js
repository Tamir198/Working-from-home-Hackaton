import React, { useState, useEffect } from "react"
import './App.css';
import axios from "axios";
import NewMeetingPopUp from "./components/NewMeetingPopUp"
// eslint-disable-next-line
import style from "bootstrap/dist/css/bootstrap.css";
import { Button } from "@material-ui/core";
function App() {
  const [user, setUser] = useState({})
  const [userToken, setUserToken] = useState("");
  const [newMeetPop, setNewMeetPop] = useState(false);
  const [meetingData, setMeetingData] = useState();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log(code);
    //setMeetingData({id:"3132119",password:"1234",topic:"hello"})
    if (!code)
      return;

    axios.get("http://localhost:5001/hackathon-mta/europe-west1/api/getToken", { params: { code } })
      .then(res => {
        const token = res.data.access_token;
        console.log(token);
        setUserToken(token);
        axios.get("http://localhost:5001/hackathon-mta/europe-west1/api/users", { params: { token } })
          .then(res => {
            setUser(res.data);
            console.log(res.data.data)
          })

          .catch(e => console.log(e));
      })
      .catch(e => console.log(e))


    // const getTokenUrl="https://zoom.us/oauth/token/"
    // axios.post(getTokenUrl,null,{params:{grant_type:"authorization_code",code:code,redirect_uri:"https://hackathon-mta.web.app/"},
    //   headers:{"Accept-Encoding":"gzip, deflate, br","accept":"*/*","Access-Control-Allow-Origin": "*","Content-Type":"application/json;charset=UTF-8","Authorization":"Basic eklCbG5mM0pROWVkWEg1OHZJMERROmNKNVowMUtjTjB1bXk4c1N3SHFac3ZkdnpiWFNvQW9H"}}).then(res=>console.log(res))
    // .catch(e=>console.log(e))
  }, [])

  const createRoom = () => {
    setNewMeetPop(true);

  }

  const handleWhatsApp = () => {
    const whatsAppLink = `https://wa.me/?text=${meetingData.join_url}`;
    window.open(whatsAppLink, '_blank');
    //window.location.assign(whatsAppLink);
  }

  return (
    <div className="app">
      <div className="header">
        <img id="wolf" src="https://mtahack.com/images/logos/hacks/logo-small.png" alt="mta"/>
        <h1>איזי זום</h1>
      </div>
    
      {user.first_name && <h1> שלום: {user.first_name}</h1>}
      {user.first_name &&
       <p style={{fontSize:"1.6rem",margin:"auto",borderBottom:"1px solid black"}}>מה תרצה/י לעשות?</p>}
      <div className="buttons">
        <a href="https://zoom.us/oauth/authorize?response_type=code&client_id=zIBlnf3JQ9edXH58vI0DQ&redirect_uri=https://hackathon-mta.web.app/">
          {!userToken && 
          <button>התחברות לזום</button>}
        </a>

        {userToken && !meetingData && <button onClick={() => createRoom()}>צור חדר</button>}
        {meetingData &&
          <Button color="primary" variant="contained" onClick={handleWhatsApp}><div className="whatsappButton"> שלח קישור לשיעור
      <i class="fa fa-whatsapp fa-lg" aria-hidden="true"></i>
          </div>
          </Button>}
        {meetingData && 
        <iframe id="iframe" title="zoom buttons control" src={`http://127.0.0.1:9999/index.html?roomid=${meetingData.id}&roomname=${meetingData.topic}&roompwd=${meetingData.password}`} width="300px" height="600px"></iframe>}
      </div>
      <NewMeetingPopUp setMeetingData={setMeetingData} newMeetPop={newMeetPop} setNewMeetPop={setNewMeetPop} userToken={userToken} />
    </div>
  );
}

export default App;
