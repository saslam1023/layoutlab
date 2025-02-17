// View / Edit Mode
const viewModeButton = document.getElementById('hideLayout');
viewModeButton.addEventListener('click', function () {
    const headerPanel = document.querySelector('.header');
    //  const gridElementToolbar = document.querySelectorAll('.grid-element-toolbar');
    const gridElementToolbar = document.querySelectorAll('.giet-button-container');
    const gridItemToolbar = document.querySelectorAll('.grid-item-toolbar');
    const gridItems = document.querySelectorAll('.grid-item');
    const lowerToolBar = document.getElementById('container-finish-toolbar');
    const mainToolBar = document.getElementById('container-toolbar-container');
    const gridContainer = document.getElementById('grid-container');
    const mainContainer = document.getElementById('container');
    const previewButton = document.getElementById('hideLayout')
    const topLogo = document.getElementById('logo-fixed');
    const clearLayout = document.getElementById('clear-layout-button');
    const loadLayout = document.getElementById('openSavedFilesButton');
    const messageModal = document.getElementById('confirmationModal');


    if (viewModeButton.innerHTML === 'Preview') {
        //  addLayoutLabFooter(gridContainer);
        // Switch to Edit Mode
        viewModeButton.innerHTML = '<i class="fa-solid fa-caret-left"></i> Edit Mode';
        viewModeButton.style.backgroundColor = 'var(--preview-bar)';
        viewModeButton.style.color = 'var(--soft-white)';
        topLogo.style.display = 'block';
        clearLayout.style.display = 'none';
        loadLayout.style.display = 'none';
        messageModal.classList.add('hide');

        /*  // Change preview button style
          previewButton.style.position = 'fixed';
          previewButton.style.right = '2.5rem'; 
          previewButton.style.bottom = '2.5rem';
          previewButton.style.height = '95vh';
          previewButton.style.width = '4.5rem';
          previewButton.style.borderRadius = '0';
          previewButton.style.fontSize = '12px';*/

        previewButton.style.backgroundColor = 'red';


        // Hide unnecessary elements        
        // lowerToolBar.style.display = 'none';
        headerPanel.style.display = 'none';
        mainToolBar.style.display = 'none';
        console.log(mainToolBar);
        mainContainer.style.border = 'none';
        gridContainer.style.border = 'none';
        //  document.body.style.backgroundColor = '';
        document.body.style.backgroundImage = 'none';

        // Update grid items for Edit Mode
        gridItems.forEach(gridContainer => {
            //   gridContainer.style.backgroundColor = ''; 
            gridContainer.style.border = 'none';
        });

        gridItemToolbar.forEach(gridContainer => {
            gridContainer.style.display = 'none';
        });
        gridElementToolbar.forEach(gridContainer => {
            gridContainer.style.display = 'none';
        });

        const gridItemSpanCols = document.querySelectorAll('.grid-item-span-col-1');
        gridItemSpanCols.forEach(item => {
            if (!item.style.backgroundColor) {
                item.style.backgroundColor = 'transparent';
            }
        });

        // Disable contenteditable elements
        const editableItems = document.querySelectorAll('[contenteditable]');
        editableItems.forEach(item => {
            item.setAttribute('contenteditable', 'false');
        });

        // Disable resizing
        const resizableItems = document.querySelectorAll('.resizable-wrapper');
        resizableItems.forEach(item => {
            item.style.resize = 'none';
            item.style.border = '0';
        });


        // Disable tips
        const tips = document.querySelectorAll('.tip');
        tips.forEach(item => {
            item.classList.remove('show');
            item.style.display = 'none';
        });


    } else if (viewModeButton.innerHTML === '<i class="fa-solid fa-caret-left"></i> Edit Mode') {


        // Tip animation

        const tip5 = document.getElementById('tip-5');
        tip5.style.display = 'flex';
        tip5.classList.add('show');
        showTip5();

        function showTip5() {
            const tip5 = document.getElementById('tip-5');
            tip5.style.display = 'flex';
            tip5.classList.add('show');
            setTimeout(() => {
                hideTip5();
            }, 2000);
        }

        function hideTip5() {
            const tip5 = document.getElementById('tip-5');
            if (tip5) {
                tip5.classList.add('fade-out');
                setTimeout(() => {
                    tip5.style.display = 'none';
                    tip5.classList.remove('show', 'fade-out');
                    console.log(`tip5 hidden`);

                })
            }
        }


        // Switch to Preview
        viewModeButton.innerHTML = 'Preview';
        viewModeButton.style.backgroundColor = '';
        viewModeButton.style.color = '';
        topLogo.style.display = '';
        clearLayout.style.display = '';
        loadLayout.style.display = '';
        messageModal.classList.remove('hide');

        previewButton.style.backgroundColor = '';


        // Show all elements
        //  lowerToolBar.style.display = '';
        headerPanel.style.display = '';
        mainToolBar.style.display = '';
        mainContainer.style.border = '';
        gridContainer.style.border = '';
        document.body.style.backgroundImage = '';


        // Restore grid items for Preview
        gridItems.forEach(gridContainer => {
            gridContainer.style.border = '';
        });

        gridItemToolbar.forEach(gridContainer => {
            gridContainer.style.display = '';
        });

        gridElementToolbar.forEach(gridContainer => {
            gridContainer.style.display = '';
        });

        const gridItemSpanCols = document.querySelectorAll('.grid-item-span-col-1');
        gridItemSpanCols.forEach(item => {
            if (item.style.backgroundColor) {
                //  item.style.backgroundColor = '';
            }
        });


        // Re-enable contenteditable elements
        const editableItems = document.querySelectorAll('[contenteditable]');
        editableItems.forEach(item => {
            item.setAttribute('contenteditable', 'true');
            console.log(`contenteditable reactivated`);
        })

        // Re-enable resizing
        const resizableItems = document.querySelectorAll('.resizable-wrapper');
        resizableItems.forEach(item => {
            item.style.resize = 'both';
            item.style.border = '';
            console.log(`resizeable reactivated`);
        });
    }


});