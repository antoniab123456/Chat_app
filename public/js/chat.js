(() => {
    var status = document.querySelector('#status');
    var output = document.querySelector('.message_container');
    var input = document.querySelector('#textarea_message');
    var name = document.querySelector('#name');
   
    var statusDefault = status.textContent;

    var setStatus = (s) => {
        status.textContent = s;
        if (s !== statusDefault) {
            var delay = setTimeout(() => {
                setStatus(statusDefault);
            }, 3000);
        }
    }

    var socket = io.connect('http://localhost:7070');

    if (socket !== undefined) {

        socket.on('output', data => {
            // if (data.length) {
                // for (var x = 0; x < data.length; x++) {
                //     createOutput(data[x]);
                //     output.onload = toBottom();
                // }
                data.forEach(element => {
                    createOutput(element);
                    output.onload = toBottom();
                });
            // }
        });

        /* Get status from server */
        socket.on('status', (data) => {
            setStatus((typeof data === 'object') ? data.message : data);
            if (data.clear) {
                input.value = '';
            }
        });

        input.addEventListener('keydown', e => {
            if (e.which === 13 && e.shiftKey == false) {
                socket.emit('input', {
                    name: name.value.charAt(0).toUpperCase() + name.value.slice(1),
                    message: input.value,
                    hours: new Date().getHours(),
                    mins: getMins()
                });

                e.preventDefault();
            }
        });
    }

    /* Functions used above */
    function createOutput(d) {
        var chars = d.name.split('');

        var codeArray = [];
        chars.forEach((char) => {
            var code = char.charCodeAt(0);
            codeArray.push(code);
        });

        function getSum(total, num) { return total + num; }

        var generate = codeArray.reduce(getSum).toString().slice(0, 3);
        var id = parseInt(generate);

       /* Functions for shorter syntax */
        var el = div => { return document.createElement(div);}
        var append = child => {return output.appendChild(child);}
        var attr = (variab, nameCl) => { return variab.setAttribute('class', nameCl);}
        var html = (variab, smth) => { return variab.innerHTML = smth; }

        /* Building blue layout on the left*/
        if (id <= 100 || id >= 700) {
            var msgDiv = el('div');
            var nameDiv = el('div');
            attr(msgDiv, 'chat_received');
            attr(nameDiv, 'name_received');
            html(nameDiv, '<p>' + d.name + '</p>');
            var msg = '<div class="what">' + '<p>' + d.message + '</p>' + '</div>' + '<span class="time_received">' + d.hours + ':' + d.mins + '</span>';
            html(msgDiv, msg);
            append(nameDiv);
            append(msgDiv);
        } else {
            var msgDiv = el('div');
            var nameDiv = el('div');
            attr(msgDiv, 'chat_sent');
            attr(nameDiv, 'name_sent');
            html(nameDiv, '<p>' + d.name + '</p>')
            var msg = '<div class="what">' + '<p>' + d.message + '</p>' + '</div>' + '<span class="time_sent">' + d.hours + ':' + d.mins + '</span>';
            html(msgDiv, msg);
            append(nameDiv);
            append(msgDiv);
        }
    }

    function toBottom() { output.scrollTo(0, output.scrollHeight); }

    function getMins() {
        var m = new Date().getMinutes();
        return min = (m < 10) ? '0' + m : m;
    }
})();