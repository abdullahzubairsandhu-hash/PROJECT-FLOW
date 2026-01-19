// types/user.ts

export interface User {
  id: string;
  clerkUserId: string; // matches Prisma
  clerkId?: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  name: string | null; // convenience property
  createdAt: Date;
  updatedAt: Date;
}
