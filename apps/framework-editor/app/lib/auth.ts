import { db } from '@comp/db';
import { env } from '@/env.mjs';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { ac, admin, auditor, employee, owner } from './permissions';

if (!process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET is not defined');
}

if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
  throw new Error('AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET is not defined');
}

const socialProviders = {
  google: {
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  },
  microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
      tenantId: process.env.MICROSOFT_TENANT_ID as string,
    },
};

console.log('Social providers configured:', Object.keys(socialProviders).join(', '));

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  trustedOrigins: ['https://comp.corumdigital.com', 'https://compadmin.corumdigital.com', 'https://compedit.corumdigital.com'],
  advanced: {
    database: {
      // This will enable us to fall back to DB for ID generation.
      // It's important so we can use custom IDs specified in Prisma Schema.
      generateId: false,
    },
  },
  secret: process.env.AUTH_SECRET!,
  plugins: [
    nextCookies(),
    organization({
      ac,
      roles: {
        owner,
        admin,
        auditor,
        employee,
      },
      schema: {
        organization: {
          modelName: 'Organization',
        },
      },
    }),
  ],
  socialProviders,
  user: {
    modelName: 'User',
  },
  organization: {
    modelName: 'Organization',
  },
  member: {
    modelName: 'Member',
  },
  invitation: {
    modelName: 'Invitation',
  },
  session: {
    modelName: 'Session',
  },
  account: {
    modelName: 'Account',
  },
  verification: {
    modelName: 'Verification',
  },
});

export type Session = typeof auth.$Infer.Session;
