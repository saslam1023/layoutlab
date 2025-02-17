document.addEventListener('DOMContentLoaded', () => {
    const savedLayoutsContainer = document.getElementById('saved-layouts');
    
    // Fetch the last 4 layouts
    fetch('/get-recent-layouts/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch layouts');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const layouts = data.layouts;
                savedLayoutsContainer.innerHTML = '';

                layouts.forEach(layout => {
                    const layoutDiv = document.createElement('div');
                    layoutDiv.className = 'saved-design';
                    const thumbnailUrl = layout.thumbnail_url ? layout.thumbnail_url : '/static/thumbnails/default.png';

                    layoutDiv.innerHTML = `
                    <button class="layout-button thumbnail" data-layout-name="${layout.name}">
                        <img src="${thumbnailUrl}" alt="${layout.name} Thumbnail" />
                    </button><h3>${layout.name}</h3><small id='loader'></small>
                    `;
                    savedLayoutsContainer.appendChild(layoutDiv);
                });



const layoutButtons = document.querySelectorAll('.layout-button');

layoutButtons.forEach(button => {
    button.addEventListener('click', function() {
        const layoutName = this.getAttribute('data-layout-name');
        
        if (layoutName) {
            const type = 'layout';
            sessionStorage.setItem('layoutTypeToLoad', type);
            sessionStorage.setItem('layoutNameToLoad', layoutName);

          //  sessionStorage.setItem('layoutNameToLoad', layoutName);
            console.log(`layout layoutname: ${layoutName}, type: ${type}`);


            // Redirect to the index page
            window.location.href = '/'; 
        }
    });
});
            }
        })
        .catch(error => {
            console.error('Error loading recent layouts:', error);
        });
});

// Function to generate thumbnail HTML from the layout configuration
function generateHTMLFromConfiguration(configuration) {
    const { gridSettings, items } = configuration;
    let styles = `
        display: grid;
        grid-template-columns: repeat(${gridSettings.columns}, 1fr);
        gap: ${gridSettings.gridGap}px;
    `;
    let html = `<div style="${styles}">`;
    items.forEach(item => {
        html += `<div style="${item.styles}" class="${item.classes}">${item.content}</div>`;
    });
    html += '</div>';
    return html;
}

/*
function useTemplate(templateId) {
    const useTemplateUrl = `/templates/${templateId}/use/`;
    
    fetch(useTemplateUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadGridConfiguration(data.configuration); // Load template configuration into the grid
                alert('Template loaded successfully! You can now save it as your layout.');
            } else {
                alert('Failed to load template.');
            }
        })
        .catch(error => {
            alert('Error loading template');
            console.error('Error:', error);
        });
}
*/


// Handle fetching templates and setting up buttons
const templatesContainer = document.getElementById('template-layouts');

// Fetch recent templates
fetch('/get-recent-templates/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch templates');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const layouts = data.templates;
            templatesContainer.innerHTML = ''; 

            layouts.forEach(layout => {
                const layoutDiv = document.createElement('div');
                layoutDiv.className = 'template-design';
                const thumbnailUrl = layout.thumbnail_url ? layout.thumbnail_url : '/static/thumbnails/default.png';

                layoutDiv.innerHTML = `
                    <button class="layout-button thumbnail" data-layout-name="${layout.name}">
                        <img src="${thumbnailUrl}" alt="${layout.name} Thumbnail" />
                    </button><h3>${layout.name}</h3><small id='loader'></small>`;
                templatesContainer.appendChild(layoutDiv);
            });

            const templateButtons = document.querySelectorAll('.template-button');
            templateButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const layoutName = this.getAttribute('data-layout-name');
                    
                    if (layoutName) {
                        // Store the layout name in sessionStorage
                        sessionStorage.setItem('layoutTypeToLoad', `template:${layoutName}`);

                        sessionStorage.setItem('layoutNameToLoad', layoutName);
                        console.log(`template layoutname: ${layoutName}`);

                        // Redirect to the index page to load the template
                        window.location.href = '/';
                    }
                });
            });
        }
    })
    .catch(error => {
        console.error('Error loading recent templates:', error);
    });



    //***** Published layouts */

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
                    const layoutDiv = document.createElement('div');
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
                    button.addEventListener('click', function() {
                        const layoutName = this.getAttribute('data-layout-name');

                        if (layoutName) {
                            const type = 'layout';
                            sessionStorage.setItem('layoutTypeToLoad', type);
                            sessionStorage.setItem('layoutNameToLoad', layoutName);
                
                          //  sessionStorage.setItem('layoutNameToLoad', layoutName);
                            console.log(`layout layoutname: ${layoutName}, type: ${type}`);
                
                
                            // Redirect to the index page
                            window.location.href = '/'; 
                        }
                    });
                });
                            }
                        })
                        .catch(error => {
                            console.error('Error loading recent layouts:', error);
                        });
            

