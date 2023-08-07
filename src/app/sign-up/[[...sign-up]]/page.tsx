import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return <div className="grid h-screen place-items-center">
    <SignUp redirectUrl={'/welcome'} />
  </div>;
}
