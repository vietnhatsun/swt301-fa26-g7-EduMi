import LandingNavbarClient from "@/components/landing/LandingNavbarClient";
import { getNavbarUser } from "@/server/auth/navbar-user";

export default async function LandingNavbar() {
  const user = await getNavbarUser();

  return <LandingNavbarClient initialUser={user} />;
}