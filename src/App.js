import React , {useState,useEffect} from "react"
import './App.css';
import axios from "axios";
import NewMeetingPopUp from "./components/NewMeetingPopUp"
import style from "bootstrap/dist/css/bootstrap.css";
import { Alert } from "bootstrap";
function App() {
  const [user,setUser]=useState({})
  const [userToken,setUserToken]=useState("");
  const [newMeetPop,setNewMeetPop]=useState(false);
  const [meetingData,setMeetingData]=useState();
  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log(code);
    if(!code)
      return;

      axios.get("http://localhost:5001/hackathon-mta/europe-west1/api/getToken",{params:{code}})
      .then(res=>
        {
          const token=res.data.access_token;
          console.log(token);
          setUserToken(token);
          axios.get("http://localhost:5001/hackathon-mta/europe-west1/api/users",{params:{token}})
          .then(res=>{
            setUser(res.data);
            console.log(res.data.data)
          })
          
          .catch(e=>console.log(e));
      })
      .catch(e=>console.log(e))
      

    // const getTokenUrl="https://zoom.us/oauth/token/"
    // axios.post(getTokenUrl,null,{params:{grant_type:"authorization_code",code:code,redirect_uri:"https://hackathon-mta.web.app/"},
    //   headers:{"Accept-Encoding":"gzip, deflate, br","accept":"*/*","Access-Control-Allow-Origin": "*","Content-Type":"application/json;charset=UTF-8","Authorization":"Basic eklCbG5mM0pROWVkWEg1OHZJMERROmNKNVowMUtjTjB1bXk4c1N3SHFac3ZkdnpiWFNvQW9H"}}).then(res=>console.log(res))
    // .catch(e=>console.log(e))
  },[])

  const createRoom=()=>{
    setNewMeetPop(true);
    
  }
  return (
    <div className="app">
      <h1>Hello hackathon</h1>
      {user.first_name && <h1>Hello {user.first_name}</h1>}
      <div className="buttons">
      <a href="https://zoom.us/oauth/authorize?response_type=code&client_id=zIBlnf3JQ9edXH58vI0DQ&redirect_uri=https://hackathon-mta.web.app/">
      <button>היכנס למערכת</button>
      </a>
      

      <button onClick={()=>createRoom()}>צור חדר</button>
      </div>

      <NewMeetingPopUp setMeetingData={setMeetingData} newMeetPop={newMeetPop} setNewMeetPop={setNewMeetPop} userToken={userToken} />
    </div>
  );
}

export default App;
