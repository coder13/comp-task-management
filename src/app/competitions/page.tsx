import { ImportCompetitionDialog } from '@/components/ImportCompetitionDialog';
import { UserCompetitionList } from '@/containers/UserCompetitionList';

export default async function Competitions() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="p-2 w-4/5">
        <div className="p-2">
          <h2 className="text-2xl">Competitions</h2>
          <UserCompetitionList />
        </div>
        <hr />
        <div className="p-2">
          <ImportCompetitionDialog />
        </div>
      </div>
    </div>
  );
}
