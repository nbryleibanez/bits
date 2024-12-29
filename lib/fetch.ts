import { verifyToken } from "@/utils/auth/tokens";

export async function getHabit(cookies: any, id: string, type: string) {
  const response = await fetch(
    `${process.env.SITE}/api/habits/${id}?type=${type}`,
    {
      method: "GET",
      cache: "force-cache",
      headers: {
        Cookie: cookies,
        "Content-Type": "application/json",
      },
      next: {
        tags: [`habit/${id}`],
        revalidate: 1800,
      },
    },
  ).then((res) => res.json());

  return response;
}

// export async function getHabits(cookies: any) {
//   const { data } = await fetch(`${process.env.SITE}/api/habits`, {
//     method: "GET",
//     cache: "force-cache",
//     headers: {
//       Cookie: cookies.toString(),
//       "Content-Type": "application/json",
//     },
//     next: {
//       tags: ["habits"],
//       revalidate: 1800,
//     },
//   }).then((res) => res.json());
//
//   return data;
// }

export async function getHabitsByUserId(cookies: any, id: string) {
  const { data } = await fetch(`${process.env.SITE}/api/habits?id=${id}`, {
    method: "GET",
    cache: "force-cache",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
    next: {
      tags: [`user/${id}/habits`],
      revalidate: 1800,
    },
  }).then((res) => res.json());

  return data;
}

export async function getHabitRequestsByUserId(cookies: any) {
  const { data } = await fetch(`${process.env.SITE}/api/habits/requests`, {
    method: "GET",
    cache: "force-cache",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
    next: { tags: ["habitRequests"] },
  }).then((res) => res.json());

  return data;
}

// --------------------------------------------USER-----------------------------------------------

export async function getUserMe(cookies: any) {
  const idToken = cookies.get("id_token").value;
  const idTokenPayload = await verifyToken(idToken, "id");
  const username = idTokenPayload?.["custom:username"];

  const { data } = await fetch(`${process.env.SITE}/api/users/me`, {
    method: "GET",
    cache: "force-cache",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
    next: { tags: [`user/${username}`] },
  }).then((res) => res.json());

  return data;
}

export async function getUserByUsername(cookies: any, username: string) {
  const res = await fetch(
    `${process.env.SITE}/api/users/search?q=${username}`,
    {
      method: "GET",
      cache: "force-cache",
      headers: {
        Cookie: cookies.toString(),
        "Content-Type": "application/json",
      },
      next: { tags: [`user/${username}`] },
    },
  );

  if (res.status === 404) return null;
  const { data } = await res.json();

  return data;
}
