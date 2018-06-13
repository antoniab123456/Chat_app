(() => {
    let status = document.querySelector('#status');
    let output = document.querySelector('.message_container');
    let input = document.querySelector('#textarea_message');
    let name = document.querySelector('#name');
   
    let statusDefault = status.textContent;

    let setStatus = (s) => {
        status.textContent = s;
        if (s !== statusDefault) {
            let delay = setTimeout(() => { setStatus(statusDefault); }, 3000);
        }
    }

    let socket = io.connect('http://localhost:7070');

    if (socket !== undefined) {

        socket.on('output', data => {
                data.forEach(element => {
                    createOutput(element);
                    data.onload = toBottom();
                });
        });

        /* Get status from server */
        socket.on('status', (data) => {
            setStatus((typeof data === 'object') ? data.message : data);
            if (data.clear) { input.value = '';}
        });

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
                    mins: getMins()
                });
                e.preventDefault();
            }
        });
    }

    /* Functions used above */
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
            let msgDiv = el('div');
            let nameDiv = el('div');
            attr(msgDiv, 'chat_received');
            attr(nameDiv, 'name_received');
            html(nameDiv, '<p>' + d.name + '</p>');
            let msg = '<div class="what">' + '<p>' + d.message + '</p>' + '</div>' + '<span class="time_received">' + d.hours + ':' + d.mins + '</span>';
            html(msgDiv, msg);
            append(nameDiv);
            append(msgDiv);
        } else {
            let msgDiv = el('div');
            let nameDiv = el('div');
            attr(msgDiv, 'chat_sent');
            attr(nameDiv, 'name_sent');
            html(nameDiv, '<p>' + d.name + '</p>')
            let msg = '<div class="what">' + '<p>' + d.message + '</p>' + '</div>' + '<span class="time_sent">' + d.hours + ':' + d.mins + '</span>';
            html(msgDiv, msg);
            append(nameDiv);
            append(msgDiv);
        }
    }

    let toBottom = () => { output.scrollTo(0, output.scrollHeight); }

    let getMins = () => {
        let m = new Date().getMinutes();
        return min = (m < 10) ? '0' + m : m;
    }
})();