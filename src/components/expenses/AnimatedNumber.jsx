import { useState, useEffect, useRef } from 'react';
import { formatINR } from '../../utils/formatters';

export function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    let current = 0;
    const duration = 400;
    const step = (value / duration) * 16;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplay(value);
        clearInterval(intervalRef.current);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(intervalRef.current);
  }, [value]);

  return <>{formatINR(display)}</>;
}
