import { env } from '@/env.mjs';
import { db } from '@comp/db';
import { MagicLinkEmail, OTPVerificationEmail } from '@comp/email';
import { sendInviteMemberEmail } from '@comp/email/lib/invite-member';
import { sendEmail } from '@comp/email/lib/resend';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP, magicLink, organization } from 'better-auth/plugins';
import { ac, allRoles } from './permissions';

let socialProviders = {};

if (env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET) {
  socialProviders = {
    ...socialProviders,
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  };
}

if (env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET) {
  socialProviders = {
    ...socialProviders,
    github: {
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  };
}

if (env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET) {
  socialProviders = {
    ...socialProviders,
    microsoft: {
      clientId: env.MICROSOFT_CLIENT_ID as string,
      clientSecret: env.MICROSOFT_CLIENT_SECRET as string,
      tenantId: env.MICROSOFT_TENANT_ID as string,
    },
  };
}


export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  //trustedOrigins: ['http://localhost:3000', 'https://comp.corumdigital.com', 'https://compadmin.corumdigital.com'],
  trustedOrigins: ['https://comp.corumdigital.com', 'https://compadmin.corumdigital.com'],
  advanced: {
    database: {
      // This will enable us to fall back to DB for ID generation.
      // It's important so we can use custom IDs specified in Prisma Schema.
      generateId: false,
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Get the user's most recent organization
          const userOrg = await db.organization.findFirst({
            where: {
              members: {
                some: {
                  userId: session.userId,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          // Set the active organization if user has one
          if (userOrg) {
            return {
              data: {
                ...session,
                activeOrganizationId: userOrg.id,
              },
            };
          }

          return {
            data: session,
          };
        },
      },
    },
  },
  secret: process.env.AUTH_SECRET!,
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const domain = 'compadmin.corumdigital.com';
        const inviteLink = `https://${domain}/invite/${data.invitation.id}`;

        const url = `https://${domain}/auth`;

        await sendInviteMemberEmail({
          email: data.email,
          inviteLink,
          organizationName: data.organization.name,
        });
      },
      ac,
      roles: allRoles,
      schema: {
        organization: {
          modelName: 'Organization',
        },
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }, request) => {
        const urlWithInviteCode = `${url}`;
        await sendEmail({
          to: email,
          subject: 'Login to Comp AI',
          react: MagicLinkEmail({
            email,
            url: urlWithInviteCode,
          }),
        });
      },
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60,
      async sendVerificationOTP({ email, otp }) {
        await sendEmail({
          to: email,
          subject: 'One-Time Password for Comp AI',
          react: OTPVerificationEmail({ email, otp }),
        });
      },
    }),
    nextCookies(),
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
export type ActiveOrganization = typeof auth.$Infer.ActiveOrganization;
export type Member = typeof auth.$Infer.Member;
export type Organization = typeof auth.$Infer.Organization;
export type Invitation = typeof auth.$Infer.Invitation;
export type Role = typeof auth.$Infer.Member.role;
