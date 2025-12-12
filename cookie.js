(function () {
  const KEY = "cookie_consent_v1";

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  }

  function setConsent(consent) {
    localStorage.setItem(KEY, JSON.stringify(consent));
  }

  function enableTaggedScripts(category) {
    const nodes = document.querySelectorAll(`script[type="text/plain"][data-cookie="${category}"]`);
    nodes.forEach((node) => {
      const s = document.createElement("script");
      for (const attr of node.attributes) {
        if (attr.name === "type") continue;
        if (attr.name === "data-cookie") continue;
        s.setAttribute(attr.name, attr.value);
      }
      s.text = node.text || "";
      node.parentNode.replaceChild(s, node);
    });
  }

  function applyConsent(consent) {
    if (consent?.analytics) enableTaggedScripts("analytics");
    if (consent?.marketing) enableTaggedScripts("marketing");
  }

  function hideBanner() {
    const b = document.getElementById("cookieBanner");
    if (b) b.remove();
    const prefs = document.getElementById("cookiePrefs");
    if (prefs) prefs.style.display = "block";
  }

  function showBanner() {
    const banner = document.getElementById("cookieBanner");
    if (!banner) return;
    banner.style.display = "block";

    document.getElementById("btnAccept").onclick = () => {
      setConsent({ necessary: true, analytics: true, marketing: true, ts: Date.now() });
      applyConsent(getConsent());
      hideBanner();
    };

    document.getElementById("btnReject").onclick = () => {
      setConsent({ necessary: true, analytics: false, marketing: false, ts: Date.now() });
      hideBanner();
    };

    document.getElementById("btnSettings").onclick = () => {
      const a = confirm("Analytics-Cookies erlauben? (OK = Ja, Abbrechen = Nein)");
      const m = confirm("Marketing-Cookies erlauben? (OK = Ja, Abbrechen = Nein)");
      setConsent({ necessary: true, analytics: !!a, marketing: !!m, ts: Date.now() });
      applyConsent(getConsent());
      hideBanner();
    };

    const prefs = document.getElementById("cookiePrefsBtn");
    if (prefs) {
      prefs.onclick = () => {
        localStorage.removeItem(KEY);
        location.reload();
      };
    }
  }

  const existing = getConsent();
  if (existing) {
    applyConsent(existing);
    const prefs = document.getElementById("cookiePrefs");
    if (prefs) prefs.style.display = "block";
    const banner = document.getElementById("cookieBanner");
    if (banner) banner.remove();
  } else {
    showBanner();
  }
})();
