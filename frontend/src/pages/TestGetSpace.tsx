import { useAuthContext } from "../context/AuthContext";
import { ApiError } from "../fetch/auth";
import { HOST, SpaceRes, WithError } from "@nest/shared";
import { useQuery } from "@tanstack/react-query";

const getSpace = async (token: string): Promise<WithError<SpaceRes>> => {
  const res = await fetch(`${HOST}/space/1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json: WithError<SpaceRes> = await res.json();

  if (!res.ok) {
    // throw new Error(res.statusText);
    throw new ApiError(res.status, json.error);
  }

  return json;
};

export const TestGetSpace = () => {
  const { currUser } = useAuthContext();
  // get space
  const spaceQuery = useQuery({
    queryKey: ["getSpace", 1],
    queryFn: () => getSpace(currUser?.jwt || ""),
    enabled: !!currUser,
  });

  const space = spaceQuery.data?.space;

  if (spaceQuery.isLoading) return <div>Loading...</div>;
  if (spaceQuery.error) {
    return <div>{JSON.stringify(spaceQuery.error)}</div>;
  }

  return (
    <>
      <div>Hello</div>
      {space && <div>{space.name}</div>}
    </>
  );
};
