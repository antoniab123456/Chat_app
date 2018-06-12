let select = (sel) => document.querySelector(sel);
let listen = (lis, e, func) => lis.addEventListener(e, func);

var upload_btn = select('#upload_btn'),
    upload_window = select('#upload_window'),
    close_upload_btn = select('#close_upload_btn'),
    message = select('#textarea_message'),
    submit_file_btn = select('#submit_file_btn'),
    more_files_error = select('.more_files_error'),
    file_name = select('#file_name'),
    header = select('#header'),
    image_preview = select('#image_preview'),
    submit_file_btn = select('#submit_file_btn'),
    chat_window = select('.chat_window'),
    submit_file = select('#submit_file'),
    image_preview_wrap = select('#image-preview-wrap'),
    enter_message = select('.enter_message'),
    footer = select('.footer'),
    image_main_div = select('#image_main_div'),
    label = select('#label');


listen(upload_btn, 'click', diplayUploadWindow);
listen(close_upload_btn, 'click', closeUploadWindow);
listen(submit_file, 'submit', showImages);

function diplayUploadWindow() {
    upload_window.style.display = "block";
}

function closeUploadWindow() {
    upload_window.style.display = "none";
}

var inputs = document.querySelectorAll('.inputfile');

Array.prototype.forEach.call(inputs, function (input) {

    var labelVal = label.innerHTML;

    input.addEventListener('change', function (e) {
        var fileName = '';

        if (this.files.length > 5) {

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
            file_name.style.border = 'none';
            more_files_error.style.display = "none"

            if (this.files && this.files.length > 1) {
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);

            } else {
                fileName = e.target.value.split('\\').pop();
            }

            if (fileName) {
                file_name.value = fileName;
                label.style.color = "#fff";
                label.style.backgroundColor = "#3a9ad2";
            } else {
                file_name.value = "No file chosen";
            }  

        }
    });
});

window.onload = function(){
    localStorage.removeItem('image_src');
}

function imagePreview() {  
    if (localStorage.getItem('image_src') === null) {
        if(this.files && this.files[0]) {
            let imgObj = new FileReader();
            imgObj.onload = function (e) {

            let urlObject = {
                src: e.target.result
            }

            urlArray = [];
            urlArray.push(urlObject);
            localStorage.setItem('image_src', JSON.stringify(urlArray));

            }

            imgObj.readAsDataURL(this.files[0]);
        }
        
    } else {
        let imgObj = new FileReader();
        imgObj.onload = function (e) {
            let urlObject = {
                src: e.target.result
            }

            var fetchedArray = JSON.parse(localStorage.getItem('image_src'));
            
            fetchedArray.push(urlObject);

            localStorage.setItem('image_src', JSON.stringify(fetchedArray));

        }

        imgObj.readAsDataURL(this.files[0]);
    }
}


 
function showImages (e) {
    upload_window.style.display = "none";
    var fetchedArray = JSON.parse(localStorage.getItem('image_src'));

    image_main_div.innerHTML = '';
  
    fetchedArray.forEach(item => image_main_div.innerHTML += '<img src="'+ item.src+'" id="image_preview">');

    chat_window.style.height = "670px";
    enter_message.style.height = "200px";
    footer.style.top = '750px';

    e.preventDefault();
}
