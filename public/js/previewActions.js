var modalButton = document.querySelector('.makeApptBtn');
var modalPreview = document.querySelector('.apptPreview');
var modalClose = document.querySelector('.close');

modalButton.addEventListener('click', 
function() {
   modalPreview.classList.add('active');
});

modalClose.addEventListener('click', 
function() {
   document.getElementById('doctorName').innerHTML = `<b>Doctor:</b> `;
   document.getElementById('datetime').innerHTML = `<b>Appointment Time:</b> `;
   modalPreview.classList.remove('active');
});
