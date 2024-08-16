'use client';
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Link, Avatar, Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import {useRouter} from 'next/navigation'

const GradientTextStyle = {
  background: 'linear-gradient(90deg, rgba(0,255,255,1) 0%, rgba(0,121,211,1) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center' // Center align text

};

const ParagraphStyle = {
    
  fontSize: '1.5rem', // Adjust size as needed
  fontFamily: 'Arial, sans-serif', // Change to your preferred font
  fontWeight: '400', // Normal weight
  lineHeight: '1.6', // Improve readability
  color: 'white', // Ensure text color contrasts well with the black background
  textAlign: 'center' // Center align text

};

// Define your contributors' data
const contributors = [
  {
    name: 'Srijan Suresh',
    github: 'https://github.com/srijansuresh',
    username: 'srijansuresh'
  },
  {
    name: 'Sri Sirikonda',
    github: 'https://github.com/sripadsirik',
    username: 'sripadsirik'
  },
  {
    name: 'Nathan Thokkudubiyyapu',
    github: 'https://github.com/nathanthokk',
    username: 'nathanthokk'
  },
  // Add more contributors as needed
];

const About = () => {
    const router = useRouter()

const goBack = () => {
    router.push('/')
}   
  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'black', minHeight: '100vh', color: 'white', padding: 4 ,}}>
      <Typography variant="h1" paragraph sx={GradientTextStyle}>
        About this Project
      </Typography>
      <Typography variant="body1" paragraph sx={ParagraphStyle}>
        This project is designed to revolutionize the way you learn and retain information by generating flashcards instantly from any text or topic using advanced AI models.<br></br> With features like Interactive Learning Modes, including Quiz Mode and Spaced Repetition, users can engage with their flashcards in a dynamic and effective way.<br></br> Built with a modern tech stack that includes Next.js, Stripe for secure payments, Material-UI for sleek design, and Google Firebase for backend support, <br></br>this project aims to provide a seamless and enriching learning experience.
        <br></br><Button
                variant="contained"
                sx={{
                  mt: 9,
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
                onClick={goBack}
              >
                go Back
              </Button>
      </Typography>

      <Typography variant="h2" gutterBottom sx={GradientTextStyle}>
        About Us
      </Typography>
      <Typography variant="body1" paragraph sx={ParagraphStyle}>
        We are a team of passionate individuals committed to creating amazing projects and contributing to the open-source community.
      </Typography>
      <Typography variant="h4" gutterBottom>
        Meet the Contributors
      </Typography>
      <Grid container spacing={4}>
        {contributors.map((contributor) => (
          <Grid item xs={12} sm={6} md={4} key={contributor.username}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <CardContent>
                <Avatar
                  alt={contributor.name}
                  src={`https://github.com/${contributor.username}.png?size=200`}
                  sx={{ bgcolor: blue[500], width: 80, height: 80, marginBottom: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {contributor.name}
                </Typography>
                <Link href={contributor.github} target="_blank" rel="noopener noreferrer" color="inherit">
                  {contributor.username}
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default About;
