// TODO: set up field reset for lookup ID field and default text (in HTML)

/* db structure: >>>
{
    id: {
        name:
        species:
        location:
    }
}
*/

function saveFields() {
    let jobj = {};
    let id = document.getElementById('name').value;
    jobj[id] = {};
    jobj[id].name = document.getElementById('name').value;
    jobj[id].species = document.getElementById('species').value;
    jobj[id].location = document.getElementById('location').value;
    
    console.log(jobj[id]);
    postNew(jobj[id]);
}

// POST new data to database
function postNew(newEntry) {
    const xhr = new XMLHttpRequest();
    const data = JSON.stringify(newEntry);
    // console.log(data);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('New entry successfully sent. ' + xhr.responseText);
        }
    };

    xhr.open('POST', '/new-entry');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
}


function genCatalog() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            jsonResponse = JSON.parse(xhr.responseText);
            let string_array = [];
            jsonResponse.forEach((row) => {
                string_array.push('<p>' + row.id + ' ' + row.name + '</p>')    
            });
            
            let pop_catalog = string_array.join('');
 
            // console.log(string_array);
            // console.log(pop_catalog);

            document.getElementById('catalog').innerHTML = pop_catalog;
        }
    };

    xhr.open('GET', '/=load_catalog');
    xhr.send();
}

// populate lookup for specific object
function lookUp() {
    let id = document.getElementById('report_id').value;
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // parse response (string) into JSON
            let jsonResponse = JSON.parse(xhr.responseText);
            document.getElementById('rep_name').innerHTML = jsonResponse.name;
            document.getElementById('rep_species').innerHTML = jsonResponse.species;
            document.getElementById('rep_location').innerHTML = jsonResponse.location;
        }
    };
    
    xhr.open('GET', '/lookup/' + id);
    xhr.send();
}


function resetFields() {
    document.getElementById('chars_form').reset(); // use <form></form> for reset() to work
}

function resetLookUp() {
    document.getElementById('lookup_field').reset();
}

document.getElementById('submit_button').addEventListener('click', saveFields);
document.getElementById('submit_button').addEventListener('click', resetFields);
document.getElementById('submit_button').addEventListener('click', genCatalog);
document.getElementById('lookup_button').addEventListener('click', lookUp);
document.getElementById('lookup_button').addEventListener('click', resetLookUp);