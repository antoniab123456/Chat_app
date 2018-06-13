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
listen(submit_file, 'submit', showAndDeleteImages);

function diplayUploadWindow() {
    upload_window.style.display = "block";
}

function closeUploadWindow() {
    upload_window.style.display = "none";
}

var inputs = document.querySelectorAll('.inputfile');

Array.prototype.forEach.call(inputs, function (input) {

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

function previewFiles() {

    var files  = select('input[type=file]').files;

    function readAndPreview(file) {
        var reader = new FileReader();
        
        reader.addEventListener("load", function () {

            let urlObject = {
                src: this.result
            }

            if(localStorage.getItem('image_src') === null){    

                urlArray = [];

                urlArray.push(urlObject);
                
                localStorage.setItem('image_src', JSON.stringify(urlArray));

            } else {

                var fetchedArray = JSON.parse(localStorage.getItem('image_src'));
    
                fetchedArray.push(urlObject);
    
                localStorage.setItem('image_src', JSON.stringify(fetchedArray));

            }

        }, false);
         reader.readAsDataURL(file);
           
    }

    if (files) {
        [].forEach.call(files, readAndPreview);
    }
  
}

function showAndDeleteImages (e) {
    function showImages() {

        upload_window.style.display = "none";
        var fetchedArray = JSON.parse(localStorage.getItem('image_src'));

        image_main_div.innerHTML = '';

        fetchedArray.forEach(item => {
            let image_preview = document.createElement('div');
            var delete_image = document.createElement('div');
            delete_image.setAttribute('id', 'delete_image');
            delete_image.innerHTML = '<p>'+'&times;'+'</p>';    
            delete_image.onclick = deleteImages;
            image_preview.setAttribute('id', 'image_preview');
            image_preview.style.backgroundImage = "url(" + item.src + ")";
            image_preview.appendChild(delete_image);
            image_main_div.appendChild(image_preview);
            
            function deleteImages () {
                image_preview.style.display = 'none';

                var image_src = JSON.parse(localStorage.getItem('image_src'));

                if(image_src.length === 1){
                    chat_window.style.height = "630px";
                }

                for (var i = 0; i < image_src.length; i++) {
                    if (image_src[i].src == item.src) {
                        image_src.splice(i, 1);
                    }
                }

                localStorage.setItem('image_src', JSON.stringify(image_src));
            } 
        });
        
        chat_window.style.height = "670px";
        enter_message.style.height = "200px";
        footer.style.top = '750px';
        e.preventDefault();
    }
    showImages();
}