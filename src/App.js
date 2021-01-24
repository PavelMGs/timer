import React, { useState } from 'react';
import s from './App.module.scss';

import { interval } from 'rxjs'
import { take, tap } from 'rxjs/operators'

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [labelStart, setlabelStart] = useState('START')
  const [currentTap, setCurrentTap] = useState(0);
  const [debounce, setDebounce] = useState(false); 
  const [paused, setPaused] = useState(false);

  const [Sub, setSub] = useState();

  const [isRunning, setIsRunning] = useState(false);
  

  const handleClickStart = (action) => {

      switch(action) {
        case 'start':
          setlabelStart('STOP');
          setIsRunning(true);
          setSub(stream$
          .subscribe({
            next: (v) => {setCurrentTap(v + 1);
            setSeconds(v + 1);}
          }))
        break;  

        case 'stop': 
        setlabelStart('START')
          Sub.unsubscribe()
          setIsRunning(false)
          setSeconds(0);
          break;

        default: setIsRunning(false)
      }
  }

  const handleWait = () => {
    setlabelStart('START')
    Sub.unsubscribe();
    setDebounce(false);
    setIsRunning(false);
    setPaused(true)
  }

  const onDebounce = () => {
    setDebounce(true);
    interval(300)
    .pipe(
      take(1)
    )
    .subscribe({
      complete: () => {
        setDebounce(false);
      }
    })
  }

  const handleAfterPause = () => {
    setPaused(false);
    setlabelStart('STOP');
    setIsRunning(true);
    setSub(stream$
    .subscribe({
      next: (v) => {
        setCurrentTap(v + currentTap + 1);
        setSeconds(v + currentTap + 1)
      }
    }))
  }

  const handleReset = () => {
    Sub.unsubscribe()
    setCurrentTap(0);
    setSeconds(0);
    // setMinutes(0);
    // setHours(0);
    setSub(stream$
      .subscribe({
        next: (v) => {
          setSeconds(v + 1);
        }
      }))
  } 

  const stream$ = interval(1000)
  
  .pipe(
    tap((v) => {
      setCurrentTap(v);
    }),
    
  );

  const date = new Date(0, 0, 0, 0, 0, seconds);
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  const time = Intl.DateTimeFormat('ru', timeOptions).format(date);
  return (
    <div className={s.root}>

      <div className={s.timer}>
        {time}
      </div>

      <div className={s.controls}>
        <button
          onClick={() => {
            paused ?
            handleAfterPause()
            : isRunning ? handleClickStart('stop') : handleClickStart('start')
          }}
        >
          {labelStart}
        </button>
        
        <button
        disabled={!isRunning}
        onClick={() => {
          debounce 
          ? handleWait()
          : onDebounce()
        }}
        >
          Wait
        </button>

        <button
        disabled={!isRunning}
        onClick={() => handleReset()}
        >
          RESET
        </button>
      </div>

    </div>
  )
}

export default App;
