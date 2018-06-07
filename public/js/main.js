var smiley = document.querySelector('#smiley');
var emoji_section = document.querySelector('#emoji_section');
var smiley = document.querySelector('#smiley');
var around_emojis = document.querySelector('.around_emojis');
var emojies = document.querySelectorAll('.emoji');
var message = document.querySelector('#textarea_message');

smiley.addEventListener('click', openEmojiPanel);
window.addEventListener('click', closeEmojiPanel);

function openEmojiPanel() {
    around_emojis.style.display = "block";
    smiley.style.color = "#808080";
}

function closeEmojiPanel(e) {
    if (e.target == around_emojis) {
        around_emojis.style.display = "none";
        smiley.style.color = "#A9A9A9";
    }
}


for (const emoji of emojies) {
    emoji.addEventListener('click', function displayEmoji(e) {
        let target = e.target;
        message.value += target.innerText;
        toBottom();
        function toBottom() {
            message.scrollTo(0, message.scrollHeight);
        }
    });
}

