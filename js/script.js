document.addEventListener("DOMContentLoaded", function () {
    console.log("Navigation script loaded.");

    // Function to toggle dropdowns
    function setupDropdowns(container) {
        // Triggers can be .mBHtvb (new) or .j10yRb (original)
        const triggers = container.querySelectorAll(".mBHtvb, .j10yRb");

        triggers.forEach(trigger => {
            trigger.style.cursor = "pointer";
            trigger.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Find the nearest parent that contains both the trigger and the dropdown
                // Based on structure: 
                // li.VsJjtf > div.PsKE7e > div.I35ICb > (a, div.mBHtvb)
                // li.VsJjtf > div.rgLkl
                // li.VsJjtf > div.oGuwee

                let parentLi = trigger.closest("li");
                if (parentLi) {
                    const dropdown = parentLi.querySelector(".oGuwee");
                    if (dropdown) {
                        const isHidden = window.getComputedStyle(dropdown).display === "none";
                        dropdown.style.display = isHidden ? "block" : "none";

                        // Optional: Toggle aria-expanded on the associated link
                        const link = parentLi.querySelector("a.aJHbb");
                        if (link) {
                            link.setAttribute("aria-expanded", isHidden ? "true" : "false");
                        }

                        // Optional: Rotate arrow icon
                        const svg = trigger.querySelector("svg");
                        if (svg) {
                            svg.style.transform = isHidden ? "rotate(90deg)" : "rotate(0deg)";
                            svg.style.transition = "transform 0.2s";
                        }
                    }
                }
            });
        });
    }

    // Initialize dropdowns on the whole document
    setupDropdowns(document);

    // If there's a sidebar toggle button (hamburger menu)
    const sidebarToggle = document.getElementById("s9iPrd");
    const sidebar = document.getElementById("yuynLe");

    // Create overlay if it doesn't exist
    let overlay = document.getElementById("mobile-menu-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "mobile-menu-overlay";
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 99;
            display: none;
            cursor: pointer;
        `;
        document.body.appendChild(overlay);
    }

    if (sidebarToggle && sidebar) {
        // Ensure sidebar has necessary styles for transition
        sidebar.style.transition = "transform 0.3s ease-in-out";
        sidebar.style.position = "fixed";
        sidebar.style.top = "0";
        sidebar.style.left = "0";
        sidebar.style.height = "100%";
        sidebar.style.zIndex = "100";
        sidebar.style.transform = "translateX(-100%)";
        sidebar.style.display = "block"; // Keep it block but off-screen

        function toggleMenu(show) {
            sidebar.style.transform = show ? "translateX(0)" : "translateX(-100%)";
            overlay.style.display = show ? "block" : "none";
            document.body.style.overflow = show ? "hidden" : "";
        }

        sidebarToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            const isOpen = sidebar.style.transform === "translateX(0px)" || sidebar.style.transform === "translateX(0)";
            toggleMenu(!isOpen);
        });

        overlay.addEventListener("click", function () {
            toggleMenu(false);
        });

        // Close menu on escape key
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") toggleMenu(false);
        });
    }
});

    // Language Toggle logic
    // Language Toggle logic
    // Language Toggle logic
    function setupLanguageToggle() {
        const headerContainer = document.querySelector('.RBEWZc');
        if (!headerContainer) return;

        const isEnglish = window.location.pathname.includes('/en/');
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'lang-toggle';
        toggleBtn.style.cssText = `
            cursor: pointer;
            padding: 5px 12px;
            font-family: 'Open Sans', sans-serif;
            font-size: 13px;
            font-weight: 700;
            color: #3c4043;
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #dadce0;
            margin-right: 15px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            user-select: none;
            z-index: 1000;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        `;
        
        const enLabel = isEnglish ? '<span style="color:#1a73e8">EN</span>' : 'EN';
        const koLabel = isEnglish ? 'KO' : '<span style="color:#1a73e8">KO</span>';
        toggleBtn.innerHTML = `${enLabel} / ${koLabel}`;
        
        toggleBtn.onmouseover = () => { 
            toggleBtn.style.background = '#f8f9fa';
            toggleBtn.style.borderColor = '#1a73e8';
        };
        toggleBtn.onmouseout = () => { 
            toggleBtn.style.background = '#ffffff'; 
            toggleBtn.style.borderColor = '#dadce0';
        };

        toggleBtn.onclick = function() {
            let currentPath = window.location.pathname;
            let currentFile = currentPath.split('/').pop() || 'index.html';
            let newPath;
            
            if (isEnglish) {
                newPath = currentPath.replace('/en/', '/');
            } else {
                if (currentPath.endsWith('/')) {
                    newPath = currentPath + 'en/index.html';
                } else {
                    const parts = currentPath.split('/');
                    parts.pop();
                    newPath = parts.join('/') + '/en/' + currentFile;
                }
            }
            window.location.href = newPath;
        };

        headerContainer.style.display = 'flex';
        headerContainer.style.alignItems = 'center';
        headerContainer.style.justifyContent = 'flex-end';
        headerContainer.appendChild(toggleBtn);
    }
    setupLanguageToggle();
    