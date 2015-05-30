if (!window.$) $ = jQuery;

/* Site-wide */

$(function() {
    // set up synxtaxhighlighter
    $('code[class^=language-]').each(function(idx, el) {
       $(el).attr('data-syntaxhighlighter', 'brush: ' + el.className.substr(9) + ';');
    });
    SyntaxHighlighter.all({'quick-code': false, 'gutter': false, 'callback': function() {        
        // link all the types
        $('.color2,.variable').each(function(i, item) {
            var i = item, t = item.innerText, repl = [item];
            while (i.nextSibling && (i.nextSibling.textContent == '.')) {
                t += '.' + i.nextSibling.nextSibling.textContent;
                repl.push(i.nextSibling);
                repl.push(i.nextSibling.nextSibling);
                i = i.nextSibling.nextSibling;
            }
            if (linkdata[t] && (linkdata[t].indexOf('/func/') == -1)) {
                $(item).before('<span class="color2"><a href="' + linkdata[t] + '">' + t + '</a></span>');
                $(repl).remove(); 
            }
        });
    }});
    
    // link non-synxtaxhighlighter sections
    $('.inherits,.nested').each(function(i, item) { 
        var text = item.innerText;
        var types = $(text.split(/[, ]+/)).each(function(i, type) {
            if (linkdata[type]) {
                text = text.replace(RegExp('\\b' + type + '\\b'), '<a href="' + linkdata[type] + '">' + type + '</a>');
            }
        });
        item.innerHTML = text;
    });
    
    // set up search box
    var selectdata = [];
    var collapseAreas = [ '', '', '', '' ];
    var globalLinks = ['', ''];
    var format = function(item) { return item.text + '&nbsp;<span class="kind">' + item.kind + '</span>'; };
    for (item in linkdata) {
        if (linkdata[item].match(/\/type\//)) {
            collapseAreas[0] += '<a href="' + linkdata[item] + '" class="list-group-item">' + item + '</a>';
            selectdata.push({ id: item.toLowerCase(), text: item, kind: 'type' });
        } else if (linkdata[item].match(/\/protocol\//)) {
            collapseAreas[1] += '<a href="' + linkdata[item] + '" class="list-group-item">' + item + '</a>';
            selectdata.push({ id: item.toLowerCase(), text: item, kind: 'protocol' });
        } else if (linkdata[item].match(/\/operator\//)) {
            collapseAreas[2] += '<a href="' + linkdata[item] + '" class="list-group-item">' + item + '</a>';
            selectdata.push({ id: item.toLowerCase(), text: item, kind: 'operator' });
        } else if (linkdata[item].match(/\/(var)\//)) {
            globalLinks[0] = '<a href="' + linkdata[item] + '" class="list-group-item">Variables</a>';
            selectdata.push({ id: item.toLowerCase(), text: item, kind: 'var' });
        } else if (linkdata[item].match(/\/(alias)\//)) {
            globalLinks[1] = '<a href="' + linkdata[item] + '" class="list-group-item">Type Aliases</a>';
            selectdata.push({ id: item.toLowerCase(), text: item, kind: 'alias' });
        } else if (linkdata[item].match(/\/(func)\//)) {
            collapseAreas[3] += '<a href="' + linkdata[item] + '" class="list-group-item">' + item + '</a>';
            selectdata.push({ id: item.toLowerCase(), text: item, kind: 'func' });
        }
    }
    $('.select2').select2({ placeholder: "Search", minimumInputLength: 1, formatInputTooShort: '', data: selectdata, formatResult: format,
                sortResults: function(results, container, query) {
                    if (query.term) {
                        return results.sort(function(a, b) {
                            var term = query.term.toLowerCase();
                            
                            // check to see if the search term matches the beginning of each result
                            var prefixesA = (a.id.indexOf(term) == 0);
                            var prefixesB = (b.id.indexOf(term) == 0);
                            
                            // we want the prefixed matches to be listed first, then the non-prefixed,
                            // so if they aren't in the same group order the prefixed item first
                            if (prefixesA != prefixesB) {
                                return (prefixesA) ? -1 : 1;
                                
                            // otherwise order using case-insensitive alpha
                            } else {
                                if (a.id == b.id) {
                                    return 0;
                                } else {
                                    return (a.id < b.id) ? -1 : 1;
                                }
                            }
                        });
                    }
                    return results;
                }
            })
            .on("change", function(e) {
                if ((e.added) && (linkdata[e.added.text])) {
                    window.location.href = linkdata[e.added.text];
                }
            });

    $('#collapseTypes').html(collapseAreas[0]);
    $('#collapseProtocols').html(collapseAreas[1]);
    $('#collapseOperators').html(collapseAreas[2]);
    $('#collapseGlobals').html(globalLinks[0] + globalLinks[1] + '<span class="subnav-header list-group-item">Functions</span>' + collapseAreas[3]);
})
