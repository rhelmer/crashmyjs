var reports_server = 'https://crash-reports.mocotoolsstaging.net';
var stats_server = 'https://crash-stats.mocotoolsstaging.net';

function submitCrash(form, serverURL) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', serverURL, true);
    var boundary=Math.random().toString().substr(2);
    xhr.setRequestHeader('content-type',
        'multipart/form-data; charset=utf-8; boundary=' + boundary);

    var multipart = '';
    for (var key in form) {
        multipart += '--' + boundary +
            '\r\nContent-Disposition: form-data; name=' + key +
            '\r\nContent-type: text/plain' +
            '\r\n\r\n' + form[key] + '\r\n';
    }
    multipart += '--'+boundary+'--\r\n';

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var response = xhr.responseText;
            var crashid = response.split('=')[1];
            var url = stats_server + '/report/index/' + crashid;

            var br = document.createElement('br'); 
            document.body.appendChild(br);
            var a = document.createElement('a'); 
            a.href = url;
            a.target='_newtab';
            a.appendChild(document.createTextNode(crashid));
            document.body.appendChild(a);
            var loading = document.getElementById('loading');
            loading.remove();
        }
    };

    xhr.addEventListener('progress', function(evt) {
        var span = document.createElement('span'); 
        span.id = 'loading';
        var content = '';
        span.appendChild(document.createTextNode('workin...'));
        document.body.appendChild(span);

    }, false);

    xhr.send(multipart);
}

document.getElementById('crashmyjs').addEventListener('click', function() {
    var form = {};
    form.ProductName = document.getElementById('productname').value;
    form.Version = document.getElementById('version').value;

    try {
        throw Error('Crash My JS');
    } catch(e) {
        form.JSException = e.stack;
        submitCrash(form, reports_server + '/submit');
    }

}, false);
