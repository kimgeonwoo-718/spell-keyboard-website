/**
 * 사이트 설정 — 새 버전을 배포할 때는 이 파일만 수정하면 됩니다.
 *
 * 다운로드 링크를 지정하는 방법은 두 가지입니다.
 *
 *   1) githubRepo 지정 (추천)
 *      프로그램 저장소의 GitHub Releases에 설치 파일(.exe / .msi)을 올려 두면
 *      최신 릴리스의 파일, 버전, 용량, 날짜를 자동으로 가져옵니다.
 *      예: githubRepo: "kimgeonwoo-718/baekjeom-pc"
 *
 *   2) downloadUrl 직접 지정
 *      설치 파일의 전체 주소를 넣으세요. 아래 version/fileSize/releaseDate도 함께 수정하세요.
 *
 * 둘 다 비어 있으면 다운로드 버튼을 눌렀을 때 "준비 중" 안내가 표시됩니다.
 */
window.SITE_CONFIG = {
  githubRepo: "",
  downloadUrl: "",

  // githubRepo를 쓰지 않을 때 화면에 표시되는 값 (releaseDate는 비워 두면 표시하지 않음)
  version: "1.0.0",
  fileSize: "약 200MB",
  releaseDate: "",

  // 폰 앱 스토어 주소 — 넣으면 다운로드 영역에 "폰 앱 받기" 버튼이 나타납니다
  phoneAppUrl: "",
};
