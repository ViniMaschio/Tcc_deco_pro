import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  return <div>Dashboard</div>;
};

export default Page;
