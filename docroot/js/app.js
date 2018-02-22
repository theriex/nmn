/*jslint browser, multivar, white, fudge */
/*global window jtminjsDecorateWithUtilities */

var app = {},  //Global container for application level funcs and values
    jt = {};   //Global access to general utility methods

(function () {
    "use strict";

    var pages = [{id:"docdiv", name:"Not My Normal",
                  content:"about.html"},
                 {id:"artdiv", name:"Reading",
                  content:"<iframe id=\"membiciframe\" src=\"https://membic.org/e/6385940616445952?site=notmynormal.org\" style=\"position:relative;height:100%;width:100%\" seamless=\"seamless\" frameborder=\"0\"/></iframe>"},
                 {id:"caldiv", name:"UMB Calendar",
                  content:"<iframe src=\"https://calendar.google.com/calendar/embed?src=notmynormal.org%40gmail.com&ctz=America/New_York\" style=\"border: 0\" width=\"$WIDTH\" height=\"600\" frameborder=\"0\" scrolling=\"no\" id=\"califrame\"></iframe>"}];


    function makeTabs () {
        var html = [];
        pages.forEach(function (pg, idx) {
            if(!idx) {
                jt.out("titlediv", jt.tac2html(
                    ["a", {href:"#about", onclick:jt.fs("app.tabsel(0)")},
                     pg.name])); }
            else {
                html.push(["div", {id:pg.id + "tab", 
                                   cla:(idx? "tabdiv" : "seltabdiv"),
                                   onclick:jt.fs("app.tabsel(" + idx + ")")},
                           pg.name]); } });
        jt.out("tabcontdiv", jt.tac2html(html));
    }


    function displayDocContent (filename, html) {
        var idx, title, bodystart = "<body>";
        if(!html || !html.trim()) {
            html = url + " contains no text"; }
        idx = html.indexOf(bodystart);
        if(idx > 0) {
            html = html.slice(idx + bodystart.length,
                              html.indexOf("</body")); }
        jt.out("docdiv", jt.tac2html(
            ["div", {cla:"docframediv"}, html]));
    }


    function makePages () {
        var w = 800, html = [];
        w = Math.min(w, jt.byId("contentdiv").offsetWidth);
        w = Math.max(w, 500);  //calendar crunches bad below this
        pages.forEach(function (pg, idx) {
            var pgcont = pg.content.replace(/\$WIDTH/g, String(w));
            if(pgcont.endsWith(".html")) {
                pgcont = jt.tac2html(
                    ["Fetching ",
                     ["a", {href:"html/" + pgcont}, pgcont],
                     "..."]); }
            html.push(["div", {id: pg.id,
                               cla: (idx? "pagediv" : "selpagediv")},
                       pgcont]); });
        jt.out("pagecontentdiv", jt.tac2html(html));
        pages.forEach(function (pg, idx) {
            if(pg.content.endsWith(".html")) {
                jt.request("GET", "html/" + pg.content, null,
                           function (resp) {
                               displayDocContent(pg.content, resp); },
                           function (code, errtxt) {
                               var txt = "Error fetching " + pg.content +
                                   " " + code + ": " + errtxt;
                               displayDocContent(pg.content, txt); },
                           jt.semaphore("makePages" + pg.content)); } });
    }


    function adjustHeight () {
        var h = jt.byId("contentdiv").offsetHeight;
        h -= jt.byId("titlediv").offsetHeight;
        h -= 10; //titlediv margin
        h -= jt.byId("tabcontdiv").offsetHeight;
        jt.byId("pagecontentdiv").style.height = String(h) + "px";
    }


    function loadFonts () {
        //google fonts can occasionally be slow or unresponsive.  Load here to
        //avoid holding up app initialization
        var elem = document.createElement("link");
        elem.rel = "stylesheet";
        elem.type = "text/css";
        elem.href = "//fonts.googleapis.com/css?family=Roboto";
        document.head.appendChild(elem);
        var elem = document.createElement("link");
        elem.rel = "stylesheet";
        elem.type = "text/css";
        elem.href = "//fonts.googleapis.com/css?family=Open+Sans";
        document.head.appendChild(elem);
        //loading the fonts can change the height of the title and tabs
        setTimeout(adjustHeight, 800);
    }


    app.tabsel = function (selidx) {
        pages.forEach(function (pg, idx) {
            var cn = (idx === selidx)? "selpagediv" : "pagediv";
            jt.byId(pg.id).className = cn; });
        pages.forEach(function (pg, idx) {
            var cn = (idx === selidx)? "seltabdiv" : "tabdiv";
            if(idx) {
                jt.byId(pg.id + "tab").className = cn; } });
    };


    app.init = function () {
        jtminjsDecorateWithUtilities(jt);
        adjustHeight();
        makeTabs();
        makePages();
        setTimeout(loadFonts, 200);
    };

}());
