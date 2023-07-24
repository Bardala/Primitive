import { SignUpReq, SignUpRes, WithError } from "@nest/shared";

export class ApiError extends Error {
  public status: number;

  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
  }
}

export const signUp = async (req: SignUpReq): Promise<void> => {
  const res = await fetch("http://localhost:4001/api/v0/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });
  const token: WithError<SignUpRes> = await res.json();

  if (res.ok) {
    localStorage.setItem("token", JSON.stringify(token));
  } else {
    throw new ApiError(res.status, token.error);
  }
};

export const logOut = async (): Promise<void> => {
  localStorage.removeItem("token");
  // you can't use useAuthContext here
  // so you have to refresh the user in tsx file

  //! const { refetchCurrUser } = useAuthContext();
  //! refetchCurrUser();
};
