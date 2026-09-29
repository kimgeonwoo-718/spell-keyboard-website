(() => {
  "use strict";

  const config = Object.assign(
    { githubRepo: "", downloadUrl: "", version: "", fileSize: "", releaseDate: "", phoneAppUrl: "" },
    window.SITE_CONFIG
  );

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────── 토스트 ───────── */

  const toastEl = $("[data-toast]");
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
    if (mb >= 100) return `${Math.round(mb)}MB`;
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
    if (info.date) {
      setText("[data-date]", info.date);
      $$("[data-date-wrap]").forEach((el) => (el.hidden = false));
    }
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
        showToast("설치 파일을 준비하고 있어요. 곧 공개할게요!");
      }
    });
  });

  if (config.phoneAppUrl) {
    $$("[data-phone-app]").forEach((a) => {
      a.href = config.phoneAppUrl;
      a.hidden = false;
    });
  }

  /* ───────── Windows가 아닌 기기 안내 ───────── */

  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent;
  if (!/win/i.test(platform)) {
    const note = $("[data-os-note]");
    if (note) note.hidden = false;
  }

  setText("[data-year]", String(new Date().getFullYear()));

  /* ───────── 번역 언어 탭 ───────── */

  const tabs = $$("[data-lang-tab]");

  function selectTab(tab) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const next = tabs[(i + step + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  /* ───────── 히어로 데모: 단축키 → 실시간 교정 → Enter로 붙여넣기 ───────── */

  const DEMO_TOKENS = [
    { wrong: "어의없게도", right: "어이없게도" },
    " 회의가 ",
    { wrong: "몇일", right: "며칠" },
    " ",
    { wrong: "미뤄졌데요", right: "미뤄졌대요" },
    ". ",
    { wrong: "금새", right: "금세" },
    " 다시 알려 ",
    { wrong: "드릴께요", right: "드릴게요" },
    "!",
  ];
  const DEMO_RESULT = DEMO_TOKENS.map((t) => (typeof t === "string" ? t : t.right)).join("");
  const TYPE_MS = 55;

  const keysEl = $("[data-demo-keys]");
  const popup = $("[data-demo-popup]");
  const textEl = $("[data-demo-text]");
  const resultEl = $("[data-demo-result]");
  const enterEl = $("[data-demo-enter]");
  const targetEl = $("[data-demo-target]");

  function showKeys(names) {
    keysEl.innerHTML = names.map((k) => `<kbd>${k}</kbd>`).join("<span>+</span>");
    keysEl.classList.remove("is-hidden");
  }

  async function pressKeys() {
    const keys = Array.from(keysEl.querySelectorAll("kbd"));
    for (const key of keys) {
      key.classList.add("is-pressed");
      await sleep(120);
    }
    await sleep(260);
    keys.forEach((key) => key.classList.remove("is-pressed"));
  }

  function resetDemo() {
    popup.classList.remove("is-open");
    textEl.innerHTML = '<span class="caret" aria-hidden="true"></span>';
    resultEl.textContent = "실시간 교정 중";
    resultEl.classList.remove("is-success");
    enterEl.classList.remove("is-active");
    targetEl.textContent = "메시지 입력";
    targetEl.classList.remove("has-text", "is-pasted");
    showKeys(["Ctrl", "Shift", "Space"]);
  }

  async function typeInto(node, text) {
    for (const ch of text) {
      node.textContent += ch;
      await sleep(TYPE_MS);
    }
  }

  async function runDemo() {
    for (;;) {
      resetDemo();
      await sleep(1100);

      await pressKeys();
      popup.classList.add("is-open");
      await sleep(300);
      keysEl.classList.add("is-hidden");
      await sleep(350);

      const caret = textEl.querySelector(".caret");
      let fixed = 0;
      for (const token of DEMO_TOKENS) {
        if (typeof token === "string") {
          const node = document.createTextNode("");
          textEl.insertBefore(node, caret);
          await typeInto(node, token);
          continue;
        }
        const span = document.createElement("span");
        span.className = "fix";
        textEl.insertBefore(span, caret);
        await typeInto(span, token.wrong);
        span.classList.add("is-wrong");
        await sleep(380);
        span.textContent = token.right;
        span.classList.replace("is-wrong", "is-fixed");
        fixed += 1;
        resultEl.textContent = `✓ ${fixed}곳 고침`;
        resultEl.classList.add("is-success");
        await sleep(120);
      }
      await sleep(700);

      showKeys(["Enter"]);
      enterEl.classList.add("is-active");
      await sleep(350);
      await pressKeys();
      popup.classList.remove("is-open");
      keysEl.classList.add("is-hidden");
      await sleep(220);

      targetEl.textContent = DEMO_RESULT;
      targetEl.classList.add("has-text", "is-pasted");
      await sleep(3400);
    }
  }

  // 모션 줄이기 설정이면 HTML에 있는 완성 상태를 그대로 보여 줌
  if (textEl && !reducedMotion) runDemo();
})();
