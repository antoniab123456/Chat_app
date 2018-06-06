(() => {
    var status = document.querySelector('#status');
    var output = document.querySelector('.message_container');
    var input = document.querySelector('#textarea_message');
    var name = document.querySelector('#name');

    /*Setting the status*/
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
            if (data.length) {
                for (var x = 0; x < data.length; x++) {
                    createOutput(data[x]);
                    output.onload = toBottom();
                    function toBottom() {
                        output.scrollTo(0, output.scrollHeight);
                    }
                }
            }

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
                    mins: new Date().getMinutes()
                });

                e.preventDefault();
            }
        });
    }

    function createOutput(d) {
        /* Generate Id from the name */
        var n = d.name;
        /* Turn into unicode symbols, add them together, limit to 3 digits */
        var codeArray = [];
        for (i = 0; i < n.length; i++) {
            var code = n.charCodeAt(i);
            codeArray.push(code);
        }

        function getSum(total, num) {
            return total + num;
        }
        var generate = codeArray.reduce(getSum).toString().slice(0, 3);
        var id = parseInt(generate);

        /* Building blue layout on the left*/
        if (id <= 100 || id >= 600) {
            var chat_el = document.createElement('div');
            var name_el = document.createElement('div');
            chat_el.setAttribute('class', 'chat_received');
            name_el.setAttribute('class', 'name_received');
            name_el.innerHTML = '<p>' + n + '</p>';
            chat_el.innerHTML = '<div class="what">'+'<p>' + d.message + '</p>' +'</div>'+'<span class="time_received">' + d.hours + ':' + d.mins + '</span>';

            /* Displaying all the created elements in the main element */
            output.appendChild(name_el);
            output.appendChild(chat_el);

        } else {
            /* Building purple layout on the right*/
            var chat_sent_el = document.createElement('div');
            var name_sent_el = document.createElement('div');
            chat_sent_el.setAttribute('class', 'chat_sent');
            name_sent_el.setAttribute('class', 'name_sent');
            name_sent_el.innerHTML = '<p>' + n + '</p>';
            chat_sent_el.innerHTML = '<div class="what">'+'<p>' + d.message + '</p>'+'</div>' + '<span class="time_sent">' + d.hours + ':' + d.mins + '</span>';

            /* Displaying all the created elements in the main element */
            output.appendChild(name_sent_el);
            output.appendChild(chat_sent_el);
        }
    }
})();