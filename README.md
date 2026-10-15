# SCRAP BOT

Phaser 3, TypeScript, Vite로 만든 모바일 우선 자동 전투 프로토타입입니다. 서버나 로그인 없이 브라우저에서 실행되며, 모든 로봇은 외부 이미지 없이 Phaser 도형으로 렌더링됩니다.

## 실행 방법

Node.js 20 이상을 권장합니다.

```bash
npm install
npm run dev
```

터미널에 표시되는 로컬 주소를 브라우저에서 엽니다. 같은 네트워크의 모바일 기기에서 확인할 때는 `npm run dev -- --host`로 실행한 뒤 PC의 로컬 IP 주소로 접속할 수 있습니다.

## 검증

```bash
npm test
npm run build
```

프로덕션 빌드 결과는 `dist/`에 생성됩니다.

## GitHub Pages 배포

`.github/workflows/deploy.yml`은 `main` 브랜치에 푸시할 때 테스트와 빌드를 실행한 뒤 `dist/`를 GitHub Pages에 배포합니다. 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 설정해야 합니다. Actions의 배포 작업이 성공하면 해당 작업의 `github-pages` 환경에서 실제 플레이 주소를 확인할 수 있습니다.

Vite의 `base: './'` 설정으로 저장소 하위 경로에서도 빌드된 에셋을 상대 경로로 불러옵니다. 배포 후에는 PC 개발 서버를 켜두지 않아도 휴대폰과 PC에서 플레이할 수 있습니다.

## 구조

```text
src/
├─ game/
│  ├─ battle/       # 순수 전투 규칙, 능력치, 테스트
│  ├─ rendering/    # 도형 로봇 렌더링과 애니메이션
│  ├─ scenes/       # Phaser 전투 장면과 흐름 제어
│  └─ ui/           # 재사용 가능한 HP 바
├─ main.ts          # Phaser 게임 설정
└─ styles.css       # 화면 및 캔버스 반응형 스타일
```

## 현재 범위

- 플레이어와 적의 주기 기반 자동 공격
- HP, 공격력, 공격 간격 능력치
- 발사체, 피격, 피해 숫자 애니메이션
- HP 바, 스테이지 표시, 승리/패배 및 다시 시작
- 모바일 세로 화면 우선의 반응형 캔버스
- HP 0 하한 보장과 종료 후 공격 차단

재화, 부품 상점, 다중 스테이지, 광고, 멀티플레이는 이 프로토타입에 포함하지 않습니다. 이후 부품/강화 기능은 `FighterStats`를 확장하거나 별도의 능력치 계산 계층을 추가하는 방식으로 연결할 수 있습니다.
