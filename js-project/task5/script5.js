const list = document.getElementById('bookList')

let selected = null;

function setSelected(li){
    if (selected === li){
        li.classList.remove('selected');
        selected = null;
        return;
    }

    if (selected) selected.classList.remove('selected');

    li.classList.add('selected');
    selected = li;
}

list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li || !list.contains(li)) return;
    setSelected(li);
});


