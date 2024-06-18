import React from 'react';
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';

import './globals.css';

import { UserContextProvider } from '@/contexts/UserContext';
import AbilityLoader from '@/utils/AbilityLoader';
import Menu from '@/components/menu/Menu';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
    title: 'Galactic Health Corporation',
    description: 'Demonstrate Permit.io authorization flow',
};

interface Plan {
    id: string;
    name: string;
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <UserContextProvider>
                <AbilityLoader />
                <html lang="en">
                    <body className={inter.className}>
                        <SignedIn>
                            <nav className="w-full" style={{direction: 'rtl'}}>
                                <div className="flex items-center justify-between pr-10 pl-10 lg:pl-0">
                                    <div className="flex items-center flex-col flex-shrink-0 text-sky-600 py-2">
                                        <Image src="/maccabi.svg" width={130} height={130} alt="logo" />
                                    </div>

                                    <div className="block lg:hidden">
                                        <Menu />
                                    </div>

                                    <div className="hidden lg:flex lg:items-center lg:w-auto mr-12 pl-10">
                                        <div className="text-sm lg:flex-grow font-semibold flex items-center">
                                            <Link
                                                href="/plan"
                                                className="block mt-4 lg:inline-block lg:mt-0 text-black ml-8"
                                            >
                                                התיק הרפואי שלי
                                            </Link>
                                            <Link
                                                href="/invite"
                                                className="block mt-4 lg:inline-block lg:mt-0 text-black ml-8"
                                            >
                                                ממשק ההרשאות
                                            </Link>
                                            <Link
                                                href="/access"
                                                className="block mt-4 lg:inline-block lg:mt-0 text-black ml-8"
                                            >
                                                בקרת גישה
                                            </Link>
                                        </div>
                                        <div>
                                            <UserButton afterSignOutUrl="/" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-3 bg-sky-700"></div>
                            </nav>
                        </SignedIn>
                        {children}
                    </body>
                </html>
            </UserContextProvider>
        </ClerkProvider>
    );
}
