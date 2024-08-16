'use client'
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import {
    Container,
    Typography,
    Card,
    CardActionArea,
    Grid,
    CardContent,
    Box
} from '@mui/material'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;
    
            // Reference to the user's 'test1' collection
            const colRef = collection(doc(db, 'users', user.id), 'test1');
            console.log('Collection Reference:', colRef); // Debugging line
    
            try {
                const docs = await getDocs(colRef);
                console.log('Documents fetched:', docs); // Debugging line
    
                const fetchedFlashcards = [];
                docs.forEach((doc) => {
                    fetchedFlashcards.push({ id: doc.id, ...doc.data() });
                });
                console.log('Flashcards:', fetchedFlashcards); // Debugging line
                setFlashcards(fetchedFlashcards);
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        }
        getFlashcard();
    }, [search, user]);
    

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <> Not exist </>
    }
    
    console.log('Flashcards Length:', flashcards.length) // Debugging line

    return (
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                    <CardContent>
                      <Box sx={{ /* Styling for flip animation */ }}>
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )
      
}