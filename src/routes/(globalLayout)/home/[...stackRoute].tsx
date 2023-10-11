import styles from "../../../layouts/testStyles.module.css";
import { useParams } from "@solidjs/router";

export default function stackRoute() {
  const params = useParams();
  console.log(params.stackRoute);

  return (
    <>
      <div class={styles.textCont}>
        <div class={styles.text}>{params.stackRoute} HELLO!</div>
      </div>
    </>
  );
}
