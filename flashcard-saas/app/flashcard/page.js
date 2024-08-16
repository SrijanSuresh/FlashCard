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
    Grid,
    CardContent,
    CardActionArea,
    Box,
    IconButton,
    LinearProgress,
    Button, 
} from '@mui/material'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { useRouter } from "next/navigation"
export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const router = useRouter()
    const handleBack = () => {
      router.push('/flashcards') // Navigate to /flashcards
    }
    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    
    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = () => {
        setFlipped(!flipped)
    }

    const handleNextCard = () => {
        setFlipped(false)
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length)
    }

    const handlePreviousCard = () => {
        setFlipped(false)
        setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length)
    }

    if (!isLoaded || !isSignedIn) {
        return <>Please wait until loading</>
    }

    const currentCard = flashcards[currentCardIndex]
    const progress = (currentCardIndex + 1) / flashcards.length * 100

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

            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                Flashcard {currentCardIndex + 1} of {flashcards.length}
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={1}>
                    <IconButton onClick={handlePreviousCard} disabled={flashcards.length === 0}>
                        <ArrowBack />
                    </IconButton>
                </Grid>
                <Grid item xs={10}>
                    <Card>
                        <CardActionArea onClick={handleCardClick}>
                            <CardContent>
                                <Box sx={{
                                    perspective: '1000px',
                                    '& > div': {
                                        transition: 'transform 0.6s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        width: '100%',
                                        height: '700px',
                                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    },
                                    '& > div > div': {
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        padding: 2,
                                        boxSizing: 'border-box',
                                    },
                                    '& > div > div:nth-of-type(2)': {
                                        transform: 'rotateY(180deg)',
                                    }}}>
                                    <div>
                                        <div>
                                            <Typography variant="h5" component="div">
                                                {currentCard ? currentCard.front : ''}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="h5" component="div">
                                                {currentCard ? currentCard.back : ''}
                                            </Typography>
                                        </div>
                                    </div>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={handleNextCard} disabled={flashcards.length === 0}>
                        <ArrowForward />
                    </IconButton>
                </Grid>
            </Grid>
        </Container>
    )
}
