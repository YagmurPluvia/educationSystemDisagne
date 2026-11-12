import lessons from './content/lessons.json'
import LessonCard from './components/LessonCard'
import './App.css'

function App() {
  return (
    <main className="app">
      <h1>Python Mikro Öğrenme</h1>
      <LessonCard lesson={lessons[0]} />
    </main>
  )
}

export default App