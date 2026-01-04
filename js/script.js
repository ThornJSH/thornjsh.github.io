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
