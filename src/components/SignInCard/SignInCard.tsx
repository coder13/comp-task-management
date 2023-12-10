import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';

export const SignInCard = () => (
  <Card className="">
    <CardHeader className="text-2xl">Sign-in</CardHeader>
    <CardContent className="w-96">
      Log in through your WCA account to start managing your competitions
    </CardContent>
    <CardFooter className="w-full flex">
      <Link href="/api/auth/sign-in" passHref className="w-full">
        <Button className="w-full">Sign-in with WCA</Button>
      </Link>
    </CardFooter>
  </Card>
);
