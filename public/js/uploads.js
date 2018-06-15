/* Functions for shortening syntax working with DOM */
let select = (sel) => document.querySelector(sel);
let listen = (lis, e, func) => lis.addEventListener(e, func);
let el = div => { return document.createElement(div);}
let append = (el, child) => {return el.appendChild(child);}
let attr = (variab, nameCl) => { return variab.setAttribute('class', nameCl);}
let html = (variab, smth) => { return variab.innerHTML = smth; }


var upload_btn = select('#upload_btn'),
    upload_window = select('#upload_window'),
    close_upload_btn = select('#close_upload_btn'),
    message = select('#textarea_message'),
    submit_file_btn = select('#submit_file_btn'),
    more_files_error = select('.more_files_error'),
    file_name = select('#file_name'),
    header = select('#header'),
    submit_file_btn = select('#submit_file_btn'),
    chat_window = select('.chat_window'),
    enter_message = select('.enter_message'),
    footer = select('.footer'),
    image_main_div = select('#image_main_div'),
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
        if (this.files.length >= 9) {

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




function previewFiles() {

    let readerArray = [];
    var input_files = select('input[type=file]').files;

    function readAndPreview(file) {

        var reader = new FileReader();

        reader.addEventListener("load", () => {

            listen(submit_file_btn, 'click', function showImages() {
                upload_window.style.display = "none";

                obj = {
                    readResult: reader.result,
                    size: file.size
                }
                readerArray.push(obj);

                image_main_div.innerHTML = '';
                readerArray.forEach(img => {
                    
                    let image_preview = el('div'),
                    delete_image = el('div');
                    attr(image_preview, 'image_preview');
                    attr( delete_image, 'delete_image');

                    html(delete_image, '<p>' + '&times;' + '</p>');
                    delete_image.onclick = deleteImages;

                    image_preview.style.background = "url(" + img.readResult + ") no-repeat center center";
                    image_preview.style.backgroundSize = 'cover';

                    append(image_preview, delete_image);
                    append(image_main_div, image_preview);
                   
                    chat_window.style.height = "670px";
                    enter_message.style.height = "200px";
                    footer.style.top = '750px';

                    function deleteImages() {
                        for (var i = 0; i < readerArray.length; i++) {
                            if (readerArray[i].size == img.size) {
                                readerArray.splice(i, 1);
                                image_preview.style.display = "none";
                            }
                        }

                        if (readerArray.length < 1) {
                            chat_window.style.height = "620px";
                            footer.style.top = '730px';
                        }
                    }
                });
            });

        }, false);
        reader.readAsDataURL(file);
    }

    /* For each of the files uploaded fire back readAndPreview function */
    if (input_files) {
        [].forEach.call(input_files, readAndPreview);
    }
}