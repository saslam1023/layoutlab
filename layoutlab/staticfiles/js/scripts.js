let index = 1;
const gridContainer = document.querySelector('.grid-container');
let gridItem = document.getElementById("grid-item");


function loadMessage() {
    const msgContainer = document.getElementById("msg-container");

msgContainer.innerHTML = `
<h1 class="header-h1 tip" id="tip-3" >3. Add your content</h1>
`;
}
loadMessage();



// Event listeners for columns
document.getElementById('columns').addEventListener('input', gridChangeCols);
document.getElementById('columnsRange').addEventListener('input', gridChangeCols);

// Event listeners for rows
document.getElementById('rows').addEventListener('input', gridChangeRows);
document.getElementById('rowsRange').addEventListener('input', gridChangeRows);

// Event listeners for grid increase / decrease
document.getElementById('decreaseGridBox').addEventListener('click', () => changeExtraGridBox(-1));
document.getElementById('increaseGridBox').addEventListener('click', () => changeExtraGridBox(1));

// Gap event listeners
document.getElementById('gridGapNum').addEventListener('input', updateGridGap);
document.getElementById('gridGapRange').addEventListener('input', updateGridGap);

// Margin event listeners
document.getElementById('containerMarginNum').addEventListener('input', updateMarginAll);
document.getElementById('containerMarginRange').addEventListener('input', updateMarginAll);


//// Functions for page container toolbar

function updateExtraGridBoxStyles() {
    const extraGridBoxInput = document.getElementById('extraGridBox');
    const columns = parseInt(document.getElementById('columns').value, 10) || 1;
    const rows = parseInt(document.getElementById('rows').value, 10) || 1;
    const minValue = columns * rows; // Minimum value for extraGridBox

    if (parseInt(extraGridBoxInput.value, 10) === minValue) {
        extraGridBoxInput.style.color = "grey"; // Change font color to grey
    } else {
        extraGridBoxInput.style.color = ""; // Reset to default color
    }
}

function createExtraGridBoxes() {
    const extraGridBox = parseInt(document.getElementById('extraGridBox').value, 10) || 1;
    const totalGridItems = extraGridBox;
    const currentCount = gridContainer.querySelectorAll('.grid-item').length;

    if (currentCount < totalGridItems) {
        // Add missing grid items
        for (let i = currentCount; i < totalGridItems; i++) {
            const gridItem = createGridItem(index);
            gridContainer.appendChild(gridItem);
            index++;
        }
    } else if (currentCount > totalGridItems) {
        // Remove excess grid items
        for (let i = currentCount; i > totalGridItems; i--) {
            const lastGridItem = gridContainer.querySelector('.grid-item:last-child');
            console.log(`last grid item: ${lastGridItem}`);
            if (lastGridItem) {
                gridContainer.removeChild(lastGridItem);
                console.log(`lastgi:${lastGridItem}`);
                index--;
            }
        }    
    }
}
    


// Gap
function updateGridGap(event) {
    const value = parseInt(event.target.value, 10); 
    document.getElementById('gridGapNum').value = value; 
    document.getElementById('gridGapRange').value = value; 
    document.querySelector('.grid-container').setAttribute('style', `gap: ${value}px;`); 
}


// Margin
function updateMarginAll(event) {
    const value = parseInt(event.target.value, 10); 
    document.getElementById('containerMarginNum').value = value;
    document.getElementById('containerMarginRange').value = value;
    document.querySelector('.container').setAttribute('style', `margin: ${value}px;`); 
    // Sync with other margins
    document.getElementById('topMarginNum').value = value;
    document.getElementById('rightMarginNum').value = value;
    document.getElementById('bottomMarginNum').value = value;
    document.getElementById('leftMarginNum').value = value;
}

function updateMargin(event) {
    const position = event.target.id.replace(/(MarginNum|MarginRange)/, ''); 
    const value = parseInt(event.target.value, 10) || 0; 

    // Safely sync the number and range inputs
    const numInput = document.getElementById(`${position}MarginNum`);
    const rangeInput = document.getElementById(`${position}MarginRange`);
    
    if (numInput) numInput.value = value;
    if (rangeInput) rangeInput.value = value;

    // Retrieve values for all margin positions (with default fallback)
    const top = parseInt(document.getElementById('topMarginNum')?.value);
    const right = parseInt(document.getElementById('rightMarginNum')?.value);
    const bottom = parseInt(document.getElementById('bottomMarginNum')?.value);
    const left = parseInt(document.getElementById('leftMarginNum')?.value);

    // Apply the margin values in CSS shorthand as inline style
    document.querySelector('.container').style.margin = `${top}px ${right}px ${bottom}px ${left}px`;
}

// Attach event listeners for all margin inputs
['top', 'right', 'bottom', 'left'].forEach((position) => {
    const numInput = document.getElementById(`${position}MarginNum`);
    const rangeInput = document.getElementById(`${position}MarginRange`);
    
    if (numInput) numInput.addEventListener('input', updateMargin);
    if (rangeInput) rangeInput.addEventListener('input', updateMargin);
});




// Update columns
function gridChangeCols(event) {
    const value = parseInt(event.target.value, 10) || 1; 
    const columnsInput = document.getElementById('columns');
    const columnsRange = document.getElementById('columnsRange');

    // Synchronize the inputs
    if (event.target === columnsInput) {
        columnsRange.value = value; // Update the slider
    } else if (event.target === columnsRange) {
        columnsInput.value = value; // Update the number input
    }

    // Get current rows value
    const rows = parseInt(document.getElementById('rows').value, 10) || 1;

    // Update grid
    createGrid(value, rows);
    updateGridBoxValue();
}

// Update rows
function gridChangeRows(event) {
    const value = parseInt(event.target.value, 10) || 1; 
    const rowsInput = document.getElementById('rows');
    const rowsRange = document.getElementById('rowsRange');

    // Synchronize the inputs
    if (event.target === rowsInput) {
        rowsRange.value = value; // Update the slider
    } else if (event.target === rowsRange) {
        rowsInput.value = value; // Update the number input
    }

    // Get current columns value
    const columns = parseInt(document.getElementById('columns').value, 10) || 1;

    // Update grid
    createGrid(columns, value);
    updateGridBoxValue();
}


function updateGridBoxValue() {
    const columns = parseInt(document.getElementById('columns').value, 10) || 1;
    const rows = parseInt(document.getElementById('rows').value, 10) || 1;

    // Calculate total grid boxes
    const totalGridBoxes = columns * rows;

    // Update the extraGridBox input value
    const extraGridBoxInput = document.getElementById('extraGridBox');
    let currentValue = parseInt(extraGridBoxInput.value, 10) || 1;

    // Ensure extraGridBox value is always greater than or equal to totalGridBoxes
    if (currentValue < totalGridBoxes) {
        extraGridBoxInput.value = totalGridBoxes;  // Set the minimum required value when grid size increases
    } else if (currentValue > totalGridBoxes) {
        extraGridBoxInput.value = totalGridBoxes;  // Reduce extraGridBox when grid size decreases
    }

    updateExtraGridBoxStyles();  // Update the styles based on the new value
    createExtraGridBoxes();  // Recreate the extra grid boxes based on the new value
}


function changeExtraGridBox(change) {
    const columns = parseInt(document.getElementById('columns').value, 10) || 1;
    const rows = parseInt(document.getElementById('rows').value, 10) || 1;
    const minValue = columns * rows; // Minimum value for extraGridBox
    const maxValue = 30; // Maximum value for extraGridBox

    const extraGridBoxInput = document.getElementById('extraGridBox');
    let currentValue = parseInt(extraGridBoxInput.value, 10) || 1;

    // Apply the increment/decrement
    currentValue += change;

    // Ensure within bounds
    currentValue = Math.max(minValue, Math.min(maxValue, currentValue));

    // Update the extraGridBox value to reflect changes
    extraGridBoxInput.value = currentValue;
    updateExtraGridBoxStyles()
    createExtraGridBoxes();
}

/////////////////////////

/*** Grid Setup */
// Create the grid items first
function createGridItem(index) {

    hideBoxToolbars();

    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item grid-item-span-col-1';
    const uniqueId = `box-${index}`;
    gridItem.id = uniqueId;
    gridItem.innerHTML = `
        <div class="grid-item-toolbar">
            <div class="git-edit show box-button" data-action="show-box-toolbar">
                <span class="edit-box-text">
                    <p class="light">Edit</p>
                    <p class="bold">Box ${index}</p>
                </span>
            </div>
            <div class="giet-button-container active-toolbar" id="giet-button-container">
                <div class="giet-button" data-class="create-block">Blocks</div>
                <div class="giet-button btn-span-2" data-class="create-semantic">Semantics</div>
                <button class="giet-button" data-action="create-heading-element">
                    Heading
                    <i class="fa-solid fa-heading fa-2xl cool-text"></i>
                </button>
                <button class="giet-button" data-action="create-text-element">
                    Text
                    <i class="fa-solid fa-pen fa-2xl orange-text"></i>
                </button>
                <button class="giet-button" data-action="create-image-element">
                    Image
                    <i class="fa-solid fa-image fa-2xl pink-text"></i>
                </button>
                <button class="giet-button" data-action="create-video-element">
                    Video
                    <i class="fa-solid fa-film fa-2xl purple-text"></i>
                </button>
                <button class="giet-button">
                    Font Colour
                    <input type="color" data-action="color" value="#000000" class="color-picker">    
                </button>
                <button class="giet-button">
                    Background Colour
                    <input type="color" data-action="background-color" value="#ffffff" class="color-picker">
                </button>
                <button class="giet-button delete-box-btn" data-action="delete-box" data-id="${index}">
                    Delete Box
                    <i class="fa-solid fa-trash-can fa-2xl red-text"></i>
                </button>
            </div>
        </div>`;

        showActiveToolbar();

    const blockButton = gridItem.querySelector('[data-class="create-block"]');
    const semanticButton = gridItem.querySelector('[data-class="create-semantic"]');

    const selectElementBlock = document.createElement('select');
    blockButton.appendChild(selectElementBlock); 
    generateClassOptions(selectElementBlock); 

    const selectElementSemantic = document.createElement('select');
    semanticButton.appendChild(selectElementSemantic); 
    generateSemanticOptions(selectElementSemantic); 


    return gridItem;
}

// Create the grid function
function createGrid(columns = 1, rows = 1) {
    const existingItems = gridContainer.children.length;

    // Remove previous column classes
    gridContainer.classList.forEach(className => {
        if (className.startsWith('grid-col-')) {
            gridContainer.classList.remove(className);
        }
    });

    // Add the new class based on the column count
    gridContainer.classList.add(`grid-col-${columns}`);

    // Calculate the total number of items needed for the new grid
    const totalItems = columns * rows;

    // If there are more items needed, add them
    for (let i = existingItems + 1; i <= totalItems; i++) {
        const gridItem = createGridItem(index);  // Use the returned gridItem

        if (gridItem instanceof Node) {
            gridContainer.appendChild(gridItem); // Append to the end of the grid
        } else {
            console.error("gridItem is not a valid DOM node:", gridItem);
        }

        index++;  // Increment the global index for the next grid item
    }

    // If there are fewer items than the new grid size, remove the excess items
    while (gridContainer.children.length > totalItems) {
        gridContainer.removeChild(gridContainer.lastChild);
        index--; 
    }
}




// Event delegation for delete button clicks
document.querySelector('.grid-container').addEventListener('click', (event) => {
    // Handle delete button clicks
    if (event.target.matches('[data-action="delete-box"], [data-action="delete-box"] *')) {
        const deleteButtonElement = event.target.closest('[data-action="delete-box"]');
        
        // Retrieve deleteId from the clicked button's data-id attribute
        const deleteId = deleteButtonElement.dataset.id;
        if (!deleteId) {
            console.error('Delete ID not found.');
            return;
        }

        showModal(
            'Delete item', 
            `Are you sure you want to delete Box ${deleteId}?`, 
            function() { 
                deleteItem(deleteId); 
            }, 
            function() { 
                cancelDelete(); 
            }, 
            null, 
            true,
            false 
        );
    }
    // Heading delete
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;

    const action = actionElement.dataset.action; 
    if (action.startsWith('delete-')) { 
        const resizableWrapper = actionElement.closest('.resizable-wrapper');
        if (!resizableWrapper) {
            return;
        }

        const itemType = action.replace('delete-', '');

        // Show confirmation modal before deleting

        showModal(
            'Delete Item', 
            `Are you sure you want to delete this ${itemType}?`, 
            function() { 
                deleteResizableWrapper(resizableWrapper); 
                console.log(`${itemType} deleted`); 
            }, 
            function() { 
                closeModal(); 
                console.log('Delete canceled'); 
            }, 
            null, 
            true, 
            false 
        );
        
    }
});

// Delete grid-item
function deleteItem(deleteId) {
    const gridItem = document.getElementById(`box-${deleteId}`);
    if (gridItem) {
        gridItem.remove(); 
    } else {
        return
    }
    closeModal();
}

// Delete elements
function deleteResizableWrapper(wrapperElement) {
    if (wrapperElement) {
        wrapperElement.remove(); 
    } else {
        console.error('Wrapper element not found.');
    }
    closeModal();
}

/* HOLD original
// Close the modal
function closeModal() {
    console.log('close modal activated');
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
}
*/

 // Function to close the modal
 function closeModal() {
    const modal = document.getElementById('confirmationModal');

    modal.classList.remove('show');
    modal.classList.add('hide');
 }
 




// Event delegation for button clicks in resizeable-wrappers
document.querySelector('.grid-container').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action], [data-action]');
    if (!button) return;

    const action = button.getAttribute('data-action');  
    const gridItem = button.closest('.grid-item');

    if (!gridItem) {
        console.error('No grid item found for toolbar button action.');
        return;
    }

    // Find the closest heading element relative to the button
    const headingElement = button.closest('.resizable-wrapper')?.querySelector('.editable-field.heading');
    // Find the closest text element relative to the button
    const textElement = button.closest('.resizable-wrapper')?.querySelector('.editable-field.text');
    // Find the closest image element relative to the button
    const imageElement = button.closest('.resizable-wrapper')?.querySelector('img');

    // Perform actions based on the button's data-action
    switch (action) {
        case 'show-box-toolbar':
        case 'show-element-toolbar':
            handleElementToolbar(event);
            break;
        case 'blocks':
            setActiveClass(event);
            handleBlocksClick(gridItem);
            break;
        case 'semantics':
            setActiveClass(event);
            handleSemanticsClick(gridItem);
            break;
        case 'create-heading-element':
            setActiveClass(event);
            handleHeadingClick(gridItem);
            break;
        case 'create-text-element':
            setActiveClass(event);
            handleTextClick(gridItem);
            break;
        case 'create-image-element':
            setActiveClass(event);
            handleImageClick(gridItem);
            break;
        case 'create-video-element':
            setActiveClass(event);
            handleVideoClick(gridItem);
            break;
        case 'toggle-controls':
            setActiveClass(event);
            handleToggleControls(event);
            break;
        case 'toggle-autoplay':
            setActiveClass(event);
            handleToggleAutoplay(event);
            break;
        case 'create-h1-element':
            if (headingElement) {
                setActiveClass(event);
                handleHeadingLevelChange('h1', headingElement, event);
            }
            break;
        case 'create-h2-element':
            if (headingElement) {
                setActiveClass(event);
                handleHeadingLevelChange('h2', headingElement);
            }
            break;
        case 'create-h3-element':
            if (headingElement) {
                setActiveClass(event);
                handleHeadingLevelChange('h3', headingElement);
            }
            break;
        case 'create-h4-element':
            if (headingElement) {
                setActiveClass(event);
                handleHeadingLevelChange('h4', headingElement);
            }
            break;
        case 'create-h5-element':
            if (headingElement) {
                setActiveClass(event);
                handleHeadingLevelChange('h5', headingElement);
            }
            break;
        case 'create-h6-element':
            if (headingElement) {
                setActiveClass(event);
                handleHeadingLevelChange('h6', headingElement);
            }
            break;
        case 'paragraph':
            if (textElement) {
                setActiveClass(event);
                textElement.removeAttribute('style'); 
            }
            break;
        case 'bold':
            if (textElement) {
                setActiveClass(event);
                textElement.style.fontWeight = textElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
            } else if (headingElement) {
                setActiveClass(event);
                headingElement.style.fontWeight = headingElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
            }
            break;
        case 'italic':
            if (textElement) {
                setActiveClass(event);
                textElement.style.fontStyle = textElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
            } else if (headingElement) {
                setActiveClass(event);
                headingElement.style.fontStyle = headingElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
            }
            break;
        case 'underline':
            if (textElement) {
                setActiveClass(event);
                textElement.style.textDecoration = textElement.style.textDecoration === 'underline' ? 'none' : 'underline';
            } else if (headingElement) {
                setActiveClass(event);
                headingElement.style.textDecoration = headingElement.style.textDecoration === 'underline' ? 'none' : 'underline';
            }
            break;
        case 'align-left':
            if (textElement) {
                setActiveClass(event);
                textElement.style.textAlign = 'left';
            } else if (headingElement) {
                setActiveClass(event);
                headingElement.style.textAlign = 'left';
            }
            break;
        case 'align-center':
            if (textElement) {
                setActiveClass(event);
                textElement.style.textAlign = 'center';
            } else if (headingElement) {
                setActiveClass(event);
                headingElement.style.textAlign = 'center';
            }
            break;
        case 'align-right':
            if (textElement) {
                setActiveClass(event);
                textElement.style.textAlign = 'right';
            } else if (headingElement) {
                setActiveClass(event);
                headingElement.style.textAlign = 'right';
            }
            break;
        default:
            console.log('Unknown action:', action);
            break;
    }

    // Check if the event is for either heading or text font size
    if (event.target.matches('[data-action="heading-font-size"], [data-action="text-font-size"]')) {
        const fontSizeInput = event.target;
        const gridItem = fontSizeInput.closest('.resizable-wrapper');

        if (gridItem) {
            const fontSize = fontSizeInput.value;
            const action = fontSizeInput.getAttribute('data-action');

            // Apply the font size to the appropriate element
            if (action === 'heading-font-size') {
                const headingElement = gridItem.querySelector('.editable-field.heading');
                if (headingElement) {
                    headingElement.style.fontSize = `${fontSize}px`;
                }
            } else if (action === 'text-font-size') {
                const textElement = gridItem.querySelector('.editable-field.text');
                if (textElement) {
                    textElement.style.fontSize = `${fontSize}px`;
                } 
            }
        }
    }
});


// Function to set the 'active' class on the closest button
function setActiveClass(event) {
    // Find the closest .giet-button element
    const clickedButton = event.target.closest('.giet-button');

    if (!clickedButton) return; // If no .giet-button was found, exit the function

    // Find the closest .giet-button-container that holds the buttons
    const closestContainer = clickedButton.closest('.giet-button-container'); 

    // If the container exists, remove the 'active' class from any element inside the container
    if (closestContainer) {
        closestContainer.querySelectorAll('.active').forEach(element => {
            element.classList.remove('active');
        });
    }

    // Add 'active' class to the clicked button
    clickedButton.classList.add('active');
}



///////// EVENT DELEGATIONS /////////
// Event delegation for drag and drop 

gridContainer.addEventListener('dragover', handleDragOver);
gridContainer.addEventListener('drop', handleDrop);
gridContainer.addEventListener('change', handleGridChange);
gridContainer.addEventListener('input', handleColorPickerChange);




// CHANGE EVENTS > HEADING, TEXT, IMAGE, VIDEO
document.querySelector('.grid-container').addEventListener('change', (event) => {
    if (event.target.matches('[data-action="heading-font-face"]')) { 
        handleFontFaceChange(event.target); 
    }
    if (event.target.matches('[data-action="text-font-face"]')) { 
        handleFontFaceChange(event.target); 
    }
    if (event.target.matches('[data-action="upload-media"]')) {
        const uploadInput = event.target; 
        const file = uploadInput.files[0]; 
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const gridItem = uploadInput.closest('.resizable-wrapper'); 
                
                if (gridItem) {
                    const mediaElement = gridItem.querySelector('.editable-field.media');
                    
                    if (mediaElement) {
                        if (mediaElement.tagName === 'IMG') {
                            mediaElement.src = e.target.result; 
                            
                            const imageName = file.name.split('.')[0]; 
                            const newAlt = imageName.charAt(0).toLowerCase() + imageName.slice(1);
                            mediaElement.alt = newAlt;

                            const altInput = gridItem.querySelector('[data-action="update-alt"]');
                            if (altInput) {
                                altInput.value = newAlt;
                            }
    
                        } else if (mediaElement.tagName === 'VIDEO') {
                            mediaElement.src = e.target.result; 
                        }
                    } else {
                        console.warn('No media element found in the grid item.');
                    }
                } else {
                    console.warn('No grid item found for the uploaded file.');
                }
            };
            reader.readAsDataURL(file); 
        }
    }
});    

// INPUT EVENTS > CAPTION, ALT TEXT, LINK SOURCE 
gridContainer.addEventListener('input', (event) => {
    if (event.target.matches('[data-action="create-caption"]')) {
        const captionInput = event.target;
        const captionText = captionInput.value.trim();

        const button = captionInput.closest('button');
        const gridItem = button.closest('.resizable-wrapper');

        if (gridItem) {
            const mediaElement = gridItem.querySelector('.editable-field.media');
            if (mediaElement) {
                handleCaptionChange(event, mediaElement, captionText);
            }
        }
    }

    if (event.target.matches('[data-action="update-alt"]')) {
        const altInput = event.target; 
        const newAlt = altInput.value.trim();

        const button = altInput.closest('button');
        const gridItem = button.closest('.resizable-wrapper');

        if (gridItem) {
            const mediaElement = gridItem.querySelector('.editable-field.media'); 
            if (mediaElement && mediaElement.tagName === 'IMG') {
                mediaElement.alt = newAlt; 
            }
        }
    }

    if (event.target.matches('[data-action="update-src"]')) {
        const srcInput = event.target;
        const newSrc = srcInput.value.trim();
        const gridItem = srcInput.closest('.resizable-wrapper');
        
        if (gridItem) {
            const mediaElement = gridItem.querySelector('.editable-field.media');
            if (mediaElement && newSrc) {
                mediaElement.src = newSrc;

                // Generate and update alt text for images
                if (mediaElement.tagName === 'IMG') {
                    const imageName = newSrc.split('/').pop().split('.')[0];
                    const newAlt = imageName.charAt(0).toUpperCase() + imageName.slice(1);
                    mediaElement.alt = newAlt;

                    // Find and update the alt input field, if it exists
                    const altInput = gridItem.querySelector('[data-action="update-alt"]');
                    if (altInput) {
                        altInput.value = newAlt;
                    }
                }
            }
        }
    }
});

// FOCUSIN EVENTS > AUTO SELECT INPUT TEXT
gridContainer.addEventListener('focusin', (event) => {
    if (event.target.tagName === 'INPUT') {
        event.target.select(); 
    }
});



// Function to handle toolbar visibility when called directly
function toggleToolbarVisibility(gietButtonContainer) {
    // Get all giet-buttons within the container
    const gietButtons = gietButtonContainer.querySelectorAll('.giet-button');
    if (!gietButtons.length) {
        console.warn("No .giet-button elements found inside .giet-button-container!");
        return;
    }

    // Check if these buttons are already visible
    const isVisible = gietButtons[0].style.display === "flex";
    

    // Hide all giet-buttons globally
    document.querySelectorAll('.giet-button-container .giet-button').forEach((button) => {
                button.style.display = "none"; 

    });

    // Show buttons for the clicked container if they were hidden
    if (!isVisible) {
        gietButtons.forEach((button) => {
            button.style.display = "flex";

        });
    }
}

// Function to handle element toolbar when a click event occurs

function handleElementToolbar(event) {
    const gietEditBox = event.target;
    // Check if the clicked element matches the action selector
    const gitEditBox = event.target.closest('[data-action="show-box-toolbar"]') || event.target.closest('.giet-edit');

    if (!gitEditBox) {
        console.warn("Clicked element is not a valid target!");
        return;
    }

    // Find the nearest giet-button-container
    const gietButtonContainer = gitEditBox.closest('.giet-button-container') || gitEditBox.nextElementSibling;

    if (!gietButtonContainer || !gietButtonContainer.classList.contains('giet-button-container')) {
        console.warn("No .giet-button-container found!");
        return;
    }

    // Get all giet-buttons within this container
    const gietButtons = gietButtonContainer.querySelectorAll('.giet-button');
    if (!gietButtons.length) {
        console.warn("No .giet-button elements found inside .giet-button-container!");
        return;
    }


    // Check if these buttons are already visible
    const isVisible = gietButtons[0].style.display === "flex";


    // Hide all giet-buttons globally
    document.querySelectorAll('.giet-button-container .giet-button').forEach((button) => {
        button.style.display = "none"; 
    });

    // Show buttons for the clicked container if they were hidden
    if (!isVisible) {
        gietButtons.forEach((button) => {
            button.style.display = "flex";
        });
    }

}





/////



// Function to handle color picker change events
function handleColorPickerChange(event) {
    if (event.target.matches('[data-action="color"]')) {
        const colorPicker = event.target; 
        const gridItem = colorPicker.closest('.grid-item');
        if (gridItem) {
            const textElements = gridItem.querySelectorAll('.editable-field[contenteditable="true"]');
            textElements.forEach(function(textElement) {
                textElement.style.color = colorPicker.value;
            });
        } else {
            console.error('No grid item found.');
        }
    }

    if (event.target.matches('[data-action="background-color"]')) {
        const colorPicker = event.target; 
        const gridItem = colorPicker.closest('.grid-item');
        if (gridItem) {
            gridItem.style.backgroundColor = colorPicker.value;
        } else {
            console.error('No grid item found.');
        }
    }

    const button = event.target.closest('button[data-action], [data-action]');
    if (!button) return;

    const action = button.getAttribute('data-action');  
    const colorPicker = event.target;

    if (!colorPicker || !(colorPicker instanceof HTMLInputElement)) return;

    const applyStyle = (targetElement, cssProperty, value) => {
        if (targetElement) {
            targetElement.style[cssProperty] = value;
        } else {
            console.error(`No target element found for applying ${cssProperty}.`);
        }
    };

    switch (action) {
        case 'element-font-color':
            const element = colorPicker.closest('.resizable-wrapper');
            applyStyle(element, 'color', colorPicker.value);
            break;
        case 'element-background-color':
            const bgelement = colorPicker.closest('.resizable-wrapper');
            applyStyle(bgelement, 'backgroundColor', colorPicker.value);
            break;
        case 'video-color':
            const videoElement = colorPicker.closest('.resizable-wrapper').querySelector('video');
            if (videoElement) {
                videoElement.style.filter = `hue-rotate(${colorPicker.value}deg)`;
            } else {
                console.error('No video element found.');
            }
            break;
        default:
            console.log('Unknown action:', action);
            break;
    }
}



// Function to calculate luminance of a color
function getLuminance(color) {
    // Convert the hex color to RGB
    const rgb = hexToRgb(color);
    if (!rgb) return 128; // Default luminance if the color is invalid

    // Calculate the luminance using the formula
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const a = [r, g, b].map(function (v) {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    const luminance = 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    return luminance * 255; // Return luminance as a value between 0 and 255
}

// Function to convert hex to RGB
function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;

    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return { r: r, g: g, b: b };
}




function handleGridChange(event) {
    // Check if the event target is a select element inside the grid container
    const selectElement = event.target.closest('select');
    if (!selectElement) return; 

    // Check if it's the select element for the block options
    if (event.target.closest('[data-class="create-block"]')) {
        handleBlockChange(selectElement);
    }

    // Check if it's the select element for the semantic options
    if (event.target.closest('[data-class="create-semantic"]')) {
        handleSemanticChange(selectElement);
    }
}


// Toggle Controls
function handleToggleControls(event) {
    console.log(`in handleToggleControls`);
    const button = event.target.closest('[data-action="toggle-controls"]');
    
    if (!button) {
        return;
    }

    // Find the associated video element
    const videoElement = button.closest('.resizable-wrapper').querySelector('video');
    const showHideVideo = button.querySelector('.show-hide-video');  

    console.log(`button: ${button}, videoElement: ${videoElement}, event: ${event}`);
    
    if (videoElement && showHideVideo) {
        videoElement.controls = !videoElement.controls;

        // Update the button text
        showHideVideo.textContent = videoElement.controls ? 'Controls ON' : 'Controls OFF';
    } else {
        console.warn('Video element or showHideVideo not found!');
    }
}

// Autoplay
function handleToggleAutoplay(event) {
    console.log(`in handleToggleAUTOPLAY`);

    const button = event.target.closest('[data-action="toggle-autoplay"]');
    
    if (!button) {
        return;
    }

    const videoElement = button.closest('.resizable-wrapper').querySelector('video');
    const showHideAutoplay = button.querySelector('.show-hide-autoplay');

    if (videoElement && showHideAutoplay) {
        // Toggle the autoplay property
        videoElement.autoplay = !videoElement.autoplay;
        
        // Log the current status of autoplay
        console.log(`Autoplay status: ${videoElement.autoplay}`);  // Log the boolean value directly

        // If autoplay is ON, mute the video to comply with browser restrictions
        if (videoElement.autoplay) {
            videoElement.muted = true;  // Ensure the video is muted for autoplay to work
            videoElement.play();  // Start the video immediately
        }

        // Update button text
        showHideAutoplay.textContent = videoElement.autoplay ? 'Autoplay ON' : 'Autoplay OFF';
    } else {
        console.warn('Video element or showHideAutoplay not found!');
    }
}



// Function to handle the "Blocks" dropdown
function handleBlockChange(selectElement) {
    const selectedClass = selectElement.value;
    const gridItem = selectElement.closest('.grid-item'); // Find the closest grid-item
    if (gridItem) {
        gridItem.className = 'grid-item'; // Reset the base class
        if (selectedClass) gridItem.classList.add(selectedClass); // Add the selected class
    }
}


// Function to generate class options dynamically
function generateClassOptions(selectElement) {
    const classOptions = {
        "1 x 1": "",
        "1 x 2": "grid-item-span-row-2",
        "1 x 3": "grid-item-span-row-3",
        "1 x 4": "grid-item-span-row-4",
        "1 x 5": "grid-item-span-row-5",
        "1 x 6": "grid-item-span-row-6",
        "2 x 1": "grid-item-span-col-2",
        "3 x 1": "grid-item-span-col-3",
        "4 x 1": "grid-item-span-col-4",
        "5 x 1": "grid-item-span-col-5",
        "6 x 1": "grid-item-span-col-6",
        "2 x 2": "grid-item-span-row-2-col-2",
        "2 x 3": "grid-item-span-row-2-col-3",
        "2 x 4": "grid-item-span-row-2-col-4",
        "2 x 5": "grid-item-span-row-2-col-5",
        "2 x 6": "grid-item-span-row-2-col-6",
        "3 x 2": "grid-item-span-row-3-col-2",
        "3 x 3": "grid-item-span-row-3-col-3",
        "3 x 4": "grid-item-span-row-3-col-4",
        "3 x 5": "grid-item-span-row-3-col-5",
        "3 x 6": "grid-item-span-row-3-col-6",
        "4 x 2": "grid-item-span-row-4-col-2",
        "4 x 3": "grid-item-span-row-4-col-3",
        "4 x 4": "grid-item-span-row-4-col-4",
        "4 x 5": "grid-item-span-row-4-col-5",
        "4 x 6": "grid-item-span-row-4-col-6",
        "5 x 2": "grid-item-span-row-5-col-2",
        "5 x 3": "grid-item-span-row-5-col-3",
        "5 x 4": "grid-item-span-row-5-col-4",
        "5 x 5": "grid-item-span-row-5-col-5",
        "5 x 6": "grid-item-span-row-5-col-6",
        "6 x 2": "grid-item-span-row-6-col-2",
        "6 x 3": "grid-item-span-row-6-col-3",
        "6 x 4": "grid-item-span-row-6-col-4",
        "6 x 5": "grid-item-span-row-6-col-5",
        "6 x 6": "grid-item-span-row-6-col-6"
    };

    // Populate the dropdown options
    Object.entries(classOptions).forEach(([label, value]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        selectElement.appendChild(option);
    });
}

// Function to handle "Semantics"
function handleSemanticChange(selectElement) {
    const selectedSemanticTag = selectElement.value;
    const item = selectElement.closest('.grid-item'); // Find the nearest grid-item ancestor

    if (!item) {
        console.log("Item not found");
        return;
    }

    // Create the new semantic element (e.g., <header>, <nav>, etc.)
    const semanticElement = document.createElement(selectedSemanticTag);

    // Copy the original element's classes, id, and other attributes
    semanticElement.className = item.className; // Copy all class names
    semanticElement.id = item.id; // Copy the id, if any

    // Copy any additional attributes (if needed)
    Array.from(item.attributes).forEach(attr => {
        if (attr.name !== 'class' && attr.name !== 'id') {
            semanticElement.setAttribute(attr.name, attr.value);
        }
    });

    // Move all the children from the original item (div) into the new semantic element
    while (item.firstChild) {
        semanticElement.appendChild(item.firstChild); // Move all children
    }

    // Replace the original grid-item with the new semantic element
    item.parentNode.replaceChild(semanticElement, item);

    const nameTag = selectElement.options[selectElement.selectedIndex].text;
    const gitEditBox = semanticElement.querySelector('.git-edit');

    if (gitEditBox) {
        // Remove any previous .semantic-element-name inside gitEditBox
        const existingSemanticElement = gitEditBox.querySelector('.semantic-element-name');
        if (existingSemanticElement) {
            existingSemanticElement.remove(); // Remove the old label
        }

        // Only proceed if nameTag is not 'Default'
        if (nameTag !== 'Default') {
            // Add the new label (selected semantic) before the existing content
            const newSemanticElement = document.createElement('p');
            newSemanticElement.className = 'semantic-element-name';
            newSemanticElement.textContent = toTitleCase(nameTag); // Apply title case

            gitEditBox.prepend(newSemanticElement); // Prepend the new label

            // List of possible old nameTag classes
            const possibleNameTags = ['Header-tag', 'Navigation-tag', 'Main-tag', 'Aside-tag', 'Section-tag', 'Footer-tag', 'Div-tag']; // Add your old nameTag classes here

            // Remove any old nameTag classes
            possibleNameTags.forEach(tag => {
                if (gitEditBox.classList.contains(tag)) {
                    gitEditBox.classList.remove(tag); // Remove the old nameTag class
                }
            });

            // Add the new nameTag class
            gitEditBox.classList.add(nameTag + `-tag`); // Add the new nameTag class
        }
    }
}

// Convert text to Title Case
function toTitleCase(str) {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}

// Function to dynamically generate semantic options
function generateSemanticOptions(selectElement) {
    const semanticLayoutOptions = {
        Default: 'div',
        Header: 'header',
        Navigation: 'nav',
        Main: 'main',
        Section: 'section',
        Aside: 'aside',
        Footer: 'footer',
    };

    Object.entries(semanticLayoutOptions).forEach(([label, value]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        selectElement.appendChild(option);
    });
}



////// *** ELEMENTS *** ////////

function hideToolbars(){
     // Hide all giet-buttons globally
     document.querySelectorAll('.giet-button-container .giet-button').forEach((button) => {
        button.style.display = "none"; 
    });
}

function hideBoxToolbars(){
    document.querySelectorAll('.giet-button-container .giet-button').forEach((button) => {
    button.style.display = "none"; 
    });
    removeActiveToolbarClass();
}

function removeActiveToolbarClass() {
    document.querySelectorAll('.active-toolbar').forEach((element) => {
        element.classList.remove('active-toolbar');
    });
}


function showActiveToolbar(){
    document.querySelectorAll('.active-toolbar').forEach((button) => {
    button.style.display = "flex"; 
    });
}



/////////// HEADING /////////

let headingId = 1;
// Function to create an "h1" element with a unique toolbar
function handleHeadingClick(gridItem) {
    console.log('Heading button clicked');

hideToolbars();

    // Create the resizable/draggable wrapper
    const headingElementWrapper = document.createElement('div');
    headingElementWrapper.className = 'resizable-wrapper';
    headingElementWrapper.setAttribute('draggable', true); 
    
    // Create the <h1> element
    const headingElement = document.createElement('h1');
    headingElement.id = `heading-${headingId}`;
    headingElement.contentEditable = true;
    headingElement.className = 'editable-field editable-content heading';
    headingElement.textContent = `Enter your heading here`;
    headingElement.draggable = false;
    
    // Create a toolbar for the heading
    const toolbar = document.createElement('div');
    toolbar.className = 'heading-toolbar grid-item-toolbar';
    
    // Add buttons to the toolbar
    toolbar.innerHTML = `
    <div class="giet-edit show heading-button" data-action="show-element-toolbar">
        <span class="edit-box-text">
            <p class="light">Edit</p>
            <p class="bold">Heading ${headingId}</p>
        </span>
    </div>
    <div class="giet-button-container">
        <div class="giet-button" data-class="font-size">
            Font size
            <input type="number" value="16" min="1" class="font-size-input" data-action="heading-font-size">
        </div>
        <div class="giet-button btn-span-2" data-action="font-face">Font</div>
        <button class="giet-button active" data-action="create-h1-element">
            Title
            <span class="giet-button-h1">H1</span>
        </button>
        <button class="giet-button" data-action="create-h2-element">Category
            <span class="giet-button-h2">H2</span>
        </button>
        <button class="giet-button" data-action="create-h3-element">Section
            <span class="giet-button-h3">H3</span>
        </button>
        <button class="giet-button" data-action="create-h4-element">
            Subsection
            <span class="giet-button-h4">H4</span>
        </button>
        <button class="giet-button" data-action="create-h5-element">
            Division
            <span class="giet-button-h5">H5</span>
        </button>
            <button class="giet-button" data-action="create-h6-element">
            Detail
            <span class="giet-button-h6">H6</span>
        </button>
        <button class="giet-button" data-action="bold">
            Bold
            <i class="fa-solid fa-bold fa-2xl"></i>
        </button>
        <button class="giet-button" data-action="italic">
            Italic
            <i class="fa-solid fa-italic fa-2xl"></i>
        </button>
        <button class="giet-button" data-action="underline">
            Underline
            <i class="fa-solid fa-underline fa-2xl"></i>
        </button>
        <button class="giet-button" data-action="align-left">
            Left
            <i class="fa-solid fa-align-left fa-2xl"></i>
        </button>
                <button class="giet-button" data-action="align-center">
            Center
            <i class="fa-solid fa-align-center fa-2xl"></i>
        </button>
        <button class="giet-button" data-action="align-right">
            Right
            <i class="fa-solid fa-align-right fa-2xl"></i>
        </button>
        <button class="giet-button">
            Font Colour
            <input type="color" data-action="element-font-color" value="#000000" class="color-picker">    
        </button>
        <button class="giet-button">
            Background Colour
            <input type="color" data-action="element-background-color" value="#ffffff" class="color-picker">
        </button>
        <button class="giet-button delete-box-btn" data-action="delete-heading" data-id="${headingId}">
            Delete Box
            <i class="fa-solid fa-trash-can fa-2xl red-text"></i>
        </button>
    </div>
    `;
    

    // Append the heading and toolbar to the wrapper
    gridItem.appendChild(headingElementWrapper);
    headingElementWrapper.appendChild(toolbar);
    headingElementWrapper.appendChild(headingElement);

    const fontFaceButton = headingElementWrapper.querySelector('[data-action="font-face"]');

    // Create font face drop down
    const selectElement = document.createElement('select');
    selectElement.setAttribute('data-action', 'heading-font-face');
    fontFaceButton.appendChild(selectElement); 
    generateFontOptions(selectElement); 


    headingId++;
    // Drag and drop 
    initialiseDraggables();
}


// Change heading levels
function handleHeadingLevelChange(level, headingElement) {
        const headingId = headingElement.id;
        if (!headingId) {
            return;
        }
    
        const resizableWrapper = headingElement.closest('.resizable-wrapper');
    
        if (!resizableWrapper) {
            console.error('No resizable wrapper found for heading.');
            return;
        }
    
        const targetHeading = resizableWrapper.querySelector(`#${headingId}`);
        if (!targetHeading) {
            console.error(`No heading element with ID "${headingId}" found in resizable wrapper.`);
            return;
        }
    
        // Replace the heading element with the new level
        const newHeadingElement = document.createElement(level);
        newHeadingElement.id = headingElement.id;
        newHeadingElement.contentEditable = true;
        newHeadingElement.className = headingElement.className;
        newHeadingElement.textContent = headingElement.textContent;
        newHeadingElement.draggable = false;
        newHeadingElement.style.cssText = headingElement.style.cssText;   
        targetHeading.replaceWith(newHeadingElement);
        // Drag and drop 
        initialiseDraggables();
    }


// Change font size of h1-h6 dynamically when font-size is changed
function applyFontSizing(fontSize) {
    const styleTag = createFontSizeStyle();

    // Add or update the font size rule for h1 to h6
    styleTag.innerHTML = `
        .grid-item h1  {
            font-size: ${fontSize}px !important;
        }
        .grid-item h2  {
            font-size: ${fontSize * 0.9}px !important;
        }
        .grid-item h3  {
            font-size: ${fontSize * 0.8}px !important;
        }
        .grid-item h4  {
            font-size: ${fontSize * 0.75}px !important;
        }
        .grid-item h5  {
            font-size: ${fontSize * 0.65}px !important;
        }
        .grid-item h6 {
            font-size: ${fontSize * 0.55}px !important;
        }
    `;
}


/*** Font Options Generator ***/
function generateFontOptions(selectElement) {
    const fonts = [
        { name: 'Arial', value: 'arial' },
        { name: 'DM Serif Text Regular', value: 'dm serif text' },
        { name: 'Dancing Script', value: 'dancing script' },
        { name: 'Quicksand', value: 'quicksand' },
        { name: 'Lora', value: 'lora' },
        { name: 'Merriweather', value: 'merriweather' },
        { name: 'Playfair Display', value: 'playfair display' },
        { name: 'Montserrat', value: 'montserrat' },
        { name: 'Open Sans', value: 'open sans' },
        { name: 'Roboto', value: 'roboto' },
        { name: 'Red Hat Display', value: 'red hat display' }
    ];

    fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font.value;
        option.textContent = font.name;
        selectElement.appendChild(option);
    });
}

// Font face change to element
function handleFontFaceChange(selectElement) {
    const selectedFontFace = selectElement.value; 
    const gridItem = selectElement.closest('.resizable-wrapper'); 
    if (gridItem) {
        const headingElement = gridItem.querySelector('h1, h2, h3, h4, h5, h6'); 
        const textElement = gridItem.querySelector('.editable-content'); 

        if (headingElement) {
            headingElement.style.fontFamily = selectedFontFace; 
        } else if (textElement) {
            textElement.style.fontFamily = selectedFontFace; 
        }
    } else {
        console.error('No element found.');
    }
}



/////////// TEXT /////////

let textId = 1;
// Function to create an "p" element with a unique toolbar
function handleTextClick(gridItem) {
    console.log('Text button clicked');

    hideToolbars();


    // Create the resizable/draggable wrapper
    const textElementWrapper = document.createElement('div');
    textElementWrapper.className = 'resizable-wrapper';
    textElementWrapper.setAttribute('draggable', true); 
    
    // Create the <h1> element
    const textElement = document.createElement('p');
    textElement.id = `text-${textId}`;
    textElement.contentEditable = true;
    textElement.className = 'editable-field editable-content text';
    textElement.textContent = `Enter your text here`;
    textElement.draggable = false;
    
    // Create a toolbar for the text
    const toolbar = document.createElement('div');
    toolbar.className = 'text-toolbar  grid-item-toolbar';
    
    // Add buttons to the toolbar
    toolbar.innerHTML = `
    <div class="giet-edit show text-button" data-action="show-element-toolbar">
        <span class="edit-box-text">
            <p class="light">Edit</p>
            <p class="bold">Text ${textId}</p>
        </span>
    </div>
    <div class="giet-button-container">
        <div class="giet-button" data-class="font-size">
            Font size
            <input type="number" value="16" min="1" class="font-size-input" data-action="text-font-size">
        </div>
        <div class="giet-button btn-span-2" data-action="font-face">Font</div>
        <button class="giet-button active" data-action="paragraph">
            Paragraph
            <i class="fa-solid fa-paragraph fa-2xl"></i>
        </button>
        <button class="giet-button" data-action="bold">
            Bold
            <i class="fa-solid fa-bold fa-2xl"></i>
        </button>
        <button class="giet-button" data-action="italic">
            Italic
            <i class="fa-solid fa-italic fa-2xl"></i>
        </button>
        <button class="giet-button" data-action="underline">
            Underline
            <i class="fa-solid fa-underline fa-2xl"></i>
        </button>
        <button class="giet-button" data-action="align-left">
            Left
            <i class="fa-solid fa-align-left fa-2xl"></i>
        </button>
                <button class="giet-button" data-action="align-center">
            Center
            <i class="fa-solid fa-align-center fa-2xl"></i>
        </button>
        <button class="giet-button" data-action="align-right">
            Right
            <i class="fa-solid fa-align-right fa-2xl"></i>
        </button>
        <button class="giet-button">
            Font Colour
            <input type="color" data-action="element-font-color" value="#000000" class="color-picker">    
        </button>
        <button class="giet-button">
            Background Colour
            <input type="color" data-action="element-background-color" value="#ffffff" class="color-picker">
        </button>
        <button class="giet-button delete-box-btn" data-action="delete-text" data-id="${textId}">
            Delete Box
            <i class="fa-solid fa-trash-can fa-2xl red-text"></i>
        </button>
    </div>
    `;
    

    // Append the text and toolbar to the wrapper
    gridItem.appendChild(textElementWrapper);
    textElementWrapper.appendChild(toolbar);
    textElementWrapper.appendChild(textElement);

    const fontFaceButton = textElementWrapper.querySelector('[data-action="font-face"]');
    
    // Create font face drop down
    const selectElement = document.createElement('select');
    selectElement.setAttribute('data-action', 'text-font-face');
    fontFaceButton.appendChild(selectElement); 
    generateFontOptions(selectElement); 

    textId++;
    // Drag and drop 
    initialiseDraggables();
}

/////////// IMAGE /////////

let imageId = 1;
// Function to create an "p" element with a unique toolbar
function handleImageClick(gridItem) {
    console.log('Image button clicked');

    hideToolbars();


    // Create the resizable/draggable wrapper
    const imageElementWrapper = document.createElement('div');
    imageElementWrapper.className = 'resizable-wrapper image-background';
    imageElementWrapper.setAttribute('draggable', true); 
    
    // Create the <h1> element
    const imageElement = document.createElement('img');
    imageElement.id = `image-${imageId}`;
    imageElement.contentEditable = true;
    imageElement.className = 'editable-field editable-content media image';
    imageElement.src = 'https://placehold.co/300x300'; 
    imageElement.draggable = false;

    // Extract the image name (e.g., '300x300') from the URL
    const imageUrl = imageElement.src;
    const imageName = imageUrl.split('/').pop().split('.')[0];
    imageElement.alt = imageName.charAt(0).toUpperCase() + imageName.slice(1); 
    
    // Create a toolbar for the image
    const toolbar = document.createElement('div');
    toolbar.className = 'image-toolbar grid-item-toolbar';
    
    // Add buttons to the toolbar
    toolbar.innerHTML = `
    <div class="giet-edit show image-button" data-action="show-element-toolbar">
        <span class="edit-box-text">
            <p class="light">Edit</p>
            <p class="bold">Image ${imageId}</p>
        </span>
    </div>
    <div class="giet-button-container">
        <button class="giet-button btn-span-100 ">
            Upload Image
                <label for="image-upload-input-${imageId}" class="upload-file-label">Choose File</label>
                <input type="file" id="image-upload-input-${imageId}" accept="image/*" class="upload-file-input" data-action="upload-media"/>
        </button>
        <button class="giet-button btn-span-100  active">
            Image Link             
            <label for="image-src-input-${imageId}" class="visually-hidden">Image Link</label>
            <input type="text" id="image-src-input-${imageId}" value="${imageElement.src}" data-action="update-src" />
        </button>
        <button class="giet-button btn-span-100 ">
        Image Alt
            <label for="image-alt-input-${imageId}" class="visually-hidden">Image Alt</label>
            <input type="text" id="image-alt-input-${imageId}" value="${imageElement.alt}" data-action="update-alt" />
        </button>
        <button class="giet-button btn-span-100 ">
            Image Caption                
            <label for="image-caption-input-${imageId}" class="visually-hidden">Image Caption</label>
            <input type="text" value="" placeholder="Enter caption..." data-action="create-caption" />
        </button>
        <!--<button class="giet-button ">
            Font Colour
            <input type="color" data-action="element-font-color" value="#000000" class="color-picker">    
        </button>-->
        <button class="giet-button ">
            Background Colour
            <input type="color" data-action="element-background-color" value="#ffffff" class="color-picker">
        </button>
        <button class="giet-button delete-box-btn" data-action="delete-image" data-id="${imageId}">
            Delete Box
            <i class="fa-solid fa-trash-can fa-2xl red-text"></i>
        </button>
    </div>
    `;
    

    // Append the image and toolbar to the wrapper
    gridItem.appendChild(imageElementWrapper);
    imageElementWrapper.appendChild(toolbar);
    imageElementWrapper.appendChild(imageElement);


    imageId++;
    // Drag and drop 
    initialiseDraggables();

}

// Caption change 
function handleCaptionChange(event, mediaElement, captionText) {
    let figureElement = mediaElement.closest('figure');

    // If captionText is empty, remove the figure wrapper
    if (!captionText) {
        if (figureElement) {
            const parentElement = figureElement.parentElement;
            figureElement.replaceWith(mediaElement); // Restore the image to its original place
            if (parentElement && parentElement.querySelector('figcaption')) {
                parentElement.querySelector('figcaption').remove();
            }
        }
        return; 
    }

    // If the figure element doesn't exist, create one
    if (!figureElement) {
        figureElement = document.createElement('figure');
        figureElement.className = 'editable-field editable-content figure box';

        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.contentEditable = true;
        figcaptionElement.textContent = captionText;

        mediaElement.replaceWith(figureElement);
        figureElement.appendChild(mediaElement);
        figureElement.appendChild(figcaptionElement);

        // Attach event listener to synchronize with input field
        attachFigcaptionListener(figcaptionElement, mediaElement);
    } else {
        const figcaptionElement = figureElement.querySelector('figcaption');
        if (figcaptionElement) {
            figcaptionElement.textContent = captionText;
        } else {
            const newFigcaption = document.createElement('figcaption');
            newFigcaption.textContent = captionText;
            figureElement.appendChild(newFigcaption);

            // Attach event listener to synchronize with input field
            attachFigcaptionListener(newFigcaption, mediaElement);
        }
    }
}

//  Event listener for figcaption
function attachFigcaptionListener(figcaptionElement, mediaElement) {
    figcaptionElement.addEventListener('input', () => {
        const figureElement = figcaptionElement.closest('figure');
        const gridItem = figureElement.closest('.grid-item');

        // Synchronize input field with figcaption
        if (gridItem) {
            const captionInput = gridItem.querySelector('input[data-action="create-image-caption"]');
            if (captionInput) {
                captionInput.value = figcaptionElement.textContent.trim();
            }
        }

        // Remove the figure wrapper if the caption is empty
        if (!figcaptionElement.textContent.trim()) {
            if (figureElement) {
                figureElement.replaceWith(mediaElement); // Restore the image to its original place
            }
        }
    });
}


/////////// VIDEO /////////
let videoId = 1;

function handleVideoClick(gridItem){
    console.log(`Video handling`);

    hideToolbars();


    // Create the resizable/draggable wrapper
    const videoElementWrapper = document.createElement('div');
    videoElementWrapper.className = 'resizable-wrapper video-background';
    videoElementWrapper.setAttribute('draggable', true); 
    
    // Create the <h1> element
    const videoElement = document.createElement('video');
    videoElement.id = `video-${videoId}`;
    videoElement.contentEditable = true;
    videoElement.className = 'editable-field editable-content media video';
    videoElement.src = `https://www.w3schools.com/tags/mov_bbb.mp4`;
    videoElement.controls = true; 
    videoElement.autoplay = false; 
    videoElement.draggable = false;

    // Extract the video name (e.g., 'playback_placeholder') from the URL
    const videoUrl = videoElement.src;
    const videoName = videoUrl.split('/').pop().split('.')[0];
    videoElement.alt = videoName.charAt(0).toUpperCase() + videoName.slice(1); 
    
    // Create a toolbar for the video
    const toolbar = document.createElement('div');
    toolbar.className = 'video-toolbar  grid-item-toolbar';
    
    // Add buttons to the toolbar
    toolbar.innerHTML = `
    <div class="giet-edit show video-button" data-action="show-element-toolbar">
        <span class="edit-box-text">
            <p class="light">Edit</p>
            <p class="bold">Video ${videoId}</p>
        </span>
    </div>
    <div class="giet-button-container">
        <button class="giet-button btn-span-100 ">
            Upload Video
                <label for="video-upload-input-${videoId}" class="upload-file-label">Choose File</label>
                <input type="file" id="video-upload-input-${videoId}" accept="video/*" class="upload-file-input" data-action="upload-media"/>
        </button>
        <button class="giet-button btn-span-100  active">
            Video Link             
            <label for="video-src-input-${videoId}" class="visually-hidden">video Link</label>
            <input type="text" id="video-src-input-${videoId}" value="${videoElement.src}" data-action="update-src" />
        </button>
        <button class="giet-button btn-span-100 ">
            Video Caption                
            <label for="video-caption-input-${videoId}" class="visually-hidden">video Caption</label>
            <input type="text" value="" placeholder="Enter caption..." data-action="create-caption" />
        </button>
        <button class="giet-button btn-span-100 " data-video-id="${videoId}" data-action="toggle-controls">
            Video Controls
            <span class="show-hide-video">Controls ON</span>
        </button>
        <button class="toggle-autoplay giet-button btn-span-100" data-action="toggle-autoplay">
        Autoplay
        <span class="show-hide-autoplay show-hide-video">Autoplay OFF</span>
        </button>
        <button class="giet-button ">
            Background Colour
            <input type="color" data-action="element-background-color" value="#ffffff" class="color-picker">
        </button>
        <button class="giet-button delete-box-btn" data-action="delete-video" data-id="${videoId}">
            Delete Box
            <i class="fa-solid fa-trash-can fa-2xl red-text"></i>
        </button>
    </div>
    `;
    

    // Append the video and toolbar to the wrapper
    gridItem.appendChild(videoElementWrapper);
    videoElementWrapper.appendChild(toolbar);
    videoElementWrapper.appendChild(videoElement);


    videoId++;
    // Drag and drop 
    initialiseDraggables();

}







/////////////// GRID SAVE AND LOAD ////////////

    function getGridConfiguration() {
        const parentContainer = gridContainer.parentElement; 

        const gridSettings = {
            columns: parseInt(document.getElementById('columns').value) || 1, 
            rows: parseInt(document.getElementById('rows').value) || 1,
            gridGap: document.getElementById('gridGapNum').value|| 10,
            gridGapRange: document.getElementById('gridGapRange').value || 10,
        };
        
        const items = Array.from(gridContainer.children).map(item => ({
            id: item.id || '',
            classes: item.className,
            styles: item.style.cssText,
            content: item.innerHTML,
        }));
    
        const parentContainerSettings = {
            styles: parentContainer.style.cssText,
            outerMargin: document.getElementById('containerMarginNum').value || 100,
            topMargin: document.getElementById('topMarginNum').value || 100,
            bottomMargin: document.getElementById('bottomMarginNum').value || 100,
            leftMargin: document.getElementById('leftMarginNum').value || 100,
            rightMargin: document.getElementById('rightMarginNum').value || 100,
        };

        captureThumbnail(gridContainer);

        return { gridSettings, items, parentContainerSettings };
    }



    async function captureThumbnail() {
        const gridContainer = document.getElementById('grid-container');
        if (!gridContainer) return null;
    
        try {
            const canvas = await html2canvas(gridContainer);
            return canvas.toDataURL("image/png"); // Convert to Base64
        } catch (error) {
            console.error("Error capturing thumbnail:", error);
            return null;
        }
    }
    

function saveThumbnail(thumbnailData) {
    // Example: Save the thumbnail as a data URL (you can adjust as needed)
    console.log('Thumbnail data URL:', thumbnailData);

    // Example: Append the thumbnail image to an element on the page (like a preview)
    const thumbnailPreview = document.createElement('img');
    thumbnailPreview.src = thumbnailData;
    thumbnailPreview.alt = 'Grid Thumbnail';
    document.body.appendChild(thumbnailPreview);

    // You can also send this thumbnail data to the server or store it in local storage
    // Example: localStorage.setItem('gridThumbnail', thumbnailData);
}
    
    // Add loading indicator or disable button for Save Layout
    document.getElementById('saveButton').addEventListener('click', async () => {
        const saveButton = document.getElementById('saveButton');
        saveButton.classList.add('loading');
        saveButton.disabled = true; // Disable the button
        saveButton.textContent = 'Saving...'; // Update button text to indicate progress
    
        const layoutName = prompt("Enter layout name:");
        if (!layoutName) {
            saveButton.disabled = false; // Re-enable button
            saveButton.textContent = 'Save Layout'; // Reset button text
            return;
        }
    
        const gridContainer = document.getElementById('grid-container'); 
        if (gridContainer) {
            addLayoutLabFooter(gridContainer);
        }
    
        // Capture the layout as an image (Thumbnail)
        const thumbnailBase64 = await captureThumbnail();
    
        const layoutData = {
            name: layoutName,
            configuration: getGridConfiguration(), // Function to collect the grid configuration
            thumbnail: thumbnailBase64, // Add the base64 thumbnail
        };
    
        fetch('/save/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(layoutData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Layout saved successfully!');
                    console.log('Layout Name:', layoutName);
                    console.log('Thumbnail URL:', data.thumbnail_url);
                } else {
                    alert('Failed to save layout.');
                }
            })
            .catch(error => {
                alert('Error saving layout');
                console.error('Error:', error);
            })
            .finally(() => {
                saveButton.classList.remove('loading');
                saveButton.disabled = false; // Re-enable button
                saveButton.textContent = 'Save Layout'; // Reset button text
            });
    });
    

    document.addEventListener('DOMContentLoaded', () => {
        const saveButton = document.getElementById('saveTemplateButton');
        
        // Check if the button exists
        if (!saveButton) {
            console.log('Save Template button not found on the page.');
            return; // Exit if the button is not found
        }
    
        // Save Template Functionality
        saveButton.addEventListener('click', () => {
            saveButton.classList.add('loading');
            saveButton.disabled = true;
            saveButton.textContent = 'Saving...';
    
            const layoutName = prompt("Enter template name:");
            if (!layoutName) {
                saveButton.disabled = false;
                saveButton.textContent = 'Save Template';
                return;
            }
    
            const layoutData = {
                name: layoutName,
                configuration: getGridConfiguration(),
            };
    
            fetch('/save-template/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(layoutData),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Template saved successfully!');
                    } else {
                        alert('Failed to save template.');
                    }
                })
                .catch(error => {
                    alert('Error saving template');
                    console.error('Error:', error);
                })
                .finally(() => {
                    saveButton.classList.remove('loading');
                    saveButton.disabled = false;
                    saveButton.textContent = 'Save Template';
                });
        });
    });
    
    
    // Add loading indicator or disable button for Load Layout
    document.getElementById('openSavedFilesButton').addEventListener('click', () => {
        const loadButton = document.getElementById('openSavedFilesButton');
        loadButton.disabled = true; // Disable the button
        loadButton.textContent = 'Loading...'; // Update button text to indicate progress
        const layoutLoadedInput = document.getElementById('layoutName');

    
        const layoutName = prompt("Enter layout name to load:");
        if (!layoutName) {
            loadButton.disabled = false; // Re-enable button
            loadButton.textContent = 'Load Layout'; // Reset button text
            return;
        }
    
        const loadLayoutUrlWithName = `http://127.0.0.1:8000/load/${encodeURIComponent(layoutName)}`;
        fetch(loadLayoutUrlWithName)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch layout: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.configuration) {
                    resetInputsToDefault();
                    loadGridConfiguration(data.configuration); // Load configuration

                    showModal(
                        'Layout Loaded',
                        `${layoutName} layout was loaded successfully`,
                        null, 
                        null, 
                        function () { console.log('OK clicked!'); }, 
                        false,
                        true 
                    );
                    modalTimer();
                    
                    
                } else {

                    showModal(
                        'Layout Error',
                        `There was a problem loading your layout ${layoutName}`,
                        null, 
                        null, 
                        function () { console.log('OK clicked!'); }, 
                        false,
                        true 
                    );
                        modalTimer();
                }
            })
            .catch(error => {
                showModal(
                    'Layout Error',
                    `There was a problem loading your layout ${layoutName}`,
                    null, 
                    null, 
                    function () { console.log('OK clicked!'); }, 
                    false,
                    true 
                );
                console.error('Error:', error);
            })
            .finally(() => {
                loadButton.disabled = false; 
                loadButton.textContent = 'Load Layout'; 
                layoutLoadedInput.value = layoutName;

            });
    });
    


    function loadGridConfiguration(configuration) {

        gridContainer.innerHTML = ''; 
    
        const { columns, rows, gridGap, gridGapRange } = configuration.gridSettings;
        const { parentContainerSettings } = configuration;

        const parentContainer = gridContainer.parentElement; 
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




// Save to PDF Button event
document.getElementById('saveAsPdfButton').addEventListener('click', () => {
        convertToPDF();
        addLayoutLabFooter(gridContainer);
});

/* original
function convertToPDF() {
    const gridContainerElement = document.getElementById('grid-container');
    const randomNumber = Math.floor(Math.random() * 1000000);
    const filename = `layoutlab-design-${randomNumber}.pdf`;

    const options = {
        margin: 10,
        filename: filename, 
        image: { type: 'jpeg', quality: 0.98 }, 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
    };

    html2pdf().from(gridContainerElement).set(options).save();
}
*/


function convertToPDF() {
    const gridContainerElement = document.getElementById('grid-container');
    const randomNumber = Math.floor(Math.random() * 1000000);
    const filename = `layoutlab-design-${randomNumber}.pdf`;

    const options = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
        },
    };

    const author = "layoutlab.slammin-design.co.uk";
    const keywords = "This layout was created using LayoutLab";
    const title = "A LayoutLab Creation";

    html2pdf()
        .from(gridContainerElement)
        .set(options)
        .toPdf()
        .get('pdf')
        .then(function (pdf) {
            pdf.setProperties({
                title: title,
                subject: 'Generated LayoutLab Design PDF',
                author: author,
                keywords: keywords,
            });
        })
        .save();
}


/*lg
// User loads from workspace
document.addEventListener('DOMContentLoaded', function() {
    const layoutNameToLoad = sessionStorage.getItem('layoutNameToLoad');
    const gridContainer = document.getElementById('grid-container');
    const loadButton = document.getElementById('openSavedFilesButton');
    const layoutLoadedInput = document.getElementById('layoutName');

    if (layoutNameToLoad) {
        // Disable the button and show loading state
        loadButton.disabled = true;
        loadButton.textContent = 'Loading...';

        // Fetch layout configuration
        const loadLayoutUrlWithName = `http://127.0.0.1:8000/load/${encodeURIComponent(layoutNameToLoad)}`;
        
        fetch(loadLayoutUrlWithName)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch layout: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.configuration) {
                    resetInputsToDefault();
                    loadGridConfiguration(data.configuration); // Load configuration
                    alert('Layout loaded successfully from workspace!');
                } else {
                    alert('Failed to load layout.');
                }
            })
            .catch(error => {
                alert('Error loading layout');
                console.error('Error:', error);
            })
            .finally(() => {
                // Re-enable the button and reset the text
                loadButton.disabled = false;
                loadButton.textContent = 'Load Layout';
                layoutLoadedInput.value = layoutNameToLoad;

                // Remove the layout name from sessionStorage after loading
                sessionStorage.removeItem('layoutNameToLoad');
            });
    }
});
*/

// Load Layout or Template
document.addEventListener('DOMContentLoaded', function() {
    const layoutNameToLoad = sessionStorage.getItem('layoutNameToLoad');
    const gridContainer = document.getElementById('grid-container');
    const loadButton = document.getElementById('openSavedFilesButton');
    const layoutLoadedInput = document.getElementById('layoutName');

    if (layoutNameToLoad) {
        loadButton.disabled = true;
        loadButton.textContent = 'Loading...';

        const loadUrl = `http://127.0.0.1:8000/load/${encodeURIComponent(layoutNameToLoad)}`;

        fetch(loadUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch item: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.configuration) {
                    resetInputsToDefault();
                    loadGridConfiguration(data.configuration);

                    showModal(
                        'Layout Loaded',
                        `${layoutNameToLoad} layout was loaded successfully`,
                        null, 
                        null, 
                        function () { console.log('OK clicked!'); }, 
                        false,
                        true 
                    );
                    modalTimer();
                } else {
                    showModal(
                        'Layout Load Error',
                        `${layoutNameToLoad} failed to load`,
                        null, 
                        null, 
                        function () { console.log('OK clicked!'); }, 
                        false,
                        true 
                    );
                }
            })
            .catch(error => {
                showModal(
                    'Loading Error',
                    `${layoutName} failed to load`,
                    null, 
                    null, 
                    function () { console.log('OK clicked!'); }, 
                    false,
                    true 
                );
                console.error('Error:', error);
            })
            .finally(() => {
                loadButton.disabled = false;
                loadButton.textContent = 'Load Item';
                layoutLoadedInput.value = layoutNameToLoad;
                sessionStorage.removeItem('layoutNameToLoad');
            });
    }
});






// Clear Layout


const toolbarContainer = document.getElementById('container-finish-toolbar'); 

toolbarContainer.addEventListener('click', function (event) {
    console.log('Clicked element:', event.target); // Log the clicked element
    if (event.target.matches('[data-action="clear-layout"]')) {
        console.log('1 clear activated');
        
        // Check if the button is being found correctly
        console.log('Clear button found, showing modal');

        showModal(
            'Clear Layout', 
            `Are you sure you want to clear and reset the layout?`, 
            function() { 
                clearLayout();
                closeModal(); 
            }, 
            function() { 
                closeModal(); 
            }, 
            null, 
            true,
            false 
        );
    }
    console.log('2 clear end');
});


/*/

document.getElementById('clear-layout-button').addEventListener('click', () => {
    console.log('clear activated');
    showModal(
        'Clear Layout', 
        `Are you sure you want to clear and reset the layout?`, 
        function() { 
            clearLayout();
            closeModal(); 
        }, 
        function() { 
            closeModal(); 
        }, 
        null, 
        true,
        false 
    );
    console.log('clear end');
});

/*
document.addEventListener('click', function (event) {
    if (event.target.matches('[data-action="clear-layout"]')) {
        showModal(
            'Clear Layout', 
            `Are you sure you want to clear and reset the layout?`, 
            function() { clearLayout(); }, 
            function() { closeModal(); } 
        );
    }
});
*/
/////////////////////////////////////////////////////////////


// Strip text of formatting before pasting
document.querySelector('.grid-container').addEventListener('paste', function(event) {

    if (
        event.target.tagName === 'TEXTAREA' || 
        event.target.tagName === 'INPUT'
    ) {
        return;  
    }

    event.preventDefault();

    let paste = (event.clipboardData || window.clipboardData).getData('text');

    if (
        event.target.tagName === 'TEXTAREA' || 
        event.target.tagName === 'P' || 
        (event.target.tagName.startsWith('H') && event.target.tagName.length === 2) ||  // Check for H1-H6
        event.target.isContentEditable || 
        event.target.classList.contains('heading') || 
        event.target.classList.contains('text')
    ) {

        if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT') {
            event.target.value = paste;  
        } else {
            event.target.innerHTML = paste;  
        }
    }
});




/*** Drag and drop function ***/
let draggedElement = null; // Store the dragged element

// Function to initialize draggable elements
function initialiseDraggables() {
    const editableElements = document.querySelectorAll('.resizable-wrapper:not([draggable="true"])');

    editableElements.forEach(element => {
        element.setAttribute('draggable', 'true');
    });
}


gridContainer.addEventListener('dragstart', (event) => {
    handleDragStart(event);
});

gridContainer.addEventListener('dragend', (event) => {
    handleDragEnd(event);
});

gridContainer.addEventListener('dragover', (event) => {
    handleDragOver(event);
});

gridContainer.addEventListener('drop', (event) => {
    handleDrop(event);
});


function handleDragStart(event) {
    if (event.target.classList.contains('resizable-wrapper')) {
        draggedElement = event.target; // Set the element being dragged
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', event.target.id); // Use ID for easier manipulation
        draggedElement.classList.add('dragging'); // Add dragging class for styling
    }
}

function handleDragEnd(event) {
    if (event.target.classList.contains('resizable-wrapper')) {
        event.preventDefault(); // Prevent any default behavior
        draggedElement.classList.remove('dragging'); // Remove dragging class
        draggedElement.style.opacity = ''; // Reset opacity if it was changed during drag
        draggedElement = null; // Reset the dragged element for next operation
    }
}

function handleDragOver(event) {
    event.preventDefault(); // Allow the drop
    const target = event.target.closest('.grid-item');
    if (target) {
        target.classList.add('drag-over'); // Add visual feedback
    }
}

function handleDrop(event) {
    event.preventDefault();
    const target = event.target.closest('.grid-item');
    if (target && draggedElement) {
        target.appendChild(draggedElement); // Append the dragged element to the drop target
        target.classList.remove('drag-over'); // Remove visual feedback
        draggedElement.classList.remove('dragging'); // Clean up dragging state
        draggedElement = null; // Reset the dragged element
    } else {
        console.error('Dragged element is not valid or no drop target found.');
    }
}

// Modal timeout




// Reset defaults

function resetInputsToDefault() {
    // Column inputs
const columnsInput = document.getElementById('columns');
const columnsRange = document.getElementById('columnsRange');

// Row inputs
const rowsInput = document.getElementById('rows');
const rowsRange = document.getElementById('rowsRange');

// Extra Grid Box
const extraGridBox = document.getElementById('extraGridBox');

// Grid Gap
const gridGapNum = document.getElementById('gridGapNum');
const gridGapRange = document.getElementById('gridGapRange');

// Outer Margin
const containerMarginNum = document.getElementById('containerMarginNum');
const containerMarginRange = document.getElementById('containerMarginRange');

// Top Margin
const topMarginNum = document.getElementById('topMarginNum');
const topMarginRange = document.getElementById('topMarginRange');

// Right Margin
const rightMarginNum = document.getElementById('rightMarginNum');
const rightMarginRange = document.getElementById('rightMarginRange');

// Bottom Margin
const bottomMarginNum = document.getElementById('bottomMarginNum');
const bottomMarginRange = document.getElementById('bottomMarginRange');

// Left Margin
const leftMarginNum = document.getElementById('leftMarginNum');
const leftMarginRange = document.getElementById('leftMarginRange');

// Column inputs
columnsInput.value = columnsInput.defaultValue;
columnsRange.value = columnsRange.defaultValue;

// Row inputs
rowsInput.value = rowsInput.defaultValue;
rowsRange.value = rowsRange.defaultValue;

// Extra Grid Box
extraGridBox.value = extraGridBox.defaultValue;

// Grid Gap
gridGapNum.value = gridGapNum.defaultValue;
gridGapRange.value = gridGapRange.defaultValue;

// Outer Margin
containerMarginNum.value = containerMarginNum.defaultValue;
containerMarginRange.value = containerMarginRange.defaultValue;

// Top Margin
topMarginNum.value = topMarginNum.defaultValue;
topMarginRange.value = topMarginRange.defaultValue;

// Right Margin
rightMarginNum.value = rightMarginNum.defaultValue;
rightMarginRange.value = rightMarginRange.defaultValue;

// Bottom Margin
bottomMarginNum.value = bottomMarginNum.defaultValue;
bottomMarginRange.value = bottomMarginRange.defaultValue;

// Left Margin
leftMarginNum.value = leftMarginNum.defaultValue;
leftMarginRange.value = leftMarginRange.defaultValue;
}

// Reset Grid
function clearLayout() {
    // Clear the grid container content
    const gridContainer = document.querySelector('.grid-container');
    if (gridContainer) {
        gridContainer.innerHTML = ''; 
        gridContainer.removeAttribute('style'); 
    }

    // Reset IDs or other global values 
    headingId = 1;
    textId = 1;
    imageId = 1;
    videoId = 1;
    deleteId = 1;
    index = 1;

    const columns = 1; 
    const rows = 1;  

    createGrid(columns, rows);
    resetInputsToDefault();

}


// *** Grid Creation ***
// Initial grid creation
createGrid();


// Drag and drop 
initialiseDraggables();


// Footer

function addLayoutLabFooter(gridContainer) {
    // Check if the footer already exists
    const existingFooter = gridContainer.querySelector('.layout-lab-footer');
    if (existingFooter) return; // Exit if the footer already exists

    // Create the footer element
    const footerRow = document.createElement('div');
    footerRow.className = 'layout-lab-footer';
    footerRow.style.cssText = `
        grid-column: 1 / -1; /* Span the entire grid width 
        text-align: center;
        background-color: transparent;
        font-size: 14px;
        padding: 0;
        border-top: 2px solid #222;
        margin-bottom: 0;
        user-select: none; 
        pointer-events: none; /* Prevent interactions 
    `;

    // Add content to the footer
    const link = document.createElement('a');
    const footer = document.createElement('div');
    footer.classList.add('layoutlabfooter'); 
    link.href = 'https://layoutlab.slammin-design.co.uk';
    footer.innerHTML = `
    <div><p>
      A <strong>LayoutLab</strong> creation. Make your layout at 
      <a href="${link}" target="_blank" aria-label="Visit LayoutLab website at layoutlab.slammin-design.co.uk">
        <strong>layoutlab.slammin-design.co.uk</strong>
      </a></p>
    </div>
    <div class="logo-footer bold invert" id="top-logo" aria-hidden="true">
      LayoutLab
    </div>
  `;
  
    link.style.cssText = `
        text-decoration: none;
        color: #000000;
        pointer-events: auto; 
    `;
    footerRow.appendChild(footer);

    // Append the footer to the grid container
    gridContainer.appendChild(footerRow);
}

// Save sync interval (every 5 minutes)
setInterval(async () => {
    const userIsAuthenticated = await checkAuthStatus();
    if (userIsAuthenticated) {
        await syncLocalDataToServer();
    }
}, 300000); // Sync every 5 minutes

// Check if the user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch('/check-auth-status');
        const data = await response.json();
        if (data.authenticated) {
            console.log('User is authenticated');
            return true;
        } else {
            console.log('User is not authenticated');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false; // Handle the error and return false
    }
}


// Save layout locally
function saveLayoutLocally(layout) {
    const layouts = JSON.parse(localStorage.getItem('layouts')) || {};
    layouts[layout.id] = layout;
    localStorage.setItem('layouts', JSON.stringify(layouts));
}

// Save data locally with timestamp
function saveToLocal(key, value) {
    const timestamp = new Date().toISOString();
    const data = { value, timestamp };
    localStorage.setItem(key, JSON.stringify(data));
}

// Load data locally and handle expiration
function loadFromLocal(key) {
    const data = JSON.parse(localStorage.getItem(key));
    if (data) {
        const now = new Date();
        const savedTime = new Date(data.timestamp);
        const diffInDays = (now - savedTime) / (1000 * 60 * 60 * 24);

        if (diffInDays > 7) {
            // Data expired
            localStorage.removeItem(key);
            showErrorMessage('Your saved layout has expired and was cleared.');
            return null;
        }

        if (diffInDays > 5) {
            showWarningMessage('Your saved layout is about to expire.');
        }

        return data.value;
    }
    return null;
}

// Sync local data to server
async function syncLocalDataToServer() {
    const layout = loadFromLocal('layout');
    if (layout) {
        try {
            const response = await fetch('/save-layout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ configuration: layout }),
            });
            const result = await response.json();
            if (result.success) {
                localStorage.removeItem('layout'); // Clear local storage after sync
                showSuccessMessage('Layout saved successfully!');
            } else {
                showErrorMessage('Failed to save layout.');
            }
        } catch (error) {
            console.error('Error syncing data:', error);
            showErrorMessage('There was an issue syncing your data. Please try again later.');
        }
    }
}

// Sync all layouts locally with server and resolve conflicts
async function syncLayouts() {
    const localLayouts = JSON.parse(localStorage.getItem('layouts')) || {};
    const response = await fetch('/api/get_layouts'); // API to fetch server layouts
    const serverLayouts = await response.json();

    const mergedLayouts = {};
    for (const [id, localLayout] of Object.entries(localLayouts)) {
        if (serverLayouts[id]) {
            // Conflict resolution based on timestamp
            const serverLayout = serverLayouts[id];
            if (new Date(localLayout.updated_at) > new Date(serverLayout.updated_at)) {
                mergedLayouts[id] = localLayout; // Local changes take precedence
            } else {
                mergedLayouts[id] = serverLayout; // Server changes take precedence
            }
        } else {
            mergedLayouts[id] = localLayout; // Local layout is new
        }
    }

    // Save merged layouts back locally and push to server
    localStorage.setItem('layouts', JSON.stringify(mergedLayouts));
    await saveToServer(mergedLayouts); // Sync with server
}

// Migrate local layouts to server for authenticated users
async function migrateLocalLayouts() {
    const localLayouts = JSON.parse(localStorage.getItem('layouts')) || {};
    const response = await fetch('/api/migrate_layouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layouts: localLayouts }),
    });
    if (response.ok) {
        localStorage.removeItem('layouts'); // Clear local storage after migration
        showSuccessMessage('Your layouts have been migrated to the server.');
    } else {
        showErrorMessage('Failed to migrate layouts.');
    }
}

// Show success message
function showSuccessMessage(message) {
    alert(message);  // You can replace this with a custom success notification
}

// Show error message
function showErrorMessage(message) {
    alert(message);  // You can replace this with a custom error notification
}

// Show warning message
function showWarningMessage(message) {
    alert(message);  // You can replace this with a custom warning notification
}

// Save button event listener (manual sync)
document.getElementById('saveButton').addEventListener('click', async () => {
    const layout = loadFromLocal('layout');
    if (layout) {
        await syncLocalDataToServer();
        showSuccessMessage('Your layout has been saved successfully!');
    }
});

// CSRF token retrieval (if using Django or similar)
function getCSRFToken() {
    return document.querySelector('[name="csrfmiddlewaretoken"]').value;
}

