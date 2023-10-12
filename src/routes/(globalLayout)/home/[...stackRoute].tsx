import styles from "../../../layouts/testStyles.module.css";
import { useParams } from "@solidjs/router";
import { useStackMapContext } from "../../../context/StackMapContext";
import buildStackMap from "../../../components/shelfSystem/shelfScene/buildStackMap";
import { createEffect } from "solid-js";

export default function stackRoute() {
  buildStackMap();
  const [stackMap]: any = useStackMapContext();
  const params = useParams();
  const route = params.stackRoute.split("/");
  console.log(route);
  createEffect(() => {
    console.log(stackMap());
  });
  return (
    <>
      <div class={styles.textCont}>
        <div class={styles.text}>{params.stackRoute} HELLO!</div>
      </div>
    </>
  );
}
