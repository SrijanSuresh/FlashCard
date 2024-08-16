'use client'
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import {
  Container,
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Grid,
  CircularProgress,
} from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { keyframes } from '@emotion/react';
import getStripe from '@/utils/get_stripe';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }
  
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
  
    if (error) {
      console.warn(error.message);
    }
  }
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxStyles = {
    transform: `translateY(${scrollY * 0.5}px)`,
  };

  // Define the keyframes for the pulse animation
  const pulseAnimation = keyframes`
    0% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.6; transform: scale(1); }
  `;

  // Define the keyframes for the navbar color animation
  const colorAnimation = keyframes`
    0% { background-color: #6a1b9a; }
    50% { background-color: #c2185b; }
    100% { background-color: #6a1b9a; }
  `;

  return (
    <Box sx={{ 
        minHeight: '100vh', 
        width: '100vw', 
        overflow: 'hidden', 
        position: 'relative', 
        backgroundImage: 'url(/ohyea.png)', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Flashcard SaaS" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* 3D Navbar */}
      <AppBar
        position="static"
        sx={{
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
          animation: `${colorAnimation} 5s infinite ease-in-out`,
          transform: 'translateZ(0)',
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
          <SignedOut>
            <Button
              sx={{
                color: '#ffffff',
                fontWeight: 'bold',
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#6a1b9a',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
              href="/sign-in"
            >
              Login
            </Button>
            <Button
              sx={{
                color: '#ffffff',
                fontWeight: 'bold',
                borderRadius: '20px',
                ml: 2,
                transition: 'all 0.3s ease',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#6a1b9a',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
              href="/sign-up"
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* 3D Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          my: 4,
          py: 8,
          background: 'rgba(0, 0, 0, 0.5)', // Dark overlay with reduced opacity
          backdropFilter: 'blur(10px)', // Apply blur effect
          borderRadius: 3,
          color: '#ffffff',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
          transform: 'translateZ(0)',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            animation: 'fadeIn 2s',
            fontFamily: 'Poppins, sans-serif',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
          }}
        >
          Welcome to Flashcard SaaS
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            mb: 4,
            animation: 'fadeIn 2s',
            fontFamily: 'Poppins, sans-serif',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)',
          }}
        >
          The easiest way to create flashcards from your text.
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            mr: 2,
            py: 1.5,
            px: 4,
            borderRadius: 20,
            backgroundColor: '#6a1b9a',
            color: '#ffffff',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Poppins, sans-serif',
            '&:hover': {
              backgroundColor: '#c2185b',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
              transform: 'translateY(-3px)',
            },
            transition: 'all 0.3s ease',
            animation: 'fadeIn 2s',
          }}
          href="/generate"
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            py: 1.5,
            px: 4,
            borderRadius: 20,
            borderColor: '#ffffff',
            color: '#ffffff',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Poppins, sans-serif',
            '&:hover': {
              backgroundColor: '#ffffff',
              color: '#c2185b',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
              transform: 'translateY(-3px)',
            },
            transition: 'all 0.3s ease',
            animation: 'fadeIn 2s',
          }}
        >
          Learn More
        </Button>
      </Box>

      {/* Remove Pulsing Circles */}

      {/* 3D Features Section */}
      <Box sx={{ my: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold',
            color: '#8e24aa',
            fontFamily: 'Poppins, sans-serif',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
          }}
        >
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 4,
                border: '2px solid',
                borderColor: '#e91e63',
                borderRadius: 3,
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                textAlign: 'center',
                background: 'linear-gradient(120deg, #ba68c8 0%, #e57373 100%)',
                color: '#ffffff',
                transform: 'translateZ(0)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.5)',
                },
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}
              >
                Feature 1
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Example Feature
              </Typography>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Description here
              </Typography>
            </Box>
          </Grid>
          {/* Add more feature cards as needed */}
        </Grid>
      </Box>

      {/* 3D Pricing Section */}
      <Box sx={{ my: 5, textAlign: 'center' }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#d81b60',
            fontFamily: 'Poppins, sans-serif',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
          }}
        >
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={5} sx={{ my: 4 }}>
            <Box
              sx={{
                p: 6,
                borderRadius: 3,
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                backgroundColor: '#8e24aa',
                color: '#ffffff',
                transition: 'transform 0.3s ease',
                transform: 'translateZ(0)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.5)',
                },
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Basic
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontFamily: 'Poppins, sans-serif' }}
              >
                $5 / Month
              </Typography>
              <Typography gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Access to basic Flashcard Features and limited storage.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 20,
                  backgroundColor: '#ffffff',
                  color: '#8e24aa',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    backgroundColor: '#d81b60',
                    color: '#ffffff',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ my: 4 }}>
            <Box
              sx={{
                p: 6,
                borderRadius: 3,
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                backgroundColor: '#d81b60',
                color: '#ffffff',
                transition: 'transform 0.3s ease',
                transform: 'translateZ(0)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.5)',
                },
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Pro
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontFamily: 'Poppins, sans-serif' }}
              >
                $10 / Month
              </Typography>
              <Typography gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Access to all Flashcard Features and unlimited storage.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 20,
                  backgroundColor: '#ffffff',
                  color: '#d81b60',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    backgroundColor: '#8e24aa',
                    color: '#ffffff',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={handleSubmit}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
