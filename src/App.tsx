import { useCallback, useEffect, useState } from 'react';
import './App.css';

type Message = {
  type: 'system' | 'user';
  text: string;
}

type INode = {
  name: string;
  permissionLevel: number;
} & (
  {
    type: 'file';
    ext: 'text' | 'audio' | 'image';
    content: string;
  }
  | {
    type: 'directory';
    children: INode[];
  }
)

const FileSystemRoot: INode = {
  name: '/',
  permissionLevel: 0,
  type: 'directory',
  children: [
    {
      name: 'test.txt',
      permissionLevel: 0,
      type: 'file',
      ext: 'text',
      content: 'testing'
    }
  ]
};

function traverse(pwd: string) {
  if (pwd === '/') {
    return FileSystemRoot;
  }

  const dirs = pwd.slice(1).split('/');
  let node: INode = FileSystemRoot;
  for (let dir of dirs) {
    if (node.type === 'file') {
      return null;
    }

    const child = node.children.find(n => n.name === dir);
    if (!child) {
      return null;
    }
    node = child;
  }

  return node;
}

export function App() {
  const [_start] = useState(new Date());
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [_permissions, _setPermissions] = useState(0);
  const [pwd, setPwd] = useState(FileSystemRoot.name);

  const handleCommand = useCallback((input: string) => {
    setHistory(prev => [...prev, { type: 'user', text: `${pwd}> ${input}` }]);
    const [command, ...args] = input.split(' ');

    switch (command) {
      case 'help':
        break;
      case 'ls':{
        const dir = traverse(pwd);

        console.log('dir', dir);

        if (dir && dir.type === 'directory') {
          const lines: Message[] = dir.children.map(child => ({ type: 'system', text: child.name }));
          setHistory(prev => [...prev, ...lines]);
        }
      } break;
      case 'cd':{

      } break;
      case 'pwd': {
        setHistory(prev => [...prev, {type: 'system', text: pwd}])
      } break;
      case 'cat': {
        const dir = traverse(pwd);
        if (dir && dir.type === 'directory') {
          const file = dir.children.find(c => c.name === args[0]);
          if (file && file.type === 'file') {
            setHistory(prev => [...prev, {type: 'system', text: file.content}])
          }
        }
      } break;
      case 'exit': {

      } break;
    }
  }, [setHistory, setInput, pwd, setPwd]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Backspace':
          setInput(prev => prev?.slice(0, prev.length - 1));
          break;
        case 'Enter':
          handleCommand(input);
          setInput('');
          break;
        case 'Shift':
        case 'Control':
          break;
        case 'Tab':
          break;
        default:
          setInput(prev => prev + event.key);
          break;
      }

      event.stopPropagation();
      event.preventDefault();
    }
    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    }
  }, [handleCommand, input, setInput, pwd]);


  useEffect(() => {
    handleCommand('cat test.txt');
  }, []);

  return <>
    <pre className='terminal'>
      {history.map(h => h.text).join('\n')}
      {`\n${pwd}> `}{input}
      </pre>
  </>
}
