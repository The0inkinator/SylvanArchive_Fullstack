import { Title } from "solid-start";
import { HttpStatusCode } from "solid-start/server";
import FrontPageHeader from "../../components/layoutComponents/frontPageHeader/FrontPageHeader";
import styles from "../../layouts/404.module.css";

export default function NotFound() {
  return (
    <main>
      <Title>Error</Title>
      <HttpStatusCode code={404} />
      <FrontPageHeader />
      <div class={styles.wrapper}>
        <div class={styles.errorCode}>404</div>
      </div>
    </main>
  );
}
