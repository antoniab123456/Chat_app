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
                name: name.value,
                message: input.value,
                hours: new Date().getHours(),
                mins: new Date().getMinutes()
            });

            e.preventDefault();
        }
    });
}

function createOutput(d) {

    /* Creating the chat received elements */
    var chat_el = document.createElement('div');
    var name_el = document.createElement('div');
    chat_el.setAttribute('class', 'chat_received');
    name_el.setAttribute('class', 'name_received');
    name_el.innerHTML = '<p>' + d.name + '</p>';
    chat_el.innerHTML = '<p>' + d.message + '</p>' + '<span class="time_received">' + d.hours + ':' + d.mins + '</span>';

    /* Displaying all the created elements in the main element */
    output.appendChild(name_el);
    output.appendChild(chat_el);

}