# hello-svedit

This is the official bare-bones "Getting started" example for [Svedit](https://github.com/michael/svedit).

## Developing

Clone the repository:

```sh
git clone https://github.com/michael/hello-svedit.git
cd hello-svedit
```

Install the dependencies with `npm install` and start the development server:

```sh
npm run dev
```

Now make it your own. The next thing you probably want to do is define your own [node types](https://github.com/michael/svedit/blob/main/src/routes/create_demo_doc.js), add a [Toolbar](https://github.com/michael/svedit/blob/main/src/routes/components/Toolbar.svelte), and render custom [Overlays](https://github.com/michael/svedit/blob/main/src/routes/components/Overlays.svelte). For that just get inspired by the [Svedit demo code](https://github.com/michael/svedit/blob/main/src/routes).

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
