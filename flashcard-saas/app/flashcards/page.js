'use client'
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import {
    Container,
    Typography,
    Card,
    CardActionArea,
    Grid, 
    CardContent,
    Button,
    Box
} from '@mui/material'

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    const handleBack = () => {
      router.push('/generate') // Navigate to /generate
    }

    useEffect(() => {
      async function getFlashcards() {
        if (!user) return;
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          setFlashcards(collections);
        } else {
          await setDoc(docRef, { flashcards: [] });
        }
      }
      getFlashcards();
    }, [user]);
  
    if (!isLoaded || !isSignedIn) {
      return <></>;
    }
  
    const handleCardClick = (id) => {
      router.push(`/flashcard?id=${id}`);
    };
  
    return (
        <Container maxWidth={false} sx={{ backgroundColor: '#000', minHeight: '100vh', py: 4 }}>
            <Button
                sx={{
                    width: '200px',
                    backgroundColor: '#1DA1F2', // iPhone blue color
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#0a85d8',
                    },
                    mb: 4, // Add margin-bottom to space from the cards
                }}
                onClick={handleBack} 
            >
                Back
            </Button>
            <Grid container spacing={3} sx={{ mt: 8, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="h1" paragraph sx={{ color: 'white', textAlign: 'center', width: '100%' }}>
                    Your Flashcards
                  </Typography>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} key={index}>
                        <Card sx={{ mb: 2, backgroundColor: '#121212', color: 'white' }}>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
