'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import { Transition, TransitionStatus } from 'react-transition-group';

interface OverlayProps {
    open: boolean;
    handleClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ open, handleClose }) => {
    const duration = 300;

    const defaultStyle = {
        transition: `transform ${duration}ms ease-in-out`,
        transform: 'translateY(-100%)',
    };

    const transitionStyles: { [id in TransitionStatus]?: any } = {
        entering: { transform: 'translateY(-100%)' },
        entered: { transform: 'translateY(0)' },
        exiting: { transform: 'translateY(-100%)' },
        exited: { transform: 'translateY(-100%)' },
    };

    return (
        <Transition in={open} timeout={duration}>
            {(state: TransitionStatus) => (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50"
                    style={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                    }}
                >
                    <Box
                        className="fixed inset-0 bg-white z-50"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            p: 2,
                            pt: 8,
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box component="nav" className="bg-red">
                            <ul>
                                <li
                                    className="mb-3 text-center text-xl w-full"
                                    onClick={() => handleClose()}
                                >
                                    <Link href="/plan">My Plan</Link>
                                </li>
                                <li
                                    className="mb-3 text-center text-xl w-full"
                                    onClick={() => handleClose()}
                                >
                                    <Link href="/invite">
                                        Delegate Permissions
                                    </Link>
                                </li>
                                <li
                                    className="mb-3 text-center text-xl w-full"
                                    onClick={() => handleClose()}
                                >
                                    <Link href="/access">Control Access</Link>
                                </li>
                            </ul>
                        </Box>
                    </Box>
                </div>
            )}
        </Transition>
    );
};

const Menu: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <div>
            <Overlay open={open} handleClose={handleClose} />
            <div className="block lg:hidden">
                <button
                    onClick={handleOpen}
                    className="flex items-center px-3 py-2 border rounded"
                >
                    <svg
                        className="fill-current h-3 w-3"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Menu</title>
                        <path
                            d="M0 0h20v20H0V0zm2 9h16v2H2V9zm0-4h16v2H2V5zm0 8h16v2H2v-2z"
                            fillRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Menu;
