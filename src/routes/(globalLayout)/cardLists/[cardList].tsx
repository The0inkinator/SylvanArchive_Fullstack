import { useParams } from "solid-start";
import FrontPageHeader from "../../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import cardListFetcher from "../../../components/cardListPage/cardListFetcher";
import CardListScene from "~/components/cardListPage/cardListScene/CardListScene";
import { createRouteAction } from "solid-start";

export default function cardListPage() {
  const [echoing, echo] = createRouteAction(async (message: string) => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    console.log(message);
    return message;
  });

  const pathInput = useParams();
  cardListFetcher(`${pathInput.cardList}`);

  return (
    <>
      <FrontPageHeader />
      <CardListScene />
    </>
  );
}
