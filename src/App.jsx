import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

// 7대 역사 연도 및 실제 고화질 건축/역사 사진 매칭 (Unsplash 고화질 사진)
const STAGES = [
  {
    era: "고조선 (BC 2333년)",
    question: "과거로 이동해 단군왕검의 고인돌 설계도를 완성하세요!",
    targetYear: "BC 2333",
    wrongYear: "1392년",
    answerDir: "left", // 과거 연도(왼쪽) 선택
    buildingName: "고조선 고인돌 유적",
    buildingImg: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80"
  },
  {
    era: "삼국시대 (BC 57년~)",
    question: "삼국시대 신라 첨성대로 이동하여 별을 관측하세요!",
    targetYear: "BC 57년",
    wrongYear: "2026년",
    answerDir: "right",
    buildingName: "신라 첨성대 관측소",
    buildingImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    era: "고려시대 (918년)",
    question: "코리아(Korea)의 기원! 고려 팔만대장경 궁궐로 가세요!",
    targetYear: "918년",
    wrongYear: "1948년",
    answerDir: "left",
    buildingName: "고려 황궁 만월대",
    buildingImg: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80"
  },
  {
    era: "조선시대 (1392년)",
    question: "세종대왕님이 훈민정음을 만든 경복궁으로 이동하세요!",
    targetYear: "1392년",
    wrongYear: "BC 2333",
    answerDir: "right",
    buildingName: "조선 경복궁 대청마루",
    buildingImg: "https://images.unsplash.com/photo-1538669715315-056efee0be88?auto=format&fit=crop&w=800&q=80"
  },
  {
    era: "대한제국 (1897년)",
    question: "고종 황제가 선포한 자주독립국 대한제국 석조전으로!",
    targetYear: "1897년",
    wrongYear: "1950년",
    answerDir: "left",
    buildingName: "대한제국 덕수궁 석조전",
    buildingImg: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80"
  },
  {
    era: "대한민국 (1948년)",
    question: "헌법이 제정되고 대한민국이 정식 수립된 시대로!",
    targetYear: "1948년",
    wrongYear: "918년",
    answerDir: "right",
    buildingName: "대한민국 국회의사당 돔",
    buildingImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    era: "6·25 전쟁 (1950년)",
    question: "평화와 자유를 지켜낸 무궁화 평화 기념관으로 이동!",
    targetYear: "1950년",
    wrongYear: "1897년",
    answerDir: "left",
    buildingName: "6·25 평화 기념관",
    buildingImg: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80"
  }
];

export default function App() {
  const canvasRef = useRef(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [msg, setMsg] = useState("방향키로 팩맨을 움직여 올바른 연도 쿠키를 먹으세요!");

  const currentStage = STAGES[stageIndex];

  // 팩맨 위치 및 미로 상태
  const pacmanRef = useRef({ x: 3, y: 3, dirX: 0, dirY: 0, mouth: 0, mouthSpeed: 0.15 });

  // 팩맨 미로 Map (0: 길, 1: 벽, 2: 왼쪽연도(A), 3: 오른쪽연도(B), 4: 설계도쿠키)
  const mapData = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,1,4,1,0,0,0,3,1],
    [1,0,1,1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    const tileSize = 40;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. 미로 그리기 (레트로 팩맨 네온 파란색 라인)
      for (let r = 0; r < mapData.length; r++) {
        for (let c = 0; c < mapData[r].length; c++) {
          const cell = mapData[r][c];
          const x = c * tileSize;
          const y = r * tileSize;

          if (cell === 1) {
            ctx.fillStyle = "#0d47a1";
            ctx.fillRect(x, y, tileSize, tileSize);
            ctx.strokeStyle = "#42a5f5";
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
          } else if (cell === 2 || cell === 3) {
            // 연도 텍스트 쿠키
            ctx.fillStyle = cell === 2 ? "#00e676" : "#ff1744";
            ctx.beginPath();
            ctx.arc(x + 20, y + 20, 14, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px Jua";
            ctx.textAlign = "center";
            const text = cell === 2 ? currentStage.targetYear : currentStage.wrongYear;
            ctx.fillText(text, x + 20, y + 24);
          } else if (cell === 4) {
            // 건축 설계도 파편 (노란 빛)
            ctx.fillStyle = "#ffd600";
            ctx.beginPath();
            ctx.arc(x + 20, y + 20, 7, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 2. 노란 팩맨 그리기 (입 벌리는 애니메이션)
      const p = pacmanRef.current;
      p.mouth += p.mouthSpeed;
      if (p.mouth > 0.4 || p.mouth < 0) p.mouthSpeed = -p.mouthSpeed;

      const px = p.x * tileSize + 20;
      const py = p.y * tileSize + 20;

      ctx.fillStyle = "#ffea00";
      ctx.beginPath();
      const angle = p.dirX === 1 ? 0 : p.dirX === -1 ? Math.PI : p.dirY === 1 ? Math.PI / 2 : -Math.PI / 2;
      ctx.arc(px, py, 16, angle + p.mouth, angle + Math.PI * 2 - p.mouth);
      ctx.lineTo(px, py);
      ctx.fill();

      // 유령 포켓몬 (분홍 고스트)
      ctx.fillStyle = "#ff4081";
      ctx.beginPath();
      ctx.arc(6 * tileSize + 20, 3 * tileSize + 16, 14, Math.PI, 0, false);
      ctx.lineTo(6 * tileSize + 34, 3 * tileSize + 28);
      ctx.lineTo(6 * tileSize + 6, 3 * tileSize + 28);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [stageIndex, currentStage]);

  // 키보드 조작
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
        // 정답 체크 (2: 왼쪽/목표, 3: 오른쪽/오답)
        const isCorrect = (cell === 2 && currentStage.answerDir === "left") || (cell === 3 && currentStage.answerDir === "right");
        
        if (isCorrect) {
          setScore(s => s + 1);
          setMsg("✨ 정답! 팩맨이 올바른 역사의 연도를 획득했습니다!");
          confetti({ particleCount: 100, spread: 80 });

          setTimeout(() => {
            if (stageIndex + 1 >= STAGES.length) {
              setIsFinished(true);
            } else {
              setStageIndex(i => i + 1);
              pacmanRef.current.x = 3;
              pacmanRef.current.y = 3;
            }
          }, 1000);
        } else {
          setMsg("💡 아쉬워요! 유령을 피해서 정답 연도로 이동하세요!");
          setTimeout(() => {
            pacmanRef.current.x = 3;
            pacmanRef.current.y = 3;
          }, 600);
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') movePacman(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') movePacman(1, 0);
      if (e.key === 'ArrowUp' || e.key === 'w') movePacman(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') movePacman(0, 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stageIndex, isFinished]);

  return (
    <div className="game-container">
      <header className="hud-top">
        <div className="era-badge">🟡 팩맨 역사 탐험: {currentStage.era}</div>
        <p className="question-text" style={{ color: '#fff', fontSize: '20px', margin: '8px 0' }}>
          {currentStage.question}
        </p>
      </header>

      {/* 큼직하고 선명한 실제 건물 사진 레이아웃 */}
      <div className="building-card-real">
        <img 
          src={currentStage.buildingImg} 
          alt={currentStage.buildingName} 
          className="real-photo"
        />
        <div className="real-photo-title">🏛️ {currentStage.buildingName} (목표)</div>
      </div>

      {/* 진짜 팩맨 미로 캔버스 */}
      <div className="maze-wrapper">
        <canvas ref={canvasRef} width={520} height={280} className="pacman-canvas" />
      </div>

      {/* ADHD 아동을 위한 시각적 좌우 손 방향 컨트롤러 */}
      <footer className="controls-bottom">
        <button className="choice-btn left" onClick={() => movePacman(-1, 0)}>
          <span className="cue-icon">⌚</span>
          <div className="text-wrap">
            <span className="dir-label">◀ 왼쪽 이동 (시계 손 / ◀)</span>
            <span className="ans-text">연도: {currentStage.targetYear}</span>
          </div>
        </button>

        <button className="choice-btn right" onClick={() => movePacman(1, 0)}>
          <div className="text-wrap right-align">
            <span className="dir-label">오른쪽 이동 (장갑 손 / ▶)</span>
            <span className="ans-text">연도: {currentStage.wrongYear}</span>
          </div>
          <span className="cue-icon">🥊</span>
        </button>
      </footer>

      <div style={{ color: '#ffea00', fontWeight: 'bold', margin: '10px 0', fontSize: '18px' }}>
        {msg}
      </div>

      {isFinished && (
        <div className="victory-modal active">
          <div className="victory-card">
            <h1>🎉 팩맨 박물관 완공!</h1>
            <p>7개 역사 미로를 모두 통과하여 실제 고화질 역사의 3D 설계도를 완성했습니다!</p>
            <button className="restart-btn" onClick={() => { setStageIndex(0); setScore(0); setIsFinished(false); }}>
              ⚡ 다시 팩맨 탐험하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
