var reportsServer = 'https://crash-reports.mocotoolsstaging.net';
var statsServer = 'https://crash-stats.mocotoolsstaging.net';
var productName = 'Crash My JS';
var version = '1.0';

function submitCrash(msg, url, line, column, err) {
    var serverURL = reportsServer + '/submit';
    var xhr = new XMLHttpRequest();

    var form = {
        'ProductName': productName,
        'Version': version,
        'JSMessage': msg,
        'JSURL': url,
        'JSLine': line,
        'JSColumn': column,
        'JSStack': err.stack
    };

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
            var url = statsServer + '/report/index/' + crashid;

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
        span.appendChild(document.createTextNode("workin'..."));
        document.body.appendChild(span);

    }, false);

    xhr.send(multipart);
}

document.getElementById('crashmyjs').addEventListener('click', function() {
    raiseException('Crash My JS');
}, false);

window.onerror = function (msg, url, line, column, err) {
    submitCrash(msg, url, line, column, err);
}
