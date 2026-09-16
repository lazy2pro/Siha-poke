import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

const gameData = [
  {
    era: "고조선 (BC 2333년)",
    question: "우리나라 최초의 국가를 세운 인물과 널리 인간을 이롭게 한다는 정신은?",
    leftOption: "단군왕검 / 홍익인간",
    rightOption: "세종대왕 / 훈민정음",
    answer: "left",
    buildingName: "고인돌 연구소",
    buildingImg: "/assets/dolmen.png"
  },
  {
    era: "삼국시대 (BC 57년~)",
    question: "고구려, 백제, 신라 세 나라가 멋지게 경쟁했던 시대는?",
    leftOption: "조선시대",
    rightOption: "삼국시대",
    answer: "right",
    buildingName: "신라 첨성대 관측소",
    buildingImg: "/assets/cheomseongdae.png"
  },
  {
    era: "조선시대 (1392년)",
    question: "이성계가 건국하고 세종대왕이 한글을 창제한 시대는?",
    leftOption: "대한제국",
    rightOption: "조선",
    answer: "right",
    buildingName: "경복궁 대청마루",
    buildingImg: "/assets/hanok.png"
  }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [pikachuPos, setPikachuPos] = useState('center'); // 'left' | 'center' | 'right'
  const [isLocked, setIsLocked] = useState(false);

  const currentQ = gameData[index];

  const handleChoice = (direction) => {
    if (isLocked || !currentQ) return;
    setIsLocked(true);
    setPikachuPos(direction);

    const isCorrect = (direction === currentQ.answer);

    setTimeout(() => {
      if (isCorrect) {
        setScore(prev => prev + 1);
        
        // 팝업 없이 그 자리에서 즉시 폭죽 발사
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          setIndex(prev => prev + 1);
          setPikachuPos('center');
          setIsLocked(false);
        }, 1200);
      } else {
        setTimeout(() => {
          setPikachuPos('center');
          setIsLocked(false);
        }, 800);
      }
    }, 400);
  };

  return (
    <div className="game-container">
      {/* 상단 퀴즈 정보 */}
      <header className="hud-top">
        <div className="era-badge">📜 {currentQ?.era}</div>
        <div className="question-box">
          <p className="question-text">{currentQ?.question}</p>
        </div>
      </header>

      {/* 메인 스테이지 */}
      <main className="stage-wrapper">
        <div className="building-card">
          <img src={currentQ?.buildingImg} alt="건물" className="building-img" />
          <div className="building-title">📐 3D {currentQ?.buildingName}</div>
        </div>

        <div className="track-line">
          <img src="/assets/eevee.png" className="side-pokemon left" alt="이브이" />
          <img src="/assets/squirtle.png" className="side-pokemon right" alt="꼬부기" />

          {/* 주인공 피카츄 */}
          <div className={`hero-pikachu ${pikachuPos}`}>
            <img src="/assets/pikachu.png" alt="피카츄" />
          </div>
        </div>
      </main>

      {/* 하단 좌/우 선택 버튼 */}
      <footer className="controls-bottom">
        <button className="choice-btn left" onClick={() => handleChoice('left')}>
          <span className="cue-icon">⌚</span>
          <div className="text-wrap">
            <span className="dir-label">◀ 왼쪽 (시계 손)</span>
            <span className="ans-text">{currentQ?.leftOption}</span>
          </div>
        </button>

        <button className="choice-btn right" onClick={() => handleChoice('right')}>
          <div className="text-wrap right-align">
            <span className="dir-label">오른쪽 (장갑 손) ▶</span>
            <span className="ans-text">{currentQ?.rightOption}</span>
          </div>
          <span className="cue-icon">🥊</span>
        </button>
      </footer>
    </div>
  );
}
