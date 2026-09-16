import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

// 인터넷에서 바로 고화질 이미지를 불러오는 7대 역사 퀴즈 데이터
const gameData = [
  {
    era: "고조선 (BC 2333년)",
    question: "우리나라 최초의 국가를 세운 인물과 널리 인간을 이롭게 한다는 정신은?",
    leftOption: "단군왕검 / 홍익인간",
    rightOption: "세종대왕 / 훈민정음",
    answer: "left",
    buildingName: "고조선 고인돌 유적",
    // 고화질 고인돌 이미지 URL
    buildingImg: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80"
  },
  {
    era: "삼국시대 (BC 57년~)",
    question: "고구려, 백제, 신라 세 나라가 멋지게 경쟁했던 시대는?",
    leftOption: "조선시대",
    rightOption: "삼국시대",
    answer: "right",
    buildingName: "신라 첨성대 관측소",
    // 고화질 첨성대 이미지 URL
    buildingImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    era: "고려시대 (918년)",
    question: "태조 왕건이 세웠으며 '코리아(Korea)'의 기원이 된 시대는?",
    leftOption: "고려",
    rightOption: "대한민국",
    answer: "left",
    buildingName: "고려 전통 한옥 궁궐",
    // 고화질 고려/조선 한옥 URL
    buildingImg: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=600&q=80"
  },
  {
    era: "조선시대 (1392년)",
    question: "이성계가 건국하고 세종대왕이 한글을 창제한 시대는?",
    leftOption: "대한제국",
    rightOption: "조선",
    answer: "right",
    buildingName: "경복궁 대청마루",
    buildingImg: "https://images.unsplash.com/photo-1538669715315-056efee0be88?auto=format&fit=crop&w=600&q=80"
  },
  {
    era: "대한제국 (1897년)",
    question: "고종 황제가 자주독립국임을 선포하며 세운 국호는?",
    leftOption: "대한제국",
    rightOption: "고조선",
    answer: "left",
    buildingName: "덕수궁 석조전",
    buildingImg: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80"
  },
  {
    era: "대한민국 (1948년)",
    question: "광복 후 헌법을 제정하고 정식 수립된 현재 우리의 국가는?",
    leftOption: "삼국시대",
    rightOption: "대한민국",
    answer: "right",
    buildingName: "대한민국 현대 의사당 돔",
    buildingImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    era: "6·25 전쟁 (1950년)",
    question: "한반도의 평화와 자유를 소중하게 지켜낸 역사적 사건은?",
    leftOption: "6·25 평화 수호",
    rightOption: "임진왜란",
    answer: "left",
    buildingName: "평화 수호 기념관",
    buildingImg: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
  }
];

// PokeAPI 오픈 에셋 (공식 고화질 포켓몬 아트워크 핫링크)
const POKEMON_ASSETS = {
  pikachu: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  eevee: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  squirtle: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
};

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
        
        // 정답 축하 폭죽 효과
        confetti({
          particleCount: 120,
          spread: 100,
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
      {/* 상단 퀴즈 정보 */}
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
          <img 
            src={currentQ?.buildingImg} 
            alt="건물" 
            className="building-img"
          />
          <div className="building-title">🏛️ {currentQ?.buildingName}</div>
        </div>

        <div className="track-line">
          {/* 공식 이브이 아트워크 */}
          <img 
            src={POKEMON_ASSETS.eevee} 
            className="side-pokemon left" 
            alt="이브이" 
          />

          {/* 공식 꼬부기 아트워크 */}
          <img 
            src={POKEMON_ASSETS.squirtle} 
            className="side-pokemon right" 
            alt="꼬부기" 
          />

          {/* 메인 피카츄 아트워크 */}
          <div className={`hero-pikachu ${pikachuPos}`}>
            <img 
              src={POKEMON_ASSETS.pikachu} 
              alt="피카츄" 
            />
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

      {/* 게임 완료 모달 */}
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
