'use client'

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { doc, writeBatch, collection, getDoc } from "firebase/firestore"
import { db } from "@/firebase"
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Card,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Grid,
    CircularProgress ,
    CardActionArea,
    CardContent,
    LinearProgress,
} from '@mui/material'
import { ArrowBack, ArrowForward } from '@mui/icons-material'

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [loading, setLoading] = useState(false)

    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState(Array(flashcards.length).fill(false))
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [currentCard, setCurrentCard] = useState(0)
    const router = useRouter()

    const handleSubmit = async () => {
        setLoading(true)  // Start loading
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ text }),
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await response.json()
            setFlashcards(data.flashcards)
            setFlipped(Array(data.flashcards.length).fill(false))
            setCurrentCard(0)
        } catch (error) {
            console.error('Error fetching flashcards:', error)
        } finally {
            setLoading(false)  // Stop loading
        }
    }
    

    const handleCardClick = () => {
        setFlipped(prev => {
            const newFlipped = [...prev]
            newFlipped[currentCard] = !newFlipped[currentCard]
            return newFlipped
        })
    }

    const handleNext = () => {
        if (currentCard < flashcards.length - 1) {
            setCurrentCard(currentCard + 1)
        }
    }

    const handlePrev = () => {
        if (currentCard > 0) {
            setCurrentCard(currentCard - 1)
        }
    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Name already exists')
                return
            }
            else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        }
        else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const collectionRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(collectionRef)
            batch.set(cardDocRef, flashcard)
        })
        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }
    const openSaveDialog = () => {
        router.push('/flashcards')
    }
    const goBack = () => {
        router.push('/')
    }

    return (
        <Container maxWidth={false} sx={{ backgroundColor: '#000', minHeight: '100vh', py: 4 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress sx={{ color: '#1DA1F2' }} />
                </Box>
            ) : (
                <>
                    <Button
                        sx={{
                          width: '200px',
                          backgroundColor: 'black',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'red',
                          },
                        }}
                        onClick={goBack} 
                      >
                        Back
                      </Button>
                    <Typography variant="h4" component="h1" gutterBottom color="white" textAlign="center">
                        Generate Flashcards
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '10vh' }}>
                        <Paper sx={{ p: 2, width: '70%', backgroundColor: '#121212', color: 'white'}}>
                            <TextField
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                label="Enter text"
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                sx={{ mb: 2 }}
                                InputLabelProps={{
                                    style: { color: '#888' },
                                }}
                                InputProps={{
                                    style: { color: 'white', borderColor: '#888' },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                fullWidth
                                sx={{ backgroundColor: '#1DA1F2', color: 'white', '&:hover': { backgroundColor: '#0a85d8' } }}
                            >
                                Generate Flashcards
                            </Button>
                        </Paper>
                    </Box>
    
                    {flashcards.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Card sx={{ p: 2, backgroundColor: '#121212', color: 'white', minHeight: '300px', maxWidth: '800px', margin: '0 auto' }}>                        
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 2
                                }}>
                                    <IconButton
                                        onClick={handlePrev}
                                        disabled={currentCard === 0}
                                        sx={{ color: currentCard === 0 ? '#888' : 'white' }}
                                    >
                                        <ArrowBack />
                                    </IconButton>
                                    <Typography variant="h6" component="div">
                                        {currentCard + 1}/{flashcards.length}
                                    </Typography>
                                    <IconButton
                                        onClick={handleNext}
                                        disabled={currentCard === flashcards.length - 1}
                                        sx={{ color: currentCard === flashcards.length - 1 ? '#888' : 'white' }}
                                    >
                                        <ArrowForward />
                                    </IconButton>
                                </Box>
    
                                <CardActionArea onClick={handleCardClick} sx={{ perspective: '1000px' }}>
                                    <CardContent>
                                        <Box sx={{
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position: 'relative',
                                            width: '100%',
                                            height: '300px',
                                            transform: flipped[currentCard] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                padding: '16px',
                                                boxSizing: 'border-box',
                                            }}>
                                                <Typography variant="h5" component="div">{flashcards[currentCard].front}</Typography>
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                padding: '16px',
                                                boxSizing: 'border-box',
                                                transform: 'rotateY(180deg)',
                                            }}>
                                                <Typography variant="h5" component="div">{flashcards[currentCard].back}</Typography>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
    
                                <LinearProgress
                                    variant="determinate"
                                    value={(currentCard + 1) / flashcards.length * 100}
                                    sx={{ mt: 2, backgroundColor: '#333', '& .MuiLinearProgress-bar': { backgroundColor: '#1DA1F2' } }}
                                />
                            </Card>
    
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleOpen}
                                    sx={{ 
                                        backgroundColor: '#1DA1F2', 
                                        color: 'white', 
                                        '&:hover': { backgroundColor: '#0a85d8' },
                                        mr: 2 // Adds margin-right to space out the buttons
                                    }}
                                >
                                    Save Flashcards
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={openSaveDialog}
                                    sx={{ 
                                        backgroundColor: '#1DA1F2', 
                                        color: 'white', 
                                        '&:hover': { backgroundColor: '#0a85d8' }
                                    }}
                                >
                                    View Saved
                                </Button>
                            </Box>

                        </Box>
                    )}
    
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Save Flashcard Set</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please enter a name for your flashcard set.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Set Name"
                                type="text"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} sx={{ marginRight: 2 }}>
                                Cancel
                            </Button>
                            <Button onClick={saveFlashcards} color="primary">
                                Save
                            </Button>
                        </DialogActions>

                    </Dialog>
                </>
            )}
        </Container>
    )
    }
