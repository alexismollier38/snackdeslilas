# Snack des Lilas — prototype de caisse

Prototype local de l’écran de caisse tactile pour un snack en Nouvelle-Calédonie.

## Utilisation

Ouvrir `index.html` dans un navigateur moderne. Aucun serveur ni dépendance n’est nécessaire pour cette première maquette fonctionnelle.

## Périmètre actuel

- catalogue de démonstration repris de la photo fournie : plats à emporter, desserts et boissons ;
- visuels générés pour les trois familles de produits ;
- catégories et recherche rapide ;
- panier avec quantités ;
- modes sur place, à emporter et livraison ;
- affichage des montants en XPF ;
- emplacement TGC configurable ;
- modal de paiement de démonstration ;
- aperçu du tableau de bord.
- encaissement espèces avec calcul de monnaie ;
- paiement mixte de démonstration ;
- remise responsable avec PIN de démonstration ;
- persistance locale des ventes et de l’état de caisse ;
- gestion de disponibilité des produits et clôture locale.
- configuration de l’établissement avec RIDET et taux TGC à valider ;
- journal d’audit local avec empreinte chaînée des opérations.
- export CSV des ventes, export JSON complet et export du journal d’audit ;
- restauration contrôlée d’une sauvegarde JSON.
- gestion locale des utilisateurs et rôles Administrateur, Responsable et Caissier.
- remboursement contrôlé sans suppression de la vente d’origine.
- suivi des stocks, alertes de seuil bas et ajustements audités.
- nom, téléphone et commentaire facultatifs sur chaque commande.
- file de préparation des commandes avec statuts À préparer, Prête, Appelée et Terminée.
- ajout de produits et modification des prix depuis l’administration du catalogue.

## À ne pas considérer comme production

Cette version persiste uniquement une démonstration dans le navigateur, ne déclenche aucun paiement réel et ne constitue pas un logiciel fiscal certifié. Les taux TGC, les mentions de tickets/factures, les règles d’archivage et le dispositif d’intégrité doivent être validés localement avant la mise en production.
