(() => {

    let select = (sel) => document.querySelector(sel);
    let listen = (lis, e, func) => { return lis.addEventListener(e, func)};
    let el = div => { return document.createElement(div);}
    let html = (variab, smth) => { return variab.innerHTML = smth; }
    let attr = (variab, nameCl) => { return variab.setAttribute('class', nameCl);}
    let append = (el, child) => {return el.appendChild(child);}

    let status = select('#status'),
    output = select('.message_container'),
    input = select('#textarea_message'),
    name = select('#name'),
    enter_message = select('.enter_message'),
    image_main_div = select('#image_main_div'),
    chat_window = select('.chat_window'),
    upload_window = select('#upload_window'),
    inputs = select('input[type=file]'),
    submit_file = select('#submit_file'),
    footer = select('.footer'),
    not_an_image = select('.not_an_image');


    /*Clear LC on page reload */
    window.onload = function(){
        localStorage.removeItem('images');
    }

    

    /*  Set function for setting the message status */
    let statusDefault = status.textContent;

    let setStatus = (s) => {
        status.textContent = s;
        enter_message.style.top = '0px';
        if (s !== statusDefault) {
            let delay = setTimeout(() => { setStatus(statusDefault); }, 3000);
        }
    }

  /*   Connect to Socket io */
    let socket = io.connect('http://localhost:7070');

    if (socket !== undefined) {
         

        /* Generate minutes correctl with the "0" in front */
        let getMins = () => {
            let m = new Date().getMinutes();
            return min = (m < 10) ? '0' + m : m;
        }


            /* Functions used above: */

        function createOutput (d) {
            
            /* Functions for shorter syntax */
            let outputAppend = child => {return output.appendChild(child);}

            d.name !== null ? chars = d.name.split('') : id = 100;

            let codeArray = chars.map(char => char.charCodeAt(0));

            let generate = codeArray.reduce((total, num) => total + num, 0).toString().slice(0, 3);
            let id = parseInt(generate);

            var image_data = d.image;



            let msgDiv = el('div'),
            nameDiv = el('div'),
            timeDiv = el('div');
            html(timeDiv, '<span>'+d.hours+':'+d.mins+'</span>');
            html(nameDiv, '<p>' + d.name + '</p>');
            let msg = '<div class="around_msg">' + '<p>' + d.message + '</p>' + '</div>' ;
            html(msgDiv, msg);

            class Output {
                  constructor(att1, att2, att3, img_class){
                    this.att1 = att1;
                    this.att2 = att2;
                    this.att3 = att3;
                    this.img_class = img_class;
                  }

                  builldOutput(){
                    attr(msgDiv, this.att1);
                    attr(nameDiv, this.att2);
                    attr(timeDiv, this.att3);
                  }

                  getData(){
                    if(image_data !== null) {

                        Array.prototype.forEach.call(image_data, (data) => {
                            let imageEl = el('a');
                            attr(imageEl, this.img_class)
                            imageEl.setAttribute('href', data);
                            imageEl.setAttribute('target', '_blank');
                            imageEl.style.background = "url(" + data + ") no-repeat center center"; 
                            imageEl.style.backgroundSize = "cover";
                            append(msgDiv, imageEl); 
    
                            imageEl.onmouseover = function() {
                                imageEl.style.opacity = '0.7';
                            }
                            imageEl.onmouseout = function() {
                                imageEl.style.opacity = '';
                            }                     
                        });
                        
                        class Positioning {
                            constructor(a, b){
                                this.a = a;
                                this.b = b;
                            }

                            setPosition(){
                                timeDiv.style.position = 'absolute';
                                msgDiv.style.height = this.a; 
                                timeDiv.style.top = this.b;
                            }
                        }
                        
                        let position1 = new Positioning("110px", "94px");
                        let position2 = new Positioning("170px", "154px");          
                        let position3 = new Positioning("230px", "213px");   
                        

                        if(image_data.length <= 4){
                            position1.setPosition();
                        }
    
                        if(image_data.length >= 5 && image_data.length <= 8){
                            position2.setPosition();
                        }
    
                        if(image_data.length > 8){
                            position3.setPosition();
                        }

                        append(msgDiv, timeDiv)
                        outputAppend(nameDiv);
                        outputAppend(msgDiv);
                    }
                }
            } 


            let outputB = new Output('chat_received', 'name_received',  'time_received', "image_blue_element");
            let outputP = new Output('chat_sent', 'name_sent',  'time_sent', "image_element");


            /* Building blue layout*/
            if (id <= 150 || id >= 500) {
                outputB.builldOutput();
                outputB.getData();
                
            /* Building purple layout*/
            } else {
                outputP.builldOutput();
                outputP.getData();               
                timeDiv.style.left = "223px";   
            }
        }
    
        /* Build output  */
        socket.on('output', data => {
                data.forEach(element => {

                    createOutput(element);

                    /* Show the latest messages by scrolling down automatically */
                    let toBottom  = () => { output.scrollTo(0, output.scrollHeight); }
                    output.onload = toBottom();
                });
        });

        /* Get status from server */
        socket.on('status', (data) => {
            setStatus((typeof data === 'object') ? data.message : data);
            enter_message.style.top = '-13px';
            if (data.clear) { input.value = ''; }
        });
            

        document.onreadystatechange = function () {
            if (document.readyState == "interactive") {
              
              
                inputs.addEventListener('change', previewFiles);
                

                function previewFiles(e) {

                    let imagesArray = [];
                    trg = e.target;
                    var validateImg = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
                    input_files = e.target.files;



                    Array.prototype.forEach.call(input_files, (e) => {
                        imagesArray.push(e);
                    });


                    if(validateImg.exec(e.target.value) && input_files.length <= 10){

                        imagesArray.forEach(image => {
                            let reader = new FileReader();

                            listen(reader, 'load', () => {
                                let newResult = reader.result;


                                submit_file.reset();
                                upload_window.style.display = "none";

                                let image_preview = el('div'),
                                delete_image = el('div');
                                attr(image_preview, 'image_preview');
                                attr( delete_image, 'delete_image');
            
                                html(delete_image, '<p>' + '&times;' + '</p>');

                                image_preview.style.background = "url(" + newResult + ") no-repeat center center";
                                image_preview.style.backgroundSize = 'cover';

                                append(image_preview, delete_image);
                                append(image_main_div, image_preview);
                            
                                chat_window.style.height = "670px";
                                enter_message.style.height = "200px";
                                footer.style.top = '750px';
                                fetch(newResult)
                                .then(res => res.blob())
                                .then(blob => {
                                    let form = new FormData;
                                    form.append('image',  blob, (blob.size+"."+blob.type.slice(6)))
                                    let xhr = new XMLHttpRequest;
                                    xhr.open('POST', '/uploads', true);
                                    xhr.send(form);
                                    xhr.onload = function(){
                                        if(this.status == 200){
                                            var file_link = this.responseText;
                                            if(localStorage.getItem('images') === null){ 
                                                let localArray = [];
                                                localArray.push(file_link);
                                                localStorage.setItem('images', JSON.stringify(localArray));
                                            } else {
                                                let notEmpty = JSON.parse(localStorage.getItem('images'));
                                                notEmpty.push(file_link);
                                                localStorage.setItem('images', JSON.stringify(notEmpty));
                                            }
                                        }   
            
                                        delete_image.onclick = function deleteImages() {
                                            image_preview.style.display = "none";
                                            let lsArray = JSON.parse(localStorage.getItem('images'));
                                            lsArray.forEach(item => {
                                                if(item === file_link){
                                                    lsArray.splice(lsArray.indexOf(item), 1);
                                                }
                                            });

                                            if(lsArray.length < 1 ){
                                                image_main_div.innerHTML = '';  
                                                chat_window.style.height = "620px"; 
                                            }

                                            localStorage.setItem('images', JSON.stringify(lsArray));
                                        }  
                                    }
                                });
                            });
                            reader.readAsDataURL(image);
                       });
                    } else {
                        if(!validateImg.exec(e.target.value)){
                                
                            not_an_image.style.display = "block";
                            file_name.style.border = '1px solid red';
                            header.style.marginTop = "30px";
                            file_name.value = "No file chosen"

                            let hideError = () => {
                                file_name.style.border = 'none';
                                not_an_image.style.display = "none";
                                header.style.marginTop = "50px";
                            }

                            setTimeout(hideError, 3000);
                        }
                    }
                }   
            }
        }


        /* Handle sending uploads to the server */
        input.addEventListener('keydown', e => {
            if (e.which === 13 && e.shiftKey == false) {
                /* Turn name and/or Surname to capital letters*/
                let nameArray = name.value.split(' ');
                let nameValue = nameArray
                .map(names=> (names.charAt(0).toUpperCase()+names.slice(1)))
                .reduce((total, nm) => total+' '+ nm);
        
                socket.emit('input', {
                    name: nameValue,
                    message: input.value,
                    hours: new Date().getHours(),
                    mins: getMins(),
                    image: JSON.parse(localStorage.getItem('images'))
                });  
                localStorage.removeItem('images');
                chat_window.style.height = "620px";
                image_main_div.innerHTML = ''; 
                
                e.preventDefault();  
            }
        });  
    }
})();