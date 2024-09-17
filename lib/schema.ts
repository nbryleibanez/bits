import { z } from 'zod';

export const userSchema = z.object({
  user_id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string(),
  avatar_url: z.string().url(),
  created_date: z.string().datetime(),
  friends: z.array(z.object({
    user_id: z.string(),
    username: z.string(),
    full_name: z.string(),
    avatar_url: z.string().url(),
    created_date: z.string().datetime(),
  })),
  friend_requests: z.array(z.object({
    user_id: z.string(),
    username: z.string(),
    full_name: z.string(),
    avatar_url: z.string().url(),
    created_date: z.string().datetime(),
  })),
})

export const habitSchema = z.object({
  habit_id: z.string().ulid(),
  user_id: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  streak: z.number(),
  created_date: z.string().datetime(),
  participants: z.array(z.object({
    user_id: z.string(),
    username: z.string(),
    full_name: z.string(),
    avatar_url: z.string().url(),
    role: z.enum(['owner', 'participant']),
    is_logged: z.boolean(),
  })),
});
