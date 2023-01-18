import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import Home from './containers/Home'
import DeckCards from './containers/DeckCards'
import GenDeck from './containers/GenDeck'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to='/decks' />} />
        <Route path="/decks" element={<Home />}/>
        <Route path="/deck/:id" element={<DeckCards />}/>
        <Route path="/gen-deck" element={<GenDeck />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
