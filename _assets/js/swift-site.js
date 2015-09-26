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
    
    // revise link to alternate version
    $('#version a').each(function(i, item) {
        item.href = (item.href + location.href).replace(/(v[.a-z0-9]+\/).+?(\/v[.a-z0-9]+\/|$)/, '$1');
    });
    
    // set up search box
    var selectdata = [];
    var collapseAreas = [ '', '', '', '' ];
    var globalLinks = ['', ''];
    var format = function(item, element, search) {
        
        var fullText = item.fullText || item.text;
        var prefixLength = fullText.lastIndexOf('.') + 1;
        var termStart = prefixLength + item.id.replace(/^.+\./, '').indexOf(search.term.toLowerCase());

        if (search.term == 'next') {
            console.log(fullText);
            console.log(prefixLength);
            console.log(termStart);
        }

        var itemText = '';
        if (prefixLength != 0) {
            itemText = '<span class="kind">' + fullText.substr(0, prefixLength) + '</span>'
        }
        itemText += fullText.substr(prefixLength, termStart - prefixLength)
                    + '<span class="select2-match">' 
                    + fullText.substr(termStart, search.term.length) 
                    + '</span>' 
                    + fullText.substr(termStart + search.term.length);
        return itemText + '&nbsp;<span class="kind">' + item.kind + '</span>'; 
    };
    for (item in linkdata) {
        var match = null;
        var url = linkdata[item];
        if (match = url.match(/#(.+)-/)) {
            // pull the kind from the path
            var kind = match[1];
            selectdata.push({ 
                // id = lowercase name of function/property/type: will be unique
                id: item.toLowerCase(), 
                // fullText = mixed name of item
                fullText: item,
                // text = portion of fullText after final '.' -- this is what gets matched in the search
                text: item.replace(/^.+\./, '').toLowerCase(),
                // pull the kind from the path
                kind: match[1]      
            });
        } else if (linkdata[item].match(/\/type\//)) {
            collapseAreas[0] += '<a href="' + linkdata[item] + '" class="list-group-item">' + item + '</a>';
            selectdata.push({ 
                id: item.toLowerCase(), 
                fullText: item,
                text: item.replace(/^.+\./, '').toLowerCase(),
                kind: 'type'
            });
        } else if (linkdata[item].match(/\/protocol\//)) {
            collapseAreas[1] += '<a href="' + linkdata[item] + '" class="list-group-item">' + item + '</a>';
            selectdata.push({ id: item.toLowerCase(), fullText: item, text: item.toLowerCase(), kind: 'protocol' });
        } else if (linkdata[item].match(/\/operator\//)) {
            collapseAreas[2] += '<a href="' + linkdata[item] + '" class="list-group-item">' + item + '</a>';
            selectdata.push({ id: item.toLowerCase(), fullText: item, text: item.toLowerCase(), kind: 'operator' });
        } else if (linkdata[item].match(/\/(var)\//)) {
            globalLinks[0] = '<a href="' + linkdata[item] + '" class="list-group-item">Variables</a>';
            selectdata.push({ id: item.toLowerCase(), fullText: item, text: item.toLowerCase(), kind: 'var' });
        } else if (linkdata[item].match(/\/(alias)\//)) {
            globalLinks[1] = '<a href="' + linkdata[item] + '" class="list-group-item">Type Aliases</a>';
            selectdata.push({ id: item.toLowerCase(), fullText: item, text: item.toLowerCase(), kind: 'alias' });
        } else if (linkdata[item].match(/\/(func)\//)) {
            collapseAreas[3] += '<a href="' + linkdata[item] + '" class="list-group-item">' + item + '</a>';
            selectdata.push({ id: item.toLowerCase(), fullText: item, text: item.toLowerCase(), kind: 'func' });
        }
    }
    $('.select2').select2({ 
        placeholder: "Search", 
        minimumInputLength: 1, 
        formatInputTooShort: '', 
        data: selectdata, 
        formatResult: format,
        sortResults: function(results, container, query) {
            if (query.term) {
                var term = query.term.toLowerCase();
                return results.sort(function(a, b) {
                    // we sort first by location of the search term in the matches
                    // that is, when the term is "string", String should match before StaticString
                    // to begin, find the relative search term offset of the two matches
                    var aComp = a.text || a.id;
                    var bComp = b.text || b.id;
                    var indexOffset = aComp.indexOf(term) - bComp.indexOf(term);
                    
                    // if the relative offset of the search term is nonzero, the term
                    // with the lower offset should come first
                    if (indexOffset != 0) {
                        return indexOffset;
                        
                    // otherwise, order using case-insensitive alpha
                    } else {
                        if (aComp != bComp) {
                            return (aComp < bComp) ? -1 : 1;                            
                        } else {
                            // if the two terms are the same, expand the comparison to look at their fully qualified names
                            indexOffset = a.id.indexOf(term) - b.id.indexOf(term);
                            if (indexOffset != 0) {
                                return indexOffset;
                            } else {
                                if (a.id == b.id) {
                                    return 0;
                                } else {
                                    return (a.id < b.id) ? -1 : 1;
                                }
                            }
                        }
                    }
                });
            }
            return results;
        }
    })
    .on("change", function(e) {
        if (!e.added) return;
        
        var linkdataKey = e.added.fullText || e.added.text;
        if (linkdata[linkdataKey]) {
            window.location.href = linkdata[linkdataKey];
        }
    });

    $('#collapseTypes').html(collapseAreas[0]);
    $('#collapseProtocols').html(collapseAreas[1]);
    $('#collapseOperators').html(collapseAreas[2]);
    $('#collapseGlobals').html(globalLinks[0] + globalLinks[1] + '<span class="subnav-header list-group-item">Functions</span>' + collapseAreas[3]);
})
