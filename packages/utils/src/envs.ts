export function getAppUrl() {
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return 'https://compadmin.corumdigital.com';
  }

  if (process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

export function getEmailUrl() {
  return 'https://trycomp.ai';
}

export function getWebsiteUrl() {
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return 'https://compadmin.corumdigital.com';
  }

  if (process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

export function getCdnUrl() {
  return 'https://cdn.trycomp.ai';
}
