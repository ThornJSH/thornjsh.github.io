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
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", function () {
            const isHidden = window.getComputedStyle(sidebar).display === "none";
            sidebar.style.display = isHidden ? "block" : "none";
        });
    }

    // --- Translation Logic ---
    function setupTranslation() {
        // 1. Replace Search Button with KO/EN Button
        const searchContainer = document.querySelector('.RBEWZc');
        if (searchContainer) {
            // Find the search button (Google Sites standard)
            const oldSearchBtn = searchContainer.querySelector('[aria-label="Open search bar"]');
            if (oldSearchBtn) {
                oldSearchBtn.style.display = 'none'; // Hide instead of remove to be safe

                const langBtn = document.createElement('div');
                langBtn.id = 'translator-button';
                langBtn.innerHTML = 'KO / EN';
                langBtn.style.cssText = `
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px 12px;
                    border-radius: 20px;
                    background: #fff;
                    border: 1px solid #dadce0;
                    font-family: 'Open Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    color: #3c4043;
                    height: 32px;
                    white-space: nowrap;
                    margin-left: 10px;
                    box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
                    transition: all 0.2s;
                `;

                langBtn.onmouseover = () => { langBtn.style.background = '#f8f9fa'; };
                langBtn.onmouseout = () => { langBtn.style.background = '#fff'; };

                langBtn.onclick = function () {
                    const select = document.querySelector('.goog-te-combo');
                    if (select) {
                        if (select.value === 'en') {
                            select.value = ''; // Revert to Korean
                        } else {
                            select.value = 'en';
                        }
                        select.dispatchEvent(new Event('change'));

                        // Update button text style
                        langBtn.innerHTML = select.value === 'en' ? '<b>EN</b> / KO' : 'KO / <b>EN</b>';
                    } else {
                        alert("Translation module loading... Please try again in a moment.");
                    }
                };

                searchContainer.appendChild(langBtn);
            }
        }

        // 2. Load Google Translate Library
        if (!document.getElementById('google_translate_script')) {
            const gtDiv = document.createElement('div');
            gtDiv.id = "google_translate_element";
            gtDiv.style.display = "none";
            document.body.appendChild(gtDiv);

            const gtScript = document.createElement('script');
            gtScript.id = 'google_translate_script';
            gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            document.head.appendChild(gtScript);

            window.googleTranslateElementInit = function () {
                new google.translate.TranslateElement({
                    pageLanguage: 'ko',
                    includedLanguages: 'en',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                }, 'google_translate_element');
            };

            // 3. Hide Google Translate Banner and fix body top
            const style = document.createElement('style');
            style.innerHTML = `
                .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; }
                body { top: 0px !important; }
                .VIpgJd-Zvi9ab-aZ2wEe-wOHM9c { display: none !important; } /* New banner class */
                iframe.goog-te-banner-frame { display: none !important; }
                .skiptranslate.goog-te-gadget { display: none !important; }
            `;
            document.head.appendChild(style);
        }
    }

    setupTranslation();
});
