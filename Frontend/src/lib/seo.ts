export const SITE_URL = 'https://pdfmmingle.net';

export const buildCanonical = (path: string) => {
  if (!path) return SITE_URL;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

export const buildOgImage = (path = '/og-image.png') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

export const aiMetaSummary = (title: string, description: string) =>
  `${title} — ${description}`;
