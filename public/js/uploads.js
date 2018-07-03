/* Functions for shortening syntax working with DOM */
let select = (sel) => document.querySelector(sel);
let listen = (lis, e, func) => lis.addEventListener(e, func);


var upload_btn = select('#upload_btn'),
    upload_window = select('#upload_window'),
    close_upload_btn = select('#close_upload_btn'),
    more_files_error = select('.more_files_error'),
    file_name = select('#file_name'),
    header = select('#header'),
    label = select('#label');
    


listen(upload_btn, 'click', diplayUploadWindow);
listen(close_upload_btn, 'click', closeUploadWindow);

function diplayUploadWindow() {
    upload_window.style.display = "block";
}

function closeUploadWindow() {
    upload_window.style.display = "none";
}


/* Handling the input of files */
var inputs = document.querySelectorAll('.inputfile');

/* For each file input either display the file name,or 
the amount of files selected if more than one are selected */
Array.prototype.forEach.call(inputs, function (input) {

    input.addEventListener('change', function (e) {

        var fileName = '';

        /* If more than nine files are selected, throw error */
        if (this.files.length >= 10) {

            more_files_error.style.display = "block";
            file_name.style.border = '1px solid red';
            header.style.marginTop = "30px";
            file_name.value = "No file chosen"

            let hideError = () => {
                file_name.style.border = 'none';
                more_files_error.style.display = "none";
                header.style.marginTop = "50px";
            }

            setTimeout(hideError, 3000);
        } else {
            /* If more than 1 file is uploaded dispay the number of files */
            if (this.files && this.files.length > 1) {
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);

                /* If only one, split the url at \\ and pop it out */
            } else {
                fileName = e.target.value.split('\\').pop();
            }

            /* Change the button color if the file is uploaded */
            if (fileName) {
                file_name.value = fileName;
                label.style.color = "#fff";
                label.style.backgroundColor = "#3a9ad2";

                /* Otherwise the value stays the same */
            } else {
                file_name.value = "No file chosen";
            }

        }
    });
});









