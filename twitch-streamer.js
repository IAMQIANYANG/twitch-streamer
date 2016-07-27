/**
 * Created by pandachain on 2016-07-26.
 */

var users = ["comster404", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

var userInfo = [];

var getUserInfo = function(){
  users.forEach(function(user){
    var currentObj = {};
    var url = 'https://api.twitch.tv/kraken/streams/' + user;
    currentObj.url = url;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function(){
      if(request.status >= 200 && request.status < 400) {
        var currentResult = JSON.parse(request.responseText);
        currentObj.name=user;
        currentObj.status=currentResult.stream;
        if(currentObj.status === null) {
          currentObj.status = "offline";
          currentObj.url = 'https://api.twitch.tv/kraken/channels/' + user;
          getUserInfoOffline(currentObj);
        } else{
          currentObj.logo = currentResult.stream.channel.logo;
          currentObj.game = currentResult.stream.channel.game;
          currentObj.streamInfo = currentResult.stream.channel.status;
          currentObj.status = "online";
          userInfo.push(currentObj);
          displayInfo(currentObj.logo, currentObj.name, currentObj.game + ":" + currentObj.streamInfo);
        }
      } else if (request.status > 400) {
        currentObj.name=user;
        currentObj.status = "noUser";
        userInfo.push(currentObj);
        displayInfo("https://cdn4.iconfinder.com/data/icons/emoticons-4/100/smiley-7-512.png", currentObj.name, currentObj.status);

      }
    };

    request.onerror = function(){
      console.log("server error");
    };

    request.send();
  });

};

var getUserInfoOffline = function(obj) {
  if (obj.status === "offline") {
    var url = obj.url;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        var currentResult = JSON.parse(request.responseText);
        obj.logo = currentResult.logo;
        userInfo.push(obj);
        displayInfo(obj.logo, obj.name, obj.status);
      }
    };

    request.onerror = function () {
      console.log("server error");
    };

    request.send();
  }
};


var displayInfo = function (image, name, status) {

  var displayArea = document.querySelector("#userInfo");
  var displayImage = '<img src="' + image + '">';
  var displayName = '<h4>' + name + '</h4>';
  var displayStatus = '<p>' + status + '</p>';
  var link = "https://www.twitch.tv/" + name;
  if (status === "offline") {
    displayArea.innerHTML += '<div class="user offline">'
      + '<a href="' + link + '" target="_blank">'
      + displayImage + displayName + displayStatus + '</div></a>'
  } else if (status === "noUser") {
    displayArea.innerHTML += '<div class="user noUser">' + displayImage + displayName + '<p>User has deleted the account or user never existed.</p>' + '</div>'
  } else {
    displayArea.innerHTML += '<div class="user online">'
      + '<a href="' + link + '"  target="_blank">'
      + displayImage + displayName + displayStatus + '</div></a>'
  }
  
};


var radioButton = ["all", "on", "off"];

var checkUncheck = function(){
  var filters = document.querySelectorAll(".filter");
  for (var i = 0; i < filters.length; i++) {
    filters[i].addEventListener('click', checkResponse)
  }

  function checkResponse(){
    var clickedId = this.id;
    radioButton.forEach(function(id){
      if(id !== clickedId) {
        document.getElementById(id).checked = false;
      } else if(id === clickedId) {
        document.getElementById(id).checked = true;
      }
    })
  }
  
};



var allUsers = function() {
  checkUncheck();
  var allUserDivs = document.querySelectorAll(".user");
  allUserDivs.forEach(function (div) {
    div.style.cssText = "display: block";
  })
};

var onlineUsers = function() {
  allUsers();
  checkUncheck();
  var offlineDivs = document.querySelectorAll(".offline");
  var noUserDivs =  document.querySelectorAll(".noUser");
  offlineDivs.forEach(function(div){
    div.style.cssText = "display: none";
  });
  noUserDivs.forEach(function(div){
    div.style.cssText = "display: none";
  })
};

var offlineUsers = function() {
  allUsers();
  checkUncheck();
  var onlineDivs = document.querySelectorAll(".online");
  var noUserDivs =  document.querySelectorAll(".noUser");
  onlineDivs.forEach(function(div){
    div.style.cssText = "display: none";
  });
  noUserDivs.forEach(function(div){
    div.style.cssText = "display: none";
  })
};


getUserInfo();