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
                $(item).before('<code class="color2"><a href="' + linkdata[t] + '">' + t + '</a></code>');
                $(repl).remove(); 
            }
        });
        
        // doing the auto-expand cancels the linking above, commence afterward
        if (shouldExpandAll) expandAll(true);
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
    
    // build intra-page navigation
    $('.content h3').each(function(index, el) {
        // create link to add
        var title = $(el).html();
    	var id = title.toLowerCase().replace(' ', '-').replace(/[^a-z-]/, '');
        var line = '<li><a href="#' + id + '">' + title + '</a></li>';
        $('#chapters').append(line);

        // set the id on the target header
        $(el).attr('id', id);
    });

    // add notes for hidden items
    var addHiddenNote = function(index, el) {
        var subitems = $(el).nextUntil('h3,h4');
        var inheritedSubcount = subitems.filter('.inherited').length;
        if (inheritedSubcount == 0) return;
        
        var noun = inheritedSubcount == 1 ? ' inherited item hidden' : ' inherited items hidden';
        subitems.last().after('<p class="noninherited">' + inheritedSubcount + noun + '.</p>');
    }
    
    $('.content h3').each(addHiddenNote);
    $('#default-implementations').nextAll('h4').each(addHiddenNote);
    $('#aliasesmark').each(addHiddenNote);
    
    // display setting cookies
    var key_ExpandAll = 'ea';
    var key_HideInherited = 'hi';
    var shouldExpandAll = docCookies.getItem(key_ExpandAll) == 'true';
    var shouldHideInherited = docCookies.getItem(key_HideInherited) == 'true';
    
    // expand all
    var expandAll = function(bn) {
        shouldExpandAll = bn;
        docCookies.setItem(key_ExpandAll, '' + shouldExpandAll, Infinity, '/');
        $('#toggleDescriptions,#toggleDescriptionsNav').html(shouldExpandAll ? 'Collapse all' : 'Expand all');
        $('.toggle-link').each(function(index, el) {
            $(el).nextAll('.collapse').not('.navbar-collapse').collapse(shouldExpandAll ? 'show' : 'hide');
        });
        
        if ($('#navmenu-container').hasClass('in')) { // shouldn't be necessary :shrug:
            $('#navmenu-container').collapse('hide');
        }
    };
    
    $('#display').append('<li><a href="#toggleDescriptions" id="toggleDescriptions">Expand all</a></li>');
    $('#navmenu').append('<li><a href="#toggleDescriptions" id="toggleDescriptionsNav">Expand all</a></li>');
    $('#toggleDescriptions,#toggleDescriptionsNav').click(function() { expandAll(!shouldExpandAll); return false; });
    $('html').keypress(function(ev) { if (ev.keyCode == 97) expandAll(!shouldExpandAll); });
    
    // hide inherited
    var inheritedCount = $('.inherited').length;
    var hideInherited = function(bn) {
        shouldHideInherited = bn;
        docCookies.setItem(key_HideInherited, '' + shouldHideInherited, Infinity, '/');
        $('#toggleInherited,#toggleInheritedNav').html((shouldHideInherited ? 'Show inherited' : 'Hide inherited') + ' (' + inheritedCount + ')');
        if (shouldHideInherited) {
            $('.inherited').hide();
            $('.noninherited').show();
        } else {
            $('.inherited').show();
            $('.noninherited').hide();
        }
        if ($('#navmenu-container').hasClass('in')) { // shouldn't be necessary :shrug:
            $('#navmenu-container').collapse('hide');
        }
    };
    
    if (inheritedCount > 0) {
        $('#display').append('<li><a href="#toggleInherited" id="toggleInherited">Hide inherited (' + inheritedCount + ')</a></li>');
        $('#navmenu').append('<li><a href="#toggleInherited" id="toggleInheritedNav">Hide inherited (' + inheritedCount + ')</a></li>');
        $('#toggleInherited,#toggleInheritedNav').click(function() { hideInherited(!shouldHideInherited); return false; });
        $('html').keypress(function(ev) { if (ev.keyCode == 105) hideInherited(!shouldHideInherited); });
        if (shouldHideInherited) hideInherited(true);
    }
    
    // revise link to alternate version
    $('#version a').each(function(i, item) {
        item.href = (item.href + location.href).replace(/(v[.a-z0-9]+\/).+?(\/v[.a-z0-9]+\/|$)/, '$1');
    });
    
    // highlight key parts of identifiers
    $('.toggle-link').each(function(i, link) {
        // operator functions
        $(link).html( $(link).html().replace(/^((final |class |static |mutating |prefix )*(func)) ((&amp;|&lt;|&gt;|[+-\/*%|^!=.~])+)/i, '$1 <span class="identifier">$4</span>') );
        // other symbols
        $(link).html( $(link).html().replace(/^((final |class |static |mutating |prefix )*(func|var|case)) ([a-z0-9]+)/i, '$1 <span class="identifier">$4</span>') );
        // init / subscript
        $(link).html( $(link).html().replace(/^(init|subscript)/, '<span class="identifier">$1</span>') );
        
        // expand the hashed item on page load
        var hash = link.href.substring(link.href.lastIndexOf('#'));
        if (hash == location.hash) link.click();
    });
    
    // add toggle actions to all toggle links
    $('.toggle-link').click(function() {
        var hash = $(this)[0].href.substring($(this)[0].href.lastIndexOf('#') + 1);
        
        if (!$(this).nextAll('.collapse').hasClass('in')) {
            // only set the hash if we're opening this toggle item
            location.hash = hash;
        } else if (location.hash == hash) {
            // and clear the hash if we're closing the currently hashed item
            location.hash = '';
        }
    });

    // set up search box
    var selectdata = [];
    var format = function(item, element, search)
    {
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
        if (match = url.match(/^(.+\/)([a-z]+)(#.+)$/)) {
            linkdata[item] = match[1] + match[3];
            selectdata.push({ 
                // id = lowercase name of function/property/type: will be unique
                id: item.toLowerCase(), 
                // fullText = mixed name of item
                fullText: item,
                // text = portion of fullText after final '.' -- this is what gets matched in the search
                text: item.replace(/^.+\./, '').toLowerCase(),
                // pull the kind from the path
                kind: match[2]      
            });
        } else if (url.match(/\/type\//)) {
            selectdata.push({ 
                id: item.toLowerCase(), 
                fullText: item,
                text: item.replace(/^.+\./, '').toLowerCase(),
                kind: 'type'
            });
        } else if (match = url.match(/\/([a-z]+)\//)) {
            linkdata[item] = linkdata[item].replace(/-[^\/]+$/, '');
            selectdata.push({ id: item.toLowerCase(), fullText: item, text: item.toLowerCase(), kind: match[1] });
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

    // fix to make affixed menu the same width as its parent column
    var resizeAffixed = function() {
        var $affixElement = $('#fixed-sidebar');
        $affixElement.width($affixElement.parent().width());
    };
    setTimeout(function() {
        $('#fixed-sidebar').affix({ offset: { top: $('#header').height() + $('#version').height() } });
        resizeAffixed();
    }, 100);
    $(window).resize(resizeAffixed);
})


// :: cookies.js ::
// https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
//
// This framework is released under the GNU Public License, version 3 or later.
// http://www.gnu.org/licenses/gpl-3.0-standalone.html

var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};