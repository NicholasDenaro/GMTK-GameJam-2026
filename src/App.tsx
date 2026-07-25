import { useState } from 'react';
import { Game } from './Game';
import { Title } from './Title';

export function App() {
  const [state, setState] = useState<'title' | 'game'>('title');
  
  return state === 'title' ? <Title callback={() => setState('game')}></Title> : <Game></Game>
}