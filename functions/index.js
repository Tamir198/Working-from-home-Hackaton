const functions = require("firebase-functions");
const express = require("express");
const firebase = require("firebase-admin");
const cors = require("cors");
const axios = require("axios")
const nodemailer = require('nodemailer');
require('dotenv').config();
var firebaseConfig = {
    apiKey: "apiKey",
    authDomain: "authDomain",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "629303831415",
    appId: "appId"
  };
firebase.initializeApp(firebaseConfig);
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
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
app.post("/email",(req,res)=>{
  console.log(req.body);
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9779cd2c46c663",
      pass: "c4dc43ab0ca337"
    }
  });
  
  var mailOptions = {
    from: 'yonatan.shtalhaim@gmail.com',
    to: 'yonatan.shtalhaim@gmail.com',
    subject: 'Sending Email using Node.js',
    text: JSON.stringify(req.body)
  };
  
  transport.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
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
    "topic": req.query.title,
    "settings":{
      "join_before_host":"true",
      "mute_upon_entry":"true",
      "approval_type":"2"
    }
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

app.get("/getUsers",(req,res)=>{

    
    var config = {
      method: 'get',
      url: 'https://api.zoom.us/v2/metrics/meetings/77522997928/participants?meetingid=77522997928',
      headers: { 
        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI4NmE5MThkYi1mYTQ2LTQwNDgtOGIwMS0xZjM4ZTNiOTViNzEifQ.eyJ2ZXIiOjcsImF1aWQiOiJmNDJiZWU0OThiYjA0OWVhZTMyNjEyMGNlNjU2ODlhYyIsImNvZGUiOiJYZUZJUXRGMEhqX3FnX3BYc01qUVI2d3N1dGpnaWl2b2ciLCJpc3MiOiJ6bTpjaWQ6eklCbG5mM0pROWVkWEg1OHZJMERRIiwiZ25vIjowLCJ0eXBlIjowLCJ0aWQiOjAsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6InFnX3BYc01qUVI2d3N1dGpnaWl2b2ciLCJuYmYiOjE2MjAzMTk2OTcsImV4cCI6MTYyMDMyMzI5NywiaWF0IjoxNjIwMzE5Njk3LCJhaWQiOiJDSzRldElhRVR4S0V5dTh2eHhOcHpnIiwianRpIjoiMTZhZjFkN2MtMjNiOS00NzMzLWI3MjAtZDE1ZWUwNGFiZmNiIn0.C3jcpFAP2a2r1gkoNLDADc5P23IZDLvTu5_MDo8CP9xA4x7DZ8wWg5My8iFkQpy_C-GFVqZBfq_dZa3o9uqd5g', 
        'Cookie': '_zm_chtaid=12; _zm_csp_script_nonce=PsWOZo1mSR2qddz581ItLQ; _zm_ctaid=QC5gJXdxQdi_LtFPh7-_ug.1620317451396.5325e03384ced982ecdd0259bbad59ac; _zm_currency=USD; _zm_mtk_guid=bbf83d0ac16c4f37ae534039d825147c; _zm_o2nd=2f05d1be1a8fee8bc42e6af8cd16b8f1; _zm_page_auth=us04_c_hLW_A4KrSsu4NS5luh3O-w; _zm_ssid=us04_c_40SFvRb-R8aPkRmnuYKfaQ; cred=ADE09C77E600AF9453552810A4FD80B0'
      }
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });



})
exports.api = functions.region("europe-west1").https.onRequest(app);