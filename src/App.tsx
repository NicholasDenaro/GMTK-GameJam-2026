import { useState } from 'react';
import { Game } from './Game';
import { Title } from './Title';
import flip1 from './assets/flip1.ogg';
import flip2 from './assets/flip2.ogg';
import flip3 from './assets/flip3.ogg';
import error from './assets/error.ogg';
import error2 from './assets/error2.ogg';

export const AudioSamples: Record<string, {
  key: string,
  sample: typeof Audio,
  play: () => void
}> = Object.entries({
  'Flip1': new Audio(flip1),
  'Flip2': new Audio(flip2),
  'Flip3': new Audio(flip3),
  'Error-loud': new Audio(error),
  'Error': new Audio(error2),
}).map((e) => {
  const key = e[0];
  const audio = e[1]
  return ({
    key: key,
    sample: audio,
    play: () => {
      audio.currentTime = 0;
      audio.play();
    }
  })
}).reduce((prev, cur) => ({
  ...prev,
  [cur.key]: cur
}), {});

export function App() {
  const [state, setState] = useState<'title' | 'game'>('title');
  
  return <>
    {state === 'title' ? <Title callback={() => setState('game')}></Title> : <Game></Game>}
  </>
}