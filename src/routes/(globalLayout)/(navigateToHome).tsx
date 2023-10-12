import FrontPageHeader from "../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import ShelfScene from "../../components/shelfSystem/shelfScene/ShelfScene";
import { Navigate } from "solid-start";

export default function Home() {
  return <Navigate href="/home/start" />;
}
