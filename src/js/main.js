function calculateAve(){
    var lines = document.getElementById('values').value.split('\n');
    var made = 0;
    var attemps = 0;
    for(var i = 0;i < lines.length;i++){
        var value = lines[i];
        if(!isBlank(value) && !isEmpty(value)){
            var values = value.split('/');
            made = made + parseFloat(values[0]);
            attemps = attemps + parseFloat(values[1]);
        }
    }

    document.getElementById('made').innerHTML = "Made = " + made.toFixed(1);
    document.getElementById('attemps').innerHTML = "Attemps = " + attemps.toFixed(1);
    document.getElementById('ave').innerHTML = "AVE = " + (made/attemps).toFixed(3);
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}