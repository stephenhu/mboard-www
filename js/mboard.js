/* mboard.js */

function gameURL() {
  return window.location.origin + GAMES;
} // gameURL

function wsURL(service) {
  return WS + window.location.host + service;
} // wsURL

function calcScore(data) {

  var keys = Object.keys(data);
  
  var total = 0;

  for(var i = 0; i < keys.length; i++) {
    total = total + data[keys[i]];
  }

  return total;

} // calcScore


function gameClockToString(c, mins) {

  var delta   = mins * 60 - c.seconds;
  var ndelta  = delta - 1;
  var seconds = delta % 60;
  var minutes = Math.floor(delta/60);
  var tenths  = 10 - c.tenths;

  if(delta == 60) {

    if(minutes == 1) {

      if(tenths == 10) {
        return minutes + ":00";
      } else {
        return ndelta + "." + tenths;
      }
      
    } else {
      return minutes + ":59." + tenths;
    }
    
    return str;

  } else if(minutes == 0) {

    if(ndelta == -1) {
      return "0.0";
    } else if(tenths == 10) {
      return delta + ".0";
    } else {
      return ndelta + "." + tenths;
    }
    
  } else if(seconds == 0) {
    return minutes + ":00";
  } else if(seconds < 10 && seconds >= 0) {
    return minutes + ":0" + seconds;
  } else {
    return minutes + ":" + seconds;
  }

} // gameClockToString


function shotClockToString(c, secs) {

  return secs - c.seconds;
  
} // shotClockToString


function updateScore(team, val) {

  if(team == HOME) {
    document.getElementById("homeScore").innerHTML = val;
  } else {
    document.getElementById("awayScore").innerHTML = val;
  }
  
} // updateScore


function updateTimeouts(team, val) {
  
  var f = null;

  if(team == HOME) {
    f = document.getElementById("homeTimeouts");
  } else {
    f = document.getElementById("awayTimeouts");
  }

  f.innerHTML = val;
  
} // updateTimeouts
  

function updateFouls(team, val) {

  var f = null;

  if(team == HOME) {
    f = document.getElementById("homeFoul");
  } else {
    f = document.getElementById("awayFoul");
  }

  f.innerHTML = val;

} // updateFouls


function updatePossession(team) {
  
  if(team == HOME) {

    document.getElementById("homePos").className = "mdc-layout-grid__cell--span-6 possession";
    document.getElementById("awayPos").className = "mdc-layout-grid__cell--span-6 shade";
    
    document.getElementById("homeTeam").className = "align-center";
    document.getElementById("awayTeam").className = "primary-light align-center";

  } else {

    document.getElementById("homePos").className = "mdc-layout-grid__cell--span-6 shade";
    document.getElementById("awayPos").className = "mdc-layout-grid__cell--span-6 possession";

    document.getElementById("homeTeam").className = "primary-light align-center";
    document.getElementById("awayTeam").className = "align-center";
  }

} // updatePossession


function updatePeriod(val) {

  var p   = parseInt(val);
  var str = PERIODS[0];

  if(p > 3) {
    str = "OT" + (p - 3);
  } else {
    str = PERIODS[p];
  }

  document.getElementById("period").innerHTML = str;

} // updatePeriod


function updateClock(game, shot, mins, secs) {

  document.getElementById("shotClock").innerHTML = shotClockToString(shot, secs);
  document.getElementById("gameClock").innerHTML = gameClockToString(game, mins);

} // updateClock


function updateTeam(team, data) {

  if(data == null || data == undefined ||
    data == "") {
    return;
  }

  var span = document.createElement("span");

  span.className = "fa fa-photo";
  
  if(team == HOME) {
    
    var h = document.getElementById("homeTeam");
    h.innerHTML = data.name + "  ";
    span.setAttribute("id", "homeLogo");
    h.appendChild(span);

  } else if(team == AWAY) {
    
    var a = document.getElementById("awayTeam");
    a.innerHTML = data.name + "  ";
    span.setAttribute("id", "awayLogo");
    a.appendChild(span);
  
  }

} // updateTeam


function updateDisplay(data) {

  if(data == null || data == undefined ||
    data == "") {
    return;
  }

  updatePeriod(data.period);

  if(data.possession) {
    updatePossession(HOME);
  } else {
    updatePossession(AWAY);
  }

  updateTeam(HOME, data.home);
  updateTeam(AWAY, data.away);
  
  updateClock(data.game, data.shot, data.settings.minutes, data.settings.shot);

  updateScore(HOME, calcScore(data.home.points));
  updateScore(AWAY, calcScore(data.away.points));

  updateFouls(HOME, data.home.fouls);
  updateFouls(AWAY, data.away.fouls);

  updateTimeouts(HOME, data.home.timeouts);
  updateTimeouts(AWAY, data.away.timeouts);

} // updateDisplay

function getThemeURL(obj) {

  if(obj.options.theme === undefined || obj.options.theme === "" ||
    obj.options.view === undefined || obj.options.view === "") {
      return "";
    } else {
      return PAGE_THEMES + "/" + obj.options.theme + "/" + obj.options.view;
    }

} // getThemeURL

function pageListener(obj) {

  switch (obj.page) {
    case VIDEO_PLAY:
      window.location = PAGE_VIDEO + "/" + obj.options.key;
      break;

    case VIDEO_STOP:
      window.location = PAGE_SETUP;
      break;

    case PHOTO_PLAY:
      window.location = PAGE_PHOTO + "/" + obj.options.key;
      break;

    case PHOTO_STOP:
      window.location = PAGE_SETUP;
      break;

    case AUDIO_PLAY:
      window.location = PAGE_AUDIO + "/" + obj.options.key;
      break;

    case AUDIO_STOP:
      window.location = PAGE_SETUP;
      break;
    
    case CLOCKONLY:
      window.location = PAGE_CLOCK;
      break;

    case SCORE:
      window.location = PAGE_CLOCK;
      break;

    case SCOREBOARD:
      window.location = PAGE_SCOREBOARD;
      break;

    case SETUP:
      window.location = PAGE_SETUP;
      break;

    case SHOTCLOCK:
      window.location = PAGE_SHOTCLOCK;
      break;

    case THEME:

      var t = getThemeURL(obj);
      console.log(t);

      if(t != "") {
        window.location = t;  
      }
      
      break;

    default:
      break;

    }

} // pageListener

function scoreboardListener(obj) {

  switch(obj.key) {
    case HOME_SCORE:
      updateScore(HOME, obj.val);
      break;

    case AWAY_SCORE:
      updateScore(AWAY, obj.val);
      break;

    case HOME_TIMEOUT:
      updateTimeouts(HOME, obj.val);
      break;

    case AWAY_TIMEOUT:
      updateTimeouts(AWAY, obj.val);
      break;

    case HOME_FOUL:
      updateFouls(HOME, obj.val);
      break;

    case AWAY_FOUL:
      updateFouls(AWAY, obj.val);
      break;

    case CLOCK:

      var j = JSON.parse(obj.val);

      updateClock(j.game, j.shot, j.minutes, j.shotclock);
      break;

    case POSSESSION_HOME:
      updatePossession(HOME);
      break;

    case POSSESSION_AWAY:
      updatePossession(AWAY);
      break;

    case PERIOD:
      updatePeriod(obj.val);
      break;

    case GAME_STATE:
      updateDisplay(obj.state);
      break;

    default:
      break;

  }

} // scoreboardListener

function subscriber() {

  var ws = new WebSocket(wsURL(SUBSCRIBER_SOCKET));

  ws.onmessage = function(e) {

    var obj = JSON.parse(e.data);

    if(obj.hasOwnProperty("page")) {
      pageListener(obj);
    } else if(obj.hasOwnProperty("key")) {
      scoreboardListener(obj);
    }
    
  }

  ws.onerror = function(e) {
    console.log(e);
  }

  ws.onopen = function(e) {
    console.log("subscriber websocket connected");
    ws.send(JSON.stringify({"cmd": WS_GAME_STATE}));
  }

  ws.onclose = function(e) {
    console.log("connection closed by server");
  }

} // subscriber

