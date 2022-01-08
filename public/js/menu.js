/*
navSlide controls the menu bar when the window gets small. The menu bar is placed to the side and
it's controlled by the three lines.
   Input: None
   Output: None
*/
const navSlide = () => {
   const lines = document.querySelector('.lines');
   const nav = document.querySelector('.nav-links');
   const navLinks = document.querySelectorAll('.nav-links li');

   lines.addEventListener('click', () => {
      nav.classList.toggle('nav-active');
      navLinks.forEach((link, index) =>{
            if (link.style.animation) {
               link.style.animation = '';
            }
            else {
               link.style.animation = `navLinkFade 0.3s ease forwards ${index / 7 + .06}s`;
            }
         });

      lines.classList.toggle('toggle');
   });
}
navSlide();