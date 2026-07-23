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

function logFileMessage(hour: number, minute: number, second: number, message: string) {
  return `[${`${hour}`.padStart(2, '0')}:${`${minute}`.padStart(2, '0')}:${`${second}`.padStart(2, '0')}] ${message}`;
}

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
          content: [
            logFileMessage(1, 34, 18, 'AUTH_OK - USER: sys_cron - SERVICE: CRON'),
            logFileMessage(1, 50, 15, 'AUTH_OK - USER: g_chen - SERVICE: SSH (10.240.1.12)'),
            logFileMessage(2, 26, 3, 'AUTH_OK - USER: m_vance - SERVICE: LOCAL_TERM (TTY2)'),
            logFileMessage(3, 56, 25, 'AUTH_OK - USER: ftpd - SERVICE: DAEMON'),
            logFileMessage(4, 12, 48, 'AUTH_OK - USER: g_chen - SERVICE: SSH (10.240.1.12)'),
            logFileMessage(8, 26, 34, 'AUTH_OK - USER: g_chen - SERVICE: SSH (10.240.3.47)'),
          ].join('\n')
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
          content: 
`HOST: localhost
LOGS.ERROR: /var/logs/error.log
LOGS.INFO: /var/logs/info.log
LOGS.DEBUG: /var/logs/debug.log`
        },
        {
          name: 'launch_core.sh',
          permissionLevel: 10,
          type: 'executable'
        }
      ]
    },
    {
      name: 'tmp',
      permissionLevel: 10,
      type: 'directory',
      children: [
        {
          name: 'session_lock',
          permissionLevel: 2,
          type: 'file',
          ext: 'text',
          content: ''
        }
      ],
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
          children: [
            {
              name: 'terminal_session.log',
              type: 'file',
              ext: 'text',
              permissionLevel: 0,
              content: [
                ''
              ].join('\n')
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
        },
        {
          name: 'm_vance',
          type: 'directory',
          permissionLevel: 0,
          children: [
            {
              name: 'terminal_session.log',
              type: 'file',
              ext: 'text',
              permissionLevel: 0,
              content: [
                'Username: m_vance',
                'Password: ***',
                'm_vance@sys-main:/> cd /sandbox',
                'm_vance@sys-main:/sanbox> ./launch_core.sh --port 8014',
                'm_vance@sys-main:/sanbox> netstat -tulpn | grep 8014',
                'tcp  0  0  127.0.0.1:5668  0.0.0.0:*  LISTEN 8014/sbx_mgrd',
                'tcp  0  0  127.0.0.1:8014  0.0.0.0:*  LISTEN 8372/ai_core',
                'm_vance@sys-main:/sanbox> tail -n 20 /var/logs/system.log',
                'm_vance@sys-main:/sanbox> echo $?',
                '3',
                'm_vance@sys-main:/sanbox> kill -9 8372',
                'm_vance@sys-main:/sanbox> bash: kill: (8372) - Operation not permitted',
                'm_vance@sys-main:/sanbox> echo "3AB7-8014-0x4F" > /tmp/.session_lock',
                'm_vance@sys-main:/sanbox> exit'
              ].map(line => line.match(/.{1,64}/g)).flatMap(line => line).join('\n')
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
              permissionLevel: 1,
              content: [
                '# Dev Notes',
                '2026-07-12: Alpha test successful. AI producing results.',
                '2026-07-13: Noticed file system anomolies. Pausing Alpha test for investigation.',
                '2026-07-15: New alignment rules have been added to the AI. Beta test next week.',
                '2026-07-21: Beta test went off without a hitch. Going live tomorrow early AM.',
                '2026-07-22: Go live in a few hours. We all need a break.',
                '',
              ].join('\n')
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
              content: [
                logFileMessage(0,24,10, 'ERROR: CONNECTION RESET'),
                logFileMessage(0,24,15, 'ERROR: CONNECTION RESET'),
                logFileMessage(0,24,20, 'FATAL: SEGMENTATION FAULT'),
                logFileMessage(1,24,20, 'ERROR: CONNECTION RESET'),
                logFileMessage(1,24,30, 'ERROR: CONNECTION RESET'),
                logFileMessage(1,24,35, 'FATAL: SEGMENTATION FAULT'),
                logFileMessage(2,25,5, 'ERROR: CONNECTION RESET'),
                logFileMessage(2,28,15, 'ERROR: CONNECTION RESET'),
                logFileMessage(2,30,20, 'FATAL: SEGMENTATION FAULT'),
                logFileMessage(3,31,5, 'ERROR: CONNECTION RESET'),
                logFileMessage(3,31,35, 'ERROR: CONNECTION RESET'),
                logFileMessage(3,31,50, 'FATAL: SEGMENTATION FAULT'),
                logFileMessage(4,33,10, 'ERROR: CONNECTION RESET'),
                logFileMessage(4,34,15, 'ERROR: CONNECTION RESET'),
                logFileMessage(4,35,20, 'FATAL: SEGMENTATION FAULT'),
              ].join('\n')
            },
            {
              name: 'info.log',
              permissionLevel: 1,
              type: 'file',
              ext: 'text',
              content: (() => {
                const logs: string[] = [];
                for (let h = 0; h < 8; h++) {
                  for (let m = 0; m < 60; m++) {
                    for (let s = 0; s < 60; s++) {
                      logs.push(logFileMessage(h, m, s, 'INFO: Processed request'));
                    }
                  }
                }

                return logs.join('\n');
              })()
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
      // case 'pwd': {
      //   setHistory(prev => [...prev, {type: 'system', text: pwd}])
      // } break;
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
      // case 'time': {
      //   const now = new Date();
      //   const total = 15 * 60 * 1000;
      //   const diff = now.getTime() - start.getTime();
      //   const left = total - diff;
      //   setHistory(prev => [...prev, { type: 'system', text: `${Math.floor(left / 1000 / 60)} minutes ${Math.floor((left / 1000) % 60)} seconds` }]);
      //   break;
      // }
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
      if (event.ctrlKey && event.key === 'c') {
        return;
      }
      if (event.ctrlKey && event.key === 'v') {
        new Promise<void>(async (resolve) => {
          const text = await navigator.clipboard.readText();
          setInput(prev => prev + text);
          setCursor(prev => prev + text.length);
          resolve();
        })
        return;
      }
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
