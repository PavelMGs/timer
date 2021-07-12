import React, { useEffect, useRef, useState } from 'react';
import { Observable } from 'rxjs';
import s from './New.module.scss';



const New = () => {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, _setIsRunning] = useState(false);
    const [debounce, setDebounce] = useState(false);
    const [paused, _setPaused] = useState(false);
    const [reset, _setReset] = useState(false);

    const isRunningRef = useRef(isRunning); //Для получения актуального стейта в интервале
    const pausedRef = useRef(paused);
    const resetRef = useRef(reset);

    const setIsRunning = (newData) => {
        isRunningRef.current = newData;
        _setIsRunning(newData);
    };

    const setPaused = (newData) => {
        pausedRef.current = newData;
        _setPaused(newData);
    };

    const setReset = (newData) => {
        resetRef.current = newData;
        _setReset(newData);
    };

    const obStream$ = new Observable(observer => {
        let time = 0;
        setInterval(() => {
            if(resetRef.current) {
                time = -1000;
                setReset(false);
            }
            if(isRunningRef.current && !pausedRef.current) {
                observer.next(time += 1000);
            } else if(!pausedRef.current && !isRunningRef.current) {
                observer.complete();
            }
        }, 1000)
    })

    const handleStart = () => {
        if(!isRunning) {
            setIsRunning(true);
        } else {
            setIsRunning(false);
            setSeconds(0);
        }
    }

    useEffect(() => {
        if(isRunning && !paused) {
            obStream$.subscribe({
            next(val) {
                setSeconds(val / 1000);
                console.log(val)
            },
            complete() {
                console.log('completed')
            }
        })
        } else if(isRunning && paused) {
            setPaused(false);
        }
    }, [isRunning]);

    const handleWait = () => {
        setDebounce(true);
        setTimeout(() => {
            setDebounce(false)
        }, 300)
    }

    const onDebounce = () => {
        setPaused(true);
        setIsRunning(false);
    }
    
    const date = new Date(0, 0, 0, 0, 0, seconds);
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const time = Intl.DateTimeFormat('ru', timeOptions).format(date);
    return (
        <div className={s.root}>

            <div className={s.timer}>
                {time}
            </div>

            <div className={s.controls}>
                <button
                onClick={handleStart}
                >
                    {
                        isRunning
                        ? 'Stop'
                        : "Start"
                    }
                </button>

                <button
                    disabled={!isRunning}
                    onClick={() => {
                        !debounce
                            ? handleWait()
                            : onDebounce()
                    }}
                >
                    Wait
                </button>

                <button
                    disabled={!isRunning}
                    onClick={() => setReset(true)}
                >
                    RESET
                </button>
            </div>

        </div>
    )
}

export default New
