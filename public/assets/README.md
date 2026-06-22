# Portfolio Asset Library

This directory reserves the media structure for portfolio projects.

Use the same project slug as `src/data/site.ts`.

```txt
public/assets/
  games/
    mulan/
      cover/
      gallery/
      videos/
      thumbnails/
  uiux/
  visual/
  ai-films/
```

Recommended conventions:

- `cover/`: primary card cover and optional full-screen banner media
- `cover/banner/`: full-screen hero or project banner media
- `gallery/`: detail page images and GIFs
- `videos/`: MP4, WebM, or embedded-video poster assets
- `thumbnails/`: lightweight thumbnails for grids, carousels, and previews

Current rendering intentionally keeps placeholder visuals. The project data already exposes normalized `assets` paths so real media can be wired in later without changing routes.
