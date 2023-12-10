import { Container } from '@/components/Container';
import { CreateTeamForm } from './create-team-form';

export default function Page() {
  return (
    <Container className="mt-12 space-y-8">
      <div>
        <h1 className="text-2xl">Create Team</h1>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Teams help you manage your competitions.
          </p>
          <p className="text-sm text-muted-foreground">
            Once set up, you can connect &quot;org users&quot; from the WCA to
            your team, enabling you to monitor all competitions where they are
            designated as organizers.
          </p>
        </div>
      </div>
      <CreateTeamForm />
    </Container>
  );
}
