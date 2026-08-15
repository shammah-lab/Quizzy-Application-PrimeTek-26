/* =============================================================
   09 — JULIEN                                 [ niveau : moyen ]
   Rôle : Écran de résultat et récapitulatif de la partie
   Branche : feat/ecran-resultat

   MISSION
   -------
   1. À la réception de 'partie:terminee', basculer sur l'écran résultat
      (App.allerA('resultat')) et remplir : #resultat-score, #resultat-total,
      #resultat-pourcentage, #resultat-duree, #resultat-serie.
      Le pourcentage : Math.round((score / total) * 100)
   2. Choisir un message personnalisé selon le pourcentage — au moins quatre
      paliers (< 40 %, 40-69 %, 70-89 %, >= 90 %) -> #resultat-titre et
      #resultat-message. Écris de vrais textes qui donnent envie de rejouer,
      pas « Bravo » quatre fois.
   3. Construire le récapitulatif question par question dans #resultat-recap
      à partir du tableau `reponses`, avec .map() + .join('') :

        <li class="${correcte ? 'est-juste' : ''}">
          <b>${intitule}</b>
          <small>Bonne réponse : ${bonneReponse}</small>
        </li>

   4. Bouton #btn-rejouer : supprimer la partie en cours de sessionStorage
      (App.session.supprimer(App.CLES.session)) puis App.allerA('accueil').

   CONTRAT
   -------
   - Écoute 'partie:terminee' avec { joueur, score, total, serieMax,
     reponses, categorie, duree, date }
   - Tu ne touches NI au classement (Sammy) NI à l'historique (Resia) :
     ils écoutent le même événement de leur côté.
   ============================================================= */

App.sur('partie:terminee', (partie) => {
  // TODO 1 à 3 : déstructure l'objet partie et remplis l'écran
  // const { joueur, score, total, serieMax, reponses, duree } = partie;
});

App.sur('app:pret', () => {
  // TODO 4 : brancher #btn-rejouer
});
