import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

// 7대 역사 stage 데이터
const STAGES = [
  {
    era: "고조선 (BC 2333년)",
    question: "포켓몬과 함께 과거로! 단군왕검의 고인돌 설계도를 완성하세요!",
    targetYear: "BC 2333",
    wrongYear: "1392년",
    answerDir: "left",
    buildingName: "고조선 고인돌 유적",
    buildingImg: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=400&q=80"
  },
  {
    era: "삼국시대 (BC 57년~)",
    question: "피카츄와 함께 신라 첨성대로 이동해 별자리를 관측하세요!",
    targetYear: "BC 57년",
    wrongYear: "2026년",
    answerDir: "right",
    buildingName: "신라 첨성대 관측소",
    buildingImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
  },
  {
    era: "고려시대 (918년)",
    question: "코리아(Korea)의 시작! 고려 궁궐 황궁 미로를 탈출하세요!",
    targetYear: "918년",
    wrongYear: "1948년",
    answerDir: "left",
    buildingName: "고려 황궁 만월대",
    buildingImg: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=400&q=80"
  },
  {
    era: "조선시대 (1392년)",
    question: "세종대왕님이 한글을 창제하신 경복궁 설계도를 획득하세요!",
    targetYear: "1392년",
    wrongYear: "BC 2333",
    answerDir: "right",
    buildingName: "조선 경복궁 대청마루",
    buildingImg: "https://images.unsplash.com/photo-1538669715315-056efee0be88?auto=format&fit=crop&w=400&q=80"
  },
  {
    era: "대한제국 (1897년)",
    question: "자주독립국 대한제국의 덕수궁 석조전 박물관으로!",
    targetYear: "1897년",
    wrongYear: "1950년",
    answerDir: "left",
    buildingName: "대한제국 덕수궁 석조전",
    buildingImg: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=400&q=80"
  },
  {
    era: "대한민국 (1948년)",
    question: "대한민국 국회의사당 돔 센터로 이동하세요!",
    targetYear: "1948년",
    wrongYear: "918년",
    answerDir: "right",
    buildingName: "대한민국 국회의사당",
    buildingImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80"
  }
];

export default function App() {
  const canvasRef = useRef(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [msg, setMsg] = useState("⚡ 방향키(A/D)로 피카츄 팩맨을 조종해 올바른 연도를 먹으세요!");

  const currentStage = STAGES[stageIndex];
  const pacmanRef = useRef({ x: 1, y: 1, dirX: 0, dirY: 0, mouth: 0, mouthSpeed: 0.15 });

  // 큼직해진 대형 미로 맵 (15x9 격자)
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
    const tileSize = 48; // 타일 크기를 대폭 확대

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. 미로 그리기
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
            // 정답/오답 타깃 타일
            ctx.fillStyle = cell === 2 ? "#00c853" : "#d50000";
            ctx.beginPath();
            ctx.arc(x + 24, y + 24, 18, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px Jua";
            ctx.textAlign = "center";
            const text = cell === 2 ? currentStage.targetYear : currentStage.wrongYear;
            ctx.fillText(text, x + 24, y + 29);
          } else if (cell === 4) {
            // 포켓몬 몬스터볼 쿠키
            ctx.fillStyle = "#ff1744";
            ctx.beginPath();
            ctx.arc(x + 24, y + 24, 8, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x + 24, y + 24, 8, 0, Math.PI);
            ctx.fill();
            ctx.fillStyle = "#212121";
            ctx.fillRect(x + 16, y + 23, 16, 2);
          } else if (cell === 5) {
            // 고스트 포켓몬(유령)
            ctx.fillStyle = "#7b1fa2";
            ctx.beginPath();
            ctx.arc(x + 24, y + 20, 14, Math.PI, 0, false);
            ctx.lineTo(x + 38, y + 34);
            ctx.lineTo(x + 10, y + 34);
            ctx.fill();
            ctx.fillStyle = "#ffeb3b";
            ctx.circle?.(x + 19, y + 18, 3);
            ctx.circle?.(x + 29, y + 18, 3);
          }
        }
      }

      // 2. 메인 플레이어 (피카츄 팩맨)
      const p = pacmanRef.current;
      p.mouth += p.mouthSpeed;
      if (p.mouth > 0.4 || p.mouth < 0) p.mouthSpeed = -p.mouthSpeed;

      const px = p.x * tileSize + 24;
      const py = p.y * tileSize + 24;

      // 피카츄 노란 바디
      ctx.fillStyle = "#ffea00";
      ctx.beginPath();
      const angle = p.dirX === 1 ? 0 : p.dirX === -1 ? Math.PI : p.dirY === 1 ? Math.PI / 2 : -Math.PI / 2;
      ctx.arc(px, py, 20, angle + p.mouth, angle + Math.PI * 2 - p.mouth);
      ctx.lineTo(px, py);
      ctx.fill();

      // 피카츄 빨간 볼
      ctx.fillStyle = "#ff1744";
      ctx.beginPath();
      ctx.arc(px - 4, py + 8, 4, 0, Math.PI * 2);
      ctx.arc(px + 4, py + 8, 4, 0, Math.PI * 2);
      ctx.fill();

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
      p.dirX = dx;
      p.dirY = dy;

      const cell = mapData[newY][newX];
      if (cell === 2 || cell === 3) {
        const isCorrect = (cell === 2 && currentStage.answerDir === "left") || (cell === 3 && currentStage.answerDir === "right");
        
        if (isCorrect) {
          setScore(s => s + 1);
          setMsg("🎉 정답! 피카츄가 역사의 설계도를 완성했습니다!");
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
          setMsg("⚡ 아쉬워요! 유령 포켓몬을 피해서 올바른 연도로 움직이세요!");
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
      {/* 상단 콤팩트 HUD */}
      <header className="hud-top-compact">
        <div className="hud-left">
          <div className="era-badge-small">📜 {currentStage.era}</div>
          <div className="question-text-small">{currentStage.question}</div>
        </div>

        {/* 미니 건축물 사진 카드 (상단에 콤팩트하게 배치) */}
        <div className="building-mini-card">
          <img 
            src={currentStage.buildingImg} 
            alt={currentStage.buildingName}
            className="mini-photo"
            onError={(e) => { e.target.src = "https://via.placeholder.com/100x60?text=3D+Building"; }}
          />
          <span className="mini-title">📐 {currentStage.buildingName}</span>
        </div>
      </header>

      {/* 대형 팩맨 퍼즐 메인 미로 (화면 중심) */}
      <main className="maze-main-wrapper">
        <canvas ref={canvasRef} width={720} height={432} className="pacman-canvas-large" />
      </main>

      <div className="status-msg">{msg}</div>

      {/* 하단 좌/우 컨트롤 (시계 손 / 장갑 손) */}
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
            <h1>🎉 포켓몬 박물관 완공!</h1>
            <p>7대 역사 퍼즐 미로를 모두 통과하여 포켓몬 건축 박물관을 멋지게 완성했습니다!</p>
            <button className="restart-btn" onClick={() => { setStageIndex(0); setScore(0); setIsFinished(false); }}>
              ⚡ 다시 피카츄 팩맨 탐험하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
