/* =============================================================
   07 — THEOPHILE LUMBALA                      [ niveau : moyen ]
   Rôle : Chronomètre par question
   Branche : feat/chronometre

   MISSION
   -------
   1. Démarrer un compte à rebours de App.config.dureeQuestion secondes
      à chaque nouvelle question.
   2. Mettre à jour #chrono-valeur chaque seconde ET l'anneau SVG :
      $('#chrono').style.setProperty('--avancement', restant / duree);
      (--avancement va de 1 à 0, l'anneau se vide tout seul, tu n'as aucun
       calcul de dessin à faire)
   3. Ajouter la classe .est-urgent sur #chrono quand il reste 5 secondes
      ou moins, et la retirer au début de chaque question.
   4. À zéro : arrêter le timer et émettre 'temps:ecoule'.
   5. Arrêter le chrono dès qu'une réponse est validée, sinon il continue de
      tourner pendant que le joueur lit l'explication.

   LE PIÈGE CLASSIQUE
   ------------------
   Toujours faire clearInterval() de l'ancien timer AVANT d'en lancer un
   nouveau. Sinon deux chronos tournent en parallèle et le temps descend
   deux fois plus vite — puis trois, puis quatre.

   CONTRAT
   -------
   - Écoute 'question:affichee' (démarrer), 'reponse:validee' et
     'partie:terminee' (arrêter)
   - Émet 'temps:ecoule' (sans données)
   ============================================================= */

let minuteur = null;
const chrono = $('#chrono')
const chronojauge = $('.chrono__jauge')
const chronoVal = $('#chrono-valeur')
let tempsTotal = App.config.dureeQuestion
const arreterChrono = () => {
  // TODO 1 : clearInterval(minuteur); minuteur = null;
  clearInterval(minuteur)
};

const demarrerChrono = (tempsTotal) => {
  // TODO 2 : arreterChrono() d'abord
  // TODO 3 : let restant = App.config.dureeQuestion;
  // TODO 4 : afficher la valeur de départ, remettre --avancement à 1,
  //          retirer .est-urgent
  // TODO 5 : minuteur = setInterval(() => { ... }, 1000);
  //          chaque tick : restant -= 1, affichage, .est-urgent si <= 5,
  //          et si restant <= 0 -> arreterChrono() + App.emettre('temps:ecoule')
   arreterChrono()
   let restant = tempsTotal;
   chronoVal.textContent = restant
   chronojauge.style.setProperty('--avancement', 1)
   chronojauge.style.stroke = 'var(--menthe)'
   minuteur = setInterval(() => {
      restant--;
      chronoVal.textContent = restant
      chronojauge.style.setProperty('--avancement', restant / tempsTotal)
      if(restant <= 0){
         chronojauge.style.setProperty('--avancement', 0)
         arreterChrono()
         App.emettre('temps:ecoule');
      }
      else if (restant <= 5){
         chronojauge.style.stroke = 'var(--rouge)'
      }
   }, 1000)

};

App.sur('question:affichee', demarrerChrono);
App.sur('reponse:validee', arreterChrono);
App.sur('partie:terminee', arreterChrono);
