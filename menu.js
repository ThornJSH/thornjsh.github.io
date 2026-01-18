export function initMenu() {
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-content').forEach(el => {
      el.style.display = 'none';
    });
  }

  closeAllDropdowns();

  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

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

        const homeLink = showMenu.querySelector('li:first-child a');
        if (homeLink) {
          window.updatePageTitle(homeLink.textContent);
          window.loadContent(homeLink.textContent);
        }
      });
    }
  }

  setupLangSwitch('lang-switch-btn', menuEn, menuKo);
  setupLangSwitch('lang-switch-btn-en', menuKo, menuEn);

  function attachMenuEvents() {
    const allLinks = document.querySelectorAll('.nav-menu a:not(.lang-switch)');

    allLinks.forEach(link => {
      if (link.dataset.bound) return;
      link.dataset.bound = "true";

      link.addEventListener('click', function (e) {
        const dropdownBox = this.nextElementSibling;
        const isDropdownLink = dropdownBox && dropdownBox.classList.contains('dropdown-content');

        if (this.getAttribute('href') === '#') {
          e.preventDefault();
        }

        // URL 업데이트 (History API)
        const pageName = this.textContent.trim();
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('page', pageName);
        window.history.pushState({ page: pageName }, '', currentUrl);

        // 제목 및 컨텐츠 업데이트
        window.updatePageTitle(pageName);
        window.loadContent(pageName);

        document.querySelectorAll('.dropdown-content').forEach(el => {
          if (el !== dropdownBox) {
            el.style.display = 'none';
          }
        });

        if (isDropdownLink) {
          const currentDisplay = window.getComputedStyle(dropdownBox).display;
          if (currentDisplay === 'none') {
            dropdownBox.style.display = (window.innerWidth <= 768) ? 'block' : 'flex';
          } else {
            dropdownBox.style.display = 'none';
          }
        } else {
          if (window.innerWidth <= 768) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
          }
        }
      });
    });
  }

  attachMenuEvents();

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-menu') && (!menuToggle || !e.target.closest('.menu-toggle'))) {
      closeAllDropdowns();
      if (menuToggle) menuToggle.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
    }
  });
}
