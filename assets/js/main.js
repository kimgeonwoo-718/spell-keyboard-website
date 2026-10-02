(() => {
  "use strict";

  const config = Object.assign({ storeId: "", phoneAppUrl: "" }, window.SITE_CONFIG);

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

  /* ───────── 다운로드 (Microsoft Store) ───────── */

  function setText(selector, value) {
    if (!value) return;
    $$(selector).forEach((el) => (el.textContent = value));
  }

  // mode=direct: Windows에서 누르면 웹 페이지 대신 Microsoft Store 앱이 바로 열림
  const storeUrl = config.storeId
    ? `https://apps.microsoft.com/detail/${encodeURIComponent(config.storeId)}?referrer=appbadge&mode=direct`
    : "";

  $$("[data-download]").forEach((link) => {
    if (storeUrl) {
      link.href = storeUrl;
      return;
    }
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Microsoft Store 출시를 준비하고 있어요. 곧 만나요!");
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
