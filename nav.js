(function () {
  'use strict';

  var NAV_HTML = `
<div id="iph-topbar">
  <div id="iph-topbar-inner">
    <div id="iph-brand-group">
      <a id="iph-wordmark" href="index.html">InPursuit Health</a>
      <span id="iph-brand-divider">|</span>
      <a id="iph-maha" href="maha.html">MAHA Policy Accelerant</a>
    </div>
    <nav id="iph-nav" role="navigation" aria-label="Main navigation">
      <div class="iph-dropdown">
        <a class="iph-nav-item iph-dropdown-toggle" href="for-you.html" aria-haspopup="true">For You <span class="iph-caret">&#9660;</span></a>
        <div class="iph-dropdown-menu">
          <a href="for-you.html">Harness the Power of Your Data &#8482;</a>
        </div>
      </div>
      <div class="iph-dropdown">                          
        <a class="iph-nav-item iph-dropdown-toggle">For Providers <span class="iph-caret">&#9660;</span></a>
        <div class="iph-dropdown-menu">
          <div class="iph-sub-dropdown">                  
            <a class="iph-sub-dropdown-toggle">Results  <span class="iph-sub-caret">&#9660;</span></a>
            <div class="iph-sub-dropdown-menu">           
              <a href="access.html">CMS ACCESS Model</a>
              <a href="mssp.html">MSSP / ACO</a>
              <a href="lead.html">LEAD Model</a>
              <a href="team.html">TEAM Model</a>
            </div>
          </div>
        </div>
      </div>
      <div class="iph-dropdown">
        <a class="iph-nav-item iph-dropdown-toggle" href="tetra.html" aria-haspopup="true">TETRA <span class="iph-caret">&#9660;</span></a>
        <div class="iph-dropdown-menu">
          <a href="tetra.html">TETRA&#8482; &mdash; Data Orchestration</a>
          <a href="tetra-ex.html">TETRA Ex&#8482; &mdash; Health Data Exchange</a>
          <a href="tetra-conductor.html">TETRA Conductor&#8482; &mdash; AI Orchestration</a>
          <div class="iph-sub-dropdown">
            <a href="tetra-aegis.html" class="iph-sub-dropdown-toggle">TETRA Aegis&#8482; &mdash; AI Governance</a>
            <a href="tetra-aegis.html#sentinel">TETRA Sentinel&#8482; &mdash; Behavioral Surveillance</a>
          </div>
        </div>
      </div>
      <a class="iph-nav-item" href="veterans-first.html">Veterans First</a>
      <div class="iph-dropdown">
        <a class="iph-nav-item iph-dropdown-toggle" href="about.html" aria-haspopup="true">About <span class="iph-caret">&#9660;</span></a>
        <div class="iph-dropdown-menu">
          <a href="about.html">About Us</a>
          <a href="leadership.html">Leadership</a>
        </div>
      </div>
      <a id="iph-cta" href="investor-portal.html">Invest</a>
    </nav>
    <button id="iph-toggle" aria-label="Toggle navigation" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</div>`;

  var NAV_CSS = `
#iph-topbar{position:fixed;top:0;left:0;right:0;z-index:9999;background:#060E1A;border-bottom:1px solid rgba(197,164,78,0.2);transition:box-shadow 0.3s ease;font-family:'Instrument Sans','DM Sans',sans-serif;}
#iph-topbar.scrolled{box-shadow:0 4px 30px rgba(0,0,0,0.5);}
#iph-topbar-inner{max-width:1400px;margin:0 auto;padding:0 40px;display:flex;justify-content:space-between;align-items:center;height:64px;}
#iph-brand-group{display:flex;align-items:center;gap:10px;}
#iph-wordmark{font-family:'Instrument Serif',Georgia,serif;font-size:22px;color:#C5A44E;letter-spacing:1px;line-height:1;white-space:nowrap;text-decoration:none;}
#iph-wordmark:hover{color:#E8D48B;}
#iph-brand-divider{color:rgba(255,255,255,0.2);font-size:14px;}
#iph-maha{font-size:11px;font-weight:500;letter-spacing:0.5px;color:rgba(255,255,255,0.45);white-space:nowrap;text-decoration:none;}
#iph-maha:hover{color:rgba(255,255,255,0.7);}
#iph-nav{display:flex;align-items:center;gap:4px;}
.iph-nav-item{padding:20px 14px;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.6);text-decoration:none;position:relative;transition:color 0.3s;white-space:nowrap;display:inline-flex;align-items:center;gap:5px;}
.iph-nav-item:hover{color:#C5A44E;}
.iph-nav-item::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:2px;background:#C5A44E;transition:width 0.3s;}
.iph-nav-item:hover::after{width:60%;}
.iph-caret{font-size:8px;opacity:0.5;transition:transform 0.25s,opacity 0.25s;}
.iph-dropdown{position:relative;display:inline-flex;align-items:center;}
.iph-dropdown-toggle{display:inline-flex;align-items:center;gap:5px;}
.iph-dropdown-menu{display:none;position:absolute;top:100%;left:0;background:#0B1628;border:1px solid rgba(197,164,78,0.15);border-radius:0 0 8px 8px;box-shadow:0 20px 60px rgba(0,0,0,0.5);min-width:290px;z-index:10000;overflow:visible;padding-top:4px;}
.iph-dropdown:hover>.iph-dropdown-menu{display:block;}
.iph-dropdown:hover>.iph-nav-item .iph-caret{transform:rotate(180deg);opacity:1;}
.iph-dropdown-menu>a{display:flex;align-items:center;padding:13px 20px;font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.5);text-decoration:none;border-bottom:1px solid rgba(197,164,78,0.06);transition:all 0.2s;white-space:nowrap;}
.iph-dropdown-menu>a:last-child{border-bottom:none;}
.iph-dropdown-menu>a:hover{color:#C5A44E;background:rgba(197,164,78,0.05);padding-left:26px;}
.iph-sub-label{display:block;padding:10px 20px 6px;font-size:9px;letter-spacing:2px;font-weight:700;text-transform:uppercase;color:rgba(197,164,78,0.35);border-bottom:1px solid rgba(197,164,78,0.06);pointer-events:none;}
.iph-sub-dropdown{position:relative;}
.iph-sub-dropdown-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;padding:13px 20px;font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.5);text-decoration:none;border-bottom:1px solid rgba(197,164,78,0.06);transition:all 0.2s;white-space:nowrap;}
.iph-sub-dropdown-toggle:hover{color:#C5A44E;background:rgba(197,164,78,0.05);padding-left:26px;}
.iph-sub-dropdown-menu{display:none;position:absolute;top:0;left:100%;background:#0B1628;border:1px solid rgba(197,164,78,0.15);border-radius:0 8px 8px 0;box-shadow:10px 10px 40px rgba(0,0,0,0.5);min-width:280px;z-index:10001;}
.iph-sub-dropdown:hover .iph-sub-dropdown-menu{display:block;}
.iph-sub-dropdown-menu a{display:block;padding:13px 20px;font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.5);text-decoration:none;transition:all 0.2s;}
.iph-sub-dropdown-menu a:hover{color:#C5A44E;background:rgba(197,164,78,0.05);padding-left:26px;}
#iph-cta{display:inline-flex;align-items:center;margin-left:8px;padding:8px 18px;background:#C5A44E;color:#060E1A;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;border-radius:4px;white-space:nowrap;animation:iph-pulse-gold 2.5s ease-in-out infinite;}
#iph-cta:hover{background:#E8D48B;animation:none;}
@keyframes iph-pulse-gold{0%,100%{box-shadow:0 0 0 0 rgba(197,164,78,0.5);}50%{box-shadow:0 0 0 8px rgba(197,164,78,0);}}
#iph-toggle{display:none;background:none;border:none;width:32px;height:32px;cursor:pointer;position:relative;flex-shrink:0;}
#iph-toggle span{display:block;width:22px;height:2px;background:#C5A44E;position:absolute;left:5px;transition:all 0.3s;}
#iph-toggle span:nth-child(1){top:8px;}
#iph-toggle span:nth-child(2){top:15px;}
#iph-toggle span:nth-child(3){top:22px;}
#iph-toggle.open span:nth-child(1){top:15px;transform:rotate(45deg);}
#iph-toggle.open span:nth-child(2){opacity:0;}
#iph-toggle.open span:nth-child(3){top:15px;transform:rotate(-45deg);}
body{padding-top:64px;}
@media(max-width:1100px){
  #iph-topbar-inner{padding:0 20px;}
  #iph-nav{display:none;}
  #iph-toggle{display:block;}
  #iph-nav.open{display:flex;flex-direction:column;align-items:flex-start;position:absolute;top:64px;left:0;right:0;background:#060E1A;border-bottom:1px solid rgba(197,164,78,0.2);padding:12px 0;max-height:calc(100vh - 64px);overflow-y:auto;}
  #iph-nav.open .iph-nav-item{padding:13px 24px;width:100%;}
  #iph-nav.open .iph-dropdown{width:100%;flex-direction:column;align-items:flex-start;}
  #iph-nav.open .iph-dropdown-menu{display:none;position:static;box-shadow:none;border:none;border-radius:0;min-width:100%;background:rgba(197,164,78,0.04);border-top:1px solid rgba(197,164,78,0.08);padding-top:0;}
  #iph-nav.open .iph-dropdown.open>.iph-dropdown-menu{display:block;}
  #iph-nav.open .iph-dropdown-menu>a{padding:11px 36px;}
  #iph-nav.open .iph-sub-dropdown{width:100%;}
  #iph-nav.open .iph-sub-dropdown-menu{position:static;border:none;border-radius:0;box-shadow:none;background:rgba(197,164,78,0.06);min-width:100%;display:none;}
  #iph-nav.open .iph-sub-dropdown.open .iph-sub-dropdown-menu{display:block;}
  #iph-nav.open .iph-sub-dropdown-menu a{padding:10px 48px;}
  #iph-cta{margin-left:24px;margin-top:4px;margin-bottom:14px;}
}`;

  function inject() {
    var style = document.createElement('style');
    style.id = 'iph-nav-styles';
    style.textContent = NAV_CSS;
    document.head.appendChild(style);

    var wrapper = document.createElement('div');
    wrapper.innerHTML = NAV_HTML.trim();
    document.body.insertBefore(wrapper.firstElementChild, document.body.firstChild);

    initScrollShadow();
    initMobileToggle();
    initMobileDropdowns();
    setActiveLink();
  }

  function initScrollShadow() {
    var topbar = document.getElementById('iph-topbar');
    if (!topbar) return;
    window.addEventListener('scroll', function () {
      topbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  function initMobileToggle() {
    var toggle = document.getElementById('iph-toggle');
    var nav = document.getElementById('iph-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', function (e) {
      var topbar = document.getElementById('iph-topbar');
      if (topbar && !topbar.contains(e.target)) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initMobileDropdowns() {
    var toggles = document.querySelectorAll('#iph-nav .iph-dropdown-toggle');
    toggles.forEach(function (t) {
      t.addEventListener('click', function (e) {
        var nav = document.getElementById('iph-nav');
        if (!nav || !nav.classList.contains('open')) return;
        e.preventDefault();
        var parent = t.closest('.iph-dropdown');
        if (parent) parent.classList.toggle('open');
      });
    });
    var subToggles = document.querySelectorAll('#iph-nav .iph-sub-dropdown-toggle');
    subToggles.forEach(function (t) {
      t.addEventListener('click', function (e) {
        var nav = document.getElementById('iph-nav');
        if (!nav || !nav.classList.contains('open')) return;
        e.preventDefault();
        var parent = t.closest('.iph-sub-dropdown');
        if (parent) parent.classList.toggle('open');
      });
    });
  }

  function setActiveLink() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#iph-nav a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0];
      if (href === page) a.style.color = '#C5A44E';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
