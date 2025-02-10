const { SITE } = process.env;

export async function getHabit(cookies: any, id: string, type: string) {
  const response = await fetch(`${SITE}/api/habits/${id}?type=${type}`, {
    method: "GET",
    headers: {
      Cookie: cookies,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return response;
}

export async function getHabitsByUserId(cookies: any, id: string) {
  const { data } = await fetch(`${SITE}/api/habits?id=${id}`, {
    method: "GET",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return data;
}

// --------------------------------------------HABIT REQUEST-----------------------------------------------

export async function getHabitRequestById(
  cookies: any,
  id: string,
): Promise<any> {
  const { data } = await fetch(`${SITE}/api/habits/requests/${id}`, {
    method: "GET",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return data;
}

export async function getHabitRequestsByUserId(cookies: any, id: string) {
  const { data } = await fetch(`${SITE}/api/habits/requests?id=${id}`, {
    method: "GET",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return data;
}

// --------------------------------------------USER-----------------------------------------------

export async function getUserMe(cookies: any) {
  const { data } = await fetch(`${SITE}/api/users/me`, {
    method: "GET",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return data;
}

export async function getUserByUsername(cookies: any, username: string) {
  const res = await fetch(`${SITE}/api/users/search?q=${username}`, {
    method: "GET",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
  });

  if (res.status === 404) return null;
  const { data } = await res.json();

  return data;
}

export async function getUserById(cookies: any, userId: string) {
  const res = await fetch(`${SITE}/api/users/${userId}`, {
    method: "GET",
    headers: {
      Cookie: cookies.toString(),
      "Content-Type": "application/json",
    },
  });

  if (res.status === 404) return null;
  const { data } = await res.json();

  return data;
}
