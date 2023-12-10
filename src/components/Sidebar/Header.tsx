import { UserDropdownMenu } from '@/components/UserDropdownMenu';

export default function Header() {
  return (
    <div className="w-full flex p-4">
      <UserDropdownMenu />
    </div>
  );
}
