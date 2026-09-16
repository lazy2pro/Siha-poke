# 시하의 시간탐험대

밝은 장난감 디오라마 분위기의 웹 3D 교육 게임 프로토타입입니다. Stage 01에서는 조선의 1446년으로 가서 세종대왕과 훈민정음을 배우고, 완료하면 시간 자동차를 타고 Stage 02 삼국시대 탐험으로 이어집니다.

## 실행

1. Node.js 20 이상을 준비합니다.
2. `npm install`
3. `npm run dev` 후 표시되는 주소를 브라우저에서 엽니다.

## 배포용 빌드

`npm run build`

생성된 `dist` 폴더를 정적 웹 호스팅에 올리면 됩니다.

## GitHub와 Vercel 배포

이 프로젝트는 Vite 기반 정적 사이트라 별도 서버 설정 없이 Vercel에 배포할 수 있습니다.

1. GitHub에서 빈 저장소를 만듭니다. (`README`는 만들지 않음)
2. 이 폴더에서 아래 명령을 실행합니다.

```bash
git init
git add .
git commit -m "feat: 시하의 시간탐험대"
git branch -M main
git remote add origin https://github.com/내-아이디/siha-time-explorers.git
git push -u origin main
```

3. [Vercel](https://vercel.com/new)에서 방금 만든 GitHub 저장소를 Import합니다.
4. Framework Preset은 `Vite`, Build Command는 `npm run build`, Output Directory는 `dist`로 확인한 뒤 Deploy를 누릅니다.

`package-lock.json`을 함께 올려 두었으므로 Vercel에서 같은 의존성 버전으로 설치됩니다.

## 조작

- PC: WASD 또는 방향키
- 휴대폰/태블릿: 왼쪽 이동 조이스틱, 오른쪽 시점 조이스틱

## 구성

- `src/main.tsx`: 게임 상태, 오리지널 탐험 친구 정의(`CharacterDefinition`), Stage 01·02 3D 미로와 퀴즈 흐름
- `src/style.css`: 밝고 큰 터치 대상 중심의 인터페이스

실제 Pokémon 캐릭터·명칭·에셋은 사용하지 않았습니다. `CHARACTERS` 데이터만 바꾸어 대사, 색, 퀴즈 표현을 확장할 수 있습니다.
