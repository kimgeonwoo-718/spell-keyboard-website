(() => {
  "use strict";

  const config = Object.assign(
    { githubRepo: "", downloadUrl: "", version: "", fileSize: "", releaseDate: "" },
    window.SITE_CONFIG
  );

  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────── 토스트 ───────── */

  const toastEl = document.querySelector("[data-toast]");
  let toastTimer;

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add("is-visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-visible");
      setTimeout(() => (toastEl.hidden = true), 250);
    }, 3200);
  }

  /* ───────── 다운로드 정보 ───────── */

  function setText(selector, value) {
    if (!value) return;
    $$(selector).forEach((el) => (el.textContent = value));
  }

  function formatSize(bytes) {
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`;
  }

  async function fetchLatestRelease(repo) {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const release = await res.json();
    const asset =
      release.assets.find((a) => /\.exe$/i.test(a.name)) ||
      release.assets.find((a) => /\.msi$/i.test(a.name)) ||
      release.assets.find((a) => /\.zip$/i.test(a.name));
    if (!asset) throw new Error("릴리스에 설치 파일이 없습니다");
    return {
      url: asset.browser_download_url,
      version: release.tag_name.replace(/^v/i, ""),
      size: formatSize(asset.size),
      date: (release.published_at || "").slice(0, 10),
    };
  }

  const downloadInfo = (async () => {
    let info = {
      url: config.downloadUrl,
      version: config.version,
      size: config.fileSize,
      date: config.releaseDate,
    };
    if (config.githubRepo) {
      try {
        info = await fetchLatestRelease(config.githubRepo);
      } catch (err) {
        console.warn("최신 릴리스 정보를 가져오지 못했습니다:", err);
      }
    }
    setText("[data-version]", info.version);
    setText("[data-size]", info.size);
    setText("[data-date]", info.date);
    if (info.url) {
      $$("[data-download]").forEach((a) => (a.href = info.url));
    }
    return info;
  })();

  $$("[data-download]").forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const info = await downloadInfo;
      if (info.url) {
        window.location.href = info.url;
      } else {
        showToast("설치 파일을 준비하고 있어요. 곧 공개됩니다!");
      }
    });
  });

  /* ───────── Windows가 아닌 기기 안내 ───────── */

  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent;
  if (!/win/i.test(platform)) {
    const note = document.querySelector("[data-os-note]");
    if (note) note.hidden = false;
  }

  setText("[data-year]", String(new Date().getFullYear()));

  /* ───────── 히어로 교정 데모 ───────── */

  const demo = document.querySelector("[data-demo]");
  const keys = $$("[data-demo-keys] kbd");
  const result = document.querySelector("[data-demo-result]");
  const fixes = $$("[data-demo] .fix");

  function resetDemo() {
    demo.classList.remove("is-selected", "is-done");
    fixes.forEach((el) => {
      el.textContent = el.dataset.wrong;
      el.classList.remove("is-fixed");
      el.classList.add("is-wrong");
    });
    result.textContent = "맞춤법 검사 대기 중";
    result.classList.remove("is-success");
  }

  function finishDemo() {
    demo.classList.remove("is-selected");
    demo.classList.add("is-done");
    fixes.forEach((el) => {
      el.textContent = el.dataset.right;
      el.classList.remove("is-wrong");
      el.classList.add("is-fixed");
    });
    result.textContent = `✓ ${fixes.length}곳을 고쳤어요`;
    result.classList.add("is-success");
  }

  async function runDemo() {
    for (;;) {
      resetDemo();
      await sleep(1800);

      demo.classList.add("is-selected");
      await sleep(500);

      for (const key of keys) {
        key.classList.add("is-pressed");
        await sleep(140);
      }
      result.textContent = "교정 중…";
      await sleep(350);
      keys.forEach((key) => key.classList.remove("is-pressed"));
      await sleep(250);

      demo.classList.remove("is-selected");
      for (const el of fixes) {
        el.classList.remove("is-wrong");
        el.classList.add("is-fixed");
        el.textContent = el.dataset.right;
        await sleep(170);
      }
      finishDemo();
      await sleep(3600);
    }
  }

  if (demo) {
    if (reducedMotion) finishDemo();
    else runDemo();
  }
})();
