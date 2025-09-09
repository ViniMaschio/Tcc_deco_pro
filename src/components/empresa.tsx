import { useSession } from "next-auth/react";
import React from "react";

const Empresa = () => {
  const { data: session } = useSession();

  return <pre>{JSON.stringify(session)}</pre>;
};

export default Empresa;
