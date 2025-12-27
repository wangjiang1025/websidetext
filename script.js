(() => {
  "use strict";
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  // --- 1. 手機版選單邏輯 ---
  const hamburger = $(".hamburger");
  const mobileNav = $(".mobileNav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
      // 切換漢堡圖示狀態 (可選)
      hamburger.classList.toggle("is-active");
    });
    // 點擊連結後收起選單
    $$(".mobileNav a").forEach(link => {
      link.addEventListener("click", () => mobileNav.classList.remove("active"));
    });
  }

  // --- 2. 滾動顯現效果 (IntersectionObserver) ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target); // 只觸發一次
      }
    });
  }, { threshold: 0.1 }); // 10% 可見時觸發

  $$(".reveal").forEach(el => observer.observe(el));

  // --- 3. 底部情感引導 (Soft Hint) ---
  // 對應報告中的「主宰感」與「養成感」
  const hints = [
    "系統狀態：AI 情感神經網路已就緒。",
    "她正在學習你的偏好...完成度 92%。",
    "方案 A：從指尖脈衝到懷裡溫熱。",
    "距離現實降臨還有：預購確認中。",
    "你是唯一的主宰。"
  ];
  
  const hintEl = document.createElement("div");
  hintEl.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: rgba(11, 14, 26, 0.8); backdrop-filter: blur(8px);
    border: 1px solid rgba(122, 162, 255, 0.2); border-radius: 99px;
    padding: 8px 20px; font-size: 13px; color: #b8c3e6;
    opacity: 0; transition: opacity 0.5s; pointer-events: none; z-index: 90;
    white-space: nowrap;
  `;
  document.body.appendChild(hintEl);

  let hintIdx = 0;
  const showHint = () => {
    hintEl.textContent = hints[hintIdx % hints.length];
    hintEl.style.opacity = "1";
    setTimeout(() => { hintEl.style.opacity = "0"; }, 4000);
    hintIdx++;
  };
  
  // 初始延遲後開始循環顯示
  setTimeout(showHint, 2000);
  setInterval(showHint, 10000);

  // --- 4. 表單提交模擬 ---
  const form = $("#leadForm");
  const msg = $("#formMsg");
  
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#email").value;
      if(email) {
        // 模擬 API 請求時間
        const btn = form.querySelector("button");
        const originalText = btn.textContent;
        btn.textContent = "資料加密傳輸中...";
        btn.disabled = true;

        setTimeout(() => {
          msg.textContent = "已收到請求。專屬伴侶建構邀請函將發送至您的信箱。";
          btn.textContent = "已完成";
          form.reset();
        }, 1500);
      }
    });
  }

  // --- 5. 磁吸按鈕效果 (高級互動感) ---
  const magnets = $$(".magnet");
  magnets.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // 移動幅度
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });

  // --- 6. 背景粒子 (輕量化版) ---
  const canvas = $("#bgParticles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      // 根據螢幕大小決定粒子數量，避免手機過熱
      const count = window.innerWidth < 768 ? 20 : 50;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // 邊界反彈
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(122, 162, 255, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();
  }
})();