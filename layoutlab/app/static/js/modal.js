// Function to show the modal with dynamic content
function showModal(
    title,
    message,
    confirmCallback = null,
    cancelCallback = null,
    okCallback = null,
    showConfirmCancel = true,
    showOkButton = false
) {
    const modal = document.getElementById('confirmationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmButton = document.getElementById('confirmDelete');
    const cancelButton = document.getElementById('cancelDelete');
    const okButton = document.getElementById('okButton');
    const closeButton = document.getElementById('closeModal'); // Get the close button

    // Set modal title and message
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    // Show or hide Confirm/Cancel buttons
    confirmButton.style.display = showConfirmCancel ? 'inline-block' : 'none';
    cancelButton.style.display = showConfirmCancel ? 'inline-block' : 'none';

    // Show or hide OK button
    okButton.style.display = showOkButton ? 'inline-block' : 'none';

    // Show the modal with a slide-up effect
    modal.classList.remove('hide');
    modal.classList.add('show');

    // Assign actions to buttons
    confirmButton.onclick = confirmCallback ? confirmCallback : () => {};
    cancelButton.onclick = cancelCallback ? cancelCallback : closeModal;
    okButton.onclick = function () {
        if (okCallback) okCallback(); // Call the OK callback if provided
        closeModal(); // Always close the modal after clicking OK
    };

    // Ensure the close button works
    closeButton.onclick = closeModal; // Close modal when close button is clicked

    // Close the modal on click outside
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    // Function to close the modal
    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');

        // Wait for the transition to complete before hiding it completely
        setTimeout(() => {
            modal.classList.add('hide');
            modal.classList.remove('show');
            //  modal.style.display = 'none';

        }, 500); // Match the transition duration in CSS
    }
}


function modalTimer() {
    const modal = document.getElementById('confirmationModal');

    // Add the "show" class to make the modal visible
    modal.classList.add('show');
    //modal.style.display = 'flex';

    // Set timeout to hide the modal after 5 seconds
    const timeout = setTimeout(() => {
        if (modal.classList.contains('show')) {
            modal.classList.remove('show'); // Start fade-out animation
            modal.classList.add('hide');
            console.log('Modal fading out automatically');

            // Remove the modal completely after the animation ends
            setTimeout(() => {
                // modal.style.display = 'none';
                modal.classList.remove('hide'); // Clean up classes
                console.log('Modal hidden after timeout');
            }, 500); // Match the CSS transition duration
        }
    }, 5000); // 5 seconds timeout

    // Manual close button logic
    const closeButton = document.getElementById('closeModal');
    closeButton.onclick = () => {
        console.log(`closebutton clicked`);
        clearTimeout(timeout); // Clear the timer to prevent auto-hide
        modal.classList.remove('show'); // Start fade-out animation
        modal.classList.add('hide');
        console.log('Modal closed manually');

        // Remove the modal completely after the animation ends
        setTimeout(() => {
            //  modal.style.display = 'none';
            modal.classList.remove('hide'); // Clean up classes
        }, 500); // Match the CSS transition duration
    };
}