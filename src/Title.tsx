import { useCallback, useEffect, useState } from 'react';
import './Title.css';

let loadOnce = true;

type Message = {
  type: 'system' | 'user';
  text: string;
}


type QueuedMessages = (Message & { index: number, timeout: number[] })[];
const queue: QueuedMessages = [];

export function Title({callback}: {callback: () => void}) {
  const [history, _setHistory] = useState<Message[]>([]);

  const setHistory = useCallback((val: Message[] | ((prev: Message[]) => Message[])) => {
    _setHistory(prev => {
      const next = [...typeof val === 'function' ? val(prev) : val];
      for (let i = 0; i < next.length; i++ ) {
        const line = next[i];
        const split: string[] = [''];
        let count = 0;
        for (let ch of line?.text ?? '') {
          if (ch.charCodeAt(0) < 127) {
            count++;
          }
          split[split.length - 1] += ch;
          if (count === 63) {
            count = 0;
            split.push('');
          }
        }
        if (split.filter(Boolean).length > 1) {
          next.splice(i, 1, ...split.filter(Boolean).map(s => ({type: line.type, text: s})));
        }
      }
      return next.slice(Math.max(0, next.length - 120));
    }
    );
  }, [_setHistory]);


  useEffect(() => {
    let current = queue[0];
    while (current && !current.text) {
      queue.shift();
      current = queue[0];
    }
    if (!current) {
      return;
    }

    const id = setTimeout(() => {
      const char = current.text[0];
      current.text = current.text.slice(1);
      const insert = current.index === 0;
      setHistory(prev => {
        const next = JSON.parse(JSON.stringify(prev));
        if (insert) {
          next.push({...current, text: ''});
        }
        const line = next.at(-1);
        if (line) {
          line.text += char;
        }
        return next;
      });

      current.index++;
      if (current.text.length === 0) {
        queue.shift();
      }
    }, current.timeout.at(current.index % current.timeout.length));

    return () => {
      clearTimeout(id);
    }
  }, [queue[0]?.text, setHistory]);

  useEffect(() => {
    if (loadOnce) {
      queue.push({ type: 'system', text: '___________', index: 0, timeout: [20] });
      queue.push({ type: 'user',   text: '/> CHROOT', index: 0, timeout: [20] });
      queue.push({ type: 'system', text: '‾‾‾‾‾‾‾‾‾‾‾', index: 0, timeout: [20] });
      queue.push({ type: 'system', text: '[=====BOOTING=====]', index: 0, timeout: [20, 20, 150, 20, 20, 20, 20, 150, 150, 150, 150] });
    }

    setTimeout(() => {
      callback();
    }, 2500);

    loadOnce = false;
  }, []);

  return <>
    <pre className='terminal title'>
      {history.slice(-12 * (0 + 1)).slice(0, 12).map((h, i) => <div className={`${h.type}`}>{h.text}{(queue.length > 0 && i === history.length - 1) ? '█' : ''}</div>)}
    </pre>
    <div className="crt" />
  </>
}