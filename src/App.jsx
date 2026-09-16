import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

// 3D 입체 건물 그래픽 (SVG 내장 - 엑박 절대 없음)
const BuildingVisuals = {
  dolmen: (
    <svg width="140" height="90" viewBox="0 0 140 90">
      <rect x="30" y="45" width="20" height="35" fill="#78909c" rx="4"/>
      <rect x="90" y="45" width="20" height="35" fill="#78909c" rx="4"/>
      <ellipse cx="70" cy="35" rx="60" ry="20" fill="#b0bec5" stroke="#455a64" strokeWidth="4"/>
    </svg>
  ),
  cheomseongdae: (
    <svg width="140" height="90" viewBox="0 0 140 90">
      <path d="M 45 80 L 53 20 L 87 20 L 95 80 Z" fill="#d7ccc8" stroke="#5d4037" strokeWidth="4"/>
      <rect x="48" y="10" width="44" height="10" fill="#a1887f" stroke="#5d4037" strokeWidth="3"/>
      <rect x="58" y="40" width="24" height="20" fill="#4e342e"/>
    </svg>
  ),
  hanok: (
    <svg width="140" height="90" viewBox="0 0 140 90">
      <rect x="30" y="40" width="80" height="42" fill="#d7ccc8" stroke="#4e342e" strokeWidth="3"/>
      <path d="M 15 40 C 35 20 105 20 125 40 Z" fill="#37474f" stroke="#212121" strokeWidth="4"/>
      <rect x="55" y="52" width="30" height="30" fill="#8d6e63"/>
    </svg>
  ),
  western: (
    <svg width="140" height="90" viewBox="0 0 140 90">
      <rect x="30" y="35" width="80" height="45" fill="#cfd8dc" stroke="#37474f" strokeWidth="3"/>
      <rect x="40" y="42" width="12" height="38" fill="#90a4ae"/>
      <rect x="64" y="42" width="12" height="38" fill="#90a4ae"/>
      <rect x="88" y="42" width="12" height="38" fill="#90a4ae"/>
      <polygon points="25,35 70,15 115,35" fill="#b0bec5" stroke="#37474f" strokeWidth="3"/>
    </svg>
  ),
  dome: (
    <svg width="140" height="90" viewBox="0 0 140 90">
      <rect x="30" y="45" width="80" height="35" fill="#eceff1" stroke="#455a64" strokeWidth="3"/>
      <path d="M 35 45 A 35 35 0 0 1 105 45 Z" fill="#26a69a" stroke="#00695c" strokeWidth="3"/>
    </svg>
  )
};

// GitHub 고화질 오픈 이미지 주소
const POKEMON_URLS = {
  pikachu: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  eevee: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  squirtle: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
};

const gameData = [
  {
    era: "고조선 (BC 2333년)",
    question: "우리나라 최초의 국가를 세운 인물과 널리 인간을 이롭게 한다는 정신은?",
    leftOption: "단군왕검 / 홍익인간",
    rightOption: "세종대왕 / 훈민정음",
    answer: "left",
    buildingName: "고조선 고인돌 유적",
    buildingKey: "dolmen"
  },
  {
    era: "삼국시대 (BC 57년~)",
    question: "고구려, 백제, 신라 세 나라가 멋지게 경쟁했던 시대는?",
    leftOption: "조선시대",
    rightOption: "삼국시대",
    answer: "right",
    buildingName: "신라 첨성대 관측소",
    buildingKey: "cheomseongdae"
  },
  {
    era: "고려시대 (918년)",
    question: "태조 왕건이 세웠으며 '코리아(Korea)'의 기원이 된 시대는?",
    leftOption: "고려",
    rightOption: "대한민국",
    answer: "left",
    buildingName: "만월대 고려 황궁",
    buildingKey: "hanok"
  },
  {
    era: "조선시대 (1392년)",
    question: "이성계가 건국하고 세종대왕이 한글을 창제한 시대는?",
    leftOption: "대한제국",
    rightOption: "조선",
    answer: "right",
    buildingName: "경복궁 대청마루",
    buildingKey: "hanok"
  },
  {
    era: "대한제국 (1897년)",
    question: "고종 황제가 자주독립국임을 선포하며 세운 국호는?",
    leftOption: "대한제국",
    rightOption: "고조선",
    answer: "left",
    buildingName: "덕수궁 석조전",
    buildingKey: "western"
  },
  {
    era: "대한민국 (1948년)",
    question: "광복 후 헌법을 제정하고 정식 수립된 현재 우리의 국가는?",
    leftOption: "삼국시대",
    rightOption: "대한민국",
    answer: "right",
    buildingName: "대한민국 국회의사당 돔",
    buildingKey: "dome"
  }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [pikachuPos, setPikachuPos] = useState('center');
  const [isLocked, setIsLocked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = gameData[index];

  const handleChoice = (direction) => {
    if (isLocked || isFinished || !currentQ) return;
    setIsLocked(true);
    setPikachuPos(direction);

    const isCorrect = (direction === currentQ.answer);

    setTimeout(() => {
      if (isCorrect) {
        setScore(prev => prev + 1);
        
        confetti({
          particleCount: 110,
          spread: 90,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          if (index + 1 >= gameData.length) {
            setIsFinished(true);
          } else {
            setIndex(prev => prev + 1);
            setPikachuPos('center');
            setIsLocked(false);
          }
        }, 1200);

      } else {
        setTimeout(() => {
          setPikachuPos('center');
          setIsLocked(false);
        }, 800);
      }
    }, 400);
  };

  const restartGame = () => {
    setIndex(0);
    setScore(0);
    setPikachuPos('center');
    setIsLocked(false);
    setIsFinished(false);
  };

  return (
    <div className="game-container">
      {/* 상단 퀴즈 헤더 */}
      <header className="hud-top">
        <div className="era-badge">📜 {currentQ?.era}</div>
        <div className="question-box">
          <p className="question-text">{currentQ?.question}</p>
        </div>
      </header>

      <div className="score-pill">
        🏆 완공된 건축물: {score} / {gameData.length}
      </div>

      {/* 메인 2.5D 그래픽 영역 */}
      <main className="stage-wrapper">
        <div className="building-card">
          <div className="building-svg-wrapper">
            {BuildingVisuals[currentQ?.buildingKey]}
          </div>
          <div className="building-title">🏛️ {currentQ?.buildingName}</div>
        </div>

        <div className="track-line">
          {/* 이브이 이미지 */}
          <div className="side-pokemon left">
            <img src={POKEMON_URLS.eevee} alt="이브이" />
          </div>

          {/* 꼬부기 이미지 */}
          <div className="side-pokemon right">
            <img src={POKEMON_URLS.squirtle} alt="꼬부기" />
          </div>

          {/* 주인공 피카츄 이미지 */}
          <div className={`hero-pikachu ${pikachuPos}`}>
            <img src={POKEMON_URLS.pikachu} alt="피카츄" />
          </div>
        </div>
      </main>

      {/* 하단 좌/우 선택 버튼 (시계 손 / 장갑 손) */}
      <footer className="controls-bottom">
        <button className="choice-btn left" onClick={() => handleChoice('left')}>
          <span className="cue-icon">⌚</span>
          <div className="text-wrap">
            <span className="dir-label">◀ 왼쪽 (시계 손 / A키)</span>
            <span className="ans-text">{currentQ?.leftOption}</span>
          </div>
        </button>

        <button className="choice-btn right" onClick={() => handleChoice('right')}>
          <div className="text-wrap right-align">
            <span className="dir-label">오른쪽 (장갑 손 / D키) ▶</span>
            <span className="ans-text">{currentQ?.rightOption}</span>
          </div>
          <span className="cue-icon">🥊</span>
        </button>
      </footer>

      {/* 완공 모달 */}
      {isFinished && (
        <div className="victory-modal active">
          <div className="victory-card">
            <h1>🎉 포켓몬 박물관 완공!</h1>
            <p>7대 역사를 모두 탐험하고 멋진 포켓몬 건축 박물관을 완성했어요!</p>
            <button className="restart-btn" onClick={restartGame}>⚡ 다시 탐험하기</button>
          </div>
        </div>
      )}
    </div>
  );
}
