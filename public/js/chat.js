
(() => {
    let status = document.querySelector('#status'),
    output = document.querySelector('.message_container'),
    input = document.querySelector('#textarea_message'),
    name = document.querySelector('#name'),
    enter_message = document.querySelector('.enter_message');

  /*   Set function for setting the message status */
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

       
        /* Build output  */
        socket.on('output', data => {
                data.forEach(element => {
                    createOutput(element);
                    data.onload = toBottom();
                });
        });

        /* Get status from server */
        socket.on('status', (data) => {
            setStatus((typeof data === 'object') ? data.message : data);
            enter_message.style.top = '-13px';
            if (data.clear) { input.value = ''; }
        });


        /* Handle input  */

        input.addEventListener('keydown', e => {

            if (e.which === 13 && e.shiftKey == false) {
             
             /*  Handle sending uloads to the server 
            function testImage (){
                var image_src = JSON.parse(localStorage.getItem('image_src'));
                if(image_src !== null){    
                    image_src.forEach(item => {
                        var url = item.src
                        
                        fetch(url)
                        .then(res => res.blob())
                        .then(blob => {
                            let form = new FormData();
                            form.append('image', blob, (blob.size+"."+blob.type.slice(6)));
                            let xhr = new XMLHttpRequest;
                            xhr.open('POST', '/uploads', true);
                            xhr.send(form);
                            xhr.onload = function(){
                                if(this.status == 200){
                
                                       obj = {
                                            image_link: this.responseText
                                        }
                                        let arrayEmpty = [];

                                    if( localStorage.getItem('image_link') === null ){
                                        arrayEmpty.push(obj);
                                        localStorage.setItem('image_link', JSON.stringify(arrayEmpty));
                                    } else {

                                        var fetchedArray = JSON.parse(localStorage.getItem('image_link'));
                                        fetchedArray.push(obj);
                                        localStorage.setItem('image_link', JSON.stringify(fetchedArray));
                                    }
                                   
                                }
                            }
                        });
                    });
                }
            }
            
            testImage();
            */
            

                /* Turn name and/or Surname to capital letters*/
                let nameArray = name.value.split(' ');
                let nameValue = nameArray
                .map(names=> (names.charAt(0).toUpperCase()+names.slice(1)))
                .reduce((total, nm) => total+' '+ nm);
                
                socket.emit('input', {
                    name: nameValue,
                    message: input.value,
                    hours: new Date().getHours(),
                    mins: getMins()/* ,
                    image: JSON.parse(localStorage.getItem('image_link')) */
                });

                e.preventDefault();
            }
        });
    }

    /* Functions used above: */

    let createOutput = (d) => {
        
       /* Functions for shorter syntax */
       let el = div => { return document.createElement(div);}
       let append = child => {return output.appendChild(child);}
       let attr = (variab, nameCl) => { return variab.setAttribute('class', nameCl);}
       let html = (variab, smth) => { return variab.innerHTML = smth; }

        d.name !== null ? chars = d.name.split('') : id = 100;

        let codeArray = chars.map(char => char.charCodeAt(0));

        let generate = codeArray.reduce((total, num) => total + num, 0).toString().slice(0, 3);
        let id = parseInt(generate);

        /* Building blue layout*/
        if (id <= 150 || id >= 500) {
            
            let msgDiv = el('div'),
            nameDiv = el('div');
            attr(msgDiv, 'chat_received');
            attr(nameDiv, 'name_received');
            html(nameDiv, '<p>' + d.name + '</p>');
            let msg = '<div class="what">' + '<p>' + d.message + '</p>' + '</div>' + '<span class="time_received">' + d.hours + ':' + d.mins + '</span>';
            html(msgDiv, msg);

            append(nameDiv);
            append(msgDiv);
            
        /* Building purple layout*/
        } else {
            let msgDiv = el('div');
            let nameDiv = el('div');
            attr(msgDiv, 'chat_sent');
            attr(nameDiv, 'name_sent');
            html(nameDiv, '<p>' + d.name + '</p>')
            let msg = '<p>' + d.message + '</p>'+ '<span class="time_sent">' + d.hours + ':' + d.mins + '</span>';
            html(msgDiv, msg);
           
            append(nameDiv);
            append(msgDiv);
        }
        localStorage.removeItem('image_link');
    }
 
    /* Show the latest messages by scrolling down automatically */
    let toBottom = () => { output.scrollTo(0, output.scrollHeight); }

    /* Generate minutes correctl with the "0" in front */
    let getMins = () => {
        let m = new Date().getMinutes();
        return min = (m < 10) ? '0' + m : m;
    }

})();



            
   /*          if(d.image !== undefined){

                console.log(d.image);
                // console.log(Object.values(d.image));
                
                // arrayAppend.push(d.image);  
              
                // arrayAppend.forEach(item => {
                //     console.log(item.image_link);
                // });
                // let imageDiv = el('div');
                // attr(imageDiv, 'image_received');
                // imageDiv.style.backgroundImage = "url(" + d.image + ")";
                // msgDiv.appendChild(imageDiv);
            }
            */


            // if(d.image !== undefined){
            //     // let imageDiv = el('div');
            //     // attr(imageDiv, 'image_received');
            //     // imageDiv.style.backgroundImage = "url(" + d.image + ")";
            //     // msgDiv.appendChild(imageDiv);
            // }