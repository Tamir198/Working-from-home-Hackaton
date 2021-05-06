const functions = require("firebase-functions");
const express = require("express");
const firebase = require("firebase-admin");
const cors = require("cors");
const axios = require("axios")
var firebaseConfig = {
    apiKey: "AIzaSyAlkPvHFznNHQEI6BeH2euNT7GDEwnkx80",
    authDomain: "hackathon-mta.firebaseapp.com",
    projectId: "hackathon-mta",
    storageBucket: "hackathon-mta.appspot.com",
    messagingSenderId: "629303831415",
    appId: "1:629303831415:web:486fa6efa35fa37c274f72"
  };
firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
const app = express();
app.use(cors());
app.get("/getToken",(req,res)=>{
    //console.log("DEBUG = ",req.query)
    var config = {
        method: 'post',
        url: `https://zoom.us/oauth/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=https://hackathon-mta.web.app/`,
        headers: { 
          'Authorization': 'Basic eklCbG5mM0pROWVkWEg1OHZJMERROmNKNVowMUtjTjB1bXk4c1N3SHFac3ZkdnpiWFNvQW9H',"Access-Control-Allow-Origin": "*" ,
          'Cookie': '_zm_chtaid=624; _zm_csp_script_nonce=PsWOZo1mSR2qddz581ItLQ; _zm_ctaid=60YVT54HSxOqmScoJIpnkA.1620293674043.1d315d4a6f922472c000bffe17b8c12c; _zm_currency=USD; _zm_mtk_guid=bbf83d0ac16c4f37ae534039d825147c; _zm_o2nd=2f05d1be1a8fee8bc42e6af8cd16b8f1; _zm_page_auth=us04_c_hLW_A4KrSsu4NS5luh3O-w; _zm_ssid=us04_c_40SFvRb-R8aPkRmnuYKfaQ; cred=CE53421E8B03EA57D1675B606573B1E7'
        }
      };
      
      axios(config)
      .then(function (response) {
          const data=JSON.stringify(response.data);
        //console.log(JSON.stringify(response.data));
        res.send(data);
      })
      .catch(function (error) {
        console.log(error);
      });
})

app.get("/users",async (req,res)=>{
  let data={};
  data=await axios.get("https://api.zoom.us/v2/users",{headers:{"Authorization":`Bearer ${req.query.token}`}}).then(res=>{
    //console.log(res.data)
    return res.data.users[0];
  })
  .catch(e=>console.log(e));
  res.send(data);
})

app.get("/createRoom",(req,res)=>{
  //console.log("DEBUG = ",req.query);
  var data = JSON.stringify({
    "topic": req.query.title
  });
  var config = {
    method: 'post',
    url: 'https://api.zoom.us/v2/users/qg_pXsMjQR6wsutjgiivog/meetings',
    headers: { 
      'Authorization': `Bearer ${req.query.userToken}`, 
      'Content-Type': 'application/json', 
      'Cookie': '_zm_csp_script_nonce=PsWOZo1mSR2qddz581ItLQ; _zm_currency=USD; _zm_mtk_guid=bbf83d0ac16c4f37ae534039d825147c; _zm_o2nd=2f05d1be1a8fee8bc42e6af8cd16b8f1; _zm_page_auth=us04_c_hLW_A4KrSsu4NS5luh3O-w; _zm_ssid=us04_c_40SFvRb-R8aPkRmnuYKfaQ; cred=21DF8CBAA48DBE6FBC4607BFF9C1FA9B'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    //console.log(JSON.stringify(response.data));
    res.send(response.data)
  })
  .catch(function (error) {
    console.log(error);
  });

  // console.log("DEBUG = ",req.query)
  // axios.post("https://api.zoom.us/v2/users/qg_pXsMjQR6wsutjgiivog/meetings",{topic:req.query.topic},{headers:{Authorization:`Bearer ${req.query.userToken}`}})
  // .then(data=>res.send(data))
  // .catch(e=>console.log(e));
})

exports.api = functions.region("europe-west1").https.onRequest(app);