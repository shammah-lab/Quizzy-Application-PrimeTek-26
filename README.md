# TP d'équipe — Quizzy

**Codecamp PrimeTek Academy — Module JavaScript**
Durée : 2 semaines · Équipe : 12 étudiants · Livrable : une seule application, construite par 12 Pull Requests.

---

## 1. Le contexte

Vous avez déjà fait une To-Do List, seul, chacun dans son coin. Cette fois c'est différent : **un seul dépôt, une seule application, douze contributeurs.** Personne ne peut finir le projet tout seul, et personne ne peut se cacher derrière les autres — chaque fonctionnalité manquante se voit immédiatement à l'écran.

C'est exactement comme ça qu'on travaille en entreprise.

## 2. L'application à construire

**Quizzy** — un quiz interactif chronométré, avec classement, historique, réglages et éditeur de questions. Tout est stocké dans le navigateur : aucun serveur, aucune base de données.

Le HTML et le CSS **sont déjà écrits et fournis**. Vous n'y touchez pas : votre travail est à 95 % du JavaScript. L'interface existe déjà, elle est simplement… morte. À vous de lui donner vie.

### Les 7 écrans fournis

| Écran | Contenu |
|---|---|
| Accueil | pseudo, choix de catégorie et de difficulté, reprise de partie |
| Quiz | question, propositions, chronomètre en anneau, barre de progression |
| Résultat | score, pourcentage, meilleure série, récapitulatif question par question |
| Classement | top 10 persistant |
| Historique | toutes les parties + statistiques + mini graphe |
| Mes questions | créer ses propres questions, exporter / importer en JSON |
| Réglages | thème clair/sombre, nombre de questions, durée, mélange |

## 3. Le résultat attendu — comment l'application doit fonctionner

Lisez cette partie en entier **avant** de coder. C'est la description de ce que le formateur testera le jour de la démonstration. Chaque phrase ci-dessous est un test que l'application doit passer.

### 3.1 Le parcours complet d'un joueur

**Ouverture de l'application.** La page s'ouvre sur l'écran d'accueil. Le thème est celui que le joueur avait choisi la dernière fois — pas le thème par défaut. Le champ pseudo est déjà pré-rempli avec le dernier pseudo utilisé sur cet appareil. Les trois compteurs du bas affichent des vraies valeurs : le nombre de questions disponibles, le nombre de parties déjà jouées, le meilleur score obtenu.

**Choix de la partie.** Le menu déroulant des catégories contient les catégories réellement présentes dans la banque — y compris celles créées par le joueur dans « Mes questions ». Il n'y a aucun doublon. Le joueur choisit une catégorie et une difficulté, puis clique sur « Commencer la partie ».

**Si le pseudo est vide ou trop court**, la partie ne démarre pas : un message d'erreur s'affiche sous le formulaire. Pas d'`alert()`, pas de plantage silencieux. Si le filtre choisi ne correspond à aucune question, la partie ne démarre pas non plus et le joueur est prévenu.

**La partie démarre.** L'application bascule sur l'écran quiz. Le badge du joueur apparaît en haut à droite avec son initiale. La première question s'affiche avec sa catégorie, sa difficulté, « Question 1 / 10 », ses propositions, et le chronomètre qui démarre immédiatement.

**Une question.** Les propositions sont dans un ordre différent à chaque partie si le réglage « Mélanger les réponses » est actif — mais la bonne réponse reste la bonne. Le chronomètre descend seconde par seconde et l'anneau se vide. À 5 secondes, il passe en rouge. Le bouton « Question suivante » est désactivé : on ne peut pas sauter une question sans répondre.

**Le joueur répond.** Toutes les propositions se figent instantanément. La bonne réponse passe en vert, et si le joueur s'est trompé, son choix passe en rouge. L'explication de la question apparaît en dessous. Le chronomètre s'arrête. Le score en bas à gauche augmente si c'était juste. Le bouton « Question suivante » devient actif.

**Un deuxième clic sur une proposition ne fait rien.** Le score n'augmente pas deux fois. C'est un test que le formateur fera.

**Si le temps s'écoule** sans réponse, la question est comptée comme fausse, mais la bonne réponse est quand même montrée en vert avec son explication. Le joueur apprend quelque chose même quand il perd.

**La progression avance.** La barre du haut se remplit à chaque question. Sur la dernière question, le bouton ne dit plus « Question suivante » mais « Voir mon résultat ».

**Fin de partie.** L'application bascule sur l'écran de résultat : score sur total, pourcentage de réussite, durée totale de la partie, plus longue série de bonnes réponses consécutives. Le message affiché change selon la performance — un joueur à 20 % et un joueur à 100 % ne lisent pas la même chose. En dessous, le récapitulatif reprend chaque question : celles réussies en vert, celles ratées avec la bonne réponse rappelée.

**Au même moment, sans que le joueur fasse quoi que ce soit**, la partie a été enregistrée dans le classement et dans l'historique. Il n'a rien à valider.

### 3.2 Ce que les écrans secondaires doivent montrer

**Classement.** Les 10 meilleurs scores de l'appareil, du meilleur au moins bon. À score égal, la partie la plus rapide est devant. Chaque ligne affiche le rang, le pseudo, le score, la catégorie et la date. Tant qu'aucune partie n'a été jouée, un message invite à en lancer une — le tableau ne reste pas vide sans explication.

**Historique.** Toutes les parties, la plus récente en haut, avec quatre statistiques calculées en direct : nombre de parties, pourcentage moyen de réussite, meilleur score, catégorie la plus jouée. Un petit graphe en barres montre l'évolution des 12 dernières parties. Aucun `NaN`, aucun `undefined` à l'écran, même quand l'historique est vide.

**Mes questions.** Le joueur crée ses propres questions. Une question incomplète est refusée avec un message qui dit précisément ce qui manque. Une question enregistrée devient immédiatement jouable : elle apparaît dans la banque et sa catégorie apparaît dans le menu déroulant de l'accueil — sans recharger la page. Le bouton « Exporter » télécharge un fichier `.json` ; le bouton « Importer » relit un fichier de ce type et ajoute les questions sans effacer celles qui existaient. Un fichier invalide est refusé proprement, sans casser l'application.

**Réglages.** Le thème bascule entre clair et sombre instantanément, sur tous les écrans. Le nombre de questions et la durée par question modifient réellement la partie suivante. « Effacer toutes mes données » demande confirmation, puis remet l'application à zéro : classement vide, historique vide, questions perso supprimées, réglages par défaut.

### 3.3 Les trois tests de persistance — le cœur du TP

C'est ici que se joue la différence entre `localStorage` et `sessionStorage`. Les trois scénarios suivants seront testés devant vous.

**Test 1 — Le rafraîchissement (F5) en pleine partie.**
Le joueur est à la question 6 sur 10, avec 4 points. Il appuie sur F5. L'application doit lui proposer de reprendre sa partie, et la reprise doit le remettre à la question 6 avec ses 4 points. Rien n'est perdu.
→ La partie en cours vit dans `sessionStorage`.

**Test 2 — La fermeture complète du navigateur.**
Le joueur ferme tout, puis rouvre l'application le lendemain. La partie en cours a disparu — c'est normal et voulu. En revanche son classement, son historique, son thème, ses réglages et ses questions personnelles sont tous encore là.
→ Ces données vivent dans `localStorage`.

**Test 3 — Le deuxième onglet.**
Le joueur ouvre l'application dans un second onglet pendant qu'une partie tourne dans le premier. Le second onglet ne propose aucune reprise de partie : chaque onglet a sa propre session. Mais les deux onglets voient le même classement et le même historique.

Si ces trois tests passent, le concept est acquis. S'ils échouent, c'est presque toujours parce qu'on a stocké au mauvais endroit.

### 3.4 Ce qui doit être vrai partout dans l'application

- **Aucune erreur rouge dans la console.** Le formateur ouvrira F12 et le laissera ouvert pendant toute la démonstration.
- **Aucun `alert()`.** Les messages passent par `#erreur-...` ou `App.notifier()`.
- **Aucun `var`.** Uniquement `const` et `let`.
- **Aucun texte en dur qui devrait être dynamique.** Si un chiffre est affiché, il est calculé.
- **L'application fonctionne en thème clair comme en thème sombre.**
- **L'application reste lisible sur un écran de téléphone.** Le CSS est déjà responsive : ne le cassez pas en injectant du HTML mal formé.
- **Un module inachevé ne bloque pas les autres.** Si personne n'a fini le classement, on doit quand même pouvoir jouer une partie entière.

### 3.5 La checklist de démonstration

Le jour de la démo, l'équipe déroule cette liste devant le groupe. Une case non cochée est un point perdu pour l'équipe entière.

- [ ] Je lance une partie complète de 10 questions sans une seule erreur console
- [ ] Je laisse le temps s'écouler sur une question : elle est comptée fausse et la bonne réponse s'affiche
- [ ] Je clique deux fois vite sur une proposition : je ne gagne qu'un point
- [ ] Je termine la partie : le résultat, le classement et l'historique sont cohérents entre eux
- [ ] Je fais F5 au milieu d'une partie : je peux reprendre où j'en étais
- [ ] Je ferme et rouvre le navigateur : la partie a disparu, le classement est resté
- [ ] Je crée une question, je la retrouve immédiatement dans une nouvelle partie
- [ ] J'exporte mes questions, j'efface tout, je réimporte : je les récupère
- [ ] Je passe en thème clair : tous les écrans restent lisibles
- [ ] Je change le nombre de questions à 5 : la partie suivante fait bien 5 questions
- [ ] J'efface toutes mes données : l'application repart proprement à zéro

## 4. Les notions obligatoires

Votre PR doit démontrer les notions du module. Une fonctionnalité qui marche mais qui n'utilise aucune de ces notions sera renvoyée en correction.

- **`const` et `let`** — plus aucun `var` dans le projet
- **Fonctions fléchées** — `(n) => n * 2`
- **Template literals** — toute génération de HTML passe par des backticks et `${...}`
- **Déstructuration** — `const { score, total } = partie;`
- **Spread / rest** — `[...App.QUESTIONS, ...perso]`
- **Paramètres par défaut** — `({ categorie = 'toutes' } = {})`
- **Méthodes de tableaux** — `map`, `filter`, `find`, `reduce`, `some`, `sort`
- **DOM et événements** — `querySelector`, `addEventListener`, `dataset`, `classList`
- **`localStorage` et `sessionStorage`** — avec `JSON.stringify()` / `JSON.parse()`

### La règle localStorage vs sessionStorage

C'est le cœur pédagogique du TP, ne vous trompez pas :

| Ce qui doit **survivre** à la fermeture du navigateur → `localStorage` | Ce qui doit **disparaître** avec l'onglet → `sessionStorage` |
|---|---|
| classement, historique, réglages, thème, questions perso, dernier pseudo utilisé | joueur de la session, partie en cours (index, score, réponses), dernier écran visité |

## 5. Répartition des rôles

Chaque étudiant possède **un seul fichier** dans `js/`. Vous ne modifiez jamais le fichier d'un autre : c'est ce qui rend 12 PR fusionnables sans conflit.

### Fonctionnalités complexes

| # | Étudiant | Fonctionnalité | Fichier | Branche |
|---|---|---|---|---|
| 03 | **N'famory Traore** | Banque de questions, catégories dynamiques, filtres, tirage et mélange des propositions | `js/03-nfamory-banque.js` | `feat/banque-questions` |
| 06 | **Jephte Iniki** | Validation des réponses, feedback visuel, score et séries | `js/06-jephte-validation.js` | `feat/validation-reponse` |
| 11 | **Resia** | Historique complet, statistiques globales (`reduce`) et graphe | `js/11-resia-historique.js` | `feat/historique-stats` |
| 12 | **Elisee Jean Pierre** | Éditeur de questions, export et import JSON (Blob, FileReader) | `js/12-elisee-editeur.js` | `feat/editeur-questions` |

### Fonctionnalités moyennes

| # | Étudiant | Fonctionnalité | Fichier | Branche |
|---|---|---|---|---|
| 04 | **Tresor Vakekya** | Accueil, profil joueur, reprise de partie (sessionStorage) | `js/04-tresor-accueil.js` | `feat/accueil-joueur` |
| 05 | **Fabrice Bodjenga** | Affichage de la question et génération des propositions | `js/05-fabrice-affichage.js` | `feat/affichage-question` |
| 07 | **Theophile Lumbala** | Chronomètre par question (anneau SVG + urgence) | `js/07-theophile-chrono.js` | `feat/chronometre` |
| 09 | **Julien** | Écran de résultat, messages par palier, récapitulatif | `js/09-julien-resultat.js` | `feat/ecran-resultat` |

### Fonctionnalités simples

| # | Étudiant | Fonctionnalité | Fichier | Branche |
|---|---|---|---|---|
| 02 | **Gaël** | Réglages, thème clair/sombre, effacement des données | `js/02-gael-reglages.js` | `feat/reglages` |
| 08 | **Williams** | Barre de progression et enchaînement des questions | `js/08-williams-progression.js` | `feat/progression` |
| 10 | **Sammy Baseme** | Classement top 10 persistant | `js/10-sammy-classement.js` | `feat/classement` |

### Intégration

| # | Étudiant | Fonctionnalité | Fichier | Branche |
|---|---|---|---|---|
| 01 | **Shammah Ndjibu** | Dépôt, invitations, revue et fusion des PR **+** navigation entre les écrans | `js/01-shammah-navigation.js` | `feat/navigation` |

**Fichiers interdits à la modification :** `index.html`, `css/style.css`, `js/core.js`, `js/data.js`, `js/demarrage.js`.
Besoin d'un nouvel élément HTML ou d'une nouvelle classe CSS ? Ouvrez une **issue**, Shammah tranche et fait la modification lui-même. Un seul propriétaire par fichier, toujours.

## 6. Comment 12 personnes codent sans se marcher dessus

Personne n'appelle directement la fonction d'un collègue. Tout passe par un **bus d'événements** fourni dans `core.js` :

```js
// J'annonce quelque chose au reste de l'application
App.emettre('partie:terminee', { joueur, score, total, serieMax, reponses, categorie, duree, date });

// J'écoute ce que les autres annoncent
App.sur('partie:terminee', (partie) => {
  // Julien affiche le résultat, Sammy met à jour le classement,
  // Resia l'historique — chacun de son côté, sans se connaître.
});
```

Conséquence : **si le module d'un collègue n'est pas encore fini, le vôtre fonctionne quand même.** Vous pouvez déclencher n'importe quel événement à la main dans la console du navigateur pour tester votre partie tout seul.

### Les événements du projet (contrat commun — à ne pas renommer)

| Événement | Émis par | Données |
|---|---|---|
| `app:chargement` | démarrage | — (phase 1 : lecture du stockage) |
| `app:pret` | démarrage | — (phase 2 : branchement de l'interface) |
| `ecran:change` | Shammah | `{ nom }` |
| `reglages:modifies` | Gaël | `{ config }` |
| `donnees:effacees` | Gaël | — |
| `banque:modifiee` | Elisee | — |
| `partie:demarree` | Tresor | `{ joueur, questions, categorie }` |
| `question:affichee` | Fabrice | `{ question, index, total }` |
| `reponse:choisie` | Fabrice | `{ question, indexChoisi }` |
| `temps:ecoule` | Theophile | — |
| `reponse:validee` | Jephte | `{ question, indexChoisi, correcte }` |
| `question:suivante` | Williams | — |
| `partie:terminee` | Williams | `{ joueur, score, total, serieMax, reponses, categorie, duree, date }` |

### La chaîne de dépendances — à lire à voix haute en séance

```
Gaël (réglages)  ->  N'famory (banque)  ->  Tresor (démarrage partie)
        ->  Fabrice (affichage)  ->  Theophile (chrono)
        ->  Jephte (validation, score, série)  ->  Williams (suite et fin)
        ->  Julien (résultat) + Sammy (classement) + Resia (historique)
              ^
        Elisee (éditeur) alimente la banque de N'famory
```

Quatre étudiants sont **bloquants** pour les autres : Gaël, N'famory, Jephte et Williams. Leurs PR passent en priorité dans la file de revue de Shammah.

## 7. Le circuit Git — le même pour tout le monde

```bash
# 1. Une seule fois
git clone <url-du-depot>
cd quizzy

# 2. Avant CHAQUE session de travail
git checkout main
git pull origin main

# 3. Je crée ma branche (voir le tableau des rôles)
git checkout -b feat/chronometre

# 4. Je code, je teste dans le navigateur, puis :
git add js/06-theophile-chrono.js
git commit -m "feat(chrono): compte à rebours et anneau SVG par question"
git push origin feat/chronometre

# 5. J'ouvre la Pull Request sur GitHub vers main
#    et j'attends la revue de Shammah.
```

### Règles non négociables

1. **Jamais de commit directement sur `main`.** La branche est protégée.
2. **Une PR = une fonctionnalité = un fichier.** Une PR qui touche 4 fichiers est refusée.
3. **Messages de commit en convention :** `feat(...)`, `fix(...)`, `refactor(...)`, `docs(...)`.
4. **La PR doit être testée avant d'être ouverte.** Zéro erreur rouge dans la console.
5. **On ne fusionne jamais sa propre PR.** Seul Shammah fusionne.
6. **Un conflit ? On ne force jamais.** `git pull origin main` sur sa branche, on résout, on repousse.

### Description attendue dans chaque PR

```
## Ce que fait cette PR
…

## Notions ES6+ utilisées
- fonctions fléchées : ligne …
- template literals : ligne …
- …

## Stockage utilisé
localStorage / sessionStorage — clé(s) : …

## Comment tester
1. …
2. …

## Ce qui ne marche pas encore
…
```

### Le rôle de Shammah

- Créer le dépôt, inviter les 11 collègues, protéger `main`
- Créer les 12 issues (une par fonctionnalité) et les assigner
- Relire chaque PR : est-ce que ça marche ? est-ce que ça respecte le contrat d'événements ? est-ce que les notions du module sont là ?
- Demander des corrections **par écrit dans la PR** — c'est ça, une revue de code
- Fusionner dans l'ordre, résoudre les conflits, vérifier après chaque fusion que l'application tourne toujours
- Coder aussi sa propre fonctionnalité (la navigation), en PR comme tout le monde

## 8. Planning

| Jour | Objectif |
|---|---|
| J1 | Shammah crée le dépôt, invite tout le monde, ouvre les 12 issues. Chacun clone et fait tourner le projet. |
| J2 | Chacun lit **tout** `core.js` et son propre fichier. Séance de questions collective sur le contrat d'événements. |
| J3–J6 | Développement. Première PR obligatoire de chacun au plus tard J5, même incomplète. |
| J7 | **Point d'intégration n°1** : Shammah fusionne ce qui est prêt. On teste ensemble. |
| J8–J11 | Corrections demandées en revue + finitions. |
| J12 | **Gel du code.** Dernière PR acceptée à midi. |
| J13 | Intégration finale, test complet, correction des bugs de fusion. |
| J14 | **Démonstration.** Chacun présente sa fonctionnalité en 3 minutes devant le groupe. |

## 9. Barème de notation — 20 points

| Critère | Points |
|---|---|
| La fonctionnalité marche comme décrite dans le fichier | 6 |
| Notions ES6+ réellement utilisées (fléchées, template literals, déstructuration, spread, méthodes de tableaux) | 4 |
| Respect du contrat d'événements et du stockage (bonne clé, bon type de stockage) | 3 |
| Qualité Git : branche correcte, commits propres, PR bien décrite | 3 |
| Code lisible : noms explicites, pas de code mort, indentation, commentaires utiles | 2 |
| Présentation orale de 3 minutes | 2 |

**Bonus jusqu'à +2 :** relire sérieusement la PR d'un collègue et y laisser un commentaire technique utile.
**Malus −3 :** modifier un fichier qui ne vous appartient pas sans passer par une issue.

## 10. Démarrer le projet

Ouvrir `index.html` avec l'extension **Live Server** de VS Code (clic droit → *Open with Live Server*).
Ouvrir ensuite la console du navigateur avec **F12** : chaque événement s'y affiche en direct, c'est votre meilleur outil de débogage.

```
quizzy/
├── index.html                 ← fourni, ne pas modifier
├── css/style.css              ← fourni, ne pas modifier
├── js/
│   ├── core.js                ← fourni : App, stockage, bus d'événements
│   ├── data.js                ← fourni : 21 questions de départ
│   ├── 01-shammah-…  →  12-gael-…   ← un fichier par étudiant
│   └── demarrage.js           ← fourni
└── README.md
```

---

> Une application, douze mains. Le jour de la démo, personne ne pourra dire « ma partie marchait sur ma machine ». Ce qui compte, c'est ce qui tourne dans `main`.
# Quizzy-Application-PrimeTek-26
