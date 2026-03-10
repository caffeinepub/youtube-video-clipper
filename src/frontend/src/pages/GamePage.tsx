import { Gamepad2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

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

    // Center dashed line
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = "rgba(0,242,255,0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(P_W / 2, 0);
    ctx.lineTo(P_W / 2, P_H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Score
    ctx.fillStyle = "rgba(0,242,255,0.4)";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(s.playerScore), P_W / 2 - 50, 40);
    ctx.fillText(String(s.aiScore), P_W / 2 + 50, 40);

    // Player paddle (left)
    ctx.save();
    ctx.shadowColor = "#00f2ff";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#00f2ff";
    ctx.fillRect(10, s.playerY, PADDLE_W, PADDLE_H);
    ctx.restore();

    // AI paddle (right)
    ctx.save();
    ctx.shadowColor = "#ff2255";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#ff2255";
    ctx.fillRect(P_W - 10 - PADDLE_W, s.aiY, PADDLE_W, PADDLE_H);
    ctx.restore();

    // Ball
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

      // Player paddle movement
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

      // AI paddle — follows ball with lag
      const aiCenter = s.aiY + PADDLE_H / 2;
      const aiSpeed = (2.8 + s.rally * 0.03) * dt;
      if (aiCenter < s.ballY - 5)
        s.aiY = Math.min(P_H - PADDLE_H, s.aiY + aiSpeed);
      if (aiCenter > s.ballY + 5) s.aiY = Math.max(0, s.aiY - aiSpeed);

      // Ball movement
      s.ballX += s.ballVX * speed * dt;
      s.ballY += s.ballVY * speed * dt;

      // Top / bottom wall bounce
      if (s.ballY - BALL_R <= 0) {
        s.ballY = BALL_R;
        s.ballVY = Math.abs(s.ballVY);
      }
      if (s.ballY + BALL_R >= P_H) {
        s.ballY = P_H - BALL_R;
        s.ballVY = -Math.abs(s.ballVY);
      }

      // Player paddle collision
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

      // AI paddle collision
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

      // Scoring
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
                className={`text-lg font-bold tracking-widest uppercase ${winner === "Player" ? "text-primary" : "text-red-400"}`}
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

      {/* Mobile controls */}
      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onPointerDown={() => movePaddle("up")}
          onPointerUp={() => {}}
          className="w-14 h-14 rounded-xl bg-white/5 hover:bg-primary/20 active:bg-primary/30 border border-white/10 text-white font-bold text-xl flex items-center justify-center transition-all active:scale-90 select-none"
          data-ocid="pong.button"
        >
          ▲
        </button>
        <button
          type="button"
          onPointerDown={() => movePaddle("down")}
          onPointerUp={() => {}}
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
  // Fisher-Yates shuffle
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
        // Match!
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
        // No match — flip back
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
      {/* Stats bar */}
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

      {/* Card grid */}
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

        {/* Win overlay */}
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

// ─── Game Page ─────────────────────────────────────────────────────────────
type GameTab = "snake" | "pong" | "memory";

export default function GamePage() {
  const [activeGame, setActiveGame] = useState<GameTab>("snake");

  const tabs: { id: GameTab; label: string; emoji: string }[] = [
    { id: "snake", label: "Snake", emoji: "🐍" },
    { id: "pong", label: "Pong", emoji: "🏓" },
    { id: "memory", label: "Memory", emoji: "🃏" },
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
      <div className="flex gap-2" data-ocid="games.panel">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveGame(tab.id)}
            data-ocid="games.tab"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-semibold text-sm transition-all active:scale-95 ${
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
