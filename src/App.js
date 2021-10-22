import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const minutest = useRef(25);
  const seconds = useRef(0);
  const isCounting = useRef(false);
  const interval = useRef(null);
  const label = useRef("Session");
  const [, forceRender] = useState(null);

  const resetTime = () => {
    clearInterval(interval.current);
    isCounting.current = false;
    interval.current = null;
    minutest.current = 25;
    seconds.current = 0;
    const audio = document.getElementById("beep");
    audio.pause();
    setBreakTime(5);
    setSessionTime(25);
    forceRender({});
  };

  const handleBreakClick = (value) => {
    if (
      !isCounting.current &&
      breakTime + value <= 60 &&
      breakTime + value > 0
    ) {
      setBreakTime(breakTime + value);
    }
  };

  const handleSessionClick = (value) => {
    if (
      !isCounting.current &&
      sessionTime + value <= 60 &&
      sessionTime + value > 0
    ) {
      setSessionTime(sessionTime + value);
      seconds.current = 0;
      minutest.current = sessionTime + value;
    }
  };

  const handleStartStop = () => {
    //Counting
    if (isCounting.current) {
      clearInterval(interval.current);
      interval.current = null;
      isCounting.current = false;
      forceRender({});
    }
    //Not counting
    else {
      interval.current = setInterval(() => {
        seconds.current -= 1;

        if (seconds.current < 0) {
          seconds.current = 59;
          minutest.current -= 1;
        }

        if (minutest.current < 0) {
          if (label.current === "Session") {
            label.current = "Break";
            seconds.current = 0;
            minutest.current = breakTime;
          } else {
            label.current = "Session";
            seconds.current = 0;
            minutest.current = sessionTime;
            const audio = document.getElementById("beep");
            audio.currentTime = 0;
            audio.play();
          }
        }

        isCounting.current = true;
        forceRender({});
      }, 1000);
    }
  };

  return (
    <div className="app">
      <h1 className="title">25 + 5 Clock</h1>

      <div className="label">
        <div className="left">
          <h2 id="break-label">Break Length</h2>
          <div className="config">
            <button onClick={() => handleBreakClick(-1)} id="break-decrement">
              -
            </button>
            <span id="break-length">{breakTime}</span>
            <button onClick={() => handleBreakClick(1)} id="break-increment">
              +
            </button>
          </div>
        </div>
        <div className="right">
          <h2 id="session-label">Session Length</h2>
          <div className="config">
            <button
              onClick={() => handleSessionClick(-1)}
              id="session-decrement"
            >
              -
            </button>
            <span id="session-length">{sessionTime}</span>
            <button
              onClick={() => handleSessionClick(1)}
              id="session-increment"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="time">
        <p id="timer-label">{label.current}</p>
        <p id="time-left">{`${
          minutest.current < 10 ? "0" + minutest.current : minutest.current
        }:${
          seconds.current < 10 ? "0" + seconds.current : seconds.current
        }`}</p>
      </div>

      <div className="btn">
        <button id="start_stop" onClick={handleStartStop}>
          Start/Stop
        </button>
        <button id="reset" onClick={resetTime}>
          Reset
        </button>
      </div>

      <audio
        id="beep"
        src="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
      />
    </div>
  );
}

export default App;
