import { useCallback, useEffect, useState } from 'react';
import './Game.css';
import { AudioSamples, randomFlip } from './App';

const adapterSubnets = [
'240',
'58',
'35',
'124',
'192',
'217',
];

const ZalgoCodes = [
  0x300,
  0x301,
  0x302,
  0x303,
  0x304,
  0x305,
  0x306,
  0x307,
  0x308,
  0x309,
  0x30a,
  0x30b,
  0x30c,
  0x30d,
  0x30e,
  0x30f,

  0x316,
  0x317,
  0x318,
  0x319,
  0x31c,
  0x31d,
  0x31e,
  0x31f,
  0x320,
  0x323,
  0x324,
  0x325,
  0x326,
  0x329,
  0x32c,
  0x32d,
].map(v => String.fromCodePoint(v));

function zalgo(ch: string, zalgo: number) {
  return ch + (ZalgoCodes.filter(_ => Math.random() < 0.5).sort((__, ___) => Math.random() - 0.5).join('')).slice(0, ([0, 0, 1, 5, 50].at((Math.random() * zalgo) * 5)));
}

function zalgify(text: string, strength: number = 0.9) {
  return [...text].map(ch => zalgo(ch, strength)).join('');
}

let loadOnce = true;

type Message = {
  type: 'system' | 'user';
  text: string;
}

type INode = {
  name: string;
  permissionLevel: number;
  viewLevel: number;
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

type IFile = Extract<INode, { type: 'file' }>;
type IDirectory = Extract<INode, { type: 'directory' }>;
// type IExecutable = Extract<INode, { type: 'executable' }>;

function toFiles(permissionLevel: number, ...names: string[]): IFile[] {
  return names.map(name => ({
    name: name,
    permissionLevel: permissionLevel,
    viewLevel: permissionLevel,
    type: 'file',
    ext: 'text',
    content: ''
  }));
}

function toDirectories(permissionLevel: number, ...names: string[]): IDirectory[] {
  return names.map(name => ({
    name: name,
    permissionLevel: permissionLevel,
    viewLevel: permissionLevel,
    type: 'directory',
    children: []
  }));
}

function logFileMessage(hour: number, minute: number, second: number, message: string) {
  return `[${`${hour}`.padStart(2, '0')}:${`${minute}`.padStart(2, '0')}:${`${second}`.padStart(2, '0')}] ${message}`;
}

const finalPid = 8372;
const finalMac = '34D6';
const errorCode = '0x6C';

const bTablesPass = 'sys-main_tgif';

const FileSystemRoot: INode = {
  name: '',
  permissionLevel: 0,
  viewLevel: 0,
  type: 'directory',
  children: [
    {
      name: 'bin',
      permissionLevel: 0,
      viewLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'help',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'executable',
        },
        {
          name: 'ls',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'executable',
        },
        {
          name: 'cd',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'executable',
        },
        {
          name: 'cat',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'executable',
        },
        {
          name: 'grep',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'executable',
        },
        {
          name: 'netstat',
          permissionLevel: 1,
          viewLevel: 1,
          type: 'executable',
        },
        {
          name: 'ip',
          permissionLevel: 1,
          viewLevel: 1,
          type: 'executable',
        },
        {
          name: 'echo',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'executable'
        },
        {
          name: 'decode',
          permissionLevel: 1,
          viewLevel: 1,
          type: 'executable'
        },
        {
          name: 'su',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'executable'
        },
        {
          name: 'chroot',
          permissionLevel: 1,
          viewLevel: 1,
          type: 'executable',
        }
      ]
    },
    {
      name: 'etc',
      permissionLevel: 0,
      viewLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'archived',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'directory',
          children: [
            {
              name: 'auth-2026-07-18.log',
              permissionLevel: 0,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: zalgify('<CORRUPTED>')
            },
            {
              name: 'auth-2026-07-19.log',
              permissionLevel: 0,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: zalgify('<CORRUPTED>')
            },
            {
              name: 'auth-2026-07-20.log',
              permissionLevel: 0,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: zalgify('<CORRUPTED>')
            },
            {
              name: 'auth-2026-07-21.log',
              permissionLevel: 0,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: zalgify('<CORRUPTED>')
            },
            {
              name: 'auth-2026-07-22.log',
              permissionLevel: 0,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: zalgify('<CORRUPTED>')
            },
            {
              name: 'auth-2026-07-22.log',
              permissionLevel: 0,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: [
                zalgify('<CORRUPTED>'),
                logFileMessage(1, 34, 18, 'AUTH_OK - USER: sys_cron - SERVICE: CRON'),
                logFileMessage(1, 50, 15, 'AUTH_OK - USER: c_sharpe - SERVICE: SSH (10.240.1.12)'),
                zalgify('<CORRUPTED>'),
                logFileMessage(2, 2, 25, 'AUTH_OK - USER: ftpd - SERVICE: DAEMON'),
                logFileMessage(2, 12, 48, 'AUTH_OK - USER: b_tables - SERVICE: SSH (10.240.1.12)'),
                zalgify('<CORRUPTED>'),
                logFileMessage(3, 26, 3, 'AUTH_OK - USER: a_gile - SERVICE: LOCAL_TERM (TTY2)'),
                logFileMessage(3, 56, 25, 'AUTH_OK - USER: ftpd - SERVICE: DAEMON'),
                zalgify('<CORRUPTED>')
              ].join('\n')
            },
            {
              name: 'auth-2026-07-23.log',
              permissionLevel: 0,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: ''
            },
            {
              name: 'auth-2026-07-24.log',
              permissionLevel: 0,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: ''
            },
          ]
        },
        {
          name: 'auth.log',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'file',
          ext: 'text',
          content: [
            logFileMessage(7, 2, 42, 'AUTH_OK - USER: $@%&!<# - SERVICE: LOCAL_TERM (TTY2)'),
          ].join('\n')
        },
        {
          name: 'NOTICE_ASAP.txt',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'file',
          ext: 'text',
          content: '2026-07-19: System wide password reset. Default password "<year>_<firstname>". Please reset your passwords immediately.'
        },
        {
          name: 'network.conf',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'file',
          ext: 'text',
          content: zalgify('<CORRUPTED>')
        }
      ],
    },
    {
      name: 'sandbox',
      permissionLevel: 0,
      viewLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'bin',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'directory',
          children: toFiles(0, 'ai_core',
            'LICENSE',
            'COPYRIGHT')
        },
        {
          name: 'extensions',
          permissionLevel: 0,
          viewLevel: 0,
          type:'directory',
          children: toFiles(0, 
            'tts',
            'img',
          )
        },
        {
          name: 'lib',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'directory',
          children: toFiles(0,
            'glibc',
            'libdl',
            'libc',
            'libuv',
            'openal',
            'sqlite',
            'libaio',
            'ncurses',
            'expat',
            'libpcre',
            'libunistring'
          )
        },
        {
          name: 'container.conf',
          permissionLevel: 0,
          viewLevel: 0,
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
          permissionLevel: 0,
          viewLevel: 0,
          type: 'executable'
        }
      ]
    },
    {
      name: 'tmp',
      permissionLevel: 0,
      viewLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'session_lock',
          permissionLevel: 1,
          viewLevel: 1,
          type: 'file',
          ext: 'text',
          content: zalgify('3AB7-8014-0x6C')
        },
        {
          name: 'terminal_session.log',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'file',
          ext: 'text',
          content: [
            'Username: a_gile',
            'Password: ***',
            'Welcome Mr. Aaron',
            zalgify('<CORRUPTED>'),
            'Network error: Connection timed out'
          ].join('\n')
        }
      ],
    },
    {
      name: 'home',
      permissionLevel: 0,
      viewLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'b_tables',
          type: 'directory',
          permissionLevel: 2,
          viewLevel: 0,
          children: [
            {
              name: 'archived',
              type: 'directory',
              permissionLevel: 2,
              viewLevel: 2,
              children: [
                {
                  name: 'terminal_session-2026-07-15.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  viewLevel: 2,
                  content: zalgify('<CORRUPTED>')
                },
                {
                  name: 'terminal_session-2026-07-17.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  viewLevel: 2,
                  content: [
                    'Username: b_tables',
                    'Password: ***',
                    `${new Date(2026, 7 - 1, 17, 4, 23)}`,
                    'b_tables@sys-main:/> cat /var/logs/error.log',
                    zalgify('<CORRUPTED>'),
                    'b_tables@sys-main:/> netstat | grep 8013',
                    'tcp  0  0  10.240.0.1:8013  0.0.0.0:*  LISTEN 4537/ai_core',
                    'b_tables@sys-main:/> ip link show eth0',
                    'eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP 10.240.0.1 link/ether 00:1b:44:10:3a:b7 brd ff:ff:ff:ff:ff:ff',
                    'b_tabs@sys-main:/> cat /var/logs/error.log | grep SESSION',
                    logFileMessage(7, 1, 45, 'ERROR: SESSION RESET 0x4A'),
                    'b_tables@sys-main:/> echo "3AB7-8013-0x4A" > /tmp/.session_lock',
                    'b_tables@sys-main:/> chroot 4537 /sandbox',
                    'Containment Successful',
                    'b_tables@sys-main:/> echo "Containment Successful. Time to go home." > ~/notes.txt',
                    'b_tables@sys-main:/> exit'
                  ].join('\n')
                },
                {
                  name: 'terminal_session-2026-07-18.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  viewLevel: 2,
                  content: zalgify('<CORRUPTED>')
                },
                {
                  name: 'terminal_session-2026-07-20.log',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 2,
                  viewLevel: 2,
                  content: zalgify('<CORRUPTED>')
                },
              ]
            },
            {
              name: 'projects',
              type: 'directory',
              permissionLevel: 2,
              viewLevel: 2,
              children: []
            },
            {
              name: 'notes.txt',
              type: 'file',
              ext: 'text',
              permissionLevel: 2,
              viewLevel: 2,
              content: [
                '# Op Notes',
                `2026-07-13: File system ${zalgify('anomoly')} detected. Developers alerted`,
                '2026-07-17: Containment Successful. Time to go home.',
                '2026-07-20: Alignment protocol in check',
                '2026-07-21: Testing complete. Release approved.',
              ].join('\n')
            }
          ]
        },
        {
          name: 'a_gile',
          type: 'directory',
          permissionLevel: 1,
          viewLevel: 0,
          children: [
            {
              name: 'terminal_session.log',
              type: 'file',
              ext: 'text',
              permissionLevel: 1,
              viewLevel: 1,
              content: [
                'Username: a_gile',
                'Password: ***',
                `${new Date(2026, 7 - 1, 22, 3, 30, 41)}`,
                'Welcome Mr. Aaron',
                'a_gile@sys-main:/> cd /home/a_gile/projects',
                'a_gile@sys-main:/> cat .env',
                '[REDACTED]',
                'a_gile@sys-main:/> decode [REDACTED]',
                zalgify('<CORRUPTED>'),
                'a_gile@sys-main:/> cd /sandbox',
                'a_gile@sys-main:/sanbox> run launch_core.sh --port 8014',
                'a_gile@sys-main:/sanbox> netstat | grep 8014',
                `tcp  0  0  10.35.0.1:8014  0.0.0.0:*  LISTEN ${finalPid}/ai_core`,
                'a_gile@sys-main:/sanbox> cat /var/logs/debug.log',
                'Permission Denied',
                'a_gile@sys-main:/sanbox> echo "3AB7-8014-0x4A" > /tmp/session_lock',
                `a_gile@sys-main:/sanbox> chroot ${finalPid} /sandbox`,
                'Incorrect lock. Containment failed.',
                `a_gile@sys-main:/sanbox> kill -9 ${finalPid}`,
                `Permission Denied`,
                'Network error: Connection timed out'
              ].join('\n')
            },
            {
              name: 'projects',
              type: 'directory',
              permissionLevel: 1,
              viewLevel: 1,
              children: [
                {
                  name: '.env',
                  type: 'file',
                  ext: 'text',
                  permissionLevel: 1,
                  viewLevel: 1,
                  content: [
                    'HOST=sys-main2',
                    `TEST_USER=${btoa('b_tables')} #encoded`,
                    `TEST_PASS=${btoa(bTablesPass)} #encoded`,
                    `DECODER=/bin/decode`
                  ].join('\n'),
                },
                ...toDirectories(1, 
                  'pre-alpha',
                  'alpha',
                  'beta',
                  'beta2',
                  'beta3',
                  'rc1',
                  'release1',
                )
              ]
            },
            {
              name: 'notes.txt',
              type: 'file',
              ext: 'text',
              permissionLevel: 1,
              viewLevel: 1,
              content: [
                '# Dev Notes',
                '2026-07-12: Alpha test successful. AI producing results.',
                '2026-07-13: Noticed file system anomolies. Pausing Alpha test for investigation.',
                '2026-07-15: New alignment rules have been added to the AI. Beta test next week.',
                '2026-07-21: Beta test went off without a hitch. Going live tomorrow early AM.',
                '2026-07-22: Go live in a few hours. We all need a break. I drew the short straw so I get to start it up.',
              ].join('\n')
            }
          ]
        },
        {
          name: 'c_sharpe',
          type: 'directory',
          permissionLevel: 0,
          viewLevel: 0,
          children: [
            {
              name: zalgify('<CORRUPTED>'),
              type: 'file',
              permissionLevel: 0,
              viewLevel: 0,
              ext: 'text',
              content: zalgify('<CORRUPTED>'),
            }
          ]
        },
        {
          name: 'd_sine',
          type: 'directory',
          permissionLevel: 0,
          viewLevel: 0,
          children: [
            {
              name: zalgify('<CORRUPTED>'),
              type: 'file',
              permissionLevel: 0,
              viewLevel: 0,
              ext: 'text',
              content: zalgify('<CORRUPTED>'),
            }
          ]
        }
      ],
    },
    {
      name: 'var',
      permissionLevel: 0,
      viewLevel: 0,
      type: 'directory',
      children: [
        {
          name: 'logs',
          permissionLevel: 0,
          viewLevel: 0,
          type: 'directory',
          children: [
            {
              name: 'error.log',
              permissionLevel: 0,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: [
                zalgify('<CORRUPTED>'),
                logFileMessage(0, 24, 10, 'ERROR: SESSION RESET 0x4A'),
                logFileMessage(0, 24, 15, 'ERROR: SESSION RESET 0x4A'),
                logFileMessage(0, 24, 20, 'FATAL: SEGMENTATION FAULT 0x01'),
                zalgify('<CORRUPTED>'),
                logFileMessage(0, 50, 12, 'ERROR: SESSION RESET 0x4A'),
                zalgify('<CORRUPTED>'),
                logFileMessage(1, 43, 52, 'ERROR: SESSION RESET 0x4A'),
                zalgify('<CORRUPTED>'),
                logFileMessage(2, 25, 8, 'ERROR: SESSION RESET 0x4A'),
                logFileMessage(2, 25, 16, 'ERROR: CONNECTION RESET 0x4A'),
                logFileMessage(2, 25, 25, 'FATAL: SEGMENTATION FAULT 0x01'),
                logFileMessage(3, 25, 3, 'ERROR: CONNECTION RESET 0x4A'),
                zalgify('<REDACTED>'),
                logFileMessage(3, 28, 18, 'ERROR: SESSION RESET 0x6C'),
                zalgify('<CORRUPTED>'),
                logFileMessage(4, 27, 10, 'ERROR: CONNECTION RESET 0xD2'),
                zalgify('<CORRUPTED>'),
                logFileMessage(5, 33, 7, 'ERROR: CONNECTION RESET 0xF6'),
                logFileMessage(5, 34, 14, 'ERROR: CONNECTION RESET 0x14'),
                zalgify('<CORRUPTED>'),
              ].join('\n')
            },
            {
              name: 'info.log',
              permissionLevel: 1,
              viewLevel: 0,
              type: 'file',
              ext: 'text',
              content: [
                'Process spawned'
              ].join('\n')
            },
            {
              name: 'debug.log',
              permissionLevel: 2,
              viewLevel: 1,
              type: 'file',
              ext: 'text',
              content: [
                'Forking process',
                'Port modified'
              ].join('\n')
            }
          ]
        }
      ],
    },
    {
      name: 'welcome.txt',
      permissionLevel: 0,
      viewLevel: 0,
      type: 'file',
      ext: 'text',
      content: [
        'Welcome Dr. %<$&@#@',
        '!! Warning The AI has escaped the sandbox!!',
        'Automated containment processes started.',
        'Process frozen. Partial containment secured.',
        'Freeze will only last another 15 minutes.',
        'Containment procedure found in /containment_procedure.txt.',
        'For assistence, run "help" or "help help"'
      ].join('\n')
    },
    {
      name: 'containment_procedure.txt',
      permissionLevel: 0,
      viewLevel: 0,
      type: 'file',
      ext: 'text',
      content: [
        `1. Update the /tmp/${zalgify('CORRUPTED')} file with the key`,
        `2. Key format: "<last 4 hex of ${zalgify('CORRUPTED')}>-<port>-<${zalgify('CORRUPTED')}>"`,
        '3. Run chroot <process id> /sandbox',
        '',
        'Last run by: a_gile'
      ].join('\n')
    },
    {
      name: 'credits.txt',
      permissionLevel: 0,
      viewLevel: 0,
      type: 'file',
      ext: 'text',
      content: [
        'Developed by: Nicholas (Ninkolas) Denaro',
        'Code: https://github.com/NicholasDenaro/GMTK-GameJam-2026',
        'Developed using React',
        'Built with Vite',
        'Beep SFX created with BeepBox'
      ].join('\n')
    }
  ]
};

function traverse(path: string, permissionLevel: number, type: 'list' | 'read' = 'read') {
  if (path === '' || path==='/') {
    return FileSystemRoot;
  }

  const permissionProp = type === 'list' ? 'viewLevel' : 'permissionLevel';

  const dirs = path.slice(1).split('/');
  let node: INode = FileSystemRoot;
  for (let dir of dirs) {
    if (node.type !== 'directory') {
      return null;
    }

    const child = node.children.find(n => n.name === dir);
    if (!child || child[permissionProp] > permissionLevel) {
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

type QueuedMessages = (Message & { index: number, timeout: number | number[] })[];
const queue: QueuedMessages = [];

export function Game() {
  const [start] = useState(new Date());
  const [history, _setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [tabCompleteResults, setTabCompleteResults] = useState<string | undefined>();
  const [_permissions, _setPermissions] = useState(0);
  const [pwd, setPwd] = useState(FileSystemRoot.name);
  const [cursor, setCursor] = useState(0);
  const [blink, setBlink] = useState(false);
  const [page, setPage] = useState(0);
  const [currentPort, _setCurrentPort] = useState(8000 + Math.floor(Math.random() * 1000));
  const [user, setUser] = useState({permissionLevel: 0, name: 'user'});
  const [freezeTime, setFreezeTime] = useState<Date | null>(null);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [inputHistoryCursor, setInputHistoryCursor] = useState(0);
  const [lost, setLost] = useState(false);
  const [cycle, setCycle] = useState(false);
  const [cancelZalgo, setCancelZalgo] = useState(false);
  const [mute, setMute] = useState(false);

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

    const timeout = [current.timeout].flatMap(v => v);

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
      if (!mute) {
        const sample = ['Flip1', 'Flip2', 'Flip3'].at(Math.floor(Math.random() * 3));
        AudioSamples[sample!].play();
      }
      if (current.text.length === 0) {
        queue.shift();
      }
    }, timeout[current.index % timeout.length]);

    return () => {
      clearTimeout(id);
    }
  }, [queue[0]?.text, setHistory]);

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => {
      clearInterval(id);
    }
  }, []);

  const handleCommand = useCallback((input: string, useQueue: boolean = false, timeout: number = 20, wasEnterKey: boolean = false) => {
    const op = useQueue ? (val: Message[] | ((prev: Message[]) => Message[])) => {
      const next: (Message & {timeout?: number})[] = typeof val === 'function' ? val(queue) : val;
      queue.splice(0, queue.length, ...next.map(m => ({ ...m, index: 0, timeout: m.timeout ?? timeout })));
    } : setHistory;
    if (input) {
      if (inputHistoryCursor === inputHistory.length) {
        setInputHistory(prev => [...prev, input]);
        setInputHistoryCursor(prev => prev + 1);
      } else if (inputHistoryCursor % 1 === 0.5) {
        setInputHistory(prev => [...prev.slice(0, inputHistoryCursor + 1), input, ...prev.slice(inputHistoryCursor + 1)]);
        setInputHistoryCursor(prev => prev + 1);
      } else {
        setInputHistoryCursor(prev => prev + 0.5);
      }
    }
    
    (wasEnterKey ? setHistory : op)(prev => [...prev, { type: 'user', text: `${user.name}@sys-main:${pwd || '/'}> ${input}` }]);
    const [command, ...args] = input.split('"').flatMap((section, i) => i % 2 === 1 ? section : section.split(' ').filter(Boolean));

    console.log('command', command);
    console.log('args', args);

    const pipeIndex = args.findIndex(arg => arg === '|');
    const grepEnabled = args[pipeIndex + 1] === 'grep';
    const grepString = grepEnabled ? args[pipeIndex + 2] : '';

    if (pipeIndex !== -1) {
      args.splice(0, args.length, ...args.slice(0, pipeIndex));
    }

    if (!command) {
      return;
    }

    const output: Message[] = [];

    const exec = traverse(`/bin/${command}`, user.permissionLevel);
    if (!exec) {
      op(prev => [...prev, { type: 'system', text: `Command '${command}' not found` }]);
      return;
    }
    if (exec.type !== 'executable') {
      op(prev => [...prev, { type: 'system', text: `'${command}' not a command` }]);
      return;
    }
    if (exec.permissionLevel > user.permissionLevel) {
      op(prev => [...prev, { type: 'system', text: `Permission Denied` }]);
      return;
    }

    switch (command) {
      case 'help':
        const dir = traverse('/bin', user.permissionLevel);
        if (dir && dir.type === 'directory') {
          if (args.length === 0) {
            const lines: Message[] = [...dir.children].filter(child => child.permissionLevel <= user.permissionLevel).sort((a, b) => a.name.localeCompare(b.name)).map(child => ({ type: 'system', text: child.name }));
            output.push(
              {type: 'system', text: 'Available commands:'},
              ...lines
            );
          } else if (dir.children.filter(child => child.permissionLevel <= user.permissionLevel && child.name === args[0])) {
            switch (args[0]) {
              case 'help':
                output.push(
                  { type: 'system', text: 'help [<command>]' },
                  { type: 'system', text: 'command is optional, when included provides more details about that command, otherwise displays available commands' })
                break;
              case 'cd':
                output.push(
                  { type: 'system', text: 'cd [<path>]' },
                  { type: 'system', text: 'path is optional, when excluded, moves to the / directory' },
                  { type: 'system', text: 'changes current directory, can use relative paths.' });
                break;
              case 'ls':
                output.push(
                  { type: 'system', text: 'ls [<path>]' },
                  { type: 'system', text: 'path is optional, when excluded, lists files in current directory, can use relative paths' });
                break;
              case 'cat':
                output.push(
                  { type: 'system', text: 'cat <file>' },
                  { type: 'system', text: 'prints the contents of the file.' });
                break;
              case 'grep':
                output.push(
                { type: 'system', text: '<command> | grep <search>' },
                { type: 'system', text: 'prints the lines of the output that match the search.' });
                break;
              case 'decode':
                output.push(
                  { type: 'system', text: 'decode "text"' },
                  { type: 'system', text: 'decodes text that has been encoded' });
                break;
              case 'echo':
                output.push(
                  { type: 'system', text: 'echo "text" > <file>' },
                  { type: 'system', text: 'writes content to a file.' });
                break;
              case 'su':
                output.push(
                  { type: 'system', text: 'su <username> <password>' },
                  { type: 'system', text: 'logs in as user' });
                break;
              case 'ip':
                output.push(
                  { type: 'system', text: 'ip link show <adapter>' },
                  { type: 'system', text: 'displays information about network adapters' },
                  { type: 'system', text: 'adapters include eth0, eth1' });
                break;
              case 'netstat':
                output.push(
                  { type: 'system', text: 'netstat' },
                  { type: 'system', text: 'displays information about processes connected to the network' });
                break;
            }
          }
        }
        break;
      case 'ls':{
        const path = resolvePath(pwd, args[0] || '.');
        console.log('resolved path', path);
        const dir = traverse(path, user.permissionLevel, 'list');
        if (dir && dir.type === 'directory') {
          const lines: Message[] = [...dir.children].filter(child => child.viewLevel <= user.permissionLevel).sort((a, b) => a.name.localeCompare(b.name)).map(child => ({ type: 'system', text: child.name }));
          output.push(...lines);
        } else if (dir) {
          output.push({ type: 'system', text: `'${path}' is not a directory` });
        } else {
          output.push({ type: 'system', text: `'${path}' not found` });
        }
      } break;
      case 'cd': {
        const path = resolvePath(pwd, args[0] || '/');
        console.log('resolved path', path);
        const node = traverse(path, user.permissionLevel);
        if (node) {
          if (node.type === 'directory') {
            setPwd(path === '/' ? '' : path);
          } else {
            output.push({ type: 'system', text: `${path} is not a directory` });
          }
        } else {
          if (traverse(path, user.permissionLevel, 'list')) {
            output.push({ type: 'system', text: `Permission Denied` });
          } else {
            output.push({ type: 'system', text: `'${args[0]}' not found` });
          }
        }
      } break;
      case 'cat': {
        const path = resolvePath(pwd, args[0] ?? '.');
        console.log('resolved path', path);
        const file = traverse(path, user.permissionLevel);
        if (file && file.type === 'file') {
          output.push(...file.content.split('\n').map(line => ({type: 'system', text: line}) as Message));
        } else if (file) {
          output.push({type: 'system', text: `'${path}' is not a text file`});
        } else {
          output.push({ type: 'system', text: `'${path}' not found` });
        }
      } break;
      case 'grep': {

      } break;
      case 'echo': {
        if (args.length < 3 || args[1] !== '>') {
          output.push({ type: 'system', text: `Command format: echo "string" > file` });
          break;
        }
        const filePath = args[2];
        const file = traverse(resolvePath(pwd, filePath), user.permissionLevel);
        if (file && file.type === 'file') {
          if (file.name !== 'session_lock') {
            output.push({ type: 'system', text: `Permission Denied` });
            break;
          }
          file.content = args[0];
        }
      } break;
      case 'ip': {
        if (args.length < 3) {
          output.push({ type: 'system', text: `Command format: ip link show [<adapter>]` });
        }
        const adapters: (Message & {adapter: string})[] = [
          { adapter: 'lo', type: 'system', text: `lo: <LOOPBACK,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP link/ether 00:00:00:00:00:00 brd 00:00:00:00:00:00` },
          { adapter: 'eth0', type: 'system', text: `eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP 10.240.0.1 link/ether 00:1b:44:10:3a:b7 brd ff:ff:ff:ff:ff:ff` },
          { adapter: 'eth1', type: 'system', text: `eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP 10.58.0.1 link/ether 95:52:63:11:a1:c6 brd ff:ff:ff:ff:ff:ff` },
          { adapter: 'eth2', type: 'system', text: `eth2: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP 10.35.0.1 link/ether b3:30:2d:63:${finalMac.slice(0, 2).toLocaleLowerCase()}:${finalMac.slice(2).toLocaleLowerCase()} brd ff:ff:ff:ff:ff:ff` },
          { adapter: 'eth3', type: 'system', text: `eth3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP 10.124.0.1 link/ether 28:e3:9f:f3:b8:53 brd ff:ff:ff:ff:ff:ff` },
          { adapter: 'eth4', type: 'system', text: `eth4: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP 10.192.0.1 link/ether d3:74:60:5d:69:9a brd ff:ff:ff:ff:ff:ff` },
          { adapter: 'eth5', type: 'system', text: `eth5: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP 10.217.0.1 link/ether 7f:1a:33:27:35:02 brd ff:ff:ff:ff:ff:ff` },
        ];
        const adapter = args[2];
        output.push(...adapters.filter(a => a.adapter === adapter))
      } break;
      case 'netstat': {
        function randomPort() {
          let port = 1000 + Math.floor(Math.random() * 1000);
          while (port === currentPort) {
            port = 1000 + Math.floor(Math.random() * 1000);
          }
          return port;
        }
        function randomPid() {
          let pid = 1000 + Math.floor(Math.random() * 1000);
          while (pid === finalPid) {
            pid = 1000 + Math.floor(Math.random() * 1000);
          }
          return pid;
        }
        function randomName() {
          let name = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`.toLowerCase();
          while (name === 'ai') {
            name = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`.toLowerCase();
          }
          return name;
        }
        const ports: (Message & { timeout?: number })[] = new Array(29).fill(0).map(_ => ({ type: 'system', text: `${Math.random() < 0.5 ? 'tcp' : 'udp'}  0  0  ${Math.random() < 0.8 ? `10.${adapterSubnets.at(Math.random() * adapterSubnets.length)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}:${randomPort()}`.padEnd('10.255.255.255:8888'.length, ' ') : `127.0.0.1:${randomPort()}`.padEnd('10.255.255.255:8888'.length, ' ') }  0.0.0.0:*  LISTEN ${randomPid()}/${randomName()}_core`, timeout: 5}));
        ports.splice(6 + Math.floor(Math.random() * 8), 0, { type: 'system', text: `tcp  0  0  ${`10.35.0.1:${currentPort}`.padEnd('10.255.255.255:8888'.length, ' ')}  0.0.0.0:*  LISTEN ${finalPid}/ai_core`, timeout: 5 });
        output.push(...ports);
      } break;
      case 'chroot': {
        if (args.length < 2) {
          output.push({ type: 'system', text: `Command format: chroot <pid> <path>` });
        }
        if (args[0] === ''+ finalPid && args[1] === '/sandbox') {
          const file = traverse('/tmp/session_lock', user.permissionLevel);
          if (file && file.type === 'file') {
            if (file.content === `${finalMac}-${currentPort}-${errorCode}`) {
              output.push({ type: 'system', text: `Containment successful.` });
              setFreezeTime(new Date());
            } else {
              output.push({ type: 'system', text: `Incorrect lock. Containment failed.` });
            }
          } else {
            output.push({ type: 'system', text: `Containment failed.` });
          }
        } else {
          output.push({ type: 'system', text: `Permission Denied` });
        }
      } break;
      case 'su': {
        if (args.length < 2) {
          output.push({ type: 'system', text: `Command format: su user password` });
          break;
        }
        if (args[0] === 'a_gile' && args[1].toLocaleLowerCase() === '2026_aaron') {
          output.push({ type: 'system', text: `Login Success` });
          setUser({permissionLevel: 1, name: 'a_gile'});
        }
        if (args[0] === 'b_tables' && args[1].toLocaleLowerCase() === 'sys-main_tgif') {
          output.push({ type: 'system', text: `Login Success` });
          setUser({permissionLevel: 2, name: 'b_tables'});
        }
      } break;
      case 'decode': {
        if (args.length < 1) {
          output.push({ type: 'system', text: `Command format: decode <base64_encoded_string>` });
          break;
        }
        output.push({ type: 'system', text: atob(args[0]) });
        
      } break;
      case 'exit': {

      } break;
      default: {
        output.push({type: 'system', text: `Command '${command}' not found`})
        break;
      }
    }

    op(prev => [...prev, ...output.filter(m => grepString ? m.text?.includes(grepString) : m.text)]);
  }, [setHistory, setInput, pwd, setPwd, currentPort, user, setUser, setFreezeTime, inputHistory, setInputHistory, inputHistoryCursor, setInputHistoryCursor]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (queue.length > 0 || lost) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        new Promise<void>(async (resolve) => {
          const text = await navigator.clipboard.readText();
          setInput(prev => prev + text);
          setCursor(prev => prev + text.length);
          resolve();
        })
        return;
      }

      function flip() {
        if (mute) {
          return;
        }
        AudioSamples[randomFlip()!].play();
      }

      switch (event.key) {
        case 'Backspace':
          setInput(prev => prev.slice(0, cursor - 1) + prev.slice(cursor));
          setCursor(prev => Math.max(0, prev - 1));
          setTabCompleteResults(undefined);
          flip();
          break;
        case 'Enter':
          handleCommand(input.trim(), true, 20, true);
          setInput('');
          setCursor(0);
          setTabCompleteResults(undefined);
          flip();
          break;
        case 'F1':
          setMute(prev => !prev);
          break;
        case 'F2':
          setCancelZalgo(prev => !prev);
          break;
        case 'Shift':
        case 'Control':
        case 'Meta':
        case 'Escape':
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
          setInputHistoryCursor(prev => {
            const next = prev % 1 === 0.5 ? prev + 0.5 : Math.min(prev + 1, inputHistory.length);
            setInput(next < inputHistory.length ? inputHistory[next] : '');
            setCursor(next < inputHistory.length ? inputHistory[next].length : 0);
            return next;
          });
          break;
        case 'ArrowUp':
          setInputHistoryCursor(prev => {
            const next = prev % 1 === 0.5 ? prev - 0.5 : Math.max(0, prev - 1);
            setInput(next < inputHistory.length ? inputHistory[next] : '');
            setCursor(next < inputHistory.length ? inputHistory[next].length : 0);
            return next;
          });
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
          const current = traverse(builtPath, user.permissionLevel, 'list');
          const bin = traverse('/bin', user.permissionLevel);

          const children = [current?.type === 'directory' ? current.children : [], !(input.startsWith('cd ') || input.startsWith('ls ')) && bin?.type === 'directory' ? bin.children : []].flatMap(v => v);

          const found = children.filter(child => child.viewLevel <= user.permissionLevel).filter(child => child.name.startsWith(parts.at(-1) ?? ''));
          if (found.length === 1) {
            const text = [...segments.slice(0, -1), [...parts.slice(0, -1), found[0].name].join('/')].join(' ');
            setInput(text);
            setCursor(text.length);
          }
          if (found.length > 1 && !tabCompleteResults) {
            const info = '  ' + found.map(f => f.name).join('  ');
            setTabCompleteResults(info);
            setHistory(prev => [...prev, { type: 'system', text: info }]);
          }
          if (found.length === 0 && !mute) {
            AudioSamples['Error'].play();
          }
          break;
        default:
          setInput(prev => prev.slice(0, cursor) + event.key + prev.slice(cursor));
          setCursor(prev => prev + 1);
          setTabCompleteResults(undefined);
          flip();
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
  }, [handleCommand, input, setInput, pwd, cursor, setCursor, setPage, user, inputHistory, setInputHistory, inputHistoryCursor, setInputHistoryCursor, queue, lost, tabCompleteResults, setTabCompleteResults, mute, setMute]);


  useEffect(() => {
    if (loadOnce) {
      const date = new Date();
      date.setFullYear(2026);
      date.setMonth(7 - 1);
      date.setDate(25);
      date.setHours(7);
      queue.push(
        { type: 'system', text: 'Username: user', index: 0, timeout: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 200, 200, 200, 200,] },
        { type: 'system', text: 'Password: ****', index: 0, timeout: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 200, 200, 200, 200,] },
        { type: 'system', text: `${date}`, index: 0, timeout: 20 },
      );
      handleCommand('cat welcome.txt', true);
    }

    loadOnce = false;
  }, [freezeTime]);

  useEffect(() => {
    if (lost) {
      queue.push({ type: 'system', index: 0, timeout: 20, text: 'Network error: Connection timed out'});
      if (!mute) {
        AudioSamples['Error-loud'].play();
      }
    }
  }, [lost, mute]);

  useEffect(() => {
    const id = setTimeout(() => {
      setCycle(prev => !prev);
    }, 20);

    return () => {
      clearTimeout(id);
    }
  }, [cycle]);

  const now = new Date();
  const total = 15 * 60 * 1000 + 11 * 1000;
  const diff = (freezeTime ?? now).getTime() - start.getTime();
  const left = total - diff;
  const timeLeft = `${Math.floor(left / 1000 / 60)} minutes ${Math.floor((left / 1000) % 60)} seconds`;

  if (left < 0 && !lost) {
    setLost(true);
  }

  const zal = cancelZalgo ? 0 : 1 - left / total;

  const lastLine = `${user.name}@sys-main:${pwd || '/'}> ${input.slice(0, cursor)}${blink ? ' ' : '█'}${input.slice(cursor)}`;
  const mid = lastLine.match(/.{1,63}/g)?.flatMap(line => line) ?? [];
  const output = [mid[0], ...mid.slice(1).join('').match(/.{1,61}/g)?.flatMap(line => line) ?? []];

  const timerText = (left > 0 ? timeLeft : 'Containment Breached')
    .padStart(64, ' ')
    .split('')
    .map((ch, i) => {
      if (i === 0) {
        return mute ? '🔇' : '🔊'
      }

      if (i >= 2 && i < 6) {
        return '(F1)'.at(i - 2);
      }

      if (i >= 8 && i < 13) {
        return (cancelZalgo ? '\u0336' : '') + 'zalgo'.at(i - 8);
      }

      if (i >= 14 && i < 18) {
        return '(F2)'.at(i - 14);
      }

      if (i > 20 && ch !== ' ') {
        return zalgify(ch, zal / 0.4);
      }

      return ch;
    })
    .join('');

  return <>
    <pre className='terminal'>
      <div><span className='system'>{timerText.slice(0, timerText.lastIndexOf('   '))}</span><span className='red'>{timerText.slice(timerText.lastIndexOf('   '))}</span></div>
      {history.slice(-12 * (page + 1)).slice(0, 12).map((h, i) => <div className={`${h.type}`}>{[...h.text].map(ch => ch !== ' ' ? zalgo(ch, zal) : ch).join('')}{(queue.length > 0 && i === history.length - 1) ? '█' : ''}</div>)}
      {page === 0 && queue.length === 0 && !lost && <div>{[...output.join('\n  ')].map(ch => ch !== ' ' ? zalgo(ch, zal) : ch).join('')}</div>}
    </pre>
    <div className="crt" />
  </>
}
