let text = document.getElementsByClassName('username');

text[0].oninput = function() {
    this.value = this.value.replace(/\d/g, '');
}