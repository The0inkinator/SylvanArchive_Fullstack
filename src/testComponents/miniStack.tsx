import { createSignal } from "solid-js";

interface stackNameInput {
  stackName: string;
}

export default function MiniStack({ stackName }: stackNameInput) {
  const [blue, setBlue] = createSignal<boolean>(false);

  return (
    <div
      onclick={() => {
        setBlue(true);
      }}
      style={{
        width: "2rem",
        height: "2rem",
        "background-color": blue() ? "blue" : "red",
        color: "white",
      }}
    >
      {stackName}
    </div>
  );
}
