//ACTUAL CODE STARTS HERES//

//Keep the last opened page DEFAULT

//chrome.storage.local.set({lastPage: 'BaseUI.html'});
//chrome.storage.local.get('lastPage', function(data) { if (data.lastPage) { window.location.href = data.lastPage; } });
//Telegram bot token
const token = '6696750432:AAF0OuhPkRsnCiHM12JckDe6MbC0EhmwyXY';

function SendMessage(ChatID, Message){
  const EncodedMessage = encodeURIComponent(Message);
  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${ChatID}&text=${EncodedMessage}`;
  fetch(url)
  alert(Message + " sent");
}


function ReadMessage(ChatID){
  console.log("Message is being read");
  const url = `https://api.telegram.org/bot${token}/getUpdates?chat_id=${ChatID}&offset=-1`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    if(data.ok && data.result.length > 0){
      var message = data.result[0].message.txt;
      alert(message);
      if(isUrl(message.txt) === true){
        outerSentUrl = message.txt; 
        SendMessage(outerIDSave, "The url has been changed");
      }
      else{
        SendMessage(outerIDSave, "Please enter a valid URL");
      }
    }
  })
  .catch((error) => {
      console.error(error);
      alert("something happened in the ReadMessage function");
    }
  )
}
//Organizing sending requests
//Test for buttons (CSP doesn't allow them to be in the html file (onclick))
const secondinput= document.getElementById('EnteredCode');
const zeroth = document.getElementById('ZerothSubmit');
if(zeroth !== null){
  zeroth.addEventListener("click", () => {
    SaveName();
    //console.log("SaveName is pressed");
  });
}
const first = document.getElementById('FirstSubmit');
if(first !== null){
  first.addEventListener("click", () => {
    secondinput.disabled = false; 
    second.disabled = false;
    third.disabled = false;
    //console.log("SendCode is pressed");
    SendCode();
  });
}
const second = document.getElementById('SecondSubmit');
if(second !== null){
  second.addEventListener("click", () => {
    //console.log("CheckCode is pressed");
    CheckCode();
  });
}
const third = document.getElementById('ResendButton');
if(third !== null){
  third.addEventListener("click", () => {
    //console.log("ResendButton is pressed");
    SendCode();
  });
}
const TurnedOn = document.getElementById('ON');
if(TurnedOn !== null){
  TurnedOn.addEventListener("click", () => {
    //chrome.storage.local.set({lastPage: 'WebPoliceOn.html'});
    //console.log("ON IS pressed");
    PoliceOptionOn();
  });
}
const TurnedOff = document.getElementById('OFF');
if(TurnedOff !== null){
  TurnedOff.addEventListener("click", () => {
    //console.log("OFF IS pressed");
    //chrome.storage.local.set({lastPage: 'WebPoliceOff.html'});
    PoliceOptionOff();
  });
}

const GoHomePage = document.getElementById('GoHomePage');
if(GoHomePage !== null){
  GoHomePage.addEventListener("click", () => {
    //chrome.storage.local.set({lastPage: 'BaseUI.html'});
    //console.log("GoHomePage is pressed");
    GoBack();
  });
}

const ChangeUrl = document.getElementById('ChangeUrl');
if(ChangeUrl !== null){
  ChangeUrl.addEventListener("click", () => {
    //console.log("ChangeUrl is pressed");
    ReadMessage(outerIDSave);
  });
}
//Global variables that determine function states

var outerSentUrl;
var outerIDSave;
var outerRandomCode;
var TCOtime;
var TCACtime;
var HourlyCheck;

//function that takes name and then calls send code function

function SaveName(){
  const ParentChatID = document.getElementById('ParentChatID').value;
  outerIDSave = ParentChatID;
  //console.log("SaveName is called");
}

function SendCode(){
  const RandomCode = Math.floor(100000 + Math.random()*900000);
  outerRandomCode = RandomCode;
  const WelcomeMessage = "Welcome to the Student Parental Tracker \n Here's your code: \n";
  const WelcomePlusCode = WelcomeMessage + RandomCode.toString();
  SendMessage(outerIDSave, WelcomePlusCode);
  //console.log("SendCode is called");
}

//function that checks code

function CheckCode(){
  const EnteredCode = document.getElementById('EnteredCode').value;
  if(Number(EnteredCode) === outerRandomCode){
    window.location.href = 'WebPolice.html';
    //console.log("CheckCode is called with right code");
  }
  else{
    alert("You have entered the wrong code! Please reenter the code correctly or resend the code!");
    //console.log("CheckCode is called with wrong code");
  }
}

//Police Mode toggles

function PoliceOptionOff(){
  //Hourly Check (To confirm that the student has not delted the extension)
  ReadMessage(outerIDSave);
  //outerSentUrl = 'https://github.com/';
  //alert(outerSentUrl);
  window.location.href = 'WebPoliceOff.html';
  HourlyCheck = setInterval(function(){SendMessage(outerIDSave, "This is the hourly check");}, 5000);
  alert("After Hourly");
  clearInterval(TCACtime);
  //TabCheckOnly();
  //continue to do this every five seconds
  TCOtime = setInterval(function(){TabCheckOnly();}, 5000);
  SendMessage(outerIDSave, "Study Police Option is off");
}

function PoliceOptionOn(){
  //ReadMessage(outerIDSave);
  outerSentUrl = 'https://github.com/';
  SendMessage(outerIDSave, "Study Police Option is On");
  window.location.href = 'WebPoliceOn.html';
  HourlyCheck = setInterval(function(){SendMessage(outerIDSave, "This is the hourly check");}, 5000);
  TCACtime = setInterval(function(){TabCheckAndChange();}, 5000);
  clearInterval(TCOtime);
}

//function that checks the tab and changes it (Police mode ON)

function TabCheckAndChange(){
    //ReadMessage(outerIDSave);
    alert("Tab And Check And Change activated");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentUrl = tabs[0].url;
      var ObservedUrl = currentUrl;
      var targetUrl = outerSentUrl;
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
        SendMessage(outerIDSave, "Student has attempted to leave studying to the following website: " + ObservedUrl);
        console.log(tabs[0].url);
      }
    });
  }

//function that checks the URL and reports only


function TabCheckOnly(){
    //ReadMessage(outerIDSave);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentUrl = tabs[0].url;
      var ObservedUrl = currentUrl;
      var targetUrl = outerSentUrl;
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
        alert("You have left the page and your parent's have been notified");
        SendMessage(outerIDSave, "Student has attempted to leave studying to the following website: " + ObservedUrl);
        //console.log(tabs[0].url);
      }
    });
  }


//Url checker


function isUrl(url){
  try{
    new URL(url);
    return true;
  }
  catch(error){
    return false;
  }
}


//Go to home page


function GoBack(){
  window.location.href = 'BaseUI.html';
  clearInterval(HourlyCheck);
  clearInterval(TCACtime);
  clearInterval(TCOtime);
}


//ACTUAL CODE ENDS HERE//
setInterval(function(){SendMessage(1303280167, "This is the hourly check");}, 5000);
