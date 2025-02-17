document.addEventListener('DOMContentLoaded', function () {

    // Development mode only
    //localStorage.removeItem('firstVisit');

    const tips = document.querySelectorAll('.tip');
    const gridContainer = document.getElementById('grid-container');
    let currentTip = 0;


    tips.forEach((tip, index) => {});


    // Show tip 1 
    if (localStorage.getItem('firstVisit') === null) {
        localStorage.setItem('firstVisit', 'true');
        showTip(currentTip);
    }

    // Show next tip based on input/range selector change
    document.querySelectorAll('input, range').forEach(input => {
        input.addEventListener('change', () => {
            fadeOutAndShowNextTip();
        });
    });

    // Show tip 4 when any button inside grid-container is clicked
    gridContainer.addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() === 'button') {
            fadeOutAndShowNextTip();
        }
    });

    // Fade out and show the next tip
    function fadeOutAndShowNextTip() {
        if (currentTip < tips.length - 1) {
            fadeOut(tips[currentTip]);
            currentTip++;

            setTimeout(() => {
                showTip(currentTip);
            }, 500);
        } else if (currentTip === tips.length - 1) {
            fadeOut(tips[currentTip]);
            setTimeout(() => {
                showTip(currentTip);
                triggerConfetti();
            }, 500);
        }
    }


    // Function to show the current tip with fade-in effect
    function showTip(index) {
        const tip = tips[index];
        if (tip) {
            tip.style.display = 'flex'; // Ensure it's visible
            tip.classList.add('show');
        }
    }


    // Fade-out effect
    function fadeOut(element) {
        element.classList.remove('show');
        setTimeout(() => {
            if (element.id !== 'tip-5') {
                element.style.display = 'none';
            }
        }, 500);
    }

});