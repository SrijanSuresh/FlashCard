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
    Button
  } from '@mui/material'

  export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();
    const handleBack = () => {
      router.push('/generate') // Navigate to /flashcards
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
        <Container maxWidth={false}>
                    <Button
            sx={{
              width: '200px',
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'red',
              },
            }}
            onClick={handleBack} 
          >
            Back
          </Button>
            <Grid container spacing={3} sx={{mt:4}}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h6" >
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
