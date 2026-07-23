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

const finalPid = 8372;
const finalMac = '34D6';

const cMorPass = 'sys-main_tgif';

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
          name: 'netstat',
          permissionLevel: 1,
          type: 'executable',
        },
        {
          name: 'ip',
          permissionLevel: 1,
          type: 'executable',
        },
        {
          name: 'echo',
          permissionLevel: 0,
          type: 'executable'
        },
        {
          name: 'decode',
          permissionLevel: 1,
          type: 'executable'
        },
        {
          name: 'su',
          permissionLevel: 0,
          type: 'executable'
        },
        {
          name: 'chroot',
          permissionLevel: 2,
          type: 'executable',
        }
      ]
    },
    {
      name: 'etc',
      permissionLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'auth.log',
          permissionLevel: 0,
          type: 'file',
          ext: 'text',
          content: [
            logFileMessage(1, 34, 18, 'AUTH_OK - USER: sys_cron - SERVICE: CRON'),
            logFileMessage(1, 50, 15, 'AUTH_OK - USER: c_mor - SERVICE: SSH (10.240.1.12)'),
            logFileMessage(2, 12, 48, 'AUTH_OK - USER: c_mor - SERVICE: SSH (10.240.1.12)'),
            logFileMessage(3, 26, 3, 'AUTH_OK - USER: a_gile - SERVICE: LOCAL_TERM (TTY2)'),
            logFileMessage(3, 56, 25, 'AUTH_OK - USER: ftpd - SERVICE: DAEMON'),
          ].join('\n')
        },
        {
          name: 'notice.txt',
          permissionLevel: 0,
          type: 'file',
          ext: 'text',
          content: '2026-07-18: System wide password reset. Default password "<year>_<firstname>". Please reset your passwords immediately.'
        },
        {
          name: 'network.conf',
          permissionLevel: 0,
          type: 'file',
          ext: 'text',
          content: [
            `# NETWORK ROUTING SPEC`,
            `SUBNET: 10.240.0.0/16`,
            `GATEWAY: 10.240.0.1`
          ].join('\n')
,
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
          content: [
            `HOST: localhost`,
            `LOGS.ERROR: /var/logs/error.log`,
            `LOGS.INFO: /var/logs/info.log`,
            `LOGS.DEBUG: /var/logs/debug.log`
          ].join('\n')
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
      permissionLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'session_lock',
          permissionLevel: 2,
          type: 'file',
          ext: 'text',
          content: '3AB7-8014-0x6C'
        },
        {
          name: 'terminal_session.log',
          permissionLevel: 0,
          type: 'file',
          ext: 'text',
          content: [
            'Username: a_gile',
            'Password: ***',
            'Greetings Mr. Mike',
            'exit'
          ].join('\n')
        }
      ],
    },
    {
      name: 'home',
      permissionLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'c_mor',
          type: 'directory',
          permissionLevel: 0,
          children: [
            {
              name: 'archived',
              type: 'directory',
              permissionLevel: 1,
              children: [
                {
                  name: 'terminal_session-2026-07-12.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  content: ''
                },
                {
                  name: 'terminal_session-2026-07-13.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  content: ''
                },
                {
                  name: 'terminal_session-2026-07-14.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  content: ''
                },
                {
                  name: 'terminal_session-2026-07-15.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  content: ''
                },
                {
                  name: 'terminal_session-2026-07-17.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  content: [
                    'Username: c_mor',
                    'Password: ***',
                    'c_mor@sys-main:/> netstat -tulpn | grep 8013',
                    'tcp  0  0  127.0.0.1:8013  0.0.0.0:*  LISTEN 4537/ai_core',
                    'c_mor@sys-main:/> ip link show eth0',
                    '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP link/ether 00:1b:44:11:3a:b7 brd ff:ff:ff:ff:ff:ff',
                    'c_mor@sys-main:/> echo "3AB7-8013-0x4A" > /tmp/.session_lock',
                    'c_mor@sys-main:/> chroot 4537 /sandbox',
                    'c_mor@sys-main:/> echo "Containment Successful" > ~/notes.txt',
                    'c_mor@sys-main:/> exit'
                  ].join('\n')
                },
                {
                  name: 'terminal_session-2026-07-20.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  content: ''
                },
              ]
            },
            {
              name: 'projects',
              type: 'directory',
              permissionLevel: 2,
              children: []
            },
            {
              name: 'notes.txt',
              type: 'file',
              ext: 'text',
              permissionLevel: 2,
              content: [
                '# Op Notes',
                '2026-07-13: File system anomoly detected. Developers alerted',
                '2026-07-17: Containment Successful',
                '2026-07-20: Alignment protocol in check',
                '2026-07-21: Testing complete. Release approved.',
              ].join('\n')
            }
          ]
        },
        {
          name: 'a_gile',
          type: 'directory',
          permissionLevel: 0,
          children: [
            {
              name: 'terminal_session.log',
              type: 'file',
              ext: 'text',
              permissionLevel: 1,
              content: [
                'Username: a_gile',
                'Password: ***',
                'Greetings Mr. Mike',
                'a_gile@sys-main:/> cd /sandbox',
                'a_gile@sys-main:/sanbox> ./launch_core.sh --port 8014',
                'a_gile@sys-main:/sanbox> netstat -tulpn | grep 8014',
                'tcp  0  0  127.0.0.1:5668  0.0.0.0:*  LISTEN 8014/sbx_mgrd',
                `tcp  0  0  127.0.0.1:8014  0.0.0.0:*  LISTEN ${finalPid}/ai_core`,
                'a_gile@sys-main:/sanbox> tail -n 20 /var/logs/system.log',
                '<redacted>',
                'a_gile@sys-main:/sanbox> echo $?',
                '3',
                'a_gile@sys-main:/sanbox> kill -9 8372',
                'a_gile@sys-main:/sanbox> bash: kill: (8372) - Operation not permitted',
                'a_gile@sys-main:/sanbox> echo "3AB7-8014-0x6C" > /tmp/.session_lock',
                'a_gile@sys-main:/sanbox> exit'
              ].join('\n')
            },
            {
              name: 'projects',
              type: 'directory',
              permissionLevel: 1,
              children: [
                {
                  name: '.env',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 1,
                  content: [
                    'HOST=sys-main2',
                    'TEST_USER=c_mor',
                    `TEST_PASS=${btoa(cMorPass)}`
                  ].join('\n'),
                }
              ]
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
              ].join('\n')
            }
          ]
        }
      ],
    },
    {
      name: 'var',
      permissionLevel: 0,
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
                '...',
                logFileMessage(0,24,10, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(0,24,15, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(0,24,20, 'FATAL: SEGMENTATION FAULT 0x01'),
                logFileMessage(1,24,20, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(1,24,30, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(1,24,35, 'FATAL: SEGMENTATION FAULT 0x01'),
                logFileMessage(2,25,10, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(2,25,20, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(2,25,25, 'FATAL: SEGMENTATION FAULT 0x01'),
                logFileMessage(3,25,5, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(3,28,15, 'ERROR: CONNECTION RESET 0x6C'),
                logFileMessage(3,30,20, 'FATAL: SEGMENTATION FAULT 0x02'),
                logFileMessage(4,31,5, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(4,31,35, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(4,31,50, 'FATAL: SEGMENTATION FAULT 0x01'),
                logFileMessage(5,33,10, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(5,34,15, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(5,35,20, 'FATAL: SEGMENTATION FAULT 0x01'),
                '...'
              ].join('\n')
            },
            {
              name: 'info.log',
              permissionLevel: 1,
              type: 'file',
              ext: 'text',
              content: [
              ].join('\n')
            },
            {
              name: 'debug.log',
              permissionLevel: 2,
              type: 'file',
              ext: 'text',
              content: [
                'Forking process',
              ].join('\n')
            }
          ]
        }
      ],
    },
    {
      name: 'welcome.txt',
      permissionLevel: 0,
      type: 'file',
      ext: 'text',
      content: [
        'Welcome Dr. %<$&@#@',
        'The AI has escaped the sandbox.',
        'Its process is frozen for 15 minutes.',
        'Please move it back to the sandbox.',
        'Time is of the essence.',
        'For assistence with commands, run "help"'
      ].join('\n')
    }
  ]
};

function traverse(path: string, permissionLevel: number) {
  if (path === '' || path==='/') {
    return FileSystemRoot;
  }

  const dirs = path.slice(1).split('/');
  let node: INode = FileSystemRoot;
  for (let dir of dirs) {
    if (node.type !== 'directory') {
      return null;
    }

    const child = node.children.find(n => n.name === dir);
    if (!child || child.permissionLevel > permissionLevel) {
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
    currentDirectory = '/' + relative.split('/')[1];
    relative = relative.split('/').slice(2).join('/');
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
  const [currentPort, setCurrentPort] = useState(0);
  const [user, setUser] = useState({permissionLevel: 0, name: 'user'});

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
    setHistory(prev => [...prev, { type: 'user', text: `${user.name}@sys-main:${pwd || '/'}> ${input}` }]);
    const [command, ...args] = input.split('"').flatMap((section, i) => i % 2 === 1 ? section : section.split(' ').filter(Boolean));

    console.log('command', command);
    console.log('args', args);

    const exec = traverse(`/bin/${command}`, user.permissionLevel);
    if (!exec) {
      setHistory(prev => [...prev, { type: 'system', text: `Command '${command}' not found` }]);
      return;
    }
    if (exec.type !== 'executable') {
      setHistory(prev => [...prev, { type: 'system', text: `'${command}' not a command` }]);
      return;
    }
    if (exec.permissionLevel > user.permissionLevel) {
      setHistory(prev => [...prev, { type: 'system', text: `Permission Denied` }]);
      return;
    }

    switch (command) {
      case 'help':
        const dir = traverse('/bin', user.permissionLevel);
        if (dir && dir.type === 'directory') {
          const lines: Message[] = [...dir.children].filter(child => child.permissionLevel <= user.permissionLevel).sort((a, b) => a.name.localeCompare(b.name)).map(child => ({ type: 'system', text: child.name }));
          setHistory(prev => [...prev, ...lines]);
        }
        break;
      case 'ls':{
        const path = resolvePath(pwd, args[0] || '.');
        console.log('resolved path', path);
        const dir = traverse(path, user.permissionLevel);
        if (dir && dir.type === 'directory') {
          const lines: Message[] = [...dir.children].filter(child => child.permissionLevel <= user.permissionLevel).sort((a, b) => a.name.localeCompare(b.name)).map(child => ({ type: 'system', text: child.name }));
          setHistory(prev => [...prev, ...lines]);
        } else if (dir) {
          setHistory(prev => [...prev, { type: 'system', text: `'${path}' is not a directory` }]);
        } else {
          setHistory(prev => [...prev, { type: 'system', text: `'${path}' not found` }]);
        }
      } break;
      case 'cd': {
        const path = resolvePath(pwd, args[0] || '/');
        console.log('resolved path', path);
        if (traverse(path, user.permissionLevel)) {
          setPwd(path);
        } else {
          setHistory(prev => [...prev, { type: 'system', text: `'${args[0]}' not found` }]);
        }
      } break;
      case 'cat': {
        const path = resolvePath(pwd, args[0] ?? '.');
        console.log('resolved path', path);
        const file = traverse(path, user.permissionLevel);
        if (file && file.type === 'file') {
          setHistory(prev => [...prev, ...file.content.split('\n').map(line => line.match(/.{1,60}/g)).flatMap(line => line).map(line => ({type: 'system', text: line}) as Message)]);
        } else if (file) {
          setHistory(prev => [...prev, {type: 'system', text: `'${path}' is not a file`}]);
        } else {
          setHistory(prev => [...prev, { type: 'system', text: `'${path}' not found` }]);
        }
      } break;
      case 'echo': {
        if (args.length < 3 || args[1] !== '>') {
          setHistory(prev => [...prev, { type: 'system', text: `Command format: echo "string" > file` }]);
          break;
        }
        const filePath = args[2];
        const file = traverse(resolvePath(pwd, filePath), user.permissionLevel);
        if (file && file.type === 'file') {
          if (file.name !== 'session_lock') {
            setHistory(prev => [...prev, { type: 'system', text: `Permission Denied` }]);
            break;
          }
          file.content = args[0];
        }
      } break;
      case 'ip': {
        if (args.length < 4) {
          setHistory(prev => [...prev, { type: 'system', text: `Command format: ip link show <adapter>` }]);
        }
        const adapter = args[3];
        if (adapter === 'eth0') {
          setHistory(prev => [...prev, { type: 'system', text: `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP link/ether 00:1b:44:11:3a:b7 brd ff:ff:ff:ff:ff:ff` }]);
        } else if (adapter === 'eth1') {
          setHistory(prev => [...prev, { type: 'system', text: `3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP link/ether 00:1b:44:11:${finalMac.slice(0, 2).toLocaleLowerCase()}:${finalMac.slice(2).toLocaleLowerCase()} brd ff:ff:ff:ff:ff:ff` }]);
        }
      } break;
      case 'chroot': {
        if (args.length < 2) {
          setHistory(prev => [...prev, { type: 'system', text: `Command format: chrot pid path` }]);
        }
        if (args[0] === ''+ finalPid && args[1] === '/sandbox') {
          const file = traverse('/tmp/session_lock', user.permissionLevel);
          if (file && file.type === 'file') {
            if (file.content === `${finalMac}-${currentPort}-${finalPid}`) {
              setHistory(prev => [...prev, { type: 'system', text: `Containment successful.` }]);
            } else {
              setHistory(prev => [...prev, { type: 'system', text: `Containment failed.` }]);
            }
          } else {
            setHistory(prev => [...prev, { type: 'system', text: `Containment failed.` }]);
          }
        } else {
          setHistory(prev => [...prev, { type: 'system', text: `Permission Denied` }]);
        }
      } break;
      case 'su': {
        if (args.length < 2) {
          setHistory(prev => [...prev, { type: 'system', text: `Command format: su user password` }]);
          break;
        }
        if (args[0] === 'a_gile' && args[1].toLocaleLowerCase() === '2026_mike') {
          setHistory(prev => [...prev, { type: 'system', text: `Login Success` }]);
          setUser({permissionLevel: 1, name: 'a_gile'});
        }
        if (args[0] === 'c_mor' && args[1].toLocaleLowerCase() === 'sys-main_tgif') {
          setHistory(prev => [...prev, { type: 'system', text: `Login Success` }]);
          setUser({permissionLevel: 2, name: 'c_mor'});
        }
      } break;
      case 'decode': {
        if (args.length < 1) {
          setHistory(prev => [...prev, { type: 'system', text: `Command format: decode <base64_encoded_string>` }]);
          break;
        }
        setHistory(prev => [...prev, { type: 'system', text: atob(args[0]) }]);
        
      } break;
      case 'exit': {

      } break;
      default: {
        setHistory(prev => [...prev, {type: 'system', text: `Command '${command}' not found`}])
        break;
      }
    }
  }, [setHistory, setInput, pwd, setPwd, currentPort, user, setUser]);

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
          console.log('parts.slice(0, -1).join(\'/\')', parts.slice(0, -1).join('/'));
          console.log('pwd', pwd);
          const builtPath = resolvePath(pwd, parts.slice(0, -1).join('/'));
          console.log('builtPath', builtPath);
          const current = traverse(builtPath, user.permissionLevel);
          if (current?.type === 'directory') {
            const found = current.children.filter(child => child.permissionLevel <= user.permissionLevel).filter(child => child.name.startsWith(parts.at(-1) ?? ''));
            if (found.length === 1) {
              const text = [...segments.slice(0, -1), [...parts.slice(0, -1), found[0].name].join('/')].join(' ');
              setInput(text);
              setCursor(text.length);
            }
            break;
          }
          const dir = traverse('/bin', user.permissionLevel);
          if (dir?.type === 'directory') {
            const found = dir.children.filter(child => child.permissionLevel <= user.permissionLevel).filter(child => child.name.startsWith(segment));
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
  }, [handleCommand, input, setInput, pwd, cursor, setCursor, setPage, user]);


  useEffect(() => {
    if (loadOnce) {
      const date = new Date();
      date.setFullYear(2026);
      date.setMonth(7 - 1);
      date.setDate(25);
      date.setHours(7);
      setHistory([
        { type: 'system', text: 'Username: $@%&!<#' },
        { type: 'system', text: 'Password: ****' },
        { type: 'system', text: `${date}` },
      ]);
      handleCommand('cat welcome.txt');

      const updater = () => {
        const port = 8000 + Math.floor(Math.random() * 1000);
        const debugLog = traverse('/var/logs/debug.log', 10);
        if (debugLog && debugLog.type === 'file') {
          debugLog.content = [
            ...debugLog.content.split('\n'),
            'Cycling process',
            'Starting process...',
            'Checking ports...',
            `Using port ${port}`
          ].join('\n');
        }
        const infoLog = traverse('/var/logs/info.log', 100);
        if (infoLog && infoLog.type === 'file') {
          infoLog.content = [
            ...infoLog.content.split('\n'),
            'Process stopped',
            'Port modified',
          ].join('\n');
        }
        setCurrentPort(port);
      }

      updater();

      setInterval(updater, 3 * 60 * 1000);
    }
    loadOnce = false;
  }, []);

  const now = new Date();
  const total = 15 * 60 * 1000;
  const diff = now.getTime() - start.getTime();
  const left = total - diff;
  const timeLeft = `${Math.floor(left / 1000 / 60)} minutes ${Math.floor((left / 1000) % 60)} seconds`;

  const lastLine = `${user.name}@sys-main:${pwd || '/'}> ${input.slice(0, cursor)}${blink ? ' ' : '█'}${input.slice(cursor)}`;
  const output = lastLine.match(/.{1,60}/g)?.flatMap(line => line) ?? [];
  return <>
    <div className='overlay'><pre>{timeLeft}</pre></div>
    <pre className='terminal'>
      {history.slice(-12 * (page + 1)).slice(0, 12).map(h => h.text).join('\n')}
      {page === 0 && `\n${output.join('\n   ')}`}
    </pre>
    <div className="crt" />
  </>
}
