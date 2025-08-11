document.addEventListener('DOMContentLoaded', () => {

    // Get references to the elements
    const panelExpanded = document.getElementById('panel-expanded');
    const panelCollapsed = document.getElementById('panel-collapsed');
    const collapseBtn = document.getElementById('collapse-btn');
    const expandBtn = document.getElementById('expand-btn');
    
    // Check if all elements exist before adding listeners
    if (panelExpanded && panelCollapsed && collapseBtn && expandBtn) {
        
        // --- Event Listeners ---

        // Click on the collapse button (arrow down) to hide the big panel and show the small one
        collapseBtn.addEventListener('click', () => {
            panelExpanded.classList.add('hidden');
            panelCollapsed.classList.remove('hidden');
        });

        // Click on the expand button (arrow up) to show the big panel and hide the small one
        expandBtn.addEventListener('click', () => {
            panelCollapsed.classList.add('hidden');
            panelExpanded.classList.remove('hidden');
        });

    } else {
        console.error("One or more panel elements are missing from the DOM.");
    }
});