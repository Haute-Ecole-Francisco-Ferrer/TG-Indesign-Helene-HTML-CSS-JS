/**
 * Techniques Graphiques HEFF — Page d'accueil
 * États : grille → hover (tooltip) → détail projet
 */

const projects = {
  mahira: {
    option: 'option édition',
    desc: 'Création d\'une collection de packagings pour une collaboration entre un chocolatier indépendant et une herboristerie locale.',
    author: 'Mahira ♥ 2e année',
    link: 'En savoir plus sur l\'option édition',
    images: [
      'assets/images/mahira-1.jpg',
      'assets/images/mahira-2.jpg',
      'assets/images/mahira-3.jpg',
      'assets/images/packaging-page7.jpg',
      'assets/images/6-copie.png'
    ]
  },
  iman: {
    option: 'option édition',
    desc: 'Création d\'un livret imprimé pour le ciné club du Palace.',
    author: 'Iman ♥ 2e année',
    link: 'En savoir plus sur l\'option édition',
    images: [
      'assets/images/screenshot-48-36.png',
      'assets/images/devos-elodie.jpg',
      'assets/images/scan-blaireau.jpg',
      'assets/images/image07.jpg',
      'assets/images/90969.jpg'
    ]
  },
  ayman: {
    option: 'option 3D / VFX',
    desc: 'Réalisation d\'une séquence de film mêlant prises de vues réelles et animation 3D tel que le texturing et modeling.',
    author: 'Hayman & Logan ♥ 3e année',
    link: 'En savoir plus sur l\'option 3D / VFX',
    images: [
      'assets/images/ayman-logan.jpg',
      'assets/images/img-9060.jpg',
      'assets/images/90969.jpg',
      'assets/images/img-9898.jpg',
      'assets/images/image07.jpg'
    ]
  },
  julie: {
    option: 'option web',
    desc: 'Création d\'un site web pour promouvoir le musée du design à Bruxelles.',
    author: 'Julie Braban ♥ 3e année',
    link: 'En savoir plus sur l\'option web',
    images: [
      'assets/images/screenshot-50-21.png',
      'assets/images/marais.png',
      'assets/images/vocabase-06.jpg',
      'assets/images/vocabase-05.jpg',
      'assets/images/personnage-yiwei.png'
    ]
  },
  vocabase: {
    option: 'option web',
    desc: 'Vocabase — Projet de design éditorial et web.',
    author: 'Sofian & Melina ♥ 2e année',
    link: 'En savoir plus sur l\'option web',
    images: [
      'assets/images/vocabase-06.jpg',
      'assets/images/vocabase-05.jpg',
      'assets/images/marais.png',
      'assets/images/screenshot-50-21.png',
      'assets/images/screenshot-47-34.png'
    ]
  },
  elodie: {
    option: 'option édition',
    desc: 'Création d\'étiquettes et packaging pour une marque de kombucha artisanal.',
    author: 'Elodie Devos ♥ 1re année',
    link: 'En savoir plus sur l\'option édition',
    images: [
      'assets/images/devos-elodie.jpg',
      'assets/images/mahira-1.jpg',
      'assets/images/6-copie.png',
      'assets/images/scan-blaireau.jpg',
      'assets/images/packaging-page7.jpg'
    ]
  },
  yiwei: {
    option: 'option 3D / VFX',
    desc: 'Création et modélisation d\'un personnage en 3D.',
    author: 'Yiwei ♥ 2e année',
    link: 'En savoir plus sur l\'option 3D / VFX',
    images: [
      'assets/images/personnage-yiwei.png',
      'assets/images/ayman-logan.jpg',
      'assets/images/image07.jpg',
      'assets/images/img-9060.jpg',
      'assets/images/90969.jpg'
    ]
  },
  abir: {
    option: 'option édition',
    desc: 'Illegaal × Habeebee — Projet de design graphique et identité visuelle.',
    author: 'Abir ♥ 2e année',
    link: 'En savoir plus sur l\'option édition',
    images: [
      'assets/images/img-9898.jpg',
      'assets/images/devos-elodie.jpg',
      'assets/images/6-copie.png',
      'assets/images/mahira-1.jpg',
      'assets/images/scan-blaireau.jpg'
    ]
  }
};

// Fallback : projets sans data-project dédié
const defaultProject = {
  option: 'option',
  desc: 'Projet étudiant — Techniques Graphiques HEFF',
  author: 'Étudiant·e — HEFF',
  link: 'En savoir plus',
  images: []
};

function openDetail(projectId, clickedImg) {
  const project = projects[projectId] || defaultProject;
  const detail = document.getElementById('detail');

  // Image principale = première du projet, ou l'image cliquée
  const mainSrc = project.images[0] || clickedImg;
  document.getElementById('detail-img-main').src = mainSrc;

  // 4 autres images (les restantes du projet, sinon l'image cliquée répétée)
  const otherImages = project.images.length > 1
    ? project.images.slice(1)
    : [clickedImg, clickedImg, clickedImg, clickedImg].filter(Boolean);
  for (let i = 0; i < 4; i++) {
    const thumb = document.getElementById(`detail-img-${i + 1}`);
    thumb.src = otherImages[i] || mainSrc;
  }

  // Infos
  document.getElementById('detail-option').textContent = project.option;
  document.getElementById('detail-desc').textContent = project.desc;
  document.getElementById('detail-author').textContent = project.author;
  document.getElementById('detail-link').textContent = project.link;

  // Ouvrir
  detail.setAttribute('aria-hidden', 'false');
  document.body.classList.add('detail-open');
}

function closeDetail() {
  const detail = document.getElementById('detail');
  detail.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('detail-open');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Clic sur une image de la grille → ouvrir le détail
  document.querySelectorAll('.grid__item').forEach(item => {
    item.addEventListener('click', () => {
      const projectId = item.dataset.project;
      const imgSrc = item.querySelector('img').src;

      if (projectId && projects[projectId]) {
        openDetail(projectId, null);
      } else {
        // Projet sans détail défini : montrer l'image en grand
        openDetail(null, imgSrc);
      }
    });
  });

  // Fermer le détail
  document.getElementById('detail-close').addEventListener('click', closeDetail);

  // Menu overlay
  const menuToggle = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');

  menuToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('menu-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  function openMenu() {
    menuOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    menuOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetail();
      closeMenu();
    }
  });
});
