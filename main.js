//Telegram Bot token
const token = '6696750432:AAF0OuhPkRsnCiHM12JckDe6MbC0EhmwyXY';

//Telegram Send Message function
function SendMessage(ChatID, Message){
  const EncodedMessage = encodeURIComponent(Message);
  const ApiUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${ChatID}&text=${EncodedMessage}`;
  fetch(ApiUrl);
}

//Telegram Read Message function
function ReadMessage(ChatID){
  console.log("Message is being read");
  const url = `https://api.telegram.org/bot${token}/getUpdates?chat_id=${ChatID}`;
  fetch(url)
  .then((response) => {
    if(response.ok){
      console.log("Reponse.json: " + response.json);
      console.log("Response:" + response);
      //alert("passed 1");
      return response.json();
    }
    else{
      alert("Failed to take response");
    }
  })
  .then((data) => {
    if(data.result.length > 0){
      console.log("data Object: " + JSON.stringify(data));
      let lastUpdateArray = data.result.slice(-1);
      let lastText = lastUpdateArray[0].message.text;
      console.log(lastText);
      console.log(typeof lastText);
      console.log(isUrl(lastText));
      //alert("passed 2");     
      if(isUrl(lastText) === true){
        localStorage.setItem("outerSentUrl", lastText);//REMOVE IF IT DOESN'T WORK
        alert("New URL is set to: " + lastText);
      }
      else{
        alert("No URL was sent by parent!");
      }
    }
    else{
      alert("No Updates?");
    }
  })
  .catch((error) => {
    alert("Not working altogether; explanation: " + error);
  })
}



//Enter ChatID and save it button
const CodeInput = document.getElementById('EnteredCode');
const SaveID = document.getElementById('ZerothSubmit');
if(SaveID !== null){
  SaveID.addEventListener("click", () => {
    SaveName();
  });
}

//Send code to ChatID button
const CodeGen = document.getElementById('FirstSubmit');
const CodeVer = document.getElementById('SecondSubmit');
const Resend = document.getElementById('ResendButton');
if(CodeGen !== null){
  CodeGen.addEventListener("click", () => {
    CodeInput.disabled = false;
    CodeVer.disabled = false;
    CodeGen.disabled = false;
    Resend.disabled = false;
    SendCode();
  });
}


//Resend Code
if(Resend !== null){
  Resend.addEventListener("click", () =>{
    SendCode();
  });
}

//Check code entered button
if(CodeVer !== null){
  CodeVer.addEventListener("click", () => {
    CodeGen.disabled = true;
    CheckCode();
  })
}

//Set Policing state on button
const Active = document.getElementById('ON');
if(Active !== null){
  Active.addEventListener("click", () => {
    PoliceOn();
  })
}

//Set Policing state off button
const Inactive = document.getElementById('OFF');
if(Inactive !== null){
  Inactive.addEventListener("click", () => {
    PoliceOff();
  });
}

//Go back to home page button
const GoHomePage = document.getElementById('GoHomePage');
if(GoHomePage !== null){
  GoHomePage.addEventListener("click", () => {
    GoBack();
  });
}

//Request changing URL button
const RequestNewUrl = document.getElementById('ChangeUrl');
if(RequestNewUrl !== null){
  RequestNewUrl.addEventListener("click", () => {
    let outerIDSave = localStorage.getItem("outerIDSave");
    ReadMessage(outerIDSave);
  })
}


//Save the ParentChatID function
function SaveName(){
  const ParentChatID = document.getElementById('ParentChatID').value;
  localStorage.setItem("outerIDSave", ParentChatID);//MODIFY IF IT DOESN'T WORK
  localStorage.setItem("outerSentUrl", "");
  localStorage.setItem("TCOstate", false);
  localStorage.setItem("TCACstate", false);
  localStorage.setItem("HourlyCheckState", false);
  localStorage.setItem("outerRandomCode", "");
}

//Send the code function
function SendCode(){
  const RandomCode = Math.floor(100000 + Math.random()*900000);
  localStorage.setItem("outerRandomCode", RandomCode);//MODIFY IF IT DOESN'T WORK
  const WelcomeMessage = "Welcome to the Student Parental Tracker!\nHere's your code:\n";
  const WelcomePlusCode = WelcomeMessage + RandomCode.toString();
  let outerIDSave = localStorage.getItem("outerIDSave");//MODIFY IF IT DOESN'T WORK
  SendMessage(outerIDSave, WelcomePlusCode);
}

//Check the code function
function CheckCode(){
  const EnteredCode = document.getElementById('EnteredCode').value;
  let outerRandomCode = Number(localStorage.getItem("outerRandomCode"));//REMOVE IF THIS DOESN'T WORK
  if(Number(EnteredCode) === outerRandomCode){
    localStorage.setItem("OpenPage", "WebPolice.html");
    window.location.href = localStorage.getItem("OpenPage");
  }
  else{
    alert("You have entered the wrong code!\nPlease write the correct code or resend a new one!");
  }
}

//Turn police state on function
function PoliceOn(){
  localStorage.setItem("HourlyCheckState", true);//HourlyCheckState = true;
  localStorage.setItem("TCOstate", false);//TCOstate = true;
  localStorage.setItem("TCACstate", true);
  localStorage.setItem("OpenPage", "WebPoliceOn.html");
  let outerIDSave = localStorage.getItem('outerIDSave');//MODIFY IF IT DOESN'T WORK
  ReadMessage(outerIDSave);
}

//Turn police state off function
function PoliceOff(){
  localStorage.setItem("HourlyCheckState", true);//HourlyCheckState = true;
  localStorage.setItem("TCOstate", true);
  localStorage.setItem("TCACstate", false);//TCACstate = true;
  localStorage.getItem("OpenPage", "WebPoliceOff.html");
  let outerIDSave = localStorage.getItem('outerIDSave');//MODIFY IF IT DOESN'T WORK
  ReadMessage(outerIDSave);
}



//Check which tab is being accessed function (without policing)
function TabCheckOnly(){
  var TCOstate = localStorage.getItem("TCOstate");//REMOVE IF IT DOESN'T WORK 
  if(TCOstate === "true"){
    TCOstate = true;
  }
  let outerSentUrl = localStorage.getItem("outerSentUrl");
  if(TCOstate === true && outerSentUrl !== ""){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentUrl = tabs[0].url;
      var ObservedUrl = currentUrl;
      var targetUrl = localStorage.getItem("outerSentUrl");//MODIFY IF IT DOESN'T WORK
      var notchangewebsite = false;
      var innerstring = targetUrl;
      var outerstring = currentUrl;
      var innerlength = targetUrl.length;
      if(currentUrl.length < targetUrl.length){
        innerlength = currentUrl.length;
        innerstring = currentUrl; 
        outerstring = targetUrl;
      }
      for(let i = 0; i <= Math.abs(currentUrl.length - targetUrl.length); i++){
        for(let j = 0; j < innerlength; j++){
          if(outerstring[j] === innerstring[j + i] && j === innerlength - 1){
            notchangewebsite = true; 
          }
          else if(outerstring[j] !== innerstring[j + i]){
            break;
          }
        }
      }
      if(notchangewebsite === false){
        alert("You have left the page and your parents have been notified");
        let outerIDSave = localStorage.getItem("outerIDSave");//REMOVE IF IT DOESN'T WORK
        SendMessage(outerIDSave, "Student has attempted to leave studying to the following website:\n" + ObservedUrl);
      }
    });
  }
}

//Hourly check function (to notify parent that the extension is still downloaded and operational(student hasn't delted it))
function HourlyCheck(){
  let HourlyCheckState = localStorage.getItem("HourlyCheckState");//REMOVE IF IT DOESN'T WORK//The value is a string. Convert to boolean
  if(HourlyCheckState === "true"){
    HourlyCheckState = true;
  }
  //alert("HourlyCheckOutside: " + HourlyCheckState);
  if(HourlyCheckState === true){
    let outerIDSave = localStorage.getItem("outerIDSave");
    //alert("HourlyCheckInside!!!!!!");
    SendMessage(outerIDSave, "This is the hourly check.");
  }
}

//Tab check and change function(Policing state is off)
function TabCheckAndChange(){
  var TCACstate = localStorage.getItem("TCACstate");
  if(TCACstate === "true"){
    TCACstate = true;
  }
  let outerSentUrl = localStorage.getItem("outerSentUrl");
  if(TCACstate === true && outerSentUrl !== ""){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentUrl = tabs[0].url;
      var ObservedUrl = currentUrl;
      var targetUrl = localStorage.getItem("outerSentUrl");//MODIFY IF IT DOESN'T WORK
      var notchangewebsite = false;
      var innerstring = targetUrl;
      var outerstring = currentUrl;
      var innerlength = targetUrl.length;
      if(currentUrl.length < targetUrl.length){
        innerlength = currentUrl.length;
        innerstring = currentUrl; 
        outerstring = targetUrl;
       }
    //console.log(Math.abs(currentUrl.length - targetUrl.length));
      for(let i = 0; i <= Math.abs(currentUrl.length - targetUrl.length); i++){
        for(let j = 0; j < innerlength; j++){
          if(outerstring[j] === innerstring[j + i] && j === innerlength - 1){
            notchangewebsite = true; 
            //console.log("IT'S TRUE");
          }
          else if(outerstring[j] !== innerstring[j + i]){
            //console.log("How did it break?");
            break;
          }
        }
      }
      if(notchangewebsite === false){
        chrome.tabs.update(tabs[0].id, { url: targetUrl });
        let outerIDSave = localStorage.getItem("outerIDSave");//REMOVE IF IT DOESN'T WORK
        SendMessage(outerIDSave, "Student has attempted to leave studying to the following website:\n" + ObservedUrl);
        console.log(tabs[0].url);
      }
    });
    //alert("TCAC passed with true");
  }
  //alert("TCAC passed");
}

//Go back to home page function
function GoBack(){
  localStorage.setItem("HourlyCheckState", false);
  localStorage.setItem("TCACstate", false);
  localStorage.setItem("TCOstate", false);
  localStorage.setItem("outerIDSave", "");
  localStorage.setItem("outerRandomCode", "");
  localStorage.setItem("OpenPage", "BaseUI.html");
  window.location.href = localStorage.getItem("OpenPage");
}



//Checking if the parent has sent a URL
function isUrl(url){
  try{
    new URL(url);
    return true;
  }
  catch(error){
    return false;
  }
}

//Periodically repeat functions

setInterval(function(){TabCheckOnly();}, 5000);
setInterval(function(){TabCheckAndChange();}, 5000);
setInterval(function(){HourlyCheck();}, 60*60*1000);

//Page defaulter
window.addEventListener("load", function(){
  let lastPage = localStorage.getItem("OpenPage");
  if(lastPage){
      window.location.href = lastPage;
  }
});
