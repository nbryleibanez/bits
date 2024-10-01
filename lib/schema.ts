import { z } from 'zod';

export const userSchema = z.object({
  user_id: z.string().uuid(), // Partition Key
  username: z.string(), // GSI Partition Key
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string(),
  sex: z.enum(['male', 'female']),
  age: z.number(),
  avatar_url: z.string().url(),
  created_date: z.string().datetime(),
  habits: z.array(z.object({
    habit_id: z.string().uuid(),
    habit_type: z.enum(['basic', 'cue', 'duo']),
  })),
  habits_requests: z.array(z.object({
    habit_id: z.string().uuid(),
    habit_type: z.enum(['basic', 'cue', 'duo']),
  })),
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
  habit_id: z.string().ulid(), // Partition Key
  habit_type: z.enum(['basic', 'cue', 'duo']), // Sort Key
  owner: z.string().uuid(),
  title: z.string(),
  streak: z.number(),
  created_date: z.string().datetime(),
  participants: z.array(z.object({
    user_id: z.string(),
    full_name: z.string(),
    avatar_url: z.string().url(),
    role: z.enum(['owner', 'participant']),
    is_logged: z.boolean(),
  })),
});
