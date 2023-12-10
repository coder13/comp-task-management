export default function Page({
  params: { competitionId },
}: {
  params: { competitionId: string };
}) {
  return <div className="p-2">{competitionId}</div>;
}
