# MusicalPuzzleAngular

PFE en collaboration avec le LEAD, création d'un puzzle musical en combinant plusieurs pièces (fragment de musique) pour reconstruire un morceau complet.

Projet Angular 12 + Material Angular

## Configuration

Un fichier de configuration est situé dans `assets/config/config.json`.
Il permet de modifier les paramétres des difficultés disponibles.

## Installation

`npm install` pour télécharger et installer les dépendances du projet. 

## Serveur de développement

`ng serve --open` pour lancer le serveur de développement.

## Déploiement

`ng build --prod --base-href ./` pour compiler le projet dans le dossier `dist/`.
Il faut ensuite placer ce dossier dans `nforgeron/public_html` pour le déployer sur le serveur.
Vérifier qu'il y a les droit d'accès sur le dossier `musical-puzzle-angular` (sinon se connecter en ssh `ssh i3m-lead-0243.u-bourgogne.fr -l nforgeron` et faire `chmod -c 777 musical-puzzle-angular`)