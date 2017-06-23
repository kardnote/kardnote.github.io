! function(a) {
    function b(d) {
        if (c[d]) return c[d].exports;
        var e = c[d] = {
            exports: {},
            id: d,
            loaded: !1
        };
        return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports
    }
    var c = {};
    return b.m = a, b.c = c, b.p = "", b(0)
}([function(a, b, c) {
    c(1), a.exports = c(3)
}, function(a, b) {
    function c() {
        var a = "typeform-embed",
            b = ["typeform-wrapper", "typeform-modal"],
            c = "typeform-full",
            d = function(b, c) {
                var d = encodeURIComponent(a) + "=" + encodeURIComponent(c),
                    e = b.split("?"),
                    f = !1;
                return e[1] ? (f = e[1].length > 0, b += (f ? "&" : "") + d) : b += "?" + d, b
            },
            e = function(a) {
                for (var b = document.getElementsByTagName("iframe"), c = null, d = 0, e = b.length; d < e; d++) c = b[d], (i(c) || f(c)) && j(b[d], a)
            },
            f = function(a) {
                return a.getAttribute("id") === c
            },
            g = function() {
                return this.jQuery = jQuery.noConflict(!0), this.initialise()
            },
            h = function() {
                script = document.createElement("script"), script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js", script.onload = script.onreadystatechange = function() {
                    this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (g.call(this), script.onload = script.onreadystatechange = null, head.removeChild(script))
                }.bind(this), head = document.head || document.getElementsByTagName("head")[0], head.appendChild(script)
            },
            i = function(a) {
                var c = a.parentNode,
                    d = b.indexOf(c.className) > -1,
                    e = b.indexOf(c.getAttribute("id")) > -1;
                return d || e
            },
            j = function(a, b) {
                var c = a.getAttribute("src");
                return a.setAttribute("src", d(c, b)), a
            },
            k = function() {
                if (document.querySelector) {
                    var a = document.querySelector("meta[name=viewport]"),
                        b = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
                    if (a) a.setAttribute("content", b);
                    else {
                        var c = document.createElement("meta");
                        name = "viewport", c.content = b, document.head.appendChild(c)
                    }
                }
            },
            l = function(a) {
                var b, c;
                return a = a.originalEvent || a, c = new RegExp("^(?:f|ht)tp(?:s)?://([^/]+)", "im"), b = a.origin.match(c)[1].toString(), !!/(\.typeform)\.(com|io)$/.test(b) && ("ESC" === a.data && this.close ? this.close() : "form-submit" !== a.data ? window.location.href = a.data : void 0)
            };
        return Array.indexOf || (Array.prototype.indexOf = function(a, b) {
            var c;
            if (null === this) throw new TypeError('"this" is null or not defined');
            var d = Object(this),
                e = d.length >>> 0;
            if (0 === e) return -1;
            var f = +b || 0;
            if (Math.abs(f) === 1 / 0 && (f = 0), f >= e) return -1;
            for (c = Math.max(f >= 0 ? f : e - Math.abs(f), 0); c < e;) {
                if (c in d && d[c] === a) return c;
                c++
            }
            return -1
        })(), Function.prototype.bind = Function.prototype.bind || function(a) {
            if ("function" != typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            var b = Array.prototype.slice,
                c = b.call(arguments, 1),
                d = this,
                e = function() {},
                f = function() {
                    return d.apply(this instanceof e ? this : a || window, c.concat(b.call(arguments)))
                };
            return e.prototype = this.prototype, f.prototype = new e, f
        }, {
            communicateType: e,
            loadJqueryScript: h,
            ensureMetaViewport: k,
            onMessageCallback: l
        }
    }
    a.exports = c()
}, , function(a, b, c) {
    (function() {
        var a, b, d, e, f = [].slice;
        d = "#account#.typeform.com", e = c(1), b = function() {
            function b(a) {
                return this.options = a, "undefined" != typeof jQuery && null !== jQuery && jQuery.fn.jquery >= "1.9" ? (this.jQuery = jQuery, void this.initialise()) : void e.loadJqueryScript.call(this)
            }
            var c, f, g;
            return g = "//" + d + "/app/embed/#uid#", c = [], b.prototype.template = {
                wrapper: '<div class="typeform-wrapper"></div>',
                iframe: '<iframe width="100%" height="100%" frameborder="0" src="#url#"></iframe>'
            }, b.prototype.jQuery = null, f = "embed-widget", b.prototype.initialise = function() {
                var b, c;
                return c = this, b = this.jQuery, this.$typeforms = b(".typeform-widget"), /mobile|tablet|android/i.test(navigator.userAgent.toLowerCase()) ? (b("body").addClass("typeform-mobile"), c = this, this.$typeforms.each(function() {
                    var d, e, h, i, j;
                    return d = b(this), h = d.data("url").split("/")[2].split(".")[0], j = d.data("url").split("/")[4].split("?")[0], e = b(c.template.wrapper), e.css({
                        position: "relative",
                        width: "100%",
                        height: "100%"
                    }), i = {}, i.uid = j, i.account = h, i.text = b(this).data("text"), i.url = b(this).data("url"), b.getJSON(g.replace("#uid#", i.uid).replace("#account#", i.account) + "?jsoncallback=?", function(g) {
                        var h;
                        return b.extend(i, g), h = new a(b, i, f), d.append(e.append(h.render())), setTimeout(function() {
                            return h.resize(), setTimeout(function() {
                                return c.$typeforms.addClass("typeform-ready")
                            }, 1e3)
                        }, 2e3)
                    })
                }), !0) : (b("body").addClass("typeform-default"), this.$typeforms.each(function(a) {
                    var d, e;
                    if (e = b(c.template.wrapper), e.css({
                            position: "relative",
                            width: "100%",
                            height: "100%"
                        }), d = b(c.template.iframe.replace("#url#", b(this).data("url"))), b(this).append(e.append(d)), 0 === a) return d[0].contentWindow.focus()
                }), b(window).on("message", e.onMessageCallback.bind(this)), e.communicateType(f))
            }, b
        }(), a = function() {
            function a(a, c, d) {
                var f, g, h, i, j, k, l, m, n, o;
                n = c.name, b = d, l = document.createElement("link"), l.rel = "stylesheet", l.href = "https://s3-eu-west-1.amazonaws.com/share.typeform.com/style-widget.css", m = document.getElementsByTagName("head")[0], m.appendChild(l, m), o = !1, "" !== c["welcome-image"] && (o = !0, n = "<img style='max-width:90%' src='" + c["welcome-image"] + "'/>"), c["font-google"] && a('<link id="font" href="https://fonts.googleapis.com/css?family=' + c["font-google"] + "&text=" + c.name + '" rel="stylesheet" type="text/css">').appendTo(a("head")), this.$title = a(this.template.title.replace("#title#", n)).css({
                    color: "#" + c["primary-color"],
                    fontFamily: c["font-family"]
                }), i = "", "undefined" !== c["background-image"] && (i = "url(" + c["background-image"] + ")"), this.$background = a(this.template.background).css({
                    backgroundColor: "#" + c["background-color"],
                    backgroundImage: i,
                    backgroundRepeat: c["background-repeat"]
                }), c["background-brightness"] && (j = c["background-brightness"], k = j > 0 ? 255 : 0, this.$backgroundOverlay = a(this.template.backgroundOverlay).css({
                    backgroundColor: "rgba(" + k + "," + k + "," + k + "," + Math.abs(j) + ")"
                }), this.$backgroundOverlay.appendTo(this.$background)), h = a(this.template.text.replace("#text#", c.text)).css({
                    color: "#" + c["primary-color"]
                }), g = a(this.template.overlay).css({
                    backgroundColor: "#" + c["background-color"]
                }), f = a(this.template.modal).css({
                    backgroundColor: "#" + c["background-color"]
                }), this.$modalContent = a(this.template.modalContent.replace("#url#", c.url)), this.$modalContent.find("span").css({
                    "background-color": "#" + c["button-color"]
                }), this.$banner = a(this.template.banner.replace("#account#", c.account)).append(this.$title).append(this.$background).append(g, h).append(f), this.$banner.find(".typeform-launcher").on("click", function(c) {
                    return function() {
                        var d;
                        return a("body").addClass("typeform-opened"), d = c.$banner.find(".typeform-modal"), d.html(c.$modalContent).show(), e.communicateType(b), a("body").addClass("typeform-opened"), d.find(".typeform-close").on("click", function() {
                            return a("body").removeClass("typeform-opened"), d.hide().html("")
                        })
                    }
                }(this))
            }
            var b;
            return a.prototype.template = {
                banner: "<div class='typeform-banner'><div class='typeform-launcher' data-url='#url#'></div><div class='typeform-icon'></div></div>",
                text: "<div class='typeform-text'>#text#</div>",
                title: "<div class='typeform-title'>#title#</div>",
                background: "<div class='typeform-background'></div>",
                backgroundOverlay: "<div class='typeform-background-overlay'></div>",
                overlay: "<div class='typeform-overlay'></div>",
                modal: "<div class='typeform-modal'></div>",
                modalContent: "<div class='typeform-close'><span></span><span></span></div><iframe src='#url#'></iframe>"
            }, b = "", a.prototype.render = function() {
                return this.$banner
            }, a.prototype.resize = function() {
                var a, b;
                return b = this.$background.height(), a = this.$title.height(), this.$title.css({
                    top: (b - a) / 2 + "px"
                })
            }, a
        }(), window.namespace = function(a, b, c) {
            var d, e, g, h, i, j;
            for (arguments.length < 3 && (i = [window].concat(f.call(arguments)), a = i[0], b = i[1], c = i[2]), e = a, j = b.split("."), g = 0, h = j.length; g < h; g++) d = j[g], a = a[d] || (a[d] = {});
            return c(a, e)
        }, namespace("Typeform", function(a) {
            return a.Widget = b
        }), window.typeformLoaded || new Typeform.Widget, window.typeformLoaded = !0
    }).call(this)
}]);