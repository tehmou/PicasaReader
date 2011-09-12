var urlVars, baseUrl;

(function () {
    var href = window.location.href,
        vars = [],
        parts = href.split("?"),
        hash;

    if (parts.length > 1) {
        var hashes = parts[1].split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
    }

    baseUrl = parts[0];
    urlVars = vars;
})();