# 백점맞춤 웹사이트

어떤 프로그램에서 글을 쓰든 단축키 한 번으로 맞춤법·띄어쓰기를 고치고, 번역까지 해서 바로 붙여 넣어 주는
Windows 프로그램 **백점맞춤**의 소개 및 다운로드 페이지입니다.
빌드 과정 없이 HTML/CSS/JS만으로 만들어져 있어 GitHub Pages에 바로 올릴 수 있습니다.

## 폴더 구조

```
index.html             페이지 본문 (문구 수정은 여기서)
assets/css/style.css   디자인 (색상은 맨 위 :root 변수에서 변경)
assets/js/config.js    다운로드 설정 — 새 버전 배포 시 여기만 수정
assets/js/main.js      다운로드 버튼 · 히어로 데모 애니메이션 · 번역 탭
assets/img/favicon.svg 로고 / 파비콘
```

## 로컬에서 보기

```bash
python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 을 열면 됩니다.

## 다운로드 파일 연결하기

`assets/js/config.js`에서 둘 중 하나를 설정하세요.

1. **GitHub Releases (추천)** — 프로그램 저장소에서 Release를 만들고 설치 파일(`.exe` 또는 `.msi`)을 첨부한 뒤
   `githubRepo: "계정/저장소"`를 입력하면, 최신 릴리스의 파일·버전·용량·날짜가 자동으로 표시됩니다.
   새 버전을 낼 때 웹사이트는 수정할 필요가 없습니다.
2. **직접 링크** — `downloadUrl`에 설치 파일 주소를 넣고 `version`, `fileSize`, `releaseDate`도 함께 수정하세요.

아무것도 설정하지 않으면 다운로드 버튼을 눌렀을 때 "준비 중" 안내가 뜹니다.

`phoneAppUrl`에 폰 앱 스토어 주소를 넣으면 다운로드 영역에 "폰 앱 받기" 버튼이 나타납니다.

## GitHub Pages로 배포하기

1. 이 저장소의 **Settings → Pages**로 이동
2. **Source**를 `Deploy from a branch`로, 브랜치를 `main` / `/ (root)`로 선택 후 저장
3. 잠시 후 `https://<계정>.github.io/spell-keyboard-website/` 에서 확인할 수 있습니다

## 남은 할 일

- [ ] 설치 파일 연결 (`config.js`의 `githubRepo` 또는 `downloadUrl`)
- [ ] 실제 버전 번호 확인 (지금은 1.0.0으로 표시)
- [ ] 폰 앱 스토어 주소 연결 (`config.js`의 `phoneAppUrl`)
- [ ] 개인정보처리방침 페이지 — 구글 계정 로그인과 AI 기능(서버 전송)이 있으므로 필요
- [ ] 문의 방법 확정 (지금은 푸터의 "문의 · 버그 제보"가 이 저장소의 GitHub Issues로 연결)
- [ ] 실제 프로그램 스크린샷 추가
- [ ] 카카오톡 등 링크 미리보기용 대표 이미지(og:image) — 도메인이 정해진 뒤 추가
