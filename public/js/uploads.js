var upload_btn = document.querySelector('#upload_btn');
var upload_window = document.querySelector('#upload_window');
var close_upload_btn = document.querySelector('#close_upload_btn');


upload_btn.addEventListener('click', diplayUploadWindow);
close_upload_btn.addEventListener('click', closeUploadWindow);

function diplayUploadWindow() {
    upload_window.style.display = "block";
}

function closeUploadWindow() {
    upload_window.style.display = "none";
}