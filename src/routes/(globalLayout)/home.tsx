import { onMount } from "solid-js";
import FrontPageHeader from "../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import ShelfScene from "../../components/shelfSystem/shelfScene/ShelfScene";
import styles from "../../layouts/testStyles.module.css";
import { Outlet } from "solid-start";

export default function Home() {
  return (
    <>
      <Outlet />
    </>
  );
}
