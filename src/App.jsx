import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

// 실제 고화질 건물/역사 사진 & 피카츄/포켓몬 고화질 PNG 에셋
const STAGES = [
  {
    era: "고조선 (BC 2333년)",
    question: "피카츄와 함께 단군왕검의 고인돌 유적으로 이동하세요!",
    targetYear: "BC 2333",
    wrongYear: "1392년",
    answerDir: "left",
    buildingName: "고조선 고인돌 유적",
    // 실제 고인돌 사진
    buildingImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Ganghwa_Dolmen.jpg/640px-Ganghwa_Dolmen.jpg"
  },
  {
    era: "삼국시대 (BC 57년~)",
    question: "신라 첨성대로 이동하여 별자리를 관측하세요!",
    targetYear: "BC 57년",
    wrongYear: "2026년",
    answerDir: "right",
    buildingName: "신라 첨성대 관측소",
    // 실제 첨성대 사진
    buildingImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cheomseongdae-1.jpg/640px-Cheomseongdae-1.jpg"
  },
  {
    era: "조선시대 (1392년)",
    question: "세종대왕님이 한글을 창제하신 경복궁으로 이동하세요!",
    targetYear: "1392년",
    wrongYear: "BC 2333",
    answerDir: "right",
    buildingName: "조선 경복궁 근정전",
    // 실제 경복궁 사진
    buildingImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Gyeongbokgung_Geunjeongjeon.jpg/640px-Gyeongbokgung_Geunjeongjeon.jpg"
  }
];

// 진짜 포켓몬 고화질 투명 PNG 이미지 주소
const ASSET_URLS = {
  pikachu: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  pokeball: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/sprites/items/poke-ball.png",
  ghost: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png" // 고스(Ghost) 포켓몬
};

export default function App() {
  const canvasRef = useRef(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [msg, setMsg] = useState("⚡ 방향키(A/D)로 피카츄를 조종해 올바른 연도를 먹으세요!");

  const currentStage = STAGES[stageIndex];
  const pacmanRef = useRef({ x: 1, y: 1 });

  // 이미지 객체 사전 로딩
  const imagesRef = useRef({});

  useEffect(() => {
    const pikaImg = new Image();
    pikaImg.src = ASSET_URLS.pikachu;
    const ballImg = new Image();
    ballImg.src = ASSET_URLS.pokeball;
    const ghostImg = new Image();
    ghostImg.src = ASSET_URLS.ghost;

    imagesRef.current = { pikachu: pikaImg, pokeball: ballImg, ghost: ghostImg };
  }, []);

  // 15x9 미로 격자
  const mapData = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,4,0,0,1,0,0,0,1],
    [1,2,1,0,1,0,1,1,1,0,1,0,1,3,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,5,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const tileSize = 48;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. 미로 블록 그리기
      for (let r = 0; r < mapData.length; r++) {
        for (let c = 0; c < mapData[r].length; c++) {
          const cell = mapData[r][c];
          const x = c * tileSize;
          const y = r * tileSize;

          if (cell === 1) {
            ctx.fillStyle = "#1565c0";
            ctx.fillRect(x, y, tileSize, tileSize);
            ctx.strokeStyle = "#90caf9";
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
          } else if (cell === 2 || cell === 3) {
            // 연도 선택 타깃
            ctx.fillStyle = cell === 2 ? "#00c853" : "#d50000";
            ctx.beginPath();
            ctx.arc(x + 24, y + 24, 20, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px Jua";
            ctx.textAlign = "center";
            const text = cell === 2 ? currentStage.targetYear : currentStage.wrongYear;
            ctx.fillText(text, x + 24, y + 29);
          } else if (cell === 4) {
            // 몬스터볼 아이템 사진
            const img = imagesRef.current.pokeball;
            if (img && img.complete) {
              ctx.drawImage(img, x + 12, y + 12, 24, 24);
            }
          } else if (cell === 5) {
            // 고스트 포켓몬 사진
            const img = imagesRef.current.ghost;
            if (img && img.complete) {
              ctx.drawImage(img, x + 6, y + 6, 36, 36);
            }
          }
        }
      }

      // 2. 메인 피카츄 포켓몬 렌더링 (진짜 PNG 사진)
      const p = pacmanRef.current;
      const px = p.x * tileSize + 4;
      const py = p.y * tileSize + 4;
      const pikaImg = imagesRef.current.pikachu;

      if (pikaImg && pikaImg.complete) {
        ctx.drawImage(pikaImg, px, py, 40, 40);
      } else {
        // 이미지 로딩 중 대체
        ctx.fillStyle = "#ffea00";
        ctx.beginPath();
        ctx.arc(px + 20, py + 20, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [stageIndex, currentStage]);

  const movePacman = (dx, dy) => {
    if (isFinished) return;
    const p = pacmanRef.current;
    const newX = p.x + dx;
    const newY = p.y + dy;

    if (mapData[newY] && mapData[newY][newX] !== 1) {
      p.x = newX;
      p.y = newY;

      const cell = mapData[newY][newX];
      if (cell === 2 || cell === 3) {
        const isCorrect = (cell === 2 && currentStage.answerDir === "left") || (cell === 3 && currentStage.answerDir === "right");
        
        if (isCorrect) {
          setScore(s => s + 1);
          setMsg("🎉 정답! 피카츄가 올바른 역사를 획득했습니다!");
          confetti({ particleCount: 120, spread: 90 });

          setTimeout(() => {
            if (stageIndex + 1 >= STAGES.length) {
              setIsFinished(true);
            } else {
              setStageIndex(i => i + 1);
              pacmanRef.current.x = 1;
              pacmanRef.current.y = 1;
            }
          }, 1000);
        } else {
          setMsg("⚡ 아쉬워요! 유령 포켓몬을 피해서 올바른 연도로 이동하세요!");
          setTimeout(() => {
            pacmanRef.current.x = 1;
            pacmanRef.current.y = 1;
          }, 600);
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') movePacman(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') movePacman(1, 0);
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') movePacman(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') movePacman(0, 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stageIndex, isFinished]);

  return (
    <div className="game-container">
      {/* 상단 HUD 및 진짜 건물 사진 카드 */}
      <header className="hud-top-compact">
        <div className="hud-left">
          <div className="era-badge-small">📜 {currentStage.era}</div>
          <div className="question-text-small">{currentStage.question}</div>
        </div>

        {/* 위키미디어 검증된 진짜 문화재 사진 */}
        <div className="building-mini-card">
          <img 
            src={currentStage.buildingImg} 
            alt={currentStage.buildingName}
            className="mini-photo"
          />
          <span className="mini-title">🏛️ {currentStage.buildingName}</span>
        </div>
      </header>

      {/* 진짜 피카츄가 돌아다니는 메인 미로 */}
      <main className="maze-main-wrapper">
        <canvas ref={canvasRef} width={720} height={432} className="pacman-canvas-large" />
      </main>

      <div className="status-msg">{msg}</div>

      {/* 하단 좌/우 이동 버튼 */}
      <footer className="controls-bottom">
        <button className="choice-btn left" onClick={() => movePacman(-1, 0)}>
          <span className="cue-icon">⌚</span>
          <div className="text-wrap">
            <span className="dir-label">◀ 왼쪽 (시계 손 / A키)</span>
            <span className="ans-text">연도: {currentStage.targetYear}</span>
          </div>
        </button>

        <button className="choice-btn right" onClick={() => movePacman(1, 0)}>
          <div className="text-wrap right-align">
            <span className="dir-label">오른쪽 (장갑 손 / D키) ▶</span>
            <span className="ans-text">연도: {currentStage.wrongYear}</span>
          </div>
          <span className="cue-icon">🥊</span>
        </button>
      </footer>

      {isFinished && (
        <div className="victory-modal active">
          <div className="victory-card">
            <h1>🎉 포켓몬 역사 박물관 완공!</h1>
            <p>피카츄와 함께 역사를 모두 탐험하고 멋진 박물관을 완성했습니다!</p>
            <button className="restart-btn" onClick={() => { setStageIndex(0); setScore(0); setIsFinished(false); }}>
              ⚡ 다시 피카츄 탐험하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
