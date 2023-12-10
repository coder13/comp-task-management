import { getUser } from '@/helpers/user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { getTeamsForUser } from '@/controllers';
import Link from 'next/link';

const nameToInitials = (name: string) => {
  const split = name.split(' ');
  const initials = split.map((name) => name[0]);
  return initials[0] + initials[initials.length - 1];
};

export async function UserDropdownMenu() {
  const user = await getUser();
  const teams = user?.id ? await getTeamsForUser(user?.id) : [];

  const initials = nameToInitials(user?.name || '');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full space-x-2 p-4 w-full flex justify-start"
        >
          <Avatar>
            <AvatarImage src={user?.avatar.url} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{user?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>Profile</DropdownMenuItem>
          <DropdownMenuItem disabled>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Teams</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`} passHref>
              <DropdownMenuItem>{team.name}</DropdownMenuItem>
            </Link>
          ))}
          <Link href="/teams/new" passHref>
            <DropdownMenuItem>Create Team</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
