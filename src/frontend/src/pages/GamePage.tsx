import { Gamepad2 } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Snake ─────────────────────────────────────────────────────────────────
const GRID = 20;
const CELL = 20;
const S_WIDTH = GRID * CELL;
const S_HEIGHT = GRID * CELL;
const INITIAL_SPEED = 150;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

function randomFood(snake: Point[]): Point {
  let pos: Point;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: "RIGHT" as Direction,
    nextDir: "RIGHT" as Direction,
    food: { x: 15, y: 10 } as Point,
    score: 0,
    running: false,
    gameOver: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [displayScore, setDisplayScore] = useState(0);
  const [displayBest, setDisplayBest] = useState(() => {
    try {
      return Number(localStorage.getItem("snake_best") ?? "0");
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    ctx.fillStyle = "#0B0E14";
    ctx.fillRect(0, 0, S_WIDTH, S_HEIGHT);
    ctx.fillStyle = "rgba(0,242,255,0.04)";
    for (let gx = 0; gx < GRID; gx++) {
      for (let gy = 0; gy < GRID; gy++) {
        ctx.fillRect(gx * CELL + CELL / 2 - 1, gy * CELL + CELL / 2 - 1, 2, 2);
      }
    }
    ctx.save();
    ctx.shadowColor = "#ff2255";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#ff2255";
    ctx.beginPath();
    ctx.arc(
      s.food.x * CELL + CELL / 2,
      s.food.y * CELL + CELL / 2,
      CELL / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
    s.snake.forEach((seg, i) => {
      const alpha = i === 0 ? 1 : 0.7 - (i / s.snake.length) * 0.4;
      ctx.save();
      ctx.shadowColor = "#00f2ff";
      ctx.shadowBlur = i === 0 ? 16 : 6;
      ctx.fillStyle =
        i === 0
          ? "#00f2ff"
          : `rgba(0,${Math.round(200 + (55 * i) / s.snake.length)},255,${alpha})`;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.restore();
    });
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;
    s.dir = s.nextDir;
    const head = s.snake[0];
    const newHead: Point = {
      x:
        s.dir === "LEFT" ? head.x - 1 : s.dir === "RIGHT" ? head.x + 1 : head.x,
      y: s.dir === "UP" ? head.y - 1 : s.dir === "DOWN" ? head.y + 1 : head.y,
    };
    if (
      newHead.x < 0 ||
      newHead.x >= GRID ||
      newHead.y < 0 ||
      newHead.y >= GRID
    ) {
      endGame();
      return;
    }
    if (s.snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
      endGame();
      return;
    }
    const ateFood = newHead.x === s.food.x && newHead.y === s.food.y;
    const newSnake = [newHead, ...s.snake];
    if (!ateFood) newSnake.pop();
    else {
      s.score += 1;
      s.food = randomFood(newSnake);
      setDisplayScore(s.score);
      const best = Number(localStorage.getItem("snake_best") ?? "0");
      if (s.score > best) {
        localStorage.setItem("snake_best", String(s.score));
        setDisplayBest(s.score);
      }
      if (s.score % 5 === 0)
        restartInterval(Math.max(60, INITIAL_SPEED - s.score * 4));
    }
    s.snake = newSnake;
    draw();
  }, [draw]);

  function endGame() {
    stateRef.current.running = false;
    stateRef.current.gameOver = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setGameOver(true);
    draw();
  }

  function restartInterval(speed: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, speed);
  }

  function startGame() {
    const initSnake = [{ x: 10, y: 10 }];
    stateRef.current = {
      snake: initSnake,
      dir: "RIGHT",
      nextDir: "RIGHT",
      food: randomFood(initSnake),
      score: 0,
      running: true,
      gameOver: false,
    };
    setDisplayScore(0);
    setGameOver(false);
    setStarted(true);
    restartInterval(INITIAL_SPEED);
    draw();
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const map: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
        W: "UP",
        S: "DOWN",
        A: "LEFT",
        D: "RIGHT",
      };
      const newDir = map[e.key];
      if (!newDir) return;
      e.preventDefault();
      const opp: Record<Direction, Direction> = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      };
      if (opp[newDir] !== s.dir) s.nextDir = newDir;
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    draw();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [draw]);

  const dpad = (dir: Direction) => {
    const s = stateRef.current;
    if (!s.running) return;
    const opp: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };
    if (opp[dir] !== s.dir) s.nextDir = dir;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 glass-card p-4 w-full max-w-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Score</p>
          <p className="text-primary text-2xl font-bold font-mono">
            {displayScore}
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Best</p>
          <p className="text-yellow-400 text-2xl font-bold font-mono">
            {displayBest}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-muted-foreground text-xs">Controls</p>
          <p className="text-white/60 text-xs">Arrow keys / WASD</p>
        </div>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={S_WIDTH}
          height={S_HEIGHT}
          className="rounded-xl border border-primary/20 shadow-[0_0_30px_rgba(0,242,255,0.08)]"
          style={{ maxWidth: "100%", touchAction: "none" }}
          data-ocid="snake.canvas_target"
        />
        {(!started || gameOver) && (
          <div className="absolute inset-0 rounded-xl bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            {gameOver && (
              <p className="text-red-400 text-lg font-bold tracking-widest uppercase">
                Game Over
              </p>
            )}
            {gameOver && (
              <p className="text-white/60 text-sm">Score: {displayScore}</p>
            )}
            {!started && !gameOver && (
              <p className="text-primary text-lg font-bold tracking-widest uppercase">
                Snake
              </p>
            )}
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold text-sm transition-all active:scale-95"
              data-ocid="snake.primary_button"
            >
              {gameOver ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div />
        <DPadButton label="▲" onClick={() => dpad("UP")} />
        <div />
        <DPadButton label="◀" onClick={() => dpad("LEFT")} />
        <DPadButton label="▼" onClick={() => dpad("DOWN")} />
        <DPadButton label="▶" onClick={() => dpad("RIGHT")} />
      </div>
    </div>
  );
}

// ─── Pong ──────────────────────────────────────────────────────────────────
const P_W = 400;
const P_H = 300;
const PADDLE_H = 60;
const PADDLE_W = 10;
const BALL_R = 7;

function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTime = useRef<number>(0);

  const pongState = useRef({
    playerY: P_H / 2 - PADDLE_H / 2,
    aiY: P_H / 2 - PADDLE_H / 2,
    ballX: P_W / 2,
    ballY: P_H / 2,
    ballVX: 3,
    ballVY: 2,
    playerScore: 0,
    aiScore: 0,
    running: false,
    rally: 0,
  });

  const keysHeld = useRef<Set<string>>(new Set());
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("pong_best") ?? "0");
    } catch {
      return 0;
    }
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"Player" | "AI">("Player");
  const WIN_SCORE = 7;

  const drawPong = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = pongState.current;

    ctx.fillStyle = "#0B0E14";
    ctx.fillRect(0, 0, P_W, P_H);

    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = "rgba(0,242,255,0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(P_W / 2, 0);
    ctx.lineTo(P_W / 2, P_H);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(0,242,255,0.4)";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(s.playerScore), P_W / 2 - 50, 40);
    ctx.fillText(String(s.aiScore), P_W / 2 + 50, 40);

    ctx.save();
    ctx.shadowColor = "#00f2ff";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#00f2ff";
    ctx.fillRect(10, s.playerY, PADDLE_W, PADDLE_H);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "#ff2255";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#ff2255";
    ctx.fillRect(P_W - 10 - PADDLE_W, s.aiY, PADDLE_W, PADDLE_H);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, []);

  const resetBall = useCallback((towardAI: boolean) => {
    const s = pongState.current;
    s.ballX = P_W / 2;
    s.ballY = P_H / 2;
    s.ballVX = towardAI ? 3 : -3;
    s.ballVY = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random());
    s.rally = 0;
  }, []);

  const gameLoop = useCallback(
    (ts: number) => {
      const dt = Math.min((ts - lastTime.current) / 16.67, 3);
      lastTime.current = ts;
      const s = pongState.current;
      if (!s.running) return;

      const speed = 1 + s.rally * 0.04;
      const PADDLE_SPEED = 5 * dt;

      if (
        keysHeld.current.has("ArrowUp") ||
        keysHeld.current.has("w") ||
        keysHeld.current.has("W")
      ) {
        s.playerY = Math.max(0, s.playerY - PADDLE_SPEED);
      }
      if (
        keysHeld.current.has("ArrowDown") ||
        keysHeld.current.has("s") ||
        keysHeld.current.has("S")
      ) {
        s.playerY = Math.min(P_H - PADDLE_H, s.playerY + PADDLE_SPEED);
      }

      const aiCenter = s.aiY + PADDLE_H / 2;
      const aiSpeed = (2.8 + s.rally * 0.03) * dt;
      if (aiCenter < s.ballY - 5)
        s.aiY = Math.min(P_H - PADDLE_H, s.aiY + aiSpeed);
      if (aiCenter > s.ballY + 5) s.aiY = Math.max(0, s.aiY - aiSpeed);

      s.ballX += s.ballVX * speed * dt;
      s.ballY += s.ballVY * speed * dt;

      if (s.ballY - BALL_R <= 0) {
        s.ballY = BALL_R;
        s.ballVY = Math.abs(s.ballVY);
      }
      if (s.ballY + BALL_R >= P_H) {
        s.ballY = P_H - BALL_R;
        s.ballVY = -Math.abs(s.ballVY);
      }

      if (
        s.ballX - BALL_R <= 10 + PADDLE_W &&
        s.ballX - BALL_R > 8 &&
        s.ballY >= s.playerY &&
        s.ballY <= s.playerY + PADDLE_H
      ) {
        s.ballVX = Math.abs(s.ballVX);
        const hitPos = (s.ballY - (s.playerY + PADDLE_H / 2)) / (PADDLE_H / 2);
        s.ballVY = hitPos * 4;
        s.rally++;
      }

      if (
        s.ballX + BALL_R >= P_W - 10 - PADDLE_W &&
        s.ballX + BALL_R < P_W - 8 &&
        s.ballY >= s.aiY &&
        s.ballY <= s.aiY + PADDLE_H
      ) {
        s.ballVX = -Math.abs(s.ballVX);
        const hitPos = (s.ballY - (s.aiY + PADDLE_H / 2)) / (PADDLE_H / 2);
        s.ballVY = hitPos * 4;
        s.rally++;
      }

      if (s.ballX < 0) {
        s.aiScore++;
        setAiScore(s.aiScore);
        if (s.aiScore >= WIN_SCORE) {
          s.running = false;
          setWinner("AI");
          setGameOver(true);
          drawPong();
          return;
        }
        resetBall(true);
      }
      if (s.ballX > P_W) {
        s.playerScore++;
        setPlayerScore(s.playerScore);
        const best = Number(localStorage.getItem("pong_best") ?? "0");
        if (s.playerScore > best) {
          localStorage.setItem("pong_best", String(s.playerScore));
          setBestScore(s.playerScore);
        }
        if (s.playerScore >= WIN_SCORE) {
          s.running = false;
          setWinner("Player");
          setGameOver(true);
          drawPong();
          return;
        }
        resetBall(false);
      }

      drawPong();
      rafRef.current = requestAnimationFrame(gameLoop);
    },
    [drawPong, resetBall],
  );

  function startPong() {
    const s = pongState.current;
    s.playerY = P_H / 2 - PADDLE_H / 2;
    s.aiY = P_H / 2 - PADDLE_H / 2;
    s.playerScore = 0;
    s.aiScore = 0;
    s.running = true;
    s.rally = 0;
    resetBall(true);
    setPlayerScore(0);
    setAiScore(0);
    setGameOver(false);
    setGameStarted(true);
    lastTime.current = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysHeld.current.add(e.key);
      if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysHeld.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    drawPong();
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawPong]);

  const movePaddle = (dir: "up" | "down") => {
    const s = pongState.current;
    if (!s.running) return;
    const amt = 18;
    if (dir === "up") s.playerY = Math.max(0, s.playerY - amt);
    else s.playerY = Math.min(P_H - PADDLE_H, s.playerY + amt);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 glass-card p-4 w-full max-w-[400px]">
        <div className="text-center">
          <p className="text-xs text-primary/70">You</p>
          <p className="text-primary text-2xl font-bold font-mono">
            {playerScore}
          </p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs text-white/40">Best</p>
          <p className="text-yellow-400 text-lg font-bold font-mono">
            {bestScore}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-red-400/70">AI</p>
          <p className="text-red-400 text-2xl font-bold font-mono">{aiScore}</p>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={P_W}
          height={P_H}
          className="rounded-xl border border-primary/20 shadow-[0_0_30px_rgba(0,242,255,0.08)]"
          style={{ maxWidth: "100%", touchAction: "none" }}
          data-ocid="pong.canvas_target"
        />
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 rounded-xl bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            {gameOver && (
              <p
                className={`text-lg font-bold tracking-widest uppercase ${
                  winner === "Player" ? "text-primary" : "text-red-400"
                }`}
              >
                {winner === "Player" ? "🏆 You Win!" : "😤 AI Wins"}
              </p>
            )}
            {gameOver && (
              <p className="text-white/50 text-sm">
                Score: {playerScore} – {aiScore}
              </p>
            )}
            {!gameStarted && !gameOver && (
              <>
                <p className="text-primary text-xl font-bold tracking-widest uppercase">
                  Pong
                </p>
                <p className="text-white/40 text-xs">
                  W/S or ↑/↓ to move • First to {WIN_SCORE} wins
                </p>
              </>
            )}
            <button
              type="button"
              onClick={startPong}
              className="px-6 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold text-sm transition-all active:scale-95"
              data-ocid="pong.primary_button"
            >
              {gameOver ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onPointerDown={() => movePaddle("up")}
          className="w-14 h-14 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-xl flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="pong.button"
        >
          ▲
        </button>
        <button
          type="button"
          onPointerDown={() => movePaddle("down")}
          className="w-14 h-14 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-xl flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="pong.button"
        >
          ▼
        </button>
      </div>
      <p className="text-white/30 text-xs">W/S or ↑/↓ to move paddle</p>
    </div>
  );
}

// ─── Memory Match ──────────────────────────────────────────────────────────
const EMOJIS = ["🔥", "⚡", "💎", "🎮", "🚀", "👾", "🎯", "🏆"];

type CardState = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

function makeCards(): CardState[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((emoji, id) => ({
    id,
    emoji,
    flipped: false,
    matched: false,
  }));
}

function MemoryGame() {
  const [cards, setCards] = useState<CardState[]>(makeCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [bestMoves, setBestMoves] = useState(() => {
    try {
      return Number(localStorage.getItem("memory_best_moves") ?? "0");
    } catch {
      return 0;
    }
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  function newGame() {
    setCards(makeCards());
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setWon(false);
    lockRef.current = false;
  }

  function flipCard(idx: number) {
    if (lockRef.current) return;
    const card = cards[idx];
    if (card.flipped || card.matched) return;
    if (flipped.length === 2) return;
    if (!running) setRunning(true);
    const newFlipped = [...flipped, idx];
    const newCards = cards.map((c, i) =>
      i === idx ? { ...c, flipped: true } : c,
    );
    setCards(newCards);
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        const matched = newCards.map((c, i) =>
          i === a || i === b ? { ...c, matched: true } : c,
        );
        setCards(matched);
        setFlipped([]);
        if (matched.every((c) => c.matched)) {
          setRunning(false);
          setWon(true);
          const m = moves + 1;
          const best = Number(localStorage.getItem("memory_best_moves") ?? "0");
          if (best === 0 || m < best) {
            localStorage.setItem("memory_best_moves", String(m));
            setBestMoves(m);
          }
        }
      } else {
        lockRef.current = true;
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === a || i === b ? { ...c, flipped: false } : c,
            ),
          );
          setFlipped([]);
          lockRef.current = false;
        }, 900);
      }
    }
  }

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 glass-card p-4 w-full max-w-[400px]">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Moves</p>
          <p className="text-primary text-2xl font-bold font-mono">{moves}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs text-muted-foreground">Time</p>
          <p className="text-white text-2xl font-bold font-mono">
            {fmt(seconds)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Best</p>
          <p className="text-yellow-400 text-lg font-bold font-mono">
            {bestMoves > 0 ? `${bestMoves}m` : "—"}
          </p>
        </div>
        <button
          type="button"
          onClick={newGame}
          className="ml-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold transition-all active:scale-95"
          data-ocid="memory.secondary_button"
        >
          New
        </button>
      </div>
      <div className="relative w-full max-w-[400px]">
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              onClick={() => flipCard(idx)}
              className="aspect-square rounded-xl border transition-all duration-300 select-none text-3xl flex items-center justify-center"
              style={{
                background:
                  card.flipped || card.matched
                    ? "rgba(0,242,255,0.08)"
                    : "rgba(255,255,255,0.04)",
                borderColor: card.matched
                  ? "rgba(0,242,255,0.6)"
                  : card.flipped
                    ? "rgba(0,242,255,0.35)"
                    : "rgba(255,255,255,0.08)",
                boxShadow: card.matched
                  ? "0 0 14px rgba(0,242,255,0.25)"
                  : card.flipped
                    ? "0 0 8px rgba(0,242,255,0.12)"
                    : "none",
                transform:
                  card.flipped || card.matched
                    ? "rotateY(0deg)"
                    : "rotateY(180deg)",
              }}
              data-ocid={`memory.item.${(idx % 8) + 1}`}
            >
              {card.flipped || card.matched ? card.emoji : ""}
            </button>
          ))}
        </div>
        {won && (
          <div className="absolute inset-0 rounded-xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <p className="text-4xl">🏆</p>
            <p className="text-primary text-xl font-bold tracking-wide">
              You matched them all!
            </p>
            <p className="text-white/60 text-sm">
              {moves} moves · {fmt(seconds)}
            </p>
            <button
              type="button"
              onClick={newGame}
              className="px-6 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold text-sm transition-all active:scale-95"
              data-ocid="memory.primary_button"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <p className="text-white/30 text-xs">Flip cards to find matching pairs</p>
    </div>
  );
}

// ─── Tetris ────────────────────────────────────────────────────────────────
const T_COLS = 10;
const T_ROWS = 20;
const T_CELL = 28;
const T_W = T_COLS * T_CELL;
const T_H = T_ROWS * T_CELL;

type TetroType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

const TETRO_COLORS: Record<TetroType, string> = {
  I: "#00f2ff",
  O: "#ffe600",
  T: "#b400ff",
  S: "#00ff88",
  Z: "#ff2255",
  J: "#0066ff",
  L: "#ff8800",
};

const TETROMINOS: Record<TetroType, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

type TetroCell = TetroType | null;
type TBoard = TetroCell[][];

function emptyBoard(): TBoard {
  return Array.from({ length: T_ROWS }, () => Array(T_COLS).fill(null));
}

function randomTetro(): TetroType {
  const types: TetroType[] = ["I", "O", "T", "S", "Z", "J", "L"];
  return types[Math.floor(Math.random() * types.length)];
}

function rotateCW(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  return Array.from({ length: cols }, (_, c) =>
    Array.from({ length: rows }, (__, r) => matrix[rows - 1 - r][c]),
  );
}

function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const holdRef = useRef<HTMLCanvasElement>(null);

  const boardRef = useRef<TBoard>(emptyBoard());
  const pieceRef = useRef<{
    type: TetroType;
    shape: number[][];
    x: number;
    y: number;
  } | null>(null);
  const nextRef = useRef<TetroType>(randomTetro());
  const holdTypeRef = useRef<TetroType | null>(null);
  const holdUsedRef = useRef(false);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(1);
  const runningRef = useRef(false);
  const gameOverRef = useRef(false);
  const dropIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("tetris_best") ?? "0");
    } catch {
      return 0;
    }
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  function spawnPiece(type?: TetroType) {
    const t = type ?? nextRef.current;
    nextRef.current = randomTetro();
    const shape = TETROMINOS[t].map((r) => [...r]);
    const x = Math.floor((T_COLS - shape[0].length) / 2);
    pieceRef.current = { type: t, shape, x, y: 0 };
  }

  function isValid(
    shape: number[][],
    x: number,
    y: number,
    board: TBoard,
  ): boolean {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const nx = x + c;
        const ny = y + r;
        if (nx < 0 || nx >= T_COLS || ny >= T_ROWS) return false;
        if (ny >= 0 && board[ny][nx]) return false;
      }
    }
    return true;
  }

  function lockPiece() {
    const p = pieceRef.current;
    if (!p) return;
    const board = boardRef.current;
    for (let r = 0; r < p.shape.length; r++) {
      for (let c = 0; c < p.shape[r].length; c++) {
        if (!p.shape[r][c]) continue;
        const ny = p.y + r;
        const nx = p.x + c;
        if (ny < 0) {
          // Game over
          runningRef.current = false;
          gameOverRef.current = true;
          setIsGameOver(true);
          if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
          return;
        }
        board[ny][nx] = p.type;
      }
    }
    // Clear lines
    let cleared = 0;
    for (let r = T_ROWS - 1; r >= 0; r--) {
      if (board[r].every((cell) => cell !== null)) {
        board.splice(r, 1);
        board.unshift(Array(T_COLS).fill(null));
        cleared++;
        r++;
      }
    }
    if (cleared > 0) {
      const points = [0, 100, 300, 500, 800][cleared] ?? 800;
      scoreRef.current += points * levelRef.current;
      linesRef.current += cleared;
      levelRef.current = Math.floor(linesRef.current / 10) + 1;
      setScore(scoreRef.current);
      setLines(linesRef.current);
      setLevel(levelRef.current);
      const best = Number(localStorage.getItem("tetris_best") ?? "0");
      if (scoreRef.current > best) {
        localStorage.setItem("tetris_best", String(scoreRef.current));
        setBestScore(scoreRef.current);
      }
      restartDropInterval();
    }
    holdUsedRef.current = false;
    spawnPiece();
    drawAll();
  }

  function restartDropInterval() {
    if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    const speed = Math.max(80, 600 - (levelRef.current - 1) * 50);
    dropIntervalRef.current = setInterval(() => {
      softDrop();
    }, speed);
  }

  function softDrop() {
    const p = pieceRef.current;
    if (!p || !runningRef.current) return;
    if (isValid(p.shape, p.x, p.y + 1, boardRef.current)) {
      p.y += 1;
    } else {
      lockPiece();
    }
    drawAll();
  }

  function hardDrop() {
    const p = pieceRef.current;
    if (!p || !runningRef.current) return;
    while (isValid(p.shape, p.x, p.y + 1, boardRef.current)) {
      p.y += 1;
    }
    lockPiece();
    drawAll();
  }

  function moveLeft() {
    const p = pieceRef.current;
    if (!p || !runningRef.current) return;
    if (isValid(p.shape, p.x - 1, p.y, boardRef.current)) p.x -= 1;
    drawAll();
  }

  function moveRight() {
    const p = pieceRef.current;
    if (!p || !runningRef.current) return;
    if (isValid(p.shape, p.x + 1, p.y, boardRef.current)) p.x += 1;
    drawAll();
  }

  function rotate() {
    const p = pieceRef.current;
    if (!p || !runningRef.current) return;
    const rotated = rotateCW(p.shape);
    if (isValid(rotated, p.x, p.y, boardRef.current)) {
      p.shape = rotated;
    } else if (isValid(rotated, p.x - 1, p.y, boardRef.current)) {
      p.shape = rotated;
      p.x -= 1;
    } else if (isValid(rotated, p.x + 1, p.y, boardRef.current)) {
      p.shape = rotated;
      p.x += 1;
    }
    drawAll();
  }

  function holdPiece() {
    const p = pieceRef.current;
    if (!p || !runningRef.current || holdUsedRef.current) return;
    holdUsedRef.current = true;
    const prev = holdTypeRef.current;
    holdTypeRef.current = p.type;
    spawnPiece(prev ?? undefined);
    drawAll();
  }

  function getGhostY(): number {
    const p = pieceRef.current;
    if (!p) return 0;
    let gy = p.y;
    while (isValid(p.shape, p.x, gy + 1, boardRef.current)) gy++;
    return gy;
  }

  function drawCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    ghost = false,
  ) {
    const px = x * T_CELL;
    const py = y * T_CELL;
    if (ghost) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.35;
      ctx.strokeRect(px + 2, py + 2, T_CELL - 4, T_CELL - 4);
      ctx.globalAlpha = 1;
      return;
    }
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = color;
    ctx.fillRect(px + 1, py + 1, T_CELL - 2, T_CELL - 2);
    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(px + 2, py + 2, T_CELL - 4, 4);
    ctx.restore();
  }

  function drawMiniPiece(
    canvas: HTMLCanvasElement,
    type: TetroType | null,
    size = 20,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0B0E14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!type) return;
    const shape = TETROMINOS[type];
    const color = TETRO_COLORS[type];
    const ox = Math.floor((canvas.width / size - shape[0].length) / 2);
    const oy = Math.floor((canvas.height / size - shape.length) / 2);
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        ctx.fillStyle = color;
        ctx.fillRect(
          (ox + c) * size + 1,
          (oy + r) * size + 1,
          size - 2,
          size - 2,
        );
      }
    }
    ctx.restore();
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop uses stable refs
  const drawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0B0E14";
    ctx.fillRect(0, 0, T_W, T_H);

    // Grid
    ctx.strokeStyle = "rgba(0,242,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let r = 0; r < T_ROWS; r++) {
      for (let c = 0; c < T_COLS; c++) {
        ctx.strokeRect(c * T_CELL, r * T_CELL, T_CELL, T_CELL);
      }
    }

    // Board
    for (let r = 0; r < T_ROWS; r++) {
      for (let c = 0; c < T_COLS; c++) {
        const cell = boardRef.current[r][c];
        if (cell) drawCell(ctx, c, r, TETRO_COLORS[cell]);
      }
    }

    // Ghost
    const p = pieceRef.current;
    if (p) {
      const gy = getGhostY();
      const color = TETRO_COLORS[p.type];
      if (gy !== p.y) {
        for (let r = 0; r < p.shape.length; r++) {
          for (let c = 0; c < p.shape[r].length; c++) {
            if (!p.shape[r][c]) continue;
            drawCell(ctx, p.x + c, gy + r, color, true);
          }
        }
      }
      // Active piece
      for (let r = 0; r < p.shape.length; r++) {
        for (let c = 0; c < p.shape[r].length; c++) {
          if (!p.shape[r][c]) continue;
          drawCell(ctx, p.x + c, p.y + r, color);
        }
      }
    }

    // Preview
    if (previewRef.current) {
      drawMiniPiece(previewRef.current, nextRef.current, 20);
    }
    if (holdRef.current) {
      drawMiniPiece(holdRef.current, holdTypeRef.current, 20);
    }
  }, []);

  function startTetris() {
    boardRef.current = emptyBoard();
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 1;
    runningRef.current = true;
    gameOverRef.current = false;
    holdTypeRef.current = null;
    holdUsedRef.current = false;
    nextRef.current = randomTetro();
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsGameOver(false);
    setGameStarted(true);
    spawnPiece();
    restartDropInterval();
    drawAll();
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game actions use stable refs
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!runningRef.current) return;
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          softDrop();
          break;
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          rotate();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        case "c":
        case "C":
        case "Shift":
          e.preventDefault();
          holdPiece();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    drawAll();
    return () => {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    };
  }, [drawAll]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Stats */}
      <div className="flex items-center gap-4 glass-card p-3 w-full max-w-[500px]">
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Score</p>
          <p className="text-primary text-xl font-bold font-mono">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Best</p>
          <p className="text-yellow-400 text-xl font-bold font-mono">
            {bestScore}
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Lines</p>
          <p className="text-white text-xl font-bold font-mono">{lines}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Level</p>
          <p className="text-accent text-xl font-bold font-mono">{level}</p>
        </div>
      </div>

      {/* Game area */}
      <div className="flex gap-3 items-start">
        {/* Hold */}
        <div className="flex flex-col gap-1 items-center">
          <p className="text-muted-foreground text-xs">Hold</p>
          <canvas
            ref={holdRef}
            width={80}
            height={80}
            className="rounded-lg border border-white/10"
            style={{ background: "#0B0E14" }}
          />
        </div>

        {/* Board */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={T_W}
            height={T_H}
            className="rounded-xl border border-primary/20 shadow-[0_0_30px_rgba(0,242,255,0.08)]"
            style={{ maxWidth: "100%", touchAction: "none", display: "block" }}
            data-ocid="tetris.canvas_target"
          />
          {(!gameStarted || isGameOver) && (
            <div className="absolute inset-0 rounded-xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              {isGameOver && (
                <>
                  <p className="text-red-400 text-xl font-bold tracking-widest uppercase">
                    Game Over
                  </p>
                  <p className="text-white/60 text-sm">Score: {score}</p>
                </>
              )}
              {!gameStarted && !isGameOver && (
                <>
                  <p className="text-primary text-2xl font-bold tracking-widest uppercase">
                    Tetris
                  </p>
                  <p className="text-white/40 text-xs text-center px-4">
                    ←→ move · ↑/W rotate · ↓ soft drop · Space hard drop ·
                    C/Shift hold
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={startTetris}
                className="px-6 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold text-sm transition-all active:scale-95"
                data-ocid="tetris.primary_button"
              >
                {isGameOver ? "Play Again" : "Start Game"}
              </button>
            </div>
          )}
        </div>

        {/* Next */}
        <div className="flex flex-col gap-1 items-center">
          <p className="text-muted-foreground text-xs">Next</p>
          <canvas
            ref={previewRef}
            width={80}
            height={80}
            className="rounded-lg border border-white/10"
            style={{ background: "#0B0E14" }}
          />
        </div>
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-[300px] mt-1">
        <button
          type="button"
          onClick={holdPiece}
          className="col-span-1 py-3 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white text-xs font-bold flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="tetris.button"
        >
          Hold
        </button>
        <button
          type="button"
          onClick={moveLeft}
          className="col-span-1 py-3 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="tetris.button"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={rotate}
          className="col-span-1 py-3 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white text-xs font-bold flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="tetris.button"
        >
          ↺
        </button>
        <button
          type="button"
          onClick={moveRight}
          className="col-span-1 py-3 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="tetris.button"
        >
          ▶
        </button>
        <button
          type="button"
          onClick={softDrop}
          className="col-span-1 py-3 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="tetris.button"
        >
          ▼
        </button>
        <button
          type="button"
          onClick={hardDrop}
          className="col-span-5 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 active:bg-primary/30 border border-primary/20 text-primary text-sm font-bold transition-all active:scale-95 select-none"
          data-ocid="tetris.primary_button"
        >
          ⬇ Hard Drop (Space)
        </button>
      </div>
    </div>
  );
}

// ─── 2048 ──────────────────────────────────────────────────────────────────
type Grid2048 = number[][];

function empty2048(): Grid2048 {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

function addRandom(grid: Grid2048): Grid2048 {
  const empties: [number, number][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) if (!grid[r][c]) empties.push([r, c]);
  if (!empties.length) return grid;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const next = grid.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRow(row: number[]): { row: number[]; score: number } {
  const filtered = row.filter(Boolean);
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged, score };
}

function moveGrid(
  grid: Grid2048,
  dir: "left" | "right" | "up" | "down",
): { grid: Grid2048; score: number; moved: boolean } {
  let totalScore = 0;
  let moved = false;
  let g = grid.map((r) => [...r]);

  // Rotate so we always slide left, then rotate back
  const rotations: Record<typeof dir, number> = {
    left: 0,
    down: 1,
    right: 2,
    up: 3,
  };
  const rot = rotations[dir];

  function rotateCCW(g2: Grid2048): Grid2048 {
    return Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (__, c) => g2[c][3 - r]),
    );
  }
  function rotateCWGrid(g2: Grid2048): Grid2048 {
    return Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (__, c) => g2[3 - c][r]),
    );
  }

  for (let i = 0; i < rot; i++) g = rotateCWGrid(g);

  const newG: Grid2048 = [];
  for (let r = 0; r < 4; r++) {
    const { row, score } = slideRow(g[r]);
    totalScore += score;
    if (row.join(",") !== g[r].join(",")) moved = true;
    newG.push(row);
  }

  let result = newG;
  for (let i = 0; i < rot; i++) result = rotateCCW(result);

  return { grid: result, score: totalScore, moved };
}

function hasMovesLeft(grid: Grid2048): boolean {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (!grid[r][c]) return true;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}

const TILE_COLORS: Record<number, { bg: string; fg: string; shadow?: string }> =
  {
    0: { bg: "rgba(255,255,255,0.04)", fg: "transparent" },
    2: { bg: "rgba(0,200,220,0.15)", fg: "#cce8ef" },
    4: { bg: "rgba(0,210,230,0.22)", fg: "#d4eef3" },
    8: {
      bg: "rgba(0,220,200,0.3)",
      fg: "#ffffff",
      shadow: "0 0 8px rgba(0,220,200,0.4)",
    },
    16: {
      bg: "rgba(0,200,120,0.35)",
      fg: "#ffffff",
      shadow: "0 0 8px rgba(0,200,120,0.4)",
    },
    32: {
      bg: "rgba(80,200,60,0.4)",
      fg: "#ffffff",
      shadow: "0 0 10px rgba(80,200,60,0.4)",
    },
    64: {
      bg: "rgba(200,200,0,0.4)",
      fg: "#ffffff",
      shadow: "0 0 10px rgba(200,200,0,0.4)",
    },
    128: {
      bg: "rgba(240,160,0,0.45)",
      fg: "#ffffff",
      shadow: "0 0 12px rgba(240,160,0,0.5)",
    },
    256: {
      bg: "rgba(240,80,0,0.45)",
      fg: "#ffffff",
      shadow: "0 0 14px rgba(240,80,0,0.5)",
    },
    512: {
      bg: "rgba(220,0,80,0.5)",
      fg: "#ffffff",
      shadow: "0 0 16px rgba(220,0,80,0.5)",
    },
    1024: {
      bg: "rgba(160,0,255,0.5)",
      fg: "#ffffff",
      shadow: "0 0 18px rgba(160,0,255,0.6)",
    },
    2048: {
      bg: "linear-gradient(135deg, #ffd700, #ff8c00, #ff2255)",
      fg: "#ffffff",
      shadow: "0 0 24px rgba(255,215,0,0.7)",
    },
  };

function getTileStyle(val: number): {
  bg: string;
  fg: string;
  shadow?: string;
} {
  return (
    TILE_COLORS[val] ?? {
      bg: "rgba(160,0,255,0.5)",
      fg: "#fff",
      shadow: "0 0 20px rgba(160,0,255,0.6)",
    }
  );
}

function Game2048() {
  const [grid, setGrid] = useState<Grid2048>(() =>
    addRandom(addRandom(empty2048())),
  );
  const [scoreState, setScoreState] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("2048_best") ?? "0");
    } catch {
      return 0;
    }
  });
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [wonAck, setWonAck] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  function newGame() {
    setGrid(addRandom(addRandom(empty2048())));
    setScoreState(0);
    setWon(false);
    setOver(false);
    setWonAck(false);
  }

  function applyMove(dir: "left" | "right" | "up" | "down") {
    if (over) return;
    setGrid((prev) => {
      const { grid: newG, score: gained, moved } = moveGrid(prev, dir);
      if (!moved) return prev;
      const withNew = addRandom(newG);
      setScoreState((s) => {
        const ns = s + gained;
        setBestScore((b) => {
          const nb = Math.max(b, ns);
          try {
            localStorage.setItem("2048_best", String(nb));
          } catch {}
          return nb;
        });
        return ns;
      });
      // Check win
      if (!won && withNew.flat().includes(2048)) setWon(true);
      if (!hasMovesLeft(withNew)) setOver(true);
      return withNew;
    });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game state tracked via closure
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
        a: "left",
        d: "right",
        w: "up",
        s: "down",
        A: "left",
        D: "right",
        W: "up",
        S: "down",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      applyMove(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [over, won]);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      applyMove(dx > 0 ? "right" : "left");
    } else {
      applyMove(dy > 0 ? "down" : "up");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Header */}
      <div className="flex items-center gap-4 glass-card p-3 w-full max-w-[340px]">
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Score</p>
          <p className="text-primary text-2xl font-bold font-mono">
            {scoreState}
          </p>
        </div>
        <div className="text-center flex-1">
          <p className="text-muted-foreground text-xs">Best</p>
          <p className="text-yellow-400 text-2xl font-bold font-mono">
            {bestScore}
          </p>
        </div>
        <button
          type="button"
          onClick={newGame}
          className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold transition-all active:scale-95"
          data-ocid="game_2048.primary_button"
        >
          New Game
        </button>
      </div>

      {/* Grid */}
      <div
        className="relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: "none" }}
        data-ocid="game_2048.canvas_target"
      >
        <div
          className="grid gap-2 p-3 rounded-2xl"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            background: "rgba(0,242,255,0.04)",
            border: "1px solid rgba(0,242,255,0.12)",
            boxShadow: "0 0 30px rgba(0,242,255,0.06)",
            width: 320,
          }}
        >
          {grid.flat().map((val, idx) => {
            const style = getTileStyle(val);
            return (
              <div
                key={`cell-${Math.floor(idx / 4)}-${idx % 4}`}
                className="flex items-center justify-center rounded-xl font-bold transition-all duration-100 select-none"
                style={{
                  width: 68,
                  height: 68,
                  background: style.bg,
                  color: style.fg,
                  boxShadow: style.shadow,
                  fontSize: val >= 1024 ? 18 : val >= 128 ? 22 : 26,
                }}
                data-ocid={`game_2048.item.${(idx % 16) + 1}`}
              >
                {val > 0 ? val : ""}
              </div>
            );
          })}
        </div>

        {/* Win overlay */}
        {won && !wonAck && (
          <div className="absolute inset-0 rounded-2xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <p className="text-5xl">🏆</p>
            <p className="text-yellow-400 text-2xl font-bold">2048!</p>
            <p className="text-white/60 text-sm">You reached 2048!</p>
            <button
              type="button"
              onClick={() => setWonAck(true)}
              className="px-6 py-2.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/40 font-semibold text-sm transition-all active:scale-95"
              data-ocid="game_2048.primary_button"
            >
              Keep Going
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {over && (
          <div className="absolute inset-0 rounded-2xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <p className="text-red-400 text-xl font-bold tracking-widest uppercase">
              Game Over
            </p>
            <p className="text-white/60 text-sm">Score: {scoreState}</p>
            <button
              type="button"
              onClick={newGame}
              className="px-6 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold text-sm transition-all active:scale-95"
              data-ocid="game_2048.button"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Mobile arrow buttons */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        <div />
        <button
          type="button"
          onClick={() => applyMove("up")}
          className="w-12 h-12 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="game_2048.button"
        >
          ▲
        </button>
        <div />
        <button
          type="button"
          onClick={() => applyMove("left")}
          className="w-12 h-12 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="game_2048.button"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => applyMove("down")}
          className="w-12 h-12 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="game_2048.button"
        >
          ▼
        </button>
        <button
          type="button"
          onClick={() => applyMove("right")}
          className="w-12 h-12 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="game_2048.button"
        >
          ▶
        </button>
      </div>
      <p className="text-white/30 text-xs">
        Arrow keys or swipe to merge tiles
      </p>
    </div>
  );
}

// ─── Game Page ─────────────────────────────────────────────────────────────
type GameTab = "snake" | "pong" | "memory" | "tetris" | "2048";

export default function GamePage() {
  const [activeGame, setActiveGame] = useState<GameTab>("snake");

  const tabs: { id: GameTab; label: string; emoji: string }[] = [
    { id: "snake", label: "Snake", emoji: "🐍" },
    { id: "pong", label: "Pong", emoji: "🏓" },
    { id: "memory", label: "Memory", emoji: "🃏" },
    { id: "tetris", label: "Tetris", emoji: "🟦" },
    { id: "2048", label: "2048", emoji: "🔢" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
          <Gamepad2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl font-display">
            Mini Games
          </h1>
          <p className="text-muted-foreground text-xs">Take a break and play</p>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex gap-1.5 flex-wrap" data-ocid="games.panel">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveGame(tab.id)}
            data-ocid="games.tab"
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border font-semibold text-sm transition-all active:scale-95 ${
              activeGame === tab.id
                ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_16px_rgba(0,242,255,0.15)]"
                : "bg-white/3 border-white/8 text-white/50 hover:bg-white/6 hover:text-white/80"
            }`}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Game */}
      <div className="flex flex-col items-center">
        {activeGame === "snake" && <SnakeGame />}
        {activeGame === "pong" && <PongGame />}
        {activeGame === "memory" && <MemoryGame />}
        {activeGame === "tetris" && <TetrisGame />}
        {activeGame === "2048" && <Game2048 />}
      </div>
    </div>
  );
}

function DPadButton({
  label,
  onClick,
}: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-12 h-12 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition-all active:scale-90 select-none"
      data-ocid="snake.button"
    >
      {label}
    </button>
  );
}
