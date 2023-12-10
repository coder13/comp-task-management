import { Container } from '@/components/Container';
import { ImportCompetitionDialog } from '@/components/ImportCompetitionDialog';
import { UserCompetitionList } from '@/containers/UserCompetitionList';

export default async function Competitions() {
  return (
    <Container className="mt-12">
      <div className="p-2">
        <h2 className="text-2xl">Competitions</h2>
        <UserCompetitionList />
      </div>
      <hr />
      <div className="p-2">
        <ImportCompetitionDialog />
      </div>
    </Container>
  );
}
