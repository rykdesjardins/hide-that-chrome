console.log('INCLUDED');
window.currentSettings = [];
window.appSettings = {};

var addKeyword = function(kw) {
    window.currentSettings.push(kw);
    addKWBox(kw);

    saveSettings();
};

var addKWBox = function(kw) {
    var tb = document.createElement('input');
    tb.value = kw;
    tb.dataset.index = window.currentSettings.length - 1;

    tb.addEventListener('blur', function() {
        window.currentSettings[this.dataset.index] = this.value.toLowerCase();
        if (!this.value.trim()) {
            this.style.display = "none";
        }

        saveSettings();
    });

    document.getElementById('kwList').appendChild(tb);
};

document.getElementById('addKW').addEventListener('keydown', function(e) {
    if ((e.which == 13 || e.keyCode == 13) && e.target.value) {
        addKeyword(e.target.value.toLowerCase());
        e.target.value = "";
    }
});

var saveSettings = function() {
    chrome.storage.sync.set({"words" : window.currentSettings});
};

var saveAppSetts = function() {
    chrome.storage.sync.set({"settings" : window.appSettings});
};

var loadList = function() {
    chrome.storage.sync.get('words', function(kws) {
        kws = (kws && kws.words) ? kws : {words : []};
        for (var i = 0; i < kws.words.length; i++) if (kws.words[i].trim()) {
            window.currentSettings.push(kws.words[i]);
            addKWBox(kws.words[i]);
        }
    });
};

var loadSettings = function() {
    chrome.storage.sync.get('settings', function(setts) {
        setts = (setts && setts.settings) ? setts.settings : {};
        window.appSettings = setts;
        var settNames = Object.keys(setts);
        for (var i = 0; i < settNames.length; i++) {
            var maybeEl = document.getElementById(settNames[i]);
            if (maybeEl) {
                if (maybeEl.type == "checkbox") {
                    maybeEl.checked = setts[settNames[i]];
                } else {
                    maybeEl.value = setts[settNames[i]];
                }
            }
        }

        var settsEls = document.querySelectorAll('.appSetting');
        for (var i = 0; i < settsEls.length; i++) {
            settsEls[i].addEventListener('change', function(e) {
                if (e.target.type == "checkbox") {
                    window.appSettings[e.target.id] = e.target.checked;
                } else {
                    window.appSettings[e.target.id] = e.target.value;
                }

                saveAppSetts();
            });
        }
    });
};

loadList();
loadSettings();
