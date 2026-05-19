export function initMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-content').forEach(el => {
      el.classList.remove('dropdown-open');
    });
  }

  // 모바일 햄버거 메뉴 토글
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // 한/영 언어 전환
  const menuKo = document.getElementById('menu-ko');
  const menuEn = document.getElementById('menu-en');

  function setupLangSwitch(btnId, showMenu, hideMenu) {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showMenu.style.display = (window.innerWidth <= 768) ? 'block' : 'flex';
        hideMenu.style.display = 'none';
        closeAllDropdowns();
      });
    }
  }

  setupLangSwitch('lang-switch-btn', menuEn, menuKo);
  setupLangSwitch('lang-switch-btn-en', menuKo, menuEn);

  // 메뉴 이벤트 바인딩
  function attachMenuEvents() {
    const allLinks = document.querySelectorAll('.nav-menu a:not(.lang-switch)');

    allLinks.forEach(link => {
      if (link.dataset.bound) return;
      link.dataset.bound = "true";

      link.addEventListener('click', function (e) {
        const dropdownBox = this.nextElementSibling;
        const isDropdownLink = dropdownBox && dropdownBox.classList.contains('dropdown-content');
        const isSubDropdownTrigger = isDropdownLink && dropdownBox.classList.contains('sub-dropdown');
        const isMobile = window.innerWidth <= 768;

        const href = this.getAttribute('href');
        if (href === '#' || href.startsWith('?page=')) {
          e.preventDefault();
        }

        // ── 서브 드롭다운 트리거(▶ 메뉴) ──
        if (isSubDropdownTrigger) {
          e.preventDefault();
          if (isMobile) {
            dropdownBox.classList.toggle('dropdown-open');
          }
          return;
        }

        // ── 상위 드롭다운 메뉴(예: 스마트복지기술) 클릭 ──
        if (isDropdownLink) {
          e.preventDefault();

          if (isMobile) {
            // 모바일: 다른 열린 드롭다운 닫기 + 현재 토글
            document.querySelectorAll('.dropdown > .dropdown-content').forEach(el => {
              if (el !== dropdownBox) {
                el.classList.remove('dropdown-open');
              }
            });
            dropdownBox.classList.toggle('dropdown-open');
          }
          // 데스크탑: CSS :hover가 드롭다운을 처리, JS는 콘텐츠만 로드

          const pageName = this.textContent.trim();
          if (window.loadContent) {
            window.loadContent(pageName);
          }
          return;
        }

        // ── 일반 하위 메뉴 링크(예: 스마트워크) 클릭 ──
        e.preventDefault();
        const pageName = this.textContent.trim();
        if (window.loadContent) {
          window.loadContent(pageName);
        }

        // 모바일: 메뉴 전체 닫기
        if (isMobile) {
          closeAllDropdowns();
          if (menuToggle) menuToggle.classList.remove('active');
          if (navMenu) navMenu.classList.remove('active');
        }
      });
    });
  }

  attachMenuEvents();

  // 메뉴 외부 클릭 시 닫기
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-menu') && (!menuToggle || !e.target.closest('.menu-toggle'))) {
      closeAllDropdowns();
      if (window.innerWidth <= 768) {
        if (menuToggle) menuToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
      }
    }
  });
}
