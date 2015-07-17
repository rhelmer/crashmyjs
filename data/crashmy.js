function submitCrash(form, serverURL) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', serverURL, true);
    var boundary=Math.random().toString().substr(2);
    xhr.setRequestHeader('content-type',
        'multipart/form-data; charset=utf-8; boundary=' + boundary);

    var multipart = '';
    for (var key in form) {
        multipart += '--' + boundary +
            "\r\nContent-Disposition: form-data; name=" + key +
            "\r\nContent-type: text/plain" +
            "\r\n\r\n" + form[key] + "\r\n";
    }
    multipart += "--"+boundary+"--\r\n";

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            alert('Result: ' + xhr.responseText);
        }
    };

    xhr.send(multipart);
}

document.getElementById('crashmyjs').addEventListener('click',
    function() {
        var form = {};
        form.ProductName = document.getElementById('productname').value;
        form.Version = document.getElementById('version').value;

        try {
            throw 'Crash My JS';
        } catch(e) {
            submitCrash(form, 'https://crash-reports.mocotoolsstaging.net/submit');
        }

    }, false
);
