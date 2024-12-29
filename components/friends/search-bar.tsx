"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDebounce } from "@/utils/use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  user_id: { S: string };
  username: { S: string };
  full_name: { S: string };
  avatar_url: { S: string };
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [noUserFound, setNoUserFound] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedQuery.length === 0) {
        setSearchResult(null);
        setNoUserFound(false);
        return;
      }

      try {
        const res = await fetch(
          `${window.location.origin}/api/users/search?q=${encodeURIComponent(debouncedQuery)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (res.status === 404) {
          setSearchResult(null);
          setNoUserFound(true);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const { data } = await res.json();
        setSearchResult(data);
        setNoUserFound(false);
      } catch (error) {
        console.error("Error searching user:", error);
        setSearchResult(null);
        setNoUserFound(false);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="h-12 pl-9 pr-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {query.length > 0 && (searchResult || noUserFound) && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {noUserFound ? (
            <li className="relative cursor-default select-none py-2 pl-4 pr-9 text-gray-900">
              No user found
            </li>
          ) : searchResult ? (
            <li
              key={searchResult.user_id.S}
              className="relative cursor-default select-none py-2 pl-4 pr-9 text-gray-900 hover:bg-gray-100"
            >
              <Link
                href={`/user/${searchResult.username.S}`}
                className="block flex gap-4 items-center"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={searchResult.avatar_url.S} />
                  <AvatarFallback>{searchResult.full_name.S[0]}</AvatarFallback>
                </Avatar>
                {searchResult.full_name.S}
              </Link>
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}
