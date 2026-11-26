# Portfolio

A lightweight static site. Add your HTML, styles, scripts, and other files to
this repository, then reference them from `index.html` using relative paths.

## Run locally

From the repository root, start a local web server:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

## Deploy with Vercel

1. Import this repository in the Vercel dashboard.
2. Select **Other** as the framework preset.
3. Leave the build command and output directory unset so Vercel serves the
   static files from the repository root.
4. Deploy.

The root `index.html` is the entry point for both local hosting and Vercel.
