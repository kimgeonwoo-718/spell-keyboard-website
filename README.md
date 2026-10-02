# 백점맞춤 웹사이트

어떤 프로그램에서 글을 쓰든 단축키 한 번으로 맞춤법·띄어쓰기를 고치고, 번역까지 해서 바로 붙여 넣어 주는
Windows 프로그램 **백점맞춤**의 소개 및 다운로드 페이지입니다.
빌드 과정 없이 HTML/CSS/JS만으로 만들어져 있어 GitHub Pages에 바로 올릴 수 있습니다.

## 폴더 구조

```
index.html             페이지 본문 (문구 수정은 여기서)
assets/css/style.css   디자인 (색상은 맨 위 :root 변수에서 변경)
assets/js/config.js    Microsoft Store 제품 ID · 폰 앱 주소
assets/js/main.js      다운로드 버튼 · 히어로 데모 애니메이션 · 번역 탭
assets/img/favicon.svg 로고 / 파비콘
```

## 로컬에서 보기

```bash
python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 을 열면 됩니다.

## Microsoft Store 연결하기

백점맞춤은 Microsoft Store로 배포합니다. `assets/js/config.js`의 `storeId`에 Store 제품 ID(예: `9NXXXXXXXXXX`)를 넣으면
모든 다운로드 버튼이 `https://apps.microsoft.com/detail/<제품 ID>`로 연결되고, Windows에서는 Microsoft Store 앱이 바로 열립니다.

비워 두면 다운로드 버튼을 눌렀을 때 "준비 중" 안내가 뜹니다.

`phoneAppUrl`에 폰 앱 스토어 주소를 넣으면 다운로드 영역에 "폰 앱 받기" 버튼이 나타납니다.

## GitHub Pages로 배포하기

1. 이 저장소의 **Settings → Pages**로 이동
2. **Source**를 `Deploy from a branch`로, 브랜치를 `main` / `/ (root)`로 선택 후 저장
3. 잠시 후 `https://<계정>.github.io/spell-keyboard-website/` 에서 확인할 수 있습니다

## 남은 할 일

- [ ] Microsoft Store 제품 ID 연결 (`config.js`의 `storeId`)
- [ ] 폰 앱 스토어 주소 연결 (`config.js`의 `phoneAppUrl`)
- [ ] 개인정보처리방침 페이지 — 구글 계정 로그인과 AI 기능(서버 전송)이 있으므로 필요
- [ ] 문의 방법 확정 (지금은 푸터의 "문의 · 버그 제보"가 이 저장소의 GitHub Issues로 연결)
- [ ] 실제 프로그램 스크린샷 추가
- [ ] 카카오톡 등 링크 미리보기용 대표 이미지(og:image) — 도메인이 정해진 뒤 추가
