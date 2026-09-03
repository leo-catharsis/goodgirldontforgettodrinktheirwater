# Rappel d'eau 🎀 — guide de mise en ligne

Tout le code est prêt. Il te reste à "brancher" 3 services gratuits entre eux,
uniquement en cliquant — pas une ligne de code à écrire. Compte environ 20-30 min.

## Ce que tu vas utiliser
- **GitHub** : héberge le code (gratuit)
- **Vercel** : héberge le site en ligne + déclenche l'envoi une fois par jour (gratuit)
- **OneSignal** : envoie réellement les notifications (gratuit à ce volume)

---

## Étape 1 — Mettre le code sur GitHub
1. Crée un compte sur https://github.com si tu n'en as pas.
2. Clique sur **New repository**, donne-lui un nom (ex: `rappel-eau`), en **Private**, puis **Create repository**.
3. Sur la page du repo vide, clique **uploading an existing file**, puis glisse-dépose TOUS les fichiers de ce dossier (en gardant le sous-dossier `api/` tel quel).
4. Clique **Commit changes**.

## Étape 2 — Créer le compte OneSignal
1. Va sur https://onesignal.com, crée un compte, puis **New App/Website**.
2. Choisis la plateforme **Web Push**.
3. Type de site : **Custom Code** (pas WordPress/Shopify).
4. Il va te demander l'URL de ton site — reviens à cette étape après l'étape 3 (une fois que Vercel t'aura donné une adresse).
5. Une fois l'app créée, va dans **Settings > Keys & IDs**. Tu y trouveras :
   - **OneSignal App ID**
   - **REST API Key**
   Garde cette page ouverte, tu en as besoin juste après.

## Étape 3 — Déployer sur Vercel
1. Crée un compte sur https://vercel.com (tu peux te connecter directement avec ton compte GitHub).
2. Clique **Add New > Project**, choisis ton repo `rappel-eau`, puis **Import**.
3. Avant de cliquer sur Deploy, ouvre **Environment Variables** et ajoute :
   | Nom | Valeur |
   |---|---|
   | `ONESIGNAL_APP_ID` | (collé depuis OneSignal) |
   | `ONESIGNAL_REST_API_KEY` | (collé depuis OneSignal) |
4. Clique **Deploy**. Au bout d'une minute, Vercel te donne une adresse du style `rappel-eau.vercel.app` — c'est le lien que ta copine ouvrira.

## Étape 4 — Finir la config OneSignal
1. Retourne dans OneSignal, termine la création de l'app en collant ton adresse Vercel (`https://rappel-eau.vercel.app`) comme **Site URL**.
2. Dans **Settings > Web Push > Safari Web ID**, laisse OneSignal générer les valeurs par défaut (le fichier `OneSignalSDKWorker.js` est déjà dans le projet, rien à ajouter).

## Étape 5 — Coller ton App ID dans le code
1. Sur GitHub, ouvre `index.html`, clique l'icône crayon (éditer).
2. Remplace `REMPLACE_PAR_TON_ONESIGNAL_APP_ID` par ton vrai OneSignal App ID.
3. **Commit changes** — Vercel redéploie automatiquement en ~30 secondes.

## Étape 6 — Personnaliser tes messages
Ouvre `api/schedule-notifications.js` sur GitHub (icône crayon), et modifie la liste
`MESSAGES` en haut du fichier avec tes propres phrases. Commit — c'est pris en compte
dès le lendemain (le tirage a lieu une fois par jour, tôt le matin).

## Étape 7 — Tester avant d'envoyer à ta copine
1. Ouvre `https://rappel-eau.vercel.app` sur TON iPhone, dans Safari.
2. Appuie sur **Partager > Sur l'écran d'accueil** (important : pas juste "ouvrir le lien").
3. Ouvre l'app depuis l'icône 🎀 sur l'écran d'accueil, appuie sur "Activer mes rappels", accepte les notifications.
4. Pour tester l'envoi tout de suite sans attendre le cron, va dans Vercel > ton projet > **Cron Jobs**, et clique **Run** sur `schedule-notifications` — tu devrais recevoir jusqu'à 3 notifs à des horaires aléatoires dans les minutes qui suivent (grâce à `delayed_option: timezone`, elles arrivent à l'heure programmée sur TON fuseau horaire, donc si tu tires un horaire déjà passé aujourd'hui, teste plutôt un jour normal).

## Étape 8 — Envoyer le lien à ta copine
Envoie-lui juste l'adresse Vercel. Elle doit faire exactement la même chose qu'à l'étape 7 :
ouvrir dans Safari → Ajouter à l'écran d'accueil → ouvrir l'app → activer les rappels.
Une fois fait, elle n'a plus rien à faire — les notifs arrivent toutes seules.

---

## Notes utiles
- Le cron tourne une fois par jour vers 6h UTC (~7-8h heure de Paris selon l'heure d'été/hiver) et programme les 3 notifs du jour. Sur le plan gratuit de Vercel, l'heure exacte peut varier de quelques minutes dans l'heure.
- Pour une protection anti-spam de l'endpoint (optionnel), ajoute une variable `CRON_SECRET` dans Vercel (Environment Variables) avec une valeur aléatoire — Vercel l'enverra automatiquement dans les appels cron, le code la vérifie déjà.
- Rien de tout ça ne coûte d'argent au volume d'une seule utilisatrice.
