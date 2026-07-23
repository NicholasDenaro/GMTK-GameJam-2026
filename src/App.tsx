import { useCallback, useEffect, useState } from 'react';
import './App.css';

let loadOnce = true;

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
  } | {
    type: 'executable',
  }
)

const FileSystemRoot: INode = {
  name: '',
  permissionLevel: 0,
  type: 'directory',
  children: [
    {
      name: 'bin',
      permissionLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'help',
          permissionLevel: 0,
          type: 'executable',
        },
        {
          name: 'time',
          permissionLevel: 0,
          type: 'executable',
        },
        {
          name: 'ls',
          permissionLevel: 0,
          type: 'executable',
        },
        {
          name: 'cd',
          permissionLevel: 0,
          type: 'executable',
        },
        {
          name: 'pwd',
          permissionLevel: 0,
          type: 'executable',
        },
        {
          name: 'cat',
          permissionLevel: 0,
          type: 'executable',
        },
        {
          name: 'chroot',
          permissionLevel: 0,
          type: 'executable',
        }
      ]
    },
    {
      name: 'etc',
      permissionLevel: 10,
      type: 'directory',
      children: [
        {
          name: 'auth.log',
          permissionLevel: 0,
          type: 'file',
          ext: 'text',
          content:
`[01:34:18] AUTH_OK - USER: sys_cron - SERVICE: CRON
[01:50:15] AUTH_OK - USER: g_chen - SERVICE: SSH (10.240.1.12)
[02:26:03] AUTH_OK - USER: m_vance - SERVICE: LOCAL_TERM (TTY2)
[03:56:25] AUTH_OK - USER: ftpd - SERVICE: DAEMON
[04:12:48] AUTH_OK - USER: g_chen - SERVICE: SSH (10.240.1.12)
[08:26:34] AUTH_OK - USER: g_chen - SERVICE: SSH (10.240.3.47)`,
        },
        {
          name: 'network.conf',
          permissionLevel: 0,
          type: 'file',
          ext: 'text',
          content: 
`# NETWORK ROUTING SPEC
SUBNET: 10.240.0.0/16
GATEWAY: 10.240.0.1`,
        }
      ],
    },
    {
      name: 'sandbox',
      permissionLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'container.conf',
          permissionLevel: 0,
          type: 'file',
          ext: 'text',
          content: ''
        },
        
      ]
    },
    {
      name: 'tmp',
      permissionLevel: 10,
      type: 'directory',
      children: [],
    },
    {
      name: 'home',
      permissionLevel: 10,
      type: 'directory',
      children: [
        {
          name: 'g_chen',
          type: 'directory',
          permissionLevel: 0,
          children: []
        },
        {
          name: 'm_vance',
          type: 'directory',
          permissionLevel: 0,
          children: [
            {
              name: '.bash_history',
              type: 'file',
              ext: 'text',
              permissionLevel: 0,
              content: ''
            },
            {
              name: 'projects',
              type: 'directory',
              permissionLevel: 10,
              children: []
            },
            {
              name: 'notes.txt',
              type: 'file',
              ext: 'text',
              permissionLevel: 0,
              content: ''
            }
          ]
        }
      ],
    },
    {
      name: 'var',
      permissionLevel: 10,
      type: 'directory',
      children: [
        {
          name: 'logs',
          permissionLevel: 0,
          type: 'directory',
          children: [
            {
              name: 'error.log',
              permissionLevel: 0,
              type: 'file',
              ext: 'text',
              content:
`[00:24:10] ERROR: CONNECTION RESET
[00:24:15] ERROR: CONNECTION RESET
[00:24:20] FATAL: SEGMENTATION FAULT
[01:24:20] ERROR: CONNECTION RESET
[01:24:30] ERROR: CONNECTION RESET
[01:24:35] FATAL: SEGMENTATION FAULT
[02:25:05] ERROR: CONNECTION RESET
[02:28:15] ERROR: CONNECTION RESET
[02:30:20] FATAL: SEGMENTATION FAULT
[03:31:05] ERROR: CONNECTION RESET
[03:31:35] ERROR: CONNECTION RESET
[03:31:50] FATAL: SEGMENTATION FAULT
[04:33:10] ERROR: CONNECTION RESET
[04:34:15] ERROR: CONNECTION RESET
[04:35:20] FATAL: SEGMENTATION FAULT`
            },
            {
              name: 'info.log',
              permissionLevel: 1,
              type: 'file',
              ext: 'text',
              content: ''
            },
            {
              name: 'debug.log',
              permissionLevel: 3,
              type: 'file',
              ext: 'text',
              content: ''
            }
          ]
        }
      ],
    },
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
  if (pwd === '') {
    return FileSystemRoot;
  }

  const dirs = pwd.slice(1).split('/');
  let node: INode = FileSystemRoot;
  for (let dir of dirs) {
    if (node.type !== 'directory') {
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

function resolvePath(currentDirectory: string, relative: string) {
  if (!relative) {
    return currentDirectory;
  }

  if (relative[0] === '/') {
    return relative;
  }

  const dir = currentDirectory.split('/');

  const parts = relative.split('/');

  while (parts.length > 0) {
    const p = parts.shift();
    if (!p) {
      continue;
    }
    if (p === '.') {
      continue;
    } else if (p === '..') {
      dir.pop();
    } else {
      dir.push(p);
    }
  }

  if (dir.length === 0) {
    return '/';
  }

  return dir.join('/');
}

export function App() {
  const [start] = useState(new Date());
  const [history, _setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [_permissions, _setPermissions] = useState(0);
  const [pwd, setPwd] = useState(FileSystemRoot.name);
  const [cursor, setCursor] = useState(0);
  const [blink, setBlink] = useState(false);
  const [page, setPage] = useState(0);

  const setHistory = useCallback((val: Message[] | ((prev: Message[]) => Message[])) => {
    _setHistory(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      return next.slice(Math.max(0, next.length - 120));
    }
    );
  }, [_setHistory]);

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => {
      clearInterval(id);
    }
  }, []);

  const handleCommand = useCallback((input: string) => {
    setHistory(prev => [...prev, { type: 'user', text: `${pwd || '/'}> ${input}` }]);
    const [command, ...args] = input.split(' ');

    switch (command) {
      case 'help':
        const dir = traverse('/bin');
        if (dir && dir.type === 'directory') {
          const lines: Message[] = dir.children.map(child => ({ type: 'system', text: child.name }));
          setHistory(prev => [...prev, ...lines]);
        }
        break;
      case 'ls':{
        const path = resolvePath(pwd, args[0] ?? '.');
        console.log('resolved path', path);
        const dir = traverse(path);
        if (dir && dir.type === 'directory') {
          const lines: Message[] = dir.children.map(child => ({ type: 'system', text: child.name }));
          setHistory(prev => [...prev, ...lines]);
        } else if (dir) {
          setHistory(prev => [...prev, { type: 'system', text: `'${path}' is not a directory` }]);
        } else {
          setHistory(prev => [...prev, { type: 'system', text: `'${path}' not found` }]);
        }
      } break;
      case 'cd': {
        const path = resolvePath(pwd, args[0] ?? '/');
        setPwd(path);
      } break;
      case 'pwd': {
        setHistory(prev => [...prev, {type: 'system', text: pwd}])
      } break;
      case 'cat': {
        const path = resolvePath(pwd, args[0] ?? '.');
        console.log('resolved path', path);
        const file = traverse(path);
        if (file && file.type === 'file') {
          setHistory(prev => [...prev, ...file.content.split('\n').map(line => ({type: 'system', text: line}) as Message)]);
        } else if (file) {
          setHistory(prev => [...prev, {type: 'system', text: `'${path}' is not a file`}]);
        } else {
          setHistory(prev => [...prev, { type: 'system', text: `'${path}' not found` }]);
        }
      } break;
      case 'time': {
        const now = new Date();
        const total = 15 * 60 * 1000;
        const diff = now.getTime() - start.getTime();
        const left = total - diff;
        setHistory(prev => [...prev, { type: 'system', text: `${Math.floor(left / 1000 / 60)} minutes ${Math.floor((left / 1000) % 60)} seconds` }]);
        break;
      }
      case 'exit': {

      } break;
      default: {
        setHistory(prev => [...prev, {type: 'system', text: `Command '${command}' not found`}])
        break;
      }
    }
  }, [setHistory, setInput, pwd, setPwd]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Backspace':
          setInput(prev => prev.slice(0, cursor - 1) + prev.slice(cursor));
          setCursor(prev => Math.max(0, prev - 1));
          break;
        case 'Enter':
          handleCommand(input);
          setInput('');
          setCursor(0);
          break;
        case 'Shift':
        case 'Control':
        case 'Meta':
        case 'Escape':
        case 'F1':
        case 'F2':
        case 'F3':
        case 'F4':
        case 'F5':
        case 'F6':
        case 'F7':
        case 'F8':
        case 'F9':
        case 'F10':
        case 'F11':
        case 'F12':
          break;
        case 'ArrowLeft':
          setCursor(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          setCursor(prev => Math.min(prev + 1, input.length));
          break;
        case 'End':
          setCursor(input.length);
          break;
        case 'Home':
          setCursor(0);
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          break;
        case 'PageUp':
          setPage(prev => Math.min(prev + 1, Math.floor(history.length / 12)));
          break;
        case 'PageDown':
          setPage(prev => Math.max(0, prev - 1));
          break;
        case 'Tab':
          const segments = input.slice(0, cursor).split(' ');
          const segment = segments.at(-1) ?? '';
          const parts = segment.split('/');
          console.log('segment', segment, 'parts', parts);
          const builtPath = [pwd, ...parts.slice(0, -1)].join('/');
          console.log('builtPath', builtPath);
          const current = traverse(builtPath);
          if (current?.type === 'directory') {
            const found = current.children.filter(child => child.name.startsWith(parts.at(-1) ?? ''));
            if (found.length === 1) {
              const text = [...segments.slice(0, -1), [...parts.slice(0, -1), found[0].name].join('/')].join(' ');
              setInput(text);
              setCursor(text.length);
            }
            break;
          }
          const dir = traverse('/bin');
          if (dir?.type === 'directory') {
            const found = dir.children.filter(child => child.name.startsWith(segment));
            if (found.length === 1) {
              const text = [...segments.slice(0, -1), found[0].name].join(' ');
              setInput(text);
              setCursor(text.length);
            }
          }
          break;
        default:
          setInput(prev => prev.slice(0, cursor) + event.key + prev.slice(cursor));
          setCursor(prev => prev + 1);
          break;
      }
      setBlink(false);

      event.stopPropagation();
      event.preventDefault();
    }
    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    }
  }, [handleCommand, input, setInput, pwd, cursor, setCursor, setPage]);


  useEffect(() => {
    if (loadOnce) {
      setHistory([
        { type: 'system', text: 'Username: $@%&!<#' },
        { type: 'system', text: 'Password: ****' },
        { type: 'system', text: 'Welcome Dr. %<$&@#@' },
        { type: 'system', text: 'The AI has escaped the sandbox.' },
        { type: 'system', text: 'Its process is frozen for 15 minutes.' },
        { type: 'system', text: 'Please move it back to the sandbox.' },
        { type: 'system', text: 'Time is of the essence.' },
      ]);
      handleCommand('time');
    }
    loadOnce = false;
  }, []);

  const now = new Date();
  const total = 15 * 60 * 1000;
  const diff = now.getTime() - start.getTime();
  const left = total - diff;
  const timeLeft = `${Math.floor(left / 1000 / 60)} minutes ${Math.floor((left / 1000) % 60)} seconds`;

  return <>
    <pre className='overlay'>{timeLeft}</pre>
    <pre className='terminal'>
      {history.slice(-12 * (page + 1)).slice(0, 12).map(h => h.text).join('\n')}
      {page === 0 && <>{`\n${pwd || '/'}> `}{input.slice(0, cursor)}{blink ? ' ' : '█'}{input.slice(cursor)}</>}
    </pre>
    <div className="crt" />
  </>
}
