'use client'
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Grid,
} from '@mui/material'
import Head from 'next/head'

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
  
    useEffect(() => {
      const fetchCheckoutSession = async () => {
        if (!session_id) return
        try {
          const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
          const sessionData = await res.json()
          if (res.ok) {
            setSession(sessionData)
          } else {
            setError(sessionData.error)
          }
        } catch (err) {
          setError('An error occurred while retrieving the session.')
        } finally {
          setLoading(false)
        }
      }
      fetchCheckoutSession()
    }, [session_id])
    if (loading) {
      return (
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
          <CircularProgress />
          <Typography variant="h6" sx={{mt: 2}}>
            Loading...
          </Typography>
        </Container>
      )
    }
    if (error) {
      return (
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Container>
      )
    }
    return (
      <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
        {session.payment_status === 'paid' ? (
          <>
            <Typography variant="h4">Thank you for your purchase!</Typography>
            <Box sx={{mt: 2}}>
              <Typography variant="h6">Session ID: {session_id}</Typography>
              <Typography variant="body1">
                We have received your payment. You will receive an email with the
                order details shortly.
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h4">Payment failed</Typography>
            <Box sx={{mt: 2}}>
              <Typography variant="body1">
                Your payment was not successful. Please try again.
              </Typography>
            </Box>
          </>
        )}
      </Container>
    )    
    
  }
  
  return(
    <Container maxWidth="100vh">
        <Head>
          <title>Flashcard SaaS</title>
          <meta name="description" content="Flashcard SaaS" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1}}>
              Flashcard SaaS
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Login</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{mt: 2}}>
          Learn More
        </Button>
      </Box>

      <Box sx={{my: 6}}>
        <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          {/* Feature items */}
        </Grid>
        
      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Pricing plans */}
        </Grid>
      </Box>
    </Container>
  )
}
