export async function getHabitsByUserId(cookies: any) {
  const { data } = await fetch(`${process.env.SITE}/api/habits`, {
    method: 'GET',
    headers: {
      "Cookie": cookies.toString(),
      "Content-Type": "application/json",
    },
    next: { tags: ["habits"] }
  }).then(res => res.json())

  return data;
}

export async function getHabitRequestsByUserId(cookies: any) {
  const { data } = await fetch(`${process.env.SITE}/api/habits/requests`, {
    method: 'GET',
    headers: {
      "Cookie": cookies.toString(),
      "Content-Type": "application/json",
    },
  }).then(res => res.json())

  return data;
}

export async function getHabit(cookies: any, id: string, type: string) {
  const response = await fetch(`${process.env.SITE}/api/habits/${id}?type=${type}`, {
    method: "GET",
    headers: {
      "Cookie": cookies,
      "Content-Type": "application/json",
    },
  }).then(res => res.json())

  return response;
}
