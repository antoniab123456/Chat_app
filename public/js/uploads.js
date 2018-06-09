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

var inputs = document.querySelectorAll('.inputfile');

Array.prototype.forEach.call(inputs, function (input) {
    var label = document.querySelector('#label');
    var labelVal = label.innerHTML;

    input.addEventListener('change', function (e) {
        var fileName = '';
        if (this.files && this.files.length > 1) {
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        } else {
            fileName = e.target.value.split('\\').pop();
        }
        if (fileName) {
            document.querySelector('#file_name').value = fileName;
            label.style.color = "#fff";
            label.style.backgroundColor = "#3a9ad2";
        } else {
            label.innerHTML = labelVal;
        }
    });
});