/*jslint browser, multivar, white, fudge */
/*global window jtminjsDecorateWithUtilities */

var app = {},  //Global container for application level funcs and values
    jt = {};   //Global access to general utility methods

(function () {
    "use strict";

    var pages = [{id:"artdiv", name:"Notable Articles",
                  content:"<div id=\"membicdiv\" style=\"height:90vh;\"><iframe id=\"membiciframe\" src=\"https://membic.com?view=coop&coopid=6385940616445952&css=none&site=notmynormal.org\" style=\"position:relative;height:100%;width:100%\" seamless=\"seamless\" frameborder=\"0\"/></iframe></div>"},
                 {id:"caldiv", name:"UMB Calendar",
                  content:"<iframe src=\"https://calendar.google.com/calendar/embed?src=notmynormal.org%40gmail.com&ctz=America/New_York\" style=\"border: 0\" width=\"800\" height=\"600\" frameborder=\"0\" scrolling=\"no\" id=\"califrame\"></iframe>"}];


    function makeTabs () {
        var html = [];
        pages.forEach(function (pg, idx) {
            html.push(["div", {id: pg.id + "tab", 
                               cla: (idx? "tabdiv" : "seltabdiv"),
                               onclick: jt.fs("app.tabsel(" + idx + ")")},
                       pg.name]); });
        jt.out("tabcontdiv", jt.tac2html(html));
    }


    function makePages () {
        var html = [];
        pages.forEach(function (pg, idx) {
            html.push(["div", {id: pg.id,
                               cla: (idx? "pagediv" : "selpagediv")},
                       pg.content]); });
        jt.out("pagecontentdiv", jt.tac2html(html));
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
            if(idx === selidx) {
                jt.byId(pg.id + "tab").className = "seltabdiv";
                jt.byId(pg.id).className = "selpagediv"; }
            else {
                jt.byId(pg.id + "tab").className = "tabdiv";
                jt.byId(pg.id).className = "pagediv"; } });
    };


    app.init = function () {
        jtminjsDecorateWithUtilities(jt);
        adjustHeight();
        makeTabs();
        makePages();
        setTimeout(loadFonts, 200);
    };

}());
