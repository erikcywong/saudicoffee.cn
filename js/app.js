/* NAPELL.BIO — app.js: i18n engine, language modal, nav, form validation */
(function () {
  "use strict";
  var LANG_KEY = "napell_lang";
  var LANGS = ["en", "zh", "ar"];

  function getLang() {
    var l = localStorage.getItem(LANG_KEY);
    return LANGS.indexOf(l) > -1 ? l : null;
  }
  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
  }
  function t(key) {
    var lang = getLang() || "en";
    var dict = (typeof I18N !== "undefined") ? I18N[lang] : null;
    if (dict && dict[key] != null) return dict[key];
    if (typeof I18N !== "undefined" && I18N.en && I18N.en[key] != null) return I18N.en[key];
    return key;
  }
  window.__t = t;

  function applyLang(lang) {
    var html = document.documentElement;
    html.setAttribute("lang", lang === "zh" ? "zh-CN" : (lang === "ar" ? "ar-SA" : "en"));
    if (lang === "ar") { html.setAttribute("dir", "rtl"); } else { html.setAttribute("dir", "ltr"); }

    /* text nodes */
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].innerHTML = t(nodes[i].getAttribute("data-i18n"));
    }
    /* placeholders */
    var phs = document.querySelectorAll("[data-i18n-ph]");
    for (var j = 0; j < phs.length; j++) {
      phs[j].setAttribute("placeholder", t(phs[j].getAttribute("data-i18n-ph")));
    }
    /* tooltips (title) */
    var ttls = document.querySelectorAll("[data-i18n-title]");
    for (var k = 0; k < ttls.length; k++) {
      ttls[k].setAttribute("title", t(ttls[k].getAttribute("data-i18n-title")));
    }
    /* aria-labels */
    var ars = document.querySelectorAll("[data-i18n-aria]");
    for (var m = 0; m < ars.length; m++) {
      ars[m].setAttribute("aria-label", t(ars[m].getAttribute("data-i18n-aria")));
    }
    /* lang menu active state */
    var menuBtns = document.querySelectorAll(".lang-menu button[data-lang]");
    for (var n = 0; n < menuBtns.length; n++) {
      menuBtns[n].classList.toggle("active", menuBtns[n].getAttribute("data-lang") === lang);
    }
    /* lang button label */
    var btn = document.querySelector(".lang-btn");
    if (btn) btn.textContent = t("nav.language");
  }

  /* ---------- language selection modal ---------- */
  function buildModal() {
    var overlay = document.createElement("div");
    overlay.className = "lang-modal-overlay";
    overlay.id = "langModal";
    overlay.innerHTML =
      '<div class="lang-modal" role="dialog" aria-modal="true">' +
      '  <h2>Choose Your Language' +
      '    <span class="zh">选择你的语言</span>' +
      '    <span class="ar">اختر لغتك</span>' +
      '  </h2>' +
      '  <p>NAPELL.BIO — Saudi Coffee Industry Chain Proposal</p>' +
      '  <div class="lang-options">' +
      '    <button data-lang="en">English <small>International</small></button>' +
      '    <button data-lang="zh">简体中文 <small>Chinese</small></button>' +
      '    <button data-lang="ar">العربية <small>السعودية</small></button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(overlay);
    var btns = overlay.querySelectorAll("button[data-lang]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        setLang(this.getAttribute("data-lang"));
        overlay.remove();
      });
    }
  }

  /* ---------- shared navbar & footer injection ---------- */
  function injectChrome() {
    var pages = [
      ["index.html", "nav.home", []],
      ["opportunity.html", "nav.opportunity", [["opportunity.html", "nav.dd.market"], ["alignment.html", "nav.dd.alignment"]]],
      ["technology.html", "nav.technology", [["technology.html#tissue", "nav.dd.tissue"], ["technology.html#aero", "nav.dd.aero"], ["technology.html#dash", "nav.dd.dash"]]],
      ["partnership.html", "nav.partnership", [["partnership.html", "nav.dd.jv"], ["partnership.html#pilot", "nav.dd.pilot"], ["partnership.html#gov", "nav.dd.gov"]]],
      ["roadmap.html", "nav.roadmap", [["roadmap.html", "nav.dd.phases"], ["roadmap.html#milestones", "nav.dd.ms"]]],
      ["financials.html", "nav.financials", [["financials.html", "nav.dd.unit"], ["financials.html#proj", "nav.dd.proj"]]]
    ];
    var path = location.pathname.split("/").pop() || "index.html";

    var nav = document.createElement("nav");
    nav.className = "navbar";
    var linksHtml = "";
    for (var i = 0; i < pages.length; i++) {
      var p = pages[i];
      var active = (path === p[0]) ? ' class="active"' : "";
    if (p[2].length === 0) {
      linksHtml += '<li><a href="' + p[0] + '"' + active + ' data-i18n="' + p[1] + '"></a></li>';
    } else {
      var dd = "";
      for (var d = 0; d < p[2].length; d++) {
        dd += '<li><a href="' + p[2][d][0] + '" data-i18n="' + p[2][d][1] + '"></a></li>';
      }
      linksHtml += '<li><a href="' + p[0] + '"' + active + ' data-i18n="' + p[1] + '"></a>' +
        '<ul class="dropdown">' + dd + '</ul></li>';
    }
  }
  linksHtml += '<li><a href="contact.html"' + (path === "contact.html" ? ' class="active"' : "") + ' data-i18n="nav.contact"></a></li>';
  var langWrap =
    '<div class="lang-wrap">' +
    '<button class="lang-btn" data-i18n="nav.language"></button>' +
    '<ul class="lang-menu">' +
    '<li><button data-lang="en">English<span class="l-code">EN</span></button></li>' +
    '<li><button data-lang="zh">简体中文<span class="l-code">中文</span></button></li>' +
    '<li><button data-lang="ar">العربية<span class="l-code">عربي</span></button></li>' +
    '</ul></div>';
  nav.innerHTML =
    '<a class="logo" href="index.html">NAPELL<span>.BIO</span></a>' +
    '<button class="menu-toggle" data-i18n-aria="nav.home" aria-label="Menu">☰</button>' +
    '<ul class="nav-links">' + linksHtml + '</ul>' +
    langWrap;

    /* insert navbar at top of body */
    document.body.insertBefore(nav, document.body.firstChild);

    /* language dropdown (3 explicit options) */
    var langBtn = nav.querySelector(".lang-btn");
    var langMenu = nav.querySelector(".lang-menu");
    langBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      langMenu.classList.toggle("open");
    });
    langMenu.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-lang]");
      if (!b) return;
      setLang(b.getAttribute("data-lang"));
      langMenu.classList.remove("open");
    });
    document.addEventListener("click", function () { langMenu.classList.remove("open"); });

    /* mobile toggle */
    var mt = nav.querySelector(".menu-toggle");
    if (mt) {
      mt.addEventListener("click", function () {
        nav.querySelector(".nav-links").classList.toggle("open");
      });
    }

    /* footer */
    if (!document.querySelector("footer.site-footer")) {
      var f = document.createElement("footer");
      f.className = "site-footer";
      f.innerHTML =
        '<div class="container"><div class="inner">' +
        '<p><span data-i18n="ft.rights"></span><br><span data-i18n="ft.patent"></span></p>' +
        '<p data-i18n="ft.priv"></p>' +
        '</div></div>';
      document.body.appendChild(f);
    }
  }

  /* ---------- contact form ---------- */
  function initForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var toast = document.getElementById("toast");

    function fail(input, key) {
      var field = input.closest(".field");
      field.classList.add("invalid");
      field.querySelector(".err").textContent = t(key);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector("#f-name");
      var email = form.querySelector("#f-email");
      var msg = form.querySelector("#f-msg");
      form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("invalid"); });

      if (!name.value.trim()) { fail(name, "err.name"); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { fail(email, "err.email"); ok = false; }
      if (msg.value.trim().length < 10) { fail(msg, "err.msg"); ok = false; }
      if (!ok) return;

      toast.textContent = t("ok.msg");
      toast.classList.add("show");
      form.reset();
      setTimeout(function () { toast.classList.remove("show"); }, 5000);
    });
  }

  /* ---------- access gate (partnership / financials) ---------- */
  window.NAPELL_USERS = ["saudicoffee", "erik", "james"]; /* authorized usernames */
  window.NAPELL_PASS = "wcY385916"; /* unified access password */
  function authGate() {
    var protectedPages = ["partnership.html", "financials.html"];
    var path = location.pathname.split("/").pop() || "index.html";
    if (protectedPages.indexOf(path) > -1 && sessionStorage.getItem("napell_auth") !== "1") {
      location.href = "login.html?next=" + encodeURIComponent(path);
      return false;
    }
    return true;
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    injectChrome();
    if (!authGate()) return; /* redirect to login before anything else */
    var lang = getLang();
    applyLang(lang || "en");
    if (!lang) buildModal(); /* landing: language choice overlay */
    initForm();
  });
})();
