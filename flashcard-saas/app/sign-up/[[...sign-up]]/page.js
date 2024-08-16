'use client'; // Add this directive at the top of the file

import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { keyframes } from '@emotion/react';

export default function SignUpPage() {
    // Define the keyframes for the navbar color animation
    const colorAnimation = keyframes`
        0% { background-color: #6a1b9a; }
        50% { background-color: #c2185b; }
        100% { background-color: #6a1b9a; }
    `;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'url(/1.png)', // Replace with your image path
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: 2,
            }}
        >
            {/* 3D Navbar with Color Shifting */}
            <AppBar
                position="static"
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                    marginBottom: 4,
                    borderRadius: '8px',
                    transform: 'translateZ(0)',
                    backdropFilter: 'blur(10px)', // Blur effect on the navbar
                    animation: `${colorAnimation} 5s infinite ease-in-out`, // Apply color animation
                    backgroundColor: '#6a1b9a', // Default background color in case animation doesn't load
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h4"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            color: '#ffffff',
                            fontFamily: 'Poppins, sans-serif',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                        }}
                    >
                        Flashcard SaaS
                    </Typography>
                    <Button
                        sx={{
                            color: '#ffffff',
                            fontWeight: 'bold',
                            borderRadius: '20px',
                            transition: 'all 0.3s ease',
                            fontFamily: 'Poppins, sans-serif',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            '&:hover': {
                                backgroundColor: '#283593',
                                boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        <Link href="/sign-in" passHref>
                            Login
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>

            {/* 3D Sign-Up Box */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '500px',
                    textAlign: 'center',
                    padding: '40px',
                    background: 'rgba(255, 255, 255, 0.85)', // Semi-transparent background
                    backdropFilter: 'blur(10px)', // Blur effect on the sign-up box
                    borderRadius: '8px',
                    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.4)',
                    transform: 'translateZ(0)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.5)',
                    },
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        fontFamily: 'Poppins, sans-serif',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                        color: '#3f51b5',
                    }}
                >
                    Sign Up
                </Typography>
                <SignUp />
            </Box>
        </Box>
    );
}
