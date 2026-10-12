import { useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CourseGrid from './components/CourseGrid'
import FolderPage from './components/FolderPage'
import CourseDetailsModal from './components/CourseDetailsModal'
import Reviews from './components/Reviews'
import LearningRoadmap from './components/LearningRoadmap'
import About from './components/About'
import FAQ from './components/FAQ'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import Admin from './components/Admin'
import { useStore } from './lib/store'

export default function App() {
  const st = useStore()
  const [folder, setFolder] = useState(null), [course, setCourse] = useState(null), [admin, setAdmin] = useState(false)
  const closeFolder = useCallback(() => setFolder(null), [])
  const closeCourse = useCallback(() => setCourse(null), [])
  const closeAdmin = useCallback(() => setAdmin(false), [])
  return (
    <>
      <div id="load" aria-hidden="true"><i /></div>
      <Navbar onAdmin={() => setAdmin(true)} />
      <main>
        <Hero />
        <CourseGrid courses={st.courses} folders={st.folders} fimg={st.fimg} status={st.status} onFolder={setFolder} />
        <Reviews reviews={st.reviews} />
        <LearningRoadmap />
        <About />
        <FAQ />
        <CTASection />
      </main>
      <Footer cats={st.folders} onFolder={setFolder} />
      {folder && <FolderPage cat={folder} courses={st.courses} onClose={closeFolder} onOpen={setCourse} />}
      {course && <CourseDetailsModal c={course} onClose={closeCourse} />}
      {admin && <Admin st={st} onClose={closeAdmin} />}
    </>
  )
}
