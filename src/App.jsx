import { useState, useCallback } from 'react'
import MobileFrame from './components/MobileFrame'
import BottomSheet from './components/BottomSheet'
import WelcomeScreen from './components/WelcomeScreen'
import AIChatOnboarding from './components/AIChatOnboarding'
import AIAnalysisScreen from './components/AIAnalysisScreen'
import ReportDashboard from './components/ReportDashboard'
import TalentDetailPage from './pages/TalentDetailPage'
import { demoHighMoments } from './data/demoValues'

// Phase state machine: welcome → onboard → analysis → report
export default function App() {
  const [phase, setPhase] = useState('welcome')
  const [highMoments, setHighMoments] = useState([])
  const [selectedTalent, setSelectedTalent] = useState(null)

  const transitionTo = useCallback((targetPhase) => {
    setPhase(targetPhase)
  }, [])

  const handleTalentSelect = useCallback((key) => {
    setSelectedTalent(key)
  }, [])

  const handleCloseSheet = useCallback(() => {
    setSelectedTalent(null)
  }, [])

  const handleSaveHighMoments = useCallback((moments) => {
    setHighMoments(moments)
    transitionTo('analysis')
  }, [transitionTo])

  const handleQuickDemo = useCallback(() => {
    setHighMoments([...demoHighMoments])
    transitionTo('analysis')
  }, [transitionTo])

  const handleAnalysisDone = useCallback(() => {
    transitionTo('report')
  }, [transitionTo])

  const handleRestart = useCallback(() => {
    setHighMoments([])
    setSelectedTalent(null)
    transitionTo('welcome')
  }, [transitionTo])

  return (
    <MobileFrame currentPhase={phase}>
      {/* Phase 0: Welcome */}
      {phase === 'welcome' && (
        <WelcomeScreen
          onStart={() => transitionTo('onboard')}
          onQuickDemo={handleQuickDemo}
        />
      )}

      {/* Phase 1: AI Chat Onboarding */}
      {phase === 'onboard' && (
        <AIChatOnboarding
          onSave={handleSaveHighMoments}
          onBack={() => transitionTo('welcome')}
          initialMoments={highMoments}
        />
      )}

      {/* Phase 2: AI Analysis Animation */}
      {phase === 'analysis' && (
        <AIAnalysisScreen
          highMoments={highMoments}
          onDone={handleAnalysisDone}
        />
      )}

      {/* Phase 3: Report Dashboard */}
      {phase === 'report' && (
        <>
          <ReportDashboard
            highMoments={highMoments}
            onTalentSelect={handleTalentSelect}
            onRestart={handleRestart}
            onEditMoments={() => transitionTo('onboard')}
          />

          <BottomSheet
            isOpen={!!selectedTalent}
            onClose={handleCloseSheet}
            title="天赋详情"
          >
            {selectedTalent && (
              <TalentDetailPage
                talentKey={selectedTalent}
                inSheet
                onTalentSelect={handleTalentSelect}
              />
            )}
          </BottomSheet>
        </>
      )}
    </MobileFrame>
  )
}
