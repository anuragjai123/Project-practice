const slides = document.querySelectorAll(".slide");

var counter = 0;

slides.forEach((slide, index) => {
    slide.style.left = `${index * 100}%`; // Corrected syntax
});

const goNext = () => {
    counter++;
    slideimage();
};

const goprev = () => {
    counter--;
    slideimage();
};

const slideimage = () => {
    // Ensure counter wraps around
    if (counter >= slides.length) {
        counter = 0;
    } else if (counter < 0) {
        counter = slides.length - 1;
    }
    
    slides.forEach((slide) => {
        slide.style.transform = `translateX(-${counter * 100}%)`; // Corrected syntax
    });
};

// Example event listeners (you can adjust these as needed)
document.querySelector(".next").addEventListener("click", goNext);
document.querySelector(".prev").addEventListener("click", goprev);
