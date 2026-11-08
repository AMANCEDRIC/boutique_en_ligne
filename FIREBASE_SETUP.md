# Mise en service : Firebase + Cloudinary

Le site utilise deux services gratuits :

- **Firebase** pour les données : articles, catégories, commandes, réglages, et la connexion de l'admin.
- **Cloudinary** pour les photos et vidéos des articles.

Tant que `src/environments/environment.ts` n'est pas rempli, le site tourne en **mode démo** : les articles de démonstration sont en lecture seule et l'espace admin est désactivé.

---

## 1. Firebase (offre gratuite Spark, aucune carte bancaire)

1. Ouvrir https://console.firebase.google.com, puis **Ajouter un projet** (ex. `maison-shein`). Google Analytics n'est pas nécessaire.
2. **Créer l'application Web :** dans *Paramètres du projet* > *Vos applications*, cliquer sur l'icône **Web** `</>`, donner un nom, puis **Enregistrer**. Copier l'objet `firebaseConfig` affiché.
3. **Activer la base de données :** dans *Build* > **Firestore Database**, cliquer sur *Créer une base de données*.
   - Région : `eur3 (europe-west)`.
   - Mode : **production**.
4. **Activer la connexion :** dans *Build* > **Authentication** > *Commencer* > *Sign-in method*, activer **E-mail/Mot de passe**.
5. **Créer le compte de Clara :** dans *Authentication* > *Users* > **Ajouter un utilisateur**, saisir son e-mail et un mot de passe solide. Copier l'**UID** affiché.
6. **Donner les droits admin :** dans *Firestore* > **Démarrer une collection**.
   - ID de la collection : `admins`.
   - ID du document : *l'UID copié à l'étape 5*.
   - Ajouter un champ quelconque (ex. `nom` = `Clara`), puis enregistrer.
7. **Installer les règles de sécurité :** dans *Firestore* > onglet **Règles**, remplacer tout le contenu par celui du fichier [`firestore.rules`](firestore.rules), puis **Publier**.

   Alternative en ligne de commande :

   ```
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project <projectId>
   ```

> Pour ajouter un autre administrateur, créez son compte (étape 5), puis ajoutez son UID dans `admins` (étape 6).

## 2. Cloudinary (offre gratuite, 25 Go)

1. Créer un compte sur https://cloudinary.com, puis noter le **Cloud name** affiché sur le *Dashboard*.
2. Aller dans *Settings* (roue dentée) > **Upload** > *Upload presets* > **Add upload preset**, et régler :
   - **Preset name** : `maison_shein`
   - **Signing mode** : **Unsigned**
   - **Folder** : `maison-shein`
   - **Allowed formats** : `jpg,jpeg,png,webp,heic,mp4,mov`
   - **Max file size** : 100 Mo, si l'option est proposée.
3. Enregistrer.

> Le preset non signé permet l'envoi depuis le navigateur sans serveur. Les restrictions de format et de taille limitent les abus.
> Une photo supprimée d'un article reste stockée sur Cloudinary. Faites le ménage de temps en temps dans *Media Library* si besoin.

## 3. Brancher le site

Remplir `src/environments/environment.ts` :

```ts
export const environment = {
  firebase: {
    apiKey: '…',
    authDomain: 'maison-shein.firebaseapp.com',
    projectId: 'maison-shein',
    storageBucket: 'maison-shein.appspot.com',
    messagingSenderId: '…',
    appId: '…',
  },
  cloudinary: {
    cloudName: 'votre-cloud-name',
    uploadPreset: 'maison_shein',
  },
};
```

Ces valeurs ne sont pas secrètes : elles sont visibles dans le code envoyé au navigateur. La sécurité vient des règles Firestore et des restrictions du preset Cloudinary.

## 4. Premier lancement

1. Lancer `npm start`, puis ouvrir http://localhost:4200/admin et se connecter avec le compte de Clara.
   - Les catégories par défaut sont créées automatiquement à la première connexion : Robes, Ensembles, Hauts, Bas, Sacs, Sandales, Bijoux, Lace front, Frontal, Bob et Bouclées.
2. Dans l'onglet **Réglages**, saisir le **numéro WhatsApp** qui recevra les commandes, les liens TikTok et Instagram, et les photos de l'accueil.
3. Dans l'onglet **Articles**, ajouter les articles, ou cliquer sur *Importer les articles de démo* pour tester.

### Tester depuis un téléphone

Lancer `npm start -- --host 0.0.0.0`, puis ouvrir `http://<IP-du-PC>:4200` depuis un téléphone connecté au même Wi-Fi.

En production, ajouter le domaine Vercel dans *Firebase* > *Authentication* > *Settings* > **Authorized domains**.
