// ==========================================================================
// Merlijn Cremers Portfolio - Navigatie & Project Weergave
// ==========================================================================

(function () {
  const mainView = document.getElementById('main-view');
  const backBtn = document.getElementById('back-to-projects');
  const projectSections = Array.from(document.querySelectorAll('.project-detail'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  let currentProjectId = null;

  function showMainView(targetSectionId, smoothScroll) {
    const wasInProject = currentProjectId !== null;
    currentProjectId = null;

    projectSections.forEach((sec) => {
      sec.hidden = true;
    });
    mainView.hidden = false;
    backBtn.hidden = true;

    if (targetSectionId) {
      const anchor = document.getElementById(targetSectionId);
      if (anchor) {
        requestAnimationFrame(() => {
          anchor.scrollIntoView({ behavior: smoothScroll && !wasInProject ? 'smooth' : 'auto', block: 'start' });
        });
      }
    }
  }

  function showProjectView(projectId) {
    const targetSec = document.getElementById('project-' + projectId);
    if (!targetSec) {
      showMainView('projecten', false);
      return;
    }

    currentProjectId = projectId;
    mainView.hidden = true;
    projectSections.forEach((sec) => {
      sec.hidden = sec !== targetSec;
    });
    backBtn.hidden = false;

    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // Klik op een project-thumbnail (zowel bij de 3 previews als bij de 10 projecten)
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.project-thumb');
    if (thumb) {
      e.preventDefault();
      const pid = thumb.getAttribute('data-project');
      if (pid) {
        history.pushState({ project: pid }, '', '#project/' + pid);
        showProjectView(pid);
      }
    }
  });

  // Klik op de pijl terug knop -> terug naar het overzicht met alle projecten
  backBtn.addEventListener('click', () => {
    history.pushState({ section: 'projecten' }, '', '#projecten');
    showMainView('projecten', false);
  });

  // Klik op de knoppen in de navigatiebalk (Merlijn Cremers, Projecten, About, Contact)
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-nav');
      history.pushState({ section: targetId }, '', '#' + targetId);
      showMainView(targetId, true);
    });
  });

  // Ondersteuning voor browser Vorige / Volgende knoppen en directe URL-hash
  function handleHash() {
    const hash = window.location.hash || '';
    if (hash.startsWith('#project/')) {
      const pid = hash.replace('#project/', '').trim();
      showProjectView(pid);
    } else if (hash === '#projecten' || hash === '#about' || hash === '#contact' || hash === '#home') {
      showMainView(hash.substring(1), false);
    } else {
      showMainView(null, false);
    }
  }

  window.addEventListener('popstate', handleHash);
  handleHash();
})();
