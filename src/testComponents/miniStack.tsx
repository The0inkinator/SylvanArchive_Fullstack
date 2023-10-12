interface stackNameInput {
  stackName: string;
}

export default function MiniStack({ stackName }: stackNameInput) {
  return (
    <div
      style={{
        width: "2rem",
        height: "2rem",
        "background-color": "red",
        color: "white",
      }}
    >
      {stackName}
    </div>
  );
}
