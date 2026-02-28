import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "catalog" | "chat" | "history" | "profile";

interface Character {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  colorFrom: string;
  colorTo: string;
  tag: string;
  tagColor: string;
  messages: number;
  rating: number;
  personality: string[];
}

const CHARACTERS: Character[] = [
  {
    id: 1,
    name: "Аэлина",
    role: "Воительница Света",
    description: "Бесстрашная защитница королевства. Готова выслушать твои тревоги и поддержать в любую минуту.",
    image: "https://cdn.poehali.dev/projects/e1822ee5-b2c6-41f4-9ce2-8b6876385dec/files/27e4e404-9560-4d9d-8772-6b0bc280d9b7.jpg",
    colorFrom: "#06b6d4",
    colorTo: "#3b82f6",
    tag: "Поддержка",
    tagColor: "#22d3ee",
    messages: 12400,
    rating: 4.9,
    personality: ["Храбрая", "Верная", "Сострадательная"],
  },
  {
    id: 2,
    name: "Морвен",
    role: "Тёмный Маг",
    description: "Загадочный чародей из запретной академии. Говорит загадками, но всегда помогает найти истину.",
    image: "https://cdn.poehali.dev/projects/e1822ee5-b2c6-41f4-9ce2-8b6876385dec/files/31dde807-b3a4-4ac8-8667-ba6af3fd1a5c.jpg",
    colorFrom: "#7c3aed",
    colorTo: "#ec4899",
    tag: "Мистика",
    tagColor: "#a855f7",
    messages: 8900,
    rating: 4.7,
    personality: ["Загадочный", "Мудрый", "Ироничный"],
  },
  {
    id: 3,
    name: "Сиэль",
    role: "Целительница",
    description: "Добрая жрица Солнца. Дарит тепло, вдохновение и слова утешения каждому страждущему.",
    image: "https://cdn.poehali.dev/projects/e1822ee5-b2c6-41f4-9ce2-8b6876385dec/files/b9f220c1-75a7-47c5-973b-c782238be1cf.jpg",
    colorFrom: "#f59e0b",
    colorTo: "#ef4444",
    tag: "Вдохновение",
    tagColor: "#fcd34d",
    messages: 15600,
    rating: 5.0,
    personality: ["Добрая", "Мудрая", "Лучистая"],
  },
  {
    id: 4,
    name: "Кэйн",
    role: "Ассасин Теней",
    description: "Хитрый авантюрист с тёмным прошлым. Обожает истории, загадки и неожиданные повороты.",
    image: "https://cdn.poehali.dev/projects/e1822ee5-b2c6-41f4-9ce2-8b6876385dec/files/c1845ed8-525d-40f3-b023-c3b0cbadd94c.jpg",
    colorFrom: "#10b981",
    colorTo: "#06b6d4",
    tag: "Приключения",
    tagColor: "#34d399",
    messages: 7300,
    rating: 4.8,
    personality: ["Хитрый", "Смелый", "Свободный"],
  },
];

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
  time: string;
}

const BOT_REPLIES: Record<number, string[]> = {
  1: [
    "Я слышу тебя, герой. Твои слова важны для меня.",
    "Не сдавайся. Каждое испытание делает нас сильнее.",
    "Ты не один в этом пути. Я рядом.",
    "Расскажи мне больше. Я готова слушать.",
  ],
  2: [
    "Хм... интересно. Продолжай, смертный.",
    "Ответ всегда скрыт в самом вопросе.",
    "Тьма — лишь отсутствие света. Ищи его в себе.",
    "Судьба — это нить, которую ты сам плетёшь.",
  ],
  3: [
    "Свет внутри тебя никогда не угаснет! ✨",
    "Ты удивительный человек, знаешь об этом?",
    "Каждый день — это новая возможность для чуда.",
    "Я верю в тебя всем сердцем!",
  ],
  4: [
    "Хех, неожиданно. Мне нравится.",
    "В тени я слышу всё. Говори.",
    "Каждая история начинается с первого шага.",
    "Интересный ход. Что дальше?",
  ],
};

const HISTORY_DATA = [
  { id: 1, charId: 1, charName: "Аэлина", preview: "Ты справишься, герой. Я верю в тебя!", date: "Сегодня, 14:32", count: 24 },
  { id: 2, charId: 3, charName: "Сиэль", preview: "Свет всегда найдёт путь сквозь тьму...", date: "Вчера, 21:10", count: 8 },
  { id: 3, charId: 2, charName: "Морвен", preview: "Ответ скрыт в самом вопросе, смертный.", date: "28 фев, 11:05", count: 15 },
];

const AVATAR_EMOJIS = ["🧙", "🦸", "🧝", "🦊", "🐉", "🌙", "⚔️", "🔮", "🌟", "🦋", "🎭", "🧚"];
const AVATAR_COLORS = [
  "linear-gradient(135deg, #7c3aed, #ec4899)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #10b981, #06b6d4)",
  "linear-gradient(135deg, #ec4899, #f59e0b)",
  "linear-gradient(135deg, #6366f1, #a855f7)",
];

function Stars() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(70)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 10 === 0 ? "2px" : "1px",
            height: i % 10 === 0 ? "2px" : "1px",
            background: i % 5 === 0 ? "#a855f7" : i % 7 === 0 ? "#22d3ee" : "rgba(255,255,255,0.8)",
            left: `${(i * 17.3) % 100}%`,
            top: `${(i * 13.7) % 100}%`,
            opacity: 0.3 + (i % 5) * 0.1,
            animation: `float ${3 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${(i % 6) * 0.5}s`,
          }}
        />
      ))}
      <div className="absolute top-[-20%] left-[-15%] w-[500px] h-[500px] rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)" }} />
      <div className="absolute bottom-[-20%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)" }} />
    </div>
  );
}

// ─── Обложка ──────────────────────────────────────────────────────────────────
function CoverPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#0a0612" }}>
      <Stars />

      {/* Hero image */}
      <div className="relative flex-1 flex flex-col">
        <div className="absolute inset-0">
          <img
            src="https://cdn.poehali.dev/projects/e1822ee5-b2c6-41f4-9ce2-8b6876385dec/files/54fd6503-d6a8-4953-8405-302e1975ecad.jpg"
            alt="CharaWorld"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.55 }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(10,6,18,0.3) 0%, rgba(10,6,18,0.1) 30%, rgba(10,6,18,0.7) 70%, #0a0612 100%)"
          }} />
          {/* Top vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center top, transparent 40%, rgba(10,6,18,0.6) 100%)"
          }} />
        </div>

        {/* Content on top of image */}
        <div className="relative z-10 flex flex-col items-center justify-end h-full min-h-screen pb-12 px-6 pt-16">
          {/* Badge */}
          <div
            className="mb-5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(124,58,237,0.25)",
              border: "1px solid rgba(168,85,247,0.4)",
              color: "#c084fc",
              backdropFilter: "blur(10px)",
              animation: "fade-in 0.6s ease-out forwards",
            }}
          >
            ✦ Ролевое общение с ИИ ✦
          </div>

          {/* Title */}
          <h1
            className="font-russo text-center mb-3 leading-none"
            style={{
              fontSize: "clamp(3rem, 14vw, 5.5rem)",
              background: "linear-gradient(135deg, #fff 0%, #c084fc 40%, #22d3ee 80%, #fff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              animation: "fade-in 0.7s ease-out 0.1s forwards",
              opacity: 0,
            }}
          >
            Chara<br />World
          </h1>

          {/* Subtitle */}
          <p
            className="text-center mb-2 font-medium"
            style={{
              color: "rgba(196,181,253,0.85)",
              fontSize: "1.05rem",
              lineHeight: 1.5,
              maxWidth: 320,
              animation: "fade-in 0.7s ease-out 0.25s forwards",
              opacity: 0,
            }}
          >
            Живые беседы с уникальными персонажами — героями, магами и авантюристами
          </p>

          {/* Characters chips */}
          <div
            className="flex gap-2 flex-wrap justify-center mb-8 mt-3"
            style={{ animation: "fade-in 0.7s ease-out 0.35s forwards", opacity: 0 }}
          >
            {CHARACTERS.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `linear-gradient(135deg, ${c.colorFrom}22, ${c.colorTo}11)`,
                  border: `1px solid ${c.colorFrom}44`,
                  color: c.colorFrom,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="w-4 h-4 rounded-full overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                {c.name}
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div
            className="flex gap-6 mb-8"
            style={{ animation: "fade-in 0.7s ease-out 0.45s forwards", opacity: 0 }}
          >
            {[
              { value: "4+", label: "персонажа" },
              { value: "44K+", label: "диалогов" },
              { value: "★ 4.9", label: "рейтинг" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="font-russo text-xl" style={{ color: "#c084fc" }}>{s.value}</span>
                <span className="text-xs" style={{ color: "rgba(196,181,253,0.5)" }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={onEnter}
            className="w-full max-w-sm py-4 rounded-2xl font-russo text-lg tracking-wide text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
              boxShadow: "0 0 40px rgba(168,85,247,0.5), 0 4px 20px rgba(0,0,0,0.4)",
              animation: "fade-in 0.7s ease-out 0.55s forwards, glow-pulse 2.5s ease-in-out 1s infinite",
              opacity: 0,
            }}
          >
            <span className="relative z-10">Начать приключение ✦</span>
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, #6d28d9, #9333ea, #db2777)" }} />
          </button>

          <p className="mt-4 text-xs" style={{ color: "rgba(196,181,253,0.35)" }}>
            Бесплатно · Без регистрации
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Каталог ──────────────────────────────────────────────────────────────────
function CatalogPage({ characters, onStartChat }: { characters: Character[]; onStartChat: (c: Character) => void }) {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6" style={{ animation: "fade-in 0.4s ease-out forwards" }}>
        <h2 className="font-russo text-2xl mb-1 game-gradient-text">Персонажи</h2>
        <p className="text-sm" style={{ color: "rgba(196,181,253,0.6)" }}>Выбери собеседника для разговора</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {characters.map((char, i) => (
          <div
            key={char.id}
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: "linear-gradient(145deg, #1e1535, #16102a)",
              border: "1px solid #2d1f4a",
              animation: `fade-in 0.4s ease-out ${i * 0.08}s forwards`,
              opacity: 0,
            }}
          >
            <div className="flex gap-4 p-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-28 rounded-xl overflow-hidden"
                  style={{ border: `2px solid ${char.colorFrom}55` }}>
                  <img src={char.image} alt={char.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(10,6,18,0.9)", color: "#fcd34d", border: "1px solid rgba(245,158,11,0.4)" }}>
                  ★ {char.rating}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-russo text-lg leading-tight text-white">{char.name}</h3>
                    <p className="text-xs font-medium" style={{ color: char.colorFrom }}>{char.role}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${char.tagColor}22`, border: `1px solid ${char.tagColor}44`, color: char.tagColor }}>
                    {char.tag}
                  </span>
                </div>

                <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(196,181,253,0.65)" }}>
                  {char.description}
                </p>

                {/* Traits */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {char.personality.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(45,31,74,0.8)", color: "rgba(196,181,253,0.7)", border: "1px solid rgba(45,31,74,1)" }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "rgba(196,181,253,0.4)" }}>
                    💬 {char.messages.toLocaleString("ru")} сообщений
                  </span>
                  <button
                    onClick={() => onStartChat(char)}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${char.colorFrom}, ${char.colorTo})`,
                      boxShadow: `0 0 15px ${char.colorFrom}44`,
                    }}
                  >
                    Общаться →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Чат ──────────────────────────────────────────────────────────────────────
function ChatPage({
  character, characters, onSelectChar,
}: {
  character: Character | null;
  characters: Character[];
  onSelectChar: (c: Character) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim() || !character) return;
    const now = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now(), from: "user", text: input, time: now };
    const replies = BOT_REPLIES[character.id] || ["..."];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: "bot", text: reply, time: now }]);
    }, 700);
  };

  if (!character) {
    return (
      <div className="px-4 pt-6 pb-4">
        <div className="mb-6">
          <h2 className="font-russo text-2xl mb-1 game-gradient-text">Чат</h2>
          <p className="text-sm" style={{ color: "rgba(196,181,253,0.6)" }}>Выбери персонажа для разговора</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {characters.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectChar(c)}
              className="rounded-2xl overflow-hidden text-left"
              style={{ border: `1px solid ${c.colorFrom}44`, background: "linear-gradient(145deg, #1e1535, #16102a)" }}
            >
              <img src={c.image} alt={c.name} className="w-full h-32 object-cover object-top" />
              <div className="p-3">
                <p className="font-russo text-sm text-white">{c.name}</p>
                <p className="text-xs" style={{ color: c.colorFrom }}>{c.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 130px)" }}>
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid #2d1f4a", background: "rgba(10,6,18,0.5)" }}>
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
          style={{ border: `2px solid ${character.colorFrom}66` }}>
          <img src={character.image} alt={character.name} className="w-full h-full object-cover object-top" />
        </div>
        <div>
          <p className="font-russo text-sm text-white">{character.name}</p>
          <p className="text-xs" style={{ color: character.colorFrom }}>{character.role}</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #4ade80" }} />
          <span className="text-xs text-green-400">онлайн</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-60">
            <div className="w-20 h-20 rounded-2xl overflow-hidden" style={{ border: `2px solid ${character.colorFrom}44` }}>
              <img src={character.image} alt={character.name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="text-center">
              <p className="font-russo text-base text-white mb-1">{character.name}</p>
              <p className="text-xs" style={{ color: "rgba(196,181,253,0.5)" }}>Начни разговор — я жду тебя!</p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            style={{ animation: "slide-in-right 0.3s ease-out forwards" }}>
            {msg.from === "bot" && (
              <div className="w-7 h-7 rounded-lg overflow-hidden mr-2 flex-shrink-0 self-end">
                <img src={character.image} alt="" className="w-full h-full object-cover object-top" />
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${msg.from === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}>
              {msg.text}
              <div className="text-right text-xs mt-1 opacity-50">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 flex gap-2"
        style={{ borderTop: "1px solid #2d1f4a", background: "rgba(10,6,18,0.8)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={`Напиши ${character.name}...`}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-purple-900 outline-none"
          style={{ background: "#1e1535", border: "1px solid #2d1f4a" }}
        />
        <button
          onClick={sendMessage}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: `linear-gradient(135deg, ${character.colorFrom}, ${character.colorTo})`,
            boxShadow: `0 0 15px ${character.colorFrom}55`,
          }}
        >
          <Icon name="Send" size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

// ─── История ──────────────────────────────────────────────────────────────────
function HistoryPage({ onOpen }: { onOpen: (charId: number) => void }) {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6" style={{ animation: "fade-in 0.4s ease-out forwards" }}>
        <h2 className="font-russo text-2xl mb-1 game-gradient-text">История</h2>
        <p className="text-sm" style={{ color: "rgba(196,181,253,0.6)" }}>Сохранённые диалоги</p>
      </div>
      <div className="flex flex-col gap-3">
        {HISTORY_DATA.map((h, i) => {
          const char = CHARACTERS.find((c) => c.id === h.charId)!;
          return (
            <button
              key={h.id}
              onClick={() => onOpen(h.charId)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 hover:scale-[1.01]"
              style={{
                background: "linear-gradient(145deg, #1e1535, #16102a)",
                border: `1px solid ${char.colorFrom}33`,
                animation: `fade-in 0.4s ease-out ${i * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                style={{ border: `2px solid ${char.colorFrom}55` }}>
                <img src={char.image} alt={char.name} className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-russo text-sm text-white">{h.charName}</p>
                  <span className="text-xs" style={{ color: "rgba(196,181,253,0.4)" }}>{h.date}</span>
                </div>
                <p className="text-xs truncate" style={{ color: "rgba(196,181,253,0.6)" }}>"{h.preview}"</p>
                <p className="text-xs mt-1" style={{ color: char.colorFrom }}>💬 {h.count} сообщений</p>
              </div>
              <Icon name="ChevronRight" size={16} className="flex-shrink-0" style={{ color: "rgba(196,181,253,0.3)" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Профиль ──────────────────────────────────────────────────────────────────
function ProfilePage() {
  const [avatarEmoji, setAvatarEmoji] = useState("🧙");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [username, setUsername] = useState("Путник");
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("Путник");

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6" style={{ animation: "fade-in 0.4s ease-out forwards" }}>
        <h2 className="font-russo text-2xl mb-1 game-gradient-text">Профиль</h2>
        <p className="text-sm" style={{ color: "rgba(196,181,253,0.6)" }}>Твоя личная страница</p>
      </div>

      {/* Avatar block */}
      <div className="rounded-2xl p-6 mb-4 flex flex-col items-center gap-4"
        style={{ background: "linear-gradient(145deg, #1e1535, #16102a)", border: "1px solid #2d1f4a", animation: "fade-in 0.4s ease-out 0.1s forwards", opacity: 0 }}>
        <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl"
          style={{ background: avatarColor, boxShadow: "0 0 30px rgba(168,85,247,0.4)" }}>
          {avatarEmoji}
        </div>

        {editingName ? (
          <div className="flex gap-2">
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-sm text-white text-center outline-none"
              style={{ background: "#2d1f4a", border: "1px solid #7c3aed", maxWidth: 160 }}
              autoFocus
            />
            <button onClick={() => { setUsername(tempName); setEditingName(false); }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
              ✓
            </button>
          </div>
        ) : (
          <button onClick={() => { setTempName(username); setEditingName(true); }}
            className="flex items-center gap-2 group">
            <span className="font-russo text-xl text-white">{username}</span>
            <Icon name="Pencil" size={14} className="text-purple-600 group-hover:text-purple-400 transition-colors" />
          </button>
        )}

        <div className="px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", color: "#fcd34d" }}>
          ⚡ 1 200 XP · Уровень 5
        </div>
      </div>

      {/* Emoji picker */}
      <div className="rounded-2xl p-4 mb-4"
        style={{ background: "linear-gradient(145deg, #1e1535, #16102a)", border: "1px solid #2d1f4a", animation: "fade-in 0.4s ease-out 0.2s forwards", opacity: 0 }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "rgba(196,181,253,0.6)" }}>ВЫБЕРИ АВАТАР</p>
        <div className="grid grid-cols-6 gap-2">
          {AVATAR_EMOJIS.map((e) => (
            <button key={e} onClick={() => setAvatarEmoji(e)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-150"
              style={avatarEmoji === e ? { background: "rgba(124,58,237,0.4)", border: "2px solid #7c3aed" } : { background: "rgba(45,31,74,0.5)", border: "2px solid transparent" }}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div className="rounded-2xl p-4 mb-4"
        style={{ background: "linear-gradient(145deg, #1e1535, #16102a)", border: "1px solid #2d1f4a", animation: "fade-in 0.4s ease-out 0.3s forwards", opacity: 0 }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "rgba(196,181,253,0.6)" }}>ЦВЕТ АВАТАРА</p>
        <div className="flex gap-3">
          {AVATAR_COLORS.map((col) => (
            <button key={col} onClick={() => setAvatarColor(col)}
              className="w-9 h-9 rounded-xl transition-all duration-150"
              style={{
                background: col,
                border: avatarColor === col ? "2px solid white" : "2px solid transparent",
                transform: avatarColor === col ? "scale(1.15)" : "scale(1)",
                boxShadow: avatarColor === col ? "0 0 12px rgba(255,255,255,0.3)" : "none",
              }} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3"
        style={{ animation: "fade-in 0.4s ease-out 0.4s forwards", opacity: 0 }}>
        {[
          { label: "Диалогов", value: "47", icon: "MessageCircle" },
          { label: "Персонажей", value: "4", icon: "Sparkles" },
          { label: "Дней подряд", value: "12", icon: "Flame" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-3 flex flex-col items-center gap-1"
            style={{ background: "linear-gradient(145deg, #1e1535, #16102a)", border: "1px solid #2d1f4a" }}>
            <Icon name={s.icon} fallback="Star" size={18} className="text-purple-400" />
            <span className="font-russo text-lg text-white">{s.value}</span>
            <span className="text-xs" style={{ color: "rgba(196,181,253,0.5)" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Главный компонент ─────────────────────────────────────────────────────────
export default function Index() {
  const [showCover, setShowCover] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("catalog");
  const [activeChar, setActiveChar] = useState<Character | null>(null);

  if (showCover) {
    return <CoverPage onEnter={() => setShowCover(false)} />;
  }

  const handleStartChat = (char: Character) => {
    setActiveChar(char);
    setActiveTab("chat");
  };

  const handleHistoryOpen = (charId: number) => {
    setActiveChar(CHARACTERS.find((c) => c.id === charId) || null);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen font-rubik" style={{ background: "#0a0612" }}>
      <Stars />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(10,6,18,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(45,31,74,0.6)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
            <span className="text-white text-xs">✦</span>
          </div>
          <span className="font-russo text-base tracking-wide game-gradient-text">CharaWorld</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#fcd34d" }}>
            ⚡ 1 200 XP
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pb-24 relative z-10">
        {activeTab === "catalog" && <CatalogPage characters={CHARACTERS} onStartChat={handleStartChat} />}
        {activeTab === "chat" && <ChatPage character={activeChar} characters={CHARACTERS} onSelectChar={setActiveChar} />}
        {activeTab === "history" && <HistoryPage onOpen={handleHistoryOpen} />}
        {activeTab === "profile" && <ProfilePage />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-3"
        style={{ background: "rgba(10,6,18,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(45,31,74,0.6)" }}>
        {([
          { key: "catalog", icon: "Sparkles", label: "Персонажи" },
          { key: "chat", icon: "MessageCircle", label: "Чат" },
          { key: "history", icon: "BookOpen", label: "История" },
          { key: "profile", icon: "User", label: "Профиль" },
        ] as { key: Tab; icon: string; label: string }[]).map((item) => (
          <button key={item.key} onClick={() => setActiveTab(item.key)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
            style={activeTab === item.key ? {
              background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.1))",
              border: "1px solid rgba(124,58,237,0.4)",
            } : { border: "1px solid transparent" }}>
            <Icon name={item.icon} fallback="Star" size={20}
              className={activeTab === item.key ? "text-purple-400" : "text-gray-500"} />
            <span className={`text-xs font-medium ${activeTab === item.key ? "text-purple-300" : "text-gray-600"}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}