import { onMount } from "solid-js";
import FrontPageHeader from "../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import { Outlet } from "solid-start";

export default function Home() {
  return (
    <>
      <Outlet />
    </>
  );
}
