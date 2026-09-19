(function () {
  'use strict';

  if (document.getElementById('iph-topbar')) return;

  var nav = document.querySelector('.topnav');
  if (!nav) return;

  var topbarInner = nav.closest('.topbar-inner');
  if (!topbarInner) return;

  var CSS = '' +
    '.iph-mnav-toggle{display:none;background:none;border:none;cursor:pointer;width:32px;height:32px;' +
    'position:relative;flex-shrink:0;padding:0;margin-left:auto;}' +
    '.iph-mnav-toggle span{display:block;width:22px;height:2px;background:#C5A44E;' +
    'position:absolute;left:5px;transition:all .3s;}' +
    '.iph-mnav-toggle span:nth-child(1){top:8px;}' +
    '.iph-mnav-toggle span:nth-child(2){top:15px;}' +
    '.iph-mnav-toggle span:nth-child(3){top:22px;}' +
    '.iph-mnav-toggle.open span:nth-child(1){top:15px;transform:rotate(45deg);}' +
    '.iph-mnav-toggle.open span:nth-child(2){opacity:0;}' +
    '.iph-mnav-toggle.open span:nth-child(3){top:15px;transform:rotate(-45deg);}' +
    '@media(max-width:640px){' +
    '.iph-mnav-toggle{display:block;}' +
    '.topnav.iph-mnav-open{display:flex;flex-direction:column;align-items:flex-start;' +
    'position:absolute;top:100%;left:0;right:0;background:#060E1A;' +
    'border-bottom:1px solid rgba(197,164,78,.2);padding:10px 0;z-index:9998;}' +
    '.topnav.iph-mnav-open a{padding:12px 24px;width:100%;box-sizing:border-box;}' +
    '.topnav.iph-mnav-open a.hide-sm{display:block;}' +
    '.topnav.iph-mnav-open a.portal{margin:4px 16px 12px;width:auto;}' +
    '}';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var toggle = document.createElement('button');
  toggle.className = 'iph-mnav-toggle';
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  topbarInner.appendChild(toggle);

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = nav.classList.toggle('iph-mnav-open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', function (e) {
    var topbar = topbarInner.closest('.topbar');
    if (topbar && !topbar.contains(e.target)) {
      nav.classList.remove('iph-mnav-open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
