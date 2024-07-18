const getCookie = _0x413e42 => {
  const _0x387d9a = _0x413e42 + '=';
  const _0x395512 = document.cookie.split(';');
  for (let _0x26f8d0 = 0x0; _0x26f8d0 < _0x395512.length; _0x26f8d0++) {
    let _0x3161f5 = _0x395512[_0x26f8d0];
    for (; " " == _0x3161f5.charAt(0x0);) {
      _0x3161f5 = _0x3161f5.substring(0x1, _0x3161f5.length);
    }
    if (0x0 == _0x3161f5.indexOf(_0x387d9a)) {
      return _0x3161f5.substring(_0x387d9a.length, _0x3161f5.length);
    }
  }
  return null;
};
const setCookie = (_0x38c28e, _0x5126b3, _0x2dc6cf = 0x16d) => {
  const _0x4dc65b = new Date();
  _0x4dc65b.setTime(_0x4dc65b.getTime() + 0x18 * _0x2dc6cf * 0x3c * 0x3c * 0x3e8);
  const _0x1eb68a = "; expires=" + _0x4dc65b.toUTCString();
  document.cookie = _0x38c28e + '=' + (_0x5126b3 || '') + _0x1eb68a + ";path=/;SameSite=None;Secure";
};
const applyTheme = _0x41c53c => {
  const _0x552d62 = document.getElementById("theme-stylesheet");
  if (_0x552d62) {
    _0x552d62.href = _0x41c53c;
  }
};
applyTheme(getCookie("theme") || '/styles/default-modern.css');
document.addEventListener('DOMContentLoaded', function () {
  const _0x164ef6 = () => {
    if (!getCookie("version")) {
      setCookie("version", "Release 1.8.8");
    }
    if (!getCookie('theme')) {
      setCookie('theme', "/styles/default-modern.css");
    }
    if (!getCookie("ClientEPK1_8")) {
      setCookie('ClientEPK1_8', 'default-1.8.epk');
    }
    if (!getCookie("ClientEPK1_5")) {
      setCookie('ClientEPK1_5', 'default-1.5.epk');
    }
    const _0x2ae79c = document.getElementById('version-selector');
    const _0x513b68 = document.getElementById("theme-selector");
    const _0x1bbe78 = document.getElementById("client-theme-1.8");
    const _0xd5b45f = document.getElementById("client-theme-1.5");
    if (_0x2ae79c) {
      _0x2ae79c.value = getCookie("version");
    }
    if (_0x513b68) {
      _0x513b68.value = getCookie("theme");
    }
    if (_0x1bbe78) {
      _0x1bbe78.value = getCookie('ClientEPK1_8');
    }
    if (_0xd5b45f) {
      _0xd5b45f.value = getCookie("ClientEPK1_5");
    }
    applyTheme(getCookie("theme") || "/styles/default-modern.css");
  };
  const _0x187bc4 = () => {
    const _0x570d1b = document.getElementById('version-selector');
    const _0x5d74ce = document.getElementById("theme-selector");
    const _0x364715 = document.getElementById("client-theme-1.8");
    const _0x2e9835 = document.getElementById("client-theme-1.5");
    if (_0x570d1b) {
      setCookie("version", _0x570d1b.value);
    }
    if (_0x5d74ce) {
      setCookie('theme', _0x5d74ce.value);
      applyTheme(_0x5d74ce.value);
    }
    if (_0x364715) {
      setCookie("ClientEPK1_8", _0x364715.value);
    }
    if (_0x2e9835) {
      setCookie('ClientEPK1_5', _0x2e9835.value);
    }
  };
  const _0x282373 = document.querySelectorAll("nav ul li a");
  const _0x3e269b = document.querySelectorAll(".content");
  const _0x1da34c = document.getElementById('legal-tab');
  const _0x52a5b0 = document.querySelector('.legal-submenu');
  const _0x26f86b = document.getElementById("social-tab");
  const _0x5de069 = document.querySelector(".social-submenu");
  _0x282373.forEach(_0x54a8c2 => {
    _0x54a8c2.addEventListener("click", function (_0x1cd21b) {
      if ('client-tab' !== this.id && 'about-tab' !== this.id && 'discord-tab' !== this.id && 'client-tab' !== this.id && 'reddit-tab' !== this.id && "terms-tab" !== this.id && "privacy-tab" !== this.id && 'legal-info-tab' !== this.id && 'forum-tab' !== this.id) {
        _0x1cd21b.preventDefault();
        if ("legal-tab" === this.id) {
          this.classList.toggle('active');
          _0x52a5b0.classList.toggle("active");
          const _0x386183 = this.querySelector('.fa-chevron-down');
          if (_0x386183) {
            _0x386183.style.transform = this.classList.contains('active') ? "rotate(-90deg)" : "rotate(0deg)";
          }
        } else {
          if ("social-tab" === this.id) {
            this.classList.toggle("active");
            _0x5de069.classList.toggle("active");
            const _0x532b0a = this.querySelector(".fa-chevron-down");
            if (_0x532b0a) {
              _0x532b0a.style.transform = this.classList.contains("active") ? "rotate(-90deg)" : "rotate(0deg)";
            }
          } else {
            _0x282373.forEach(_0x11e836 => _0x11e836.classList.remove("active"));
            _0x54a8c2.classList.add("active");
            const _0x3bbcc4 = _0x54a8c2.id.split('-')[0x0];
            _0x1232d9(_0x3bbcc4);
            _0x1da34c.classList.remove("active");
            _0x52a5b0.classList.remove('active');
            const _0x5b9792 = _0x1da34c.querySelector(".fa-chevron-down");
            _0x26f86b.classList.remove('active');
            _0x5de069.classList.remove("active");
            const _0x5229b3 = _0x26f86b.querySelector(".fa-chevron-down");
            if (_0x5b9792) {
              _0x5b9792.style.transform = "rotate(0deg)";
            }
            if (_0x5229b3) {
              _0x5229b3.style.transform = "rotate(0deg)";
            }
          }
        }
      }
    });
  });
  document.querySelectorAll(".legal-submenu li a").forEach(_0x2c573f => {
    _0x2c573f.addEventListener('click', function (_0x3c7fee) {
      _0x3c7fee.stopPropagation();
    });
  });
  document.querySelectorAll(".social-submenu li a").forEach(_0x1ab3a9 => {
    _0x1ab3a9.addEventListener("click", function (_0x455b57) {
      _0x455b57.stopPropagation();
    });
  });
  const _0x1232d9 = _0x5c7cd9 => {
    const _0x56d9de = document.getElementById(_0x5c7cd9);
    if (_0x56d9de) {
      _0x3e269b.forEach(_0x57af51 => {
        _0x57af51.classList.remove('active');
        _0x57af51.innerHTML = '';
        _0x57af51.style.display = "none";
      });
      _0x56d9de.style.display = "block";
      fetch(_0x5c7cd9 + ".html").then(_0x4429d1 => {
        if (!_0x4429d1.ok) {
          throw new Error("Network response was not ok :( " + _0x4429d1.statusText);
        }
        return _0x4429d1.text();
      }).then(_0x3b6268 => {
        _0x56d9de.innerHTML = _0x3b6268;
        _0x56d9de.classList.add("active");
        if ('settings' === _0x5c7cd9) {
          _0x164ef6();
          const _0x596689 = document.getElementById("version-selector");
          const _0x33866a = document.getElementById("theme-selector");
          const _0x559dde = document.getElementById('client-theme-1.8');
          const _0x349c23 = document.getElementById("client-theme-1.5");
          if (_0x596689 && _0x33866a && _0x559dde && _0x349c23) {
            _0x596689.addEventListener("change", _0x187bc4);
            _0x33866a.addEventListener("change", _0x187bc4);
            _0x559dde.addEventListener("change", _0x187bc4);
            _0x349c23.addEventListener('change', _0x187bc4);
          }
        }
      })['catch'](_0x13f539 => {
        _0x56d9de.innerHTML = "<p>Failed to load content.</p>";
        console.error("Error loading page:", _0x13f539);
      });
    } else {
      console.error("Content section for " + _0x5c7cd9 + " not found");
    }
  };
  const _0x1baf0a = () => {
    const _0x32c60b = document.createElement("div");
    _0x32c60b.id = 'terms-overlay';
    _0x32c60b.innerHTML = "\n            <div id=\"terms-box\">\n                <h2>Welcome!</h2>\n                <p>Before you proceed, please review and accept our:</p>\n                <ul>\n                    <li><a href=\"/terms/\" rel=\"noopener\" target=\"_blank\">Terms of Service</a></li>\n                    <li><a href=\"/privacy/\" rel=\"noopener\" target=\"_blank\">Privacy Policy</a></li>\n                    <li><a href=\"/legal/\" rel=\"noopener\" target=\"_blank\">Legal Disclaimer</a></li>\n                    <li><a href=\"/credits/\" rel=\"noopener\" target=\"_blank\">Credits</a></li>\n                </ul>\n                <p>By clicking \"Accept\", you agree to be bound by these documents.</p>\n                <button id=\"accept-terms\">Accept</button>\n            </div>\n        ";
    document.body.appendChild(_0x32c60b);
    const _0xeed410 = document.getElementById("accept-terms");
    if (_0xeed410) {
      _0xeed410.addEventListener('click', () => {
        setCookie('AcceptedTerms', 'Yes', 0x16d);
        _0x32c60b.remove();
      });
    }
  };
  _0x164ef6();
  const _0x492282 = document.getElementById('theme-selector');
  if (_0x492282) {
    _0x492282.addEventListener("change", function () {
      setCookie('theme', this.value);
      applyTheme(this.value);
    });
  }
  _0x1232d9("home");
  (() => {
    const _0x1d2af4 = document.getElementById("play-button");
    if (_0x1d2af4) {
      _0x1d2af4.addEventListener('click', _0x2a7cac => {
        if ("Yes" !== getCookie("AcceptedTerms")) {
          _0x2a7cac.preventDefault();
          alert("Please accept the terms before playing.");
          _0x1baf0a();
        } else {
          const _0x10f5cb = getCookie("version");
          if (_0x10f5cb) {
            (_0x1ae91f => {
              let _0x5a71a5;
              switch (_0x1ae91f) {
                case "Release 1.8.8":
                  _0x5a71a5 = "/clients/1.8/index.html";
                  break;
                case "Beta 1.7.3":
                  _0x5a71a5 = "/clients/1.7/index.html";
                  break;
                case "Release 1.5.2":
                  _0x5a71a5 = '/clients/1.5/index.html';
                  break;
                case "Beta 1.3":
                  _0x5a71a5 = '/clients/1.3/index.html';
                  break;
                case "Release 1.2.5":
                  _0x5a71a5 = "/clients/1.2/index.html";
                  break;
                case "EaglerForge":
                  _0x5a71a5 = "/clients/EaglerForge/index.html";
                  break;
                case "Resent 4.0":
                  _0x5a71a5 = "/clients/Resent/index.html";
                  break;
                case "Shadow 4.0":
                  _0x5a71a5 = "/clients/Shadow/index.html";
                  break;
                case 'Indev':
                  _0x5a71a5 = "/clients/Indev/index.html";
                  break;
                case "Alpha 1.2.6":
                  _0x5a71a5 = '/clients/Alpha-1.2/index.html';
                  break;
                default:
                  _0x5a71a5 = "/clients/1.8/index.html";
                  console.error("Unknown version:", _0x1ae91f, "launching 1.8 instead.");
              }
              if (_0x5a71a5) {
                fetch(_0x5a71a5).then(_0x1faea7 => {
                  if (!_0x1faea7.ok) {
                    throw new Error("Network response was not ok " + _0x1faea7.statusText);
                  }
                  return _0x1faea7.text();
                }).then(_0x16db39 => {
                  const _0x477c3b = new DOMParser().parseFromString(_0x16db39, "text/html");
                  document.open();
                  document.write(_0x477c3b.documentElement.outerHTML);
                  document.close();
                })["catch"](_0x16077f => {
                  console.error("Error loading version content:", _0x16077f);
                  console.error("Error name:", _0x16077f.name);
                  console.error("Error message:", _0x16077f.message);
                  console.error("Error stack:", _0x16077f.stack);
                });
              }
            })(_0x10f5cb);
          } else {
            console.error("Version not found in cookies! :(");
          }
        }
      });
    } else {
      console.error("Play button not found :(");
    }
  })();
  if ("Yes" !== getCookie('AcceptedTerms')) {
    _0x1baf0a();
  }
});