import {Welcome, Navbar, Dock} from "#components";
import {Safari, Terminal, Resume, Finder} from "#windows";

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
    </main>
  )
}

export default App
