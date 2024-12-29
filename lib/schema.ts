import { z } from "zod";

export const userSchema = z.object({
  user_id: z.string().uuid(), // Partition Key
  username: z.string(), // GSI Partition Key
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string(),
  sex: z.enum(["Male", "Female"]),
  birth_date: z.string().date(),
  avatar_url: z.string().url(),
  created_date: z.string().datetime(),
  habits: z.array(
    z.object({
      habit_id: z.string().uuid(),
      habit_type: z.enum(["basic", "cue", "duo"]),
      title: z.string(),
    }),
  ),
  habits_requests: z.array(
    z.object({
      habit_id: z.string().uuid(),
      habit_type: z.enum(["basic", "cue", "duo"]),
      title: z.string(),
      duo_id: z.string().uuid(),
      duo_username: z.string(),
      duo_name: z.string(),
      duo_avatar_url: z.string().url(),
    }),
  ),
  friends: z.array(
    z.object({
      user_id: z.string(),
      username: z.string(),
      full_name: z.string(),
      avatar_url: z.string().url(),
      created_date: z.string().datetime(),
    }),
  ),
  friend_requests: z.array(
    z.object({
      user_id: z.string(),
      username: z.string(),
      full_name: z.string(),
      avatar_url: z.string().url(),
      created_date: z.string().datetime(),
    }),
  ),
});

export const habitSchema = z.object({
  habit_id: z.string().ulid(), // Partition Key
  habit_type: z.enum(["basic", "cue", "duo"]), // Sort Key
  owner: z.string().uuid(),
  title: z.string(),
  cue: z.string().optional(),
  streak: z.number(),
  created_date: z.string().datetime(),
  participants: z.array(
    z.object({
      user_id: z.string(),
      full_name: z.string(),
      avatar_url: z.string().url(),
      role: z.enum(["owner", "participant"]),
      is_logged: z.boolean(),
    }),
  ),
});
