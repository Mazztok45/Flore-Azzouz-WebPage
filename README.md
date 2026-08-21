# Flore Azzouz — Site web professionnel

Site vitrine pour l'activité de **psychologue du travail** de Flore Azzouz : présentation de l'activité, des services proposés et des témoignages de clients. Inspiré par la qualité de [floreazzouz.fr](https://www.floreazzouz.fr), construit avec une stack 100 % open source.

> Statut : squelette du projet en place (Astro + Tailwind + React/Framer Motion + Decap CMS), build vérifié. Contenu et déploiement à finaliser.

## Démarrage rapide

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # build de production (inclut la vérification de types)
```

## Stack technique

| Besoin | Outil | Pourquoi |
|---|---|---|
| Générateur de site | [Astro](https://astro.build) | Sites statiques rapides, îlots interactifs uniquement où nécessaire |
| Styles | [Tailwind CSS](https://tailwindcss.com) | Utilitaire, facile à maintenir, cohérent avec une charte de couleurs |
| Animations | [Framer Motion](https://www.framer.com/motion/) | Animations au scroll fluides, utilisé dans des îlots React |
| CMS | [Decap CMS](https://decapcms.org) (ex-Netlify CMS) | Édition de contenu (services, témoignages) sans backend propriétaire |
| Hébergement | [Vercel](https://vercel.com) | Déploiement continu depuis GitHub, gratuit pour ce type de projet |

Tout le stack est open source ; aucun service propriétaire n'est requis pour faire fonctionner le site lui-même (voir la note sur l'authentification CMS plus bas).

## Design — palette & typographie

Palette chaleureuse et professionnelle, adaptée à un cabinet de psychologie du travail :

| Rôle | Couleur | Hex |
|---|---|---|
| Fond clair | Sable | `#F5EDE3` |
| Fond très clair | Blanc cassé | `#FAF7F2` |
| Accent principal | Terracotta | `#B5652E` |
| Accent secondaire | Sauge | `#8A9A7B` |
| Texte | Brun profond | `#4A3B31` |

```js
// tailwind.config.mjs
colors: {
  sable: "#F5EDE3",
  creme: "#FAF7F2",
  terracotta: "#B5652E",
  sauge: "#8A9A7B",
  brun: "#4A3B31",
}
```

Typographie (Google Fonts, licence SIL OFL — open source) :
- Titres : [Fraunces](https://fonts.google.com/specimen/Fraunces) — serif chaleureuse, humaine, évite le côté "corporate froid"
- Texte courant : [Work Sans](https://fonts.google.com/specimen/Work+Sans) — sans-serif lisible, neutre

## Structure du projet cible

```
/
├── public/
│   ├── admin/
│   │   ├── index.html       # point d'entrée Decap CMS
│   │   └── config.yml       # collections CMS
│   └── images/
├── src/
│   ├── components/
│   │   ├── astro/           # composants statiques
│   │   └── react/           # îlots interactifs (Framer Motion)
│   ├── content/
│   │   ├── config.ts        # schémas des collections Astro
│   │   ├── services/
│   │   └── testimonials/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Feuille de route

### 1. Initialisation du projet

```bash
npm create astro@latest -- --template minimal
npx astro add tailwind react
npm install framer-motion
```

`react` est nécessaire car Framer Motion est une librairie React ; les animations vivent dans des îlots (`client:visible`) au sein de pages Astro statiques.

### 2. Collections de contenu (Astro Content Collections)

```ts
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    order: z.number().default(0),
  }),
});

const testimonials = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    quote: z.string(),
    rating: z.number().min(1).max(5).default(5),
  }),
});

export const collections = { services, testimonials };
```

### 3. Configuration Decap CMS

```yaml
# public/admin/config.yml
backend:
  name: github
  repo: Mazztok45/Flore-Azzouz-WebPage
  branch: main

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "services"
    label: "Services"
    folder: "src/content/services"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Titre", name: "title", widget: "string" }
      - { label: "Description courte", name: "description", widget: "text" }
      - { label: "Icône", name: "icon", widget: "string", required: false }
      - { label: "Ordre d'affichage", name: "order", widget: "number", default: 0 }
      - { label: "Contenu", name: "body", widget: "markdown" }

  - name: "testimonials"
    label: "Témoignages"
    folder: "src/content/testimonials"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Nom", name: "name", widget: "string" }
      - { label: "Fonction / contexte", name: "role", widget: "string", required: false }
      - { label: "Témoignage", name: "quote", widget: "text" }
      - { label: "Note", name: "rating", widget: "number", min: 1, max: 5, default: 5 }
```

```html
<!-- public/admin/index.html -->
<!doctype html>
<html>
<head><meta charset="utf-8" /><title>Administration</title></head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

> Vercel ne fournit pas d'équivalent au "Git Gateway" de Netlify. Le backend `github` de Decap CMS nécessite une petite application OAuth GitHub (ex. déployée comme fonction serverless Vercel) pour authentifier les éditeurs — voir la [doc Decap CMS sur le backend GitHub](https://decapcms.org/docs/github-backend/).

### 4. Animations au scroll (Framer Motion)

```tsx
// src/components/react/ScrollReveal.tsx
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function ScrollReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

```astro
---
// src/pages/index.astro
import ScrollReveal from "../components/react/ScrollReveal.tsx";
---
<ScrollReveal client:visible>
  <h2 class="font-serif text-brun text-3xl">Mes services</h2>
</ScrollReveal>
```

### 5. Déploiement sur Vercel

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/static";

export default defineConfig({
  integrations: [tailwind(), react()],
  output: "static",
  adapter: vercel(),
});
```

1. Pousser le dépôt sur GitHub (déjà fait : `Mazztok45/Flore-Azzouz-WebPage`).
2. Importer le dépôt sur [vercel.com](https://vercel.com) — le framework Astro est détecté automatiquement.
3. Configurer les variables d'environnement de l'application OAuth GitHub (si Decap CMS est activé).
4. Déployer — chaque push sur `main` redéploie automatiquement.

## Scripts

```bash
npm run dev        # serveur local
npm run build      # build de production
npm run preview    # prévisualisation du build
```

## Licence

BSD 2-Clause — voir [LICENSE](./LICENSE).
