import React, { useState } from 'react';
import s from './App.module.scss';

import { interval } from 'rxjs'
import { take, tap } from 'rxjs/operators'

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
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
              const val = v + 1;
              if(val < 60) {
                setSeconds(val)
              } else if(val >= 60 && val < 3600) {
                setSeconds(Math.floor(val % 60));
                setMinutes(Math.floor(val / 60));
              } else if(val >= 3600) {
                setSeconds(Math.floor(val % 3600));
                setMinutes(Math.floor(val % 60));
                setHours(Math.floor(val / 3600));
              }
            }
          }))
        break;  

        case 'stop': 
        setlabelStart('START')
          Sub.unsubscribe()
          setIsRunning(false)
          setSeconds(0);
          setMinutes(0);
          setHours(0);
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
        const val = v + currentTap + 1;
        if(val < 60) {
          setSeconds(val)
        } else if(val >= 60 && val < 3600) {
          setSeconds(Math.floor(val % 60));
          setMinutes(Math.floor(val / 60));
        } else if(v >= 3600) {
          setSeconds(Math.floor(val % 3600));
          setMinutes(Math.floor(val % 60));
          setHours(Math.floor(val / 3600));
        }
      }
    }))
  }

  const handleReset = () => {
    Sub.unsubscribe()
    setCurrentTap(0);
    setSeconds(0)
    setSub(stream$
      .subscribe({
        next: (v) => {
          const val = v + 1;
          if(val < 60) {
            setSeconds(val)
          } else if(val >= 60 && val < 3600) {
            setSeconds(Math.floor(val % 60));
            setMinutes(Math.floor(val / 60));
          } else if(v >= 3600) {
            setSeconds(Math.floor(val % 3600));
            setMinutes(Math.floor(val % 60));
            setHours(Math.floor(val / 3600));
          }
        }
      }))
  } 

  const stream$ = interval(1000)
  .pipe(
    tap((v) => {
      setCurrentTap(v);
    }),
    
  );
  return (
    <div className={s.root}>

      <div className={s.timer}>
        {
          hours < 10 ? `0${hours}` : hours
        } : 
        {
          minutes < 10 ? ` 0${minutes}` : ` ${minutes}`
        } : 
        {
          seconds < 10 ? ` 0${seconds}` : ` ${seconds}`
        }
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
