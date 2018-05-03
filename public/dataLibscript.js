// Test get request
function catalogDelete() {
    let deleteID = document.getElementById('deleteField').value;
    if (confirm('Delete entry ID: ' + deleteID + '. Are you sure?')) {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
                location.reload(true);
            }
        };
        
        xhr.open('GET', '/delete/' + deleteID);
        xhr.send();
    }
};

document.getElementById('deleteButton').addEventListener('click', catalogDelete);