/* =============================================================
   11 — RESIA                                [ niveau : complexe ]
   Rôle : Historique complet, statistiques globales et graphe
   Branche : feat/historique-stats
   ============================================================= */

const lireHistorique = () => App.local.lire(App.CLES.historique, []);

const enregistrerPartie = (partie) => {
  // TODO 1 : Récupérer l'historique, ajouter la partie et limiter à 50 entrées max
  const historique = lireHistorique();
  historique.push(partie);

  if (historique.length > 50) {
    historique.shift(); // Enlève la plus ancienne partie (première entrée)
  }

  App.local.ecrire(App.CLES.historique, historique);
  
  // Mettre à jour l'accueil si présent
  const infoNbParties = document.querySelector('#info-nb-parties');
  if (infoNbParties) {
    infoNbParties.textContent = historique.length;
  }
};

const calculerStatistiques = (historique) => {
  // TODO 2 : Renvoyer { parties, moyenne, record, categorie }
  if (!historique || historique.length === 0) {
    return { parties: 0, moyenne: 0, record: 0, categorie: '—' };
  }

  const parties = historique.length;

  // Calcul du record (meilleur score)
  const record = Math.max(...historique.map((p) => p.score || 0));

  // Calcul de la moyenne de réussite (%)
  const totalPourcentage = historique.reduce((acc, p) => {
    const pourcent = p.total > 0 ? (p.score / p.total) * 100 : 0;
    return acc + pourcent;
  }, 0);
  const moyenne = Math.round(totalPourcentage / parties);

  // Catégorie la plus jouée avec .reduce()
  const comptageCategories = historique.reduce((acc, p) => {
    const cat = p.categorie || 'Général';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categorie = Object.keys(comptageCategories).reduce((a, b) => 
    comptageCategories[a] > comptageCategories[b] ? a : b
  );

  return { parties, moyenne, record, categorie };
};

const afficherHistorique = () => {
  // TODO 2 (affichage), 3, 4 et 6
  const historique = lireHistorique();
  const elVide = document.querySelector('#historique-vide');
  const elListe = document.querySelector('#liste-historique');
  const elGraphe = document.querySelector('#graphe-historique');

  // Mettre à jour le compteur d'accueil
  const elInfoNbParties = document.querySelector('#info-nb-parties');
  if (elInfoNbParties) elInfoNbParties.textContent = historique.length;

  // Gestion du cas où l'historique est vide
  if (!historique || historique.length === 0) {
    if (elVide) elVide.classList.remove('hidden');
    if (elListe) elListe.innerHTML = '';
    if (elGraphe) elGraphe.innerHTML = '';

    const elStatParties = document.querySelector('#stat-parties');
    const elStatMoyenne = document.querySelector('#stat-moyenne');
    const elStatRecord = document.querySelector('#stat-record');
    const elStatCategorie = document.querySelector('#stat-categorie');

    if (elStatParties) elStatParties.textContent = '0';
    if (elStatMoyenne) elStatMoyenne.textContent = '0%';
    if (elStatRecord) elStatRecord.textContent = '0';
    if (elStatCategorie) elStatCategorie.textContent = '—';
    return;
  }

  if (elVide) elVide.classList.add('hidden');

  // 1. Affichage des statistiques
  const stats = calculerStatistiques(historique);
  const elStatParties = document.querySelector('#stat-parties');
  const elStatMoyenne = document.querySelector('#stat-moyenne');
  const elStatRecord = document.querySelector('#stat-record');
  const elStatCategorie = document.querySelector('#stat-categorie');

  if (elStatParties) elStatParties.textContent = stats.parties;
  if (elStatMoyenne) elStatMoyenne.textContent = `${stats.moyenne}%`;
  if (elStatRecord) elStatRecord.textContent = stats.record;
  if (elStatCategorie) elStatCategorie.textContent = stats.categorie;

  // 2. Construction du mini graphe (12 dernières parties)
  if (elGraphe) {
    const dernieresParties = historique.slice(-12);
    elGraphe.innerHTML = dernieresParties.map((p) => {
      const pourcentage = p.total > 0 ? Math.round((p.score / p.total) * 100) : 0;
      return `<div class="graphe__barre" style="height: ${pourcentage}%" data-valeur="${p.score}"></div>`;
    }).join('');
  }

  // 3. Liste des parties (la plus récente en premier)
  if (elListe) {
    const historiqueInverse = [...historique].reverse();
    elListe.innerHTML = historiqueInverse.map((p) => {
      const dateFormatee = App.formaterDate ? App.formaterDate(p.date) : p.date;
      const pourcent = p.total > 0 ? Math.round((p.score / p.total) * 100) : 0;
      
      return `
        <div class="historique__item">
          <div class="historique__info">
            <strong>${p.joueur || 'Joueur'}</strong> — <span>${p.categorie || 'Toutes'}</span>
            <small>${dateFormatee}</small>
          </div>
          <div class="historique__score">
            ${p.score}/${p.total} (${pourcent}%)
          </div>
        </div>
      `;
    }).join('');
  }
};

// Événements
App.sur('partie:terminee', enregistrerPartie);

App.sur('ecran:change', ({ nom }) => {
  if (nom === 'historique') afficherHistorique();
});

App.sur('donnees:effacees', afficherHistorique);

App.sur('app:pret', () => {
  // TODO 5 : brancher #btn-vider-historique
  const btnVider = document.querySelector('#btn-vider-historique');
  if (btnVider) {
    btnVider.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment effacer tout votre historique ?')) {
        App.local.effacer(App.CLES.historique);
        afficherHistorique();
      }
    });
  }

  // Affichage initial des compteurs
  afficherHistorique();
});