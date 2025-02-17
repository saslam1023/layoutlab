document.addEventListener('DOMContentLoaded', function () {

    const gridContainer = document.getElementById('grid-container');
    const toolbar = document.getElementById('container-toolbar-container');

    if (toolbar) toolbar.style.display = 'none';
    if (gridContainer) gridContainer.style.border = '0';


    const publishedLayoutsContainer = document.getElementById('published-layouts-list');

    // Fetch the last 4 layouts
    fetch('/get-live-layouts/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch layouts');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const layouts = data.layouts;
                publishedLayoutsContainer.innerHTML = '';
                layouts.forEach(layout => {
                    const layoutDiv = document.createElement('li');
                    layoutDiv.className = 'published-design';
                    const thumbnailUrl = layout.thumbnail_url ? layout.thumbnail_url : '/static/thumbnails/default.png';

                    layoutDiv.innerHTML = `
                    <button class="layout-button thumbnail" data-layout-name="${layout.name}">
                        <img src="${thumbnailUrl}" alt="${layout.name} Thumbnail" />
                    </button><h3>${layout.name}</h3><small id='loader'></small>`;
                    publishedLayoutsContainer.appendChild(layoutDiv);
                });

                const layoutButtons = document.querySelectorAll('.layout-button');

                layoutButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const layoutName = this.getAttribute('data-layout-name');
                        console.log('clicked');

                        // Show loading state
                        const loadButton = document.getElementById('loader');
                        loadButton.disabled = true;
                        loadButton.textContent = 'Loading...';

                        // Fetch the layout configuration based on layout name
                        const loadLayoutUrl = `http://127.0.0.1:8000/load/${encodeURIComponent(layoutName)}`;
                        console.log('fetching');
                        fetch(loadLayoutUrl)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`1 Failed to fetch layout: ${response.statusText}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data.configuration) {
                                    //  resetInputsToDefault();
                                    loadGridConfiguration(data.configuration);
                                    // alert(' 2 Layout loaded successfully!');
                                } else {
                                    alert('3 Failed to load layout.');
                                }
                            })
                            .catch(error => {
                                alert('4 Error loading layout');
                                console.error('Error:', error);
                            })
                            .finally(() => {
                                loadButton.disabled = false;
                                loadButton.textContent = '';
                            });
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error loading recent layouts:', error);
        });


    function loadGridConfiguration(configuration) {

        gridContainer.innerHTML = ''; // Clear existing content

        const {
            columns,
            rows,
            gridGap,
            gridGapRange
        } = configuration.gridSettings;
        const {
            parentContainerSettings
        } = configuration;

        const parentContainer = gridContainer.parentElement; // Parent of grid-container
        parentContainer.style.cssText = parentContainerSettings.styles || '';
        document.getElementById('containerMarginNum').value = parentContainerSettings.outerMargin || 100;
        document.getElementById('leftMarginNum').value = parentContainerSettings.leftMargin || 100;
        document.getElementById('rightMarginNum').value = parentContainerSettings.rightMargin || 100;
        document.getElementById('topMarginNum').value = parentContainerSettings.topMargin || 100;
        document.getElementById('bottomMarginNum').value = parentContainerSettings.bottomMargin || 100;


        document.getElementById('columns').value = columns;
        document.getElementById('rows').value = rows;
        document.getElementById('gridGapNum').value = gridGap;
        document.getElementById('gridGapRange').value = gridGapRange;

        gridContainer.className = gridContainer.className.replace(/grid-col-\d+/, '') + ` grid-col-${columns}`;
        gridContainer.style.gap = `${gridGap}px`;

        configuration.items.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.id = item.id;
            gridItem.className = item.classes;
            gridItem.style.cssText = item.styles;
            gridItem.innerHTML = item.content;
            gridContainer.appendChild(gridItem);
        });
    }


    const toggleButton = document.getElementById('toggle-theme');
    const toggleText = document.getElementById('toggle-text');
    const liveContainer = document.getElementById('live-container'); // Ensure you're targeting 'live-container'

    // Check for user preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        liveContainer.classList.add('dark-theme');
        toggleButton.setAttribute('aria-pressed', 'true');
        toggleButton.setAttribute('aria-label', 'Switch to light mode');
        toggleText.textContent = "Dark mode"; // Set initial text based on dark mode preference
    } else {
        toggleText.textContent = "Light mode"; // Default text for light mode
    }

    toggleButton.addEventListener('click', () => {
        // Toggle the 'dark-theme' class on live-container
        liveContainer.classList.toggle('dark-theme');

        // Toggle aria-pressed to indicate the current state
        const isDark = liveContainer.classList.contains('dark-theme');
        toggleButton.setAttribute('aria-pressed', isDark);
        toggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');

        // Update the text based on the current state
        toggleText.textContent = isDark ? "Dark mode" : "Light mode";

        // Save user preference in localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });


});