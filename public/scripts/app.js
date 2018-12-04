// Variable for first load of howler sounds to force iPhone to play tympani
let firstLoad = true; // Tympani sound effect Howl

const TYMPANI = new Howl({
  src: ["https://www.dropbox.com/s/oo20ux4qwhrt3ur/tympani_bing.webm?raw=1", "https://www.dropbox.com/s/xy5jrxowgvamwce/tympani_bing.mp3?raw=1"],
  volume: 1.0,
  html5: false,
  mobileAutoEnable: true,
  usingWebAudio: true,
  preload: true,
  onplayerror: function () {
    console.log("tympani player error");
  }
}); // Cowbell sound effect Howl

const COWBELL = new Howl({
  src: ["https://www.dropbox.com/s/mh7tbyqenqvjudo/cartoon_cowbell.webm?raw=1", "https://www.dropbox.com/s/w33txigmskl3o3o/cartoon_cowbell.mp3?raw=1"],
  volume: 0.25,
  html5: false,
  preload: true,
  mobileAutoEnable: true,
  usingWebAudio: true,
  onplayerror: function () {
    console.log("cowbell player error");
  }
}); //Parent app

class PomodoroApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25,
      // Length of session in minuts
      breakLength: 5,
      // Length of break in minutes
      counter: 1500,
      // Current count of timer in seconds
      timeLeft: "25:00",
      // String display of current count of timer
      mode: "Session",
      // Session or break mode
      playStatus: false // Is playing or not

    };
    this.startStop = this.startStop.bind(this);
    this.countdown = this.countdown.bind(this);
    this.convertCounter = this.convertCounter.bind(this);
    this.resetApp = this.resetApp.bind(this);
    this.sessionChange = this.sessionChange.bind(this);
    this.breakChange = this.breakChange.bind(this);
    this.switchMode = this.switchMode.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.clockColorChange = this.clockColorChange.bind(this);
  } // end of constructor
  // Start or stop timer


  startStop() {
    let newStatus = true; // Run countdown or pause

    if (!this.state.playStatus) {
      this.countdown();
    } else {
      newStatus = false;
    } //Update state


    this.setState({
      playStatus: newStatus
    }); //Play audio

    this.playAudio("cowbell");
  } // end of startStop
  //Timer countdown


  countdown() {
    let counter = this.state.counter;
    let interval = setInterval(() => {
      // Stop timer if paused or reset
      if (!this.state.playStatus) {
        clearInterval(interval);
      } // Countdown a second


      counter--; //Change clock color when timer reaches 1 minute

      if (counter == 59) {
        this.clockColorChange("alert");
      } //Play audio when timer is up


      if (counter == 0) {
        this.playAudio("beep");
      } //Counter finished. Clear interval timer, switch mode and change clock color


      if (counter < 0) {
        clearInterval(interval);
        this.switchMode();
      } // Run counter converstion to min and sec strings


      let convertedCounter = this.convertCounter(counter); //Update state

      if (this.state.playStatus && counter >= 0) {
        this.setState({
          timeLeft: convertedCounter,
          counter: counter
        });
      }
    }, 1000);
  } // end of countdown
  // Convert counter to min and sec strings


  convertCounter(counter) {
    // Convert counter to minutes and seconds
    let min = Math.floor(counter / 60);
    let sec = Math.floor(counter % 60); //Convert to strings

    let minString = min.toString();
    let secString = sec.toString(); // If min/sec are less than ten, add 0 in front

    if (min < 10) {
      minString = "0" + minString;
    }

    if (sec < 10) {
      secString = "0" + secString;
    }

    return minString + ":" + secString;
  } // end of convertCounter
  // Switch between session and break modes


  switchMode() {
    let newMode = this.state.mode;
    let newCounter = 0; //Change clock color back to normal;

    this.clockColorChange("normal"); // Change variables to other state

    if (this.state.mode === "Session") {
      newMode = "Break";
      newCounter = this.state.breakLength * 60;
    } else {
      newMode = "Session";
      newCounter = this.state.sessionLength * 60;
    } //Convert counter to string


    let convertedCounter = this.convertCounter(newCounter); //Update State

    this.setState({
      mode: newMode,
      counter: newCounter,
      timeLeft: convertedCounter
    }); //Run new countdown

    this.countdown();
  } // End of switchMode
  // Change clock color


  clockColorChange(mode) {
    if (mode === "alert") {
      // Red alert
      document.getElementById("clock-panel").style.color = "#dd190b";
      document.getElementById("clock-panel").style.border = "5px solid #dd190b";
    } else {
      // Normal blue
      document.getElementById("clock-panel").style.color = "#0881dd";
      document.getElementById("clock-panel").style.border = "5px solid #0881dd";
    }
  } // Reset the app to default and stop


  resetApp() {
    //Reset clock color back to normal;
    this.clockColorChange("normal"); //Update state by resetting everything to default

    this.setState({
      sessionLength: 25,
      breakLength: 5,
      counter: 1500,
      timeLeft: "25:00",
      mode: "Session",
      playStatus: false
    });
  } // End of resetApp
  //Update session length


  sessionChange(event) {
    let newSession = this.state.sessionLength;
    let newCounter = 0; //Only allow when stopped

    if (!this.state.playStatus) {
      // Decrease by minute
      if (event.target.id === "session-decrement" && this.state.sessionLength > 1) {
        newSession--;
      } //Increase by minute
      else if (event.target.id === "session-increment" && this.state.sessionLength < 60) {
          newSession++;
        } //Convert counter to string


      newCounter = newSession * 60;
      let convertedCounter = this.convertCounter(newCounter); //Update state

      this.setState({
        sessionLength: newSession
      }); //Update clock if stopped in session mode

      if (this.state.mode === "Session") {
        this.setState({
          timeLeft: convertedCounter,
          counter: newCounter
        });
      }
    }
  } // End of sessionChange
  //Update break length


  breakChange(event) {
    let newBreak = this.state.breakLength;
    let newCounter = 0; //Only allow when stopped

    if (!this.state.playStatus) {
      // Decrease by minute
      if (event.target.id === "break-decrement" && this.state.breakLength > 1) {
        newBreak--;
      } //Increase by minute
      else if (event.target.id === "break-increment" && this.state.breakLength < 60) {
          newBreak++;
        } //Convert counter to string


      let convertedCounter = this.convertCounter(newCounter);
      newCounter = newBreak * 60; // Update state

      this.setState({
        breakLength: newBreak
      }); //Update clock if paused on break

      if (this.state.mode === "Break") {
        this.setState({
          timeLeft: convertedCounter,
          counter: newCounter
        });
      }
    }
  } // End of breakChange
  //Play sound effect at end of timer or on start/stop


  playAudio(key) {
    //First user interaction to force iPhone to play Tympani sound muted
    // So it will play later
    if (firstLoad) {
      TYMPANI.mute(true);
      TYMPANI.play();
    }

    if (key == "beep") {
      TYMPANI.mute(false);
      TYMPANI.play();
    } else {
      COWBELL.play();
    }

    firstLoad = false;
  }

  render() {
    // By Kevin tag JSX HTML
    const KEVIN_TAG = React.createElement("div", null, "by", " ", React.createElement("a", {
      href: "https://kevinandrewlong.com",
      target: "_blank"
    }, "kevin long"));
    return React.createElement("div", {
      id: "pomodoro-container",
      className: "container-fluid text-center"
    }, React.createElement("h1", {
      id: "app-title"
    }, "Pomodoro Clock"), React.createElement(Clock, {
      timeLeft: this.state.timeLeft,
      mode: this.state.mode
    }), React.createElement(Controls, {
      sessionLength: this.state.sessionLength,
      sessionChange: this.sessionChange,
      breakLength: this.state.breakLength,
      breakChange: this.breakChange,
      startStop: this.startStop,
      resetApp: this.resetApp,
      playStatus: this.state.playStatus
    }), React.createElement("div", {
      id: "by-kevin"
    }, KEVIN_TAG));
  }

} // Clock display - child of parent app


class Clock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      id: "clock-panel"
    }, React.createElement("p", {
      id: "timer-label"
    }, this.props.mode), React.createElement("h1", {
      id: "time-left"
    }, this.props.timeLeft));
  }

} // Controls - child of parent app


class Controls extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Style for plus/minus buttons if timer not active
    let plusMinusStyle = {
      color: "#034975",
      cursor: "pointer"
    }; // Style for plus/minus buttons if timer is active

    if (this.props.playStatus) {
      plusMinusStyle = {
        color: "rgba(3, 73, 117, .7)",
        cursor: "not-allowed"
      };
    }

    return React.createElement("div", {
      id: "control-panel",
      className: "row-justify-content-center"
    }, React.createElement("div", {
      id: "play-controls",
      className: "row justify-content-center"
    }, React.createElement("div", {
      className: "col-11"
    }, React.createElement("i", {
      id: "start_stop",
      onClick: this.props.startStop,
      className: this.props.playStatus ? "fas fa-pause i-button" : "fas fa-play i-button"
    }), React.createElement("i", {
      className: "blank-spacer"
    }), React.createElement("i", {
      id: "info",
      className: "fas fa-info-circle i-button",
      "data-toggle": "modal",
      "data-target": "#info-modal"
    }), React.createElement("i", {
      className: "blank-spacer"
    }), React.createElement("i", {
      id: "reset",
      onClick: this.props.resetApp,
      className: "fas fa-redo-alt i-button"
    }))), React.createElement("div", {
      className: "row justify-content-center"
    }, React.createElement("div", {
      id: "session-options",
      className: "col-12 col-sm-6"
    }, React.createElement("div", {
      className: "float-sm-right"
    }, React.createElement("div", {
      id: "session-label"
    }, "Session Length"), React.createElement("div", null, React.createElement("i", {
      id: "session-decrement",
      onClick: this.props.sessionChange,
      className: "fas fa-minus i-button",
      style: plusMinusStyle
    }), React.createElement("span", {
      id: "session-length"
    }, this.props.sessionLength), React.createElement("i", {
      id: "session-increment",
      onClick: this.props.sessionChange,
      className: "fas fa-plus i-button",
      style: plusMinusStyle
    })))), React.createElement("div", {
      id: "break-options",
      className: "col-12 col-sm-6"
    }, React.createElement("div", {
      className: "float-sm-left"
    }, React.createElement("div", {
      id: "break-label"
    }, "Break Length"), React.createElement("div", null, React.createElement("i", {
      id: "break-decrement",
      onClick: this.props.breakChange,
      className: "fas fa-minus i-button",
      style: plusMinusStyle
    }), React.createElement("span", {
      id: "break-length"
    }, this.props.breakLength), React.createElement("i", {
      id: "break-increment",
      onClick: this.props.breakChange,
      className: "fas fa-plus i-button",
      style: plusMinusStyle
    }))))));
  }

}

ReactDOM.render(React.createElement(PomodoroApp, null), document.getElementById("pomodoro-app"));