import {Welcome, Navbar, Dock} from "#components";
import {Safari, Terminal, Resume, Finder, Text, Image, Contact} from "#windows";

const App = () => {
  return (
    <main>
        <Navbar/>
        <Welcome/>
        <Dock/>

        <Terminal />
        <Safari/>
        <Resume/>
        <Finder/>
        <Text/>
        <Image/>
        <Contact />
    </main>
  )
}

export default App
