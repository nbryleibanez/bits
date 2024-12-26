export async function getHabitsByUserId(cookies: any) {
  const { data } = await fetch(`${process.env.SITE}/api/habits`, {
    method: "GET",
    cache: "force-cache",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
    next: {
      tags: ["habits"],
      revalidate: 1800,
    },
  }).then((res) => res.json());

  return data;
}

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
  const { data } = await fetch(`${process.env.SITE}/api/users/me`, {
    method: "GET",
    cache: "force-cache",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
    next: { tags: ["users/me"] },
  }).then((res) => res.json());

  return data;
}
