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
    CardActionArea,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Grid, 
    CardContent
  } from '@mui/material'
  
export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState(Array(flashcards.length).fill(false))
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ text }), // Make sure to send data in JSON format
                headers: { 'Content-Type': 'application/json' } // Set the content type
            })
            const data = await response.json()
            setFlashcards(data.flashcards) // Update this to use data.flashcards
        } catch (error) {
            console.error('Error fetching flashcards:', error)
        }
    }
    
    const handleCardClick = (index) => {
        const newFlipped = [...flipped]
        newFlipped[index] = !newFlipped[index]
        setFlipped(newFlipped)
    }
    
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const saveFlashcards = async() => {
        if(!name){
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db,'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if(docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f)=>f.name === name)){
                alert('Name already exists')
                return
            }
            else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else{
            batch.set(userDocRef, {flashcards: [{name}]})
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
    return (
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Generate Flashcards
            </Typography>
            <Paper sx={{p:4, width: '100%'}}>            
                <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                label="Enter text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
                />
                <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                >
                Generate Flashcards
                </Button>
            </Paper>
          </Box>
          
          {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                Generated Flashcards
                </Typography>
                <Grid container spacing={3}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(index)}>
                                <CardContent>
                                    <Box sx={{
                                        perspective: '1000px',
                                        '& > div': {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position: 'relative',
                                            width: '100%',
                                            height: '200px',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                                        }
                                    }}>
                                        <div>
                                            <div>
                                                <Typography variant="h5" component="div">{flashcard.front}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="h5" component="div">{flashcard.back}</Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}

                </Grid>
                <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        Save Flashcards
                    </Button>
                </Box>
            </Box> )}

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
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards} color="primary">
                    Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
      )
    
}