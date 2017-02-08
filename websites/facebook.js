var hiddenLinks = {};
var HTselectors = {
    allLinks : ".mbs._6m6._2cnj._5s6c a:not(.htparsed)",
    allCaptions : "._5pbx.userContent p:not(.htparsed), .mtm._5pco:not(.htparsed)",
    allSponsored : "._3e_2._m8c:not(.htparsed)",
    allPictures : "._4-eo._2t9n._50z9:not(.htparsed)",
    allVideos : "._5mly._45oh:not(.htparsed)"
};

window.HTkeywords = [];
window.HTsettings = {};

var hideAllLinks = function() {
    var allLinks = document.querySelectorAll(HTselectors.allLinks);

    for (var i = 0; i < allLinks.length; i++) {
        var txt = allLinks[i].textContent.toLowerCase();
        var found = false;

        for (var j = 0; j < window.HTkeywords.length; j++) if (txt.indexOf(window.HTkeywords[j]) != -1) {
            found = window.HTkeywords[j]; break;
        }

        if (found && !allLinks[i].classList.contains("htcaught")) {
            allLinks[i].classList.add("htcaught");
            var node = allLinks[i]
                .parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode;

            var wrapper = node.parentNode; 
            if (!node.classList.contains('htcaught')) {
                affectNode(node, wrapper, found, txt, "post");
            }
        }

        allLinks[i].classList.add('htparsed');
    }

    var allCaptions = document.querySelectorAll(HTselectors.allCaptions);

    for (var i = 0; i < allCaptions.length; i++) {
        var txt = allCaptions[i].textContent.toLowerCase();
        var found = false;

        for (var j = 0; j < window.HTkeywords.length; j++) if (txt.indexOf(window.HTkeywords[j]) != -1) {
            found = window.HTkeywords[j]; break;
        }

        if (found && !allCaptions[i].classList.contains("htcaught")) {
            allCaptions[i].classList.add("htcaught");
            var node = allCaptions[i].parentNode.parentNode.parentNode;
            var wrapper = node.parentNode; 

            if (!node.classList.contains('htcaught')) {
                affectNode(node, wrapper, found, txt, "post");
            }
        }

        allCaptions[i].classList.add('htparsed');
    }

    if (window.HTsettings.hideSponsored) {
        var allSponsored = document.querySelectorAll(HTselectors.allSponsored);
        for (var i = 0; i < allSponsored.length; i++) {
            var sponsored = allSponsored[i];
            sponsored.classList.add("htparsed")

            var node = sponsored.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode;

            var wrapper = node.parentNode;
            affectNode(node, wrapper, 'sponsored', 'sponsored', 'sponsored');
        }
    }

    if (window.HTsettings.hidePhotos) {
        var allPictures = document.querySelectorAll(HTselectors.allPictures);
        for (var i = 0; i < allPictures.length; i++) {
            var pic = allPictures[i];
            pic.classList.add("htparsed")

            var node = pic.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode;

            var wrapper = node.parentNode;
            affectNode(node, wrapper, 'photo', 'photo', 'photo');
        }
    }

    if (window.HTsettings.hideVideos) {
        var allVideos = document.querySelectorAll(HTselectors.allVideos);
        for (var i = 0; i < allVideos.length; i++) {
            var vid = allVideos[i];
            vid.classList.add("htparsed")

            var node = vid.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode;

            var wrapper = node.parentNode;
            affectNode(node, wrapper, 'video', 'video', 'video');
        }
    }

}

var affectNode = function(node, wrapper, found, txt, context) {
    var comments = wrapper.parentNode.parentNode.querySelector('form');
    node.style.display = "none";
    if (comments) {
        comments.style.display = "none";
    }

    if (window.HTsettings.hardHide) {
        wrapper.style.display = "none";
        node.style.display = "none";

        return;
    }

    hiddenLinks[txt] = node;
    var showNode = document.createElement('a');
    showNode.style.fontSize = "12px";
    showNode.style.color = "#CCC";
    showNode.textContent = "Show " + (context || "more");

    var tnode = document.createElement('div');

    if (context == "sponsored") {
        tnode.innerHTML = "This is a sponsored post";
    } else if (context == "photo") {
        tnode.innerHTML = "This is a photo post";
    } else if (context == "video") {
        tnode.innerHTML = "This is a video";
    } else {
        tnode.innerHTML = '<div>This post is about : <b>'+
            found+
            '</b><div>';
    }

    tnode.style.textAlign = "center";
    tnode.style.marginTop = "20px";
    tnode.style.fontSize = "16px";
    tnode.style.color = "#999";
    tnode.style.paddingBottom = "25px";

    if (context == "post") {
        tnode.appendChild(showNode);
    }

    wrapper.appendChild(tnode);

    (function(node, comments, tnode) {
        showNode.onclick = function() {
            node.classList.add("htcaught");
            node.style.display = "block";
            tnode.style.display = "none";
            
            if (comments) {
                comments.style.display = "";
            }
        };
    })(node, comments, tnode);
}

chrome.storage.sync.get('words', function(kws) {
    var arr = (kws && kws.words) ? kws.words : [];
    var finalkws = [];
    for (var i = 0; i < arr.length; i++) if (arr[i].trim()) {
        finalkws.push(arr[i])
    }

    window.HTkeywords = finalkws;

    chrome.storage.sync.get('settings', function(setts) {
        window.HTsettings = (setts && setts.settings) ? setts.settings : {};

        if (!window.HTsettings.disable) {
            setInterval(hideAllLinks, 1500);
            hideAllLinks();

            if (window.HTsettings.hideSidebar) {
                var rightCol = document.querySelector('.cardRightCol');
                if (rightCol) {
                    rightCol.style.display = "none";
                }
            }
        }
    });
});
