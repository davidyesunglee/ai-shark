import { Header } from "../Header";

export default function HeaderExample() {
  return (
    <div className="w-full">
      <Header onNewAssessment={() => console.log("New assessment clicked")} />
    </div>
  );
}
