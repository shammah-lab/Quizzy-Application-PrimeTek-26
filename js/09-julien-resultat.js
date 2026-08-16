App.sur('partie:terminee', (partie) => {

  // TODO 1
  const { joueur, score, total, serieMax, reponses, duree } = partie;

  const pourcentage = Math.round((score / total) * 100);

  App.allerA('resultat');

  document.querySelector('#resultat-score').textContent = score;
  document.querySelector('#resultat-total').textContent = total;
  document.querySelector('#resultat-pourcentage').textContent = `${pourcentage}%`;
  document.querySelector('#resultat-duree').textContent = duree;
  document.querySelector('#resultat-serie').textContent = serieMax;


  // TODO 2
  let titre = '';
  let message = '';

  if (pourcentage < 40) {
    titre = 'Dommage !';
    message = 'Continue tes efforts ! Chaque partie est une occasion de progresser.';
  } else if (pourcentage < 70) {
    titre = 'Pas mal !';
    message = 'Tu es presque ! Encore quelques efforts et tu franchiras le prochain palier.';
  } else if (pourcentage < 90) {
    titre = 'Très bien !';
    message = 'Félicitations ! Tu maîtrises déjà bien le sujet.';
  } else {
    titre = 'Parfait !';
    message = 'Bravo Champion ! Quelle performance ! Prêt à relever un nouveau défi ?';
  }

  document.querySelector('#resultat-titre').textContent = titre;
  document.querySelector('#resultat-message').textContent = message;


  // TODO 3
  const recap = reponses
    .map(({ intitule, correcte, bonneReponse }) => `
      <li class="${correcte ? 'est-juste' : ''}">
        <b>${intitule}</b>
        <small>Bonne réponse : ${bonneReponse}</small>
      </li>
    `)
    .join('');

  document.querySelector('#resultat-recap').innerHTML = recap;
});


// TODO 4
App.sur('app:pret', () => {
  document.querySelector('#btn-rejouer').addEventListener('click', () => {
    App.session.supprimer(App.CLES.session);
    App.allerA('accueil');
  });
});