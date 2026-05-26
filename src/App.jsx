import { useState, useCallback } from 'react'
import MobileFrame from './components/MobileFrame'
import BottomSheet from './components/BottomSheet'
import WelcomeScreen from './components/WelcomeScreen'
import AIChatOnboarding from './components/AIChatOnboarding'
import AIAnalysisScreen from './components/AIAnalysisScreen'
import ReportDashboard from './components/ReportDashboard'
import TalentDetailPage from './pages/TalentDetailPage'
import PhaseTransition from './components/PhaseTransition'

// Phase state machine: welcome → onboard → analysis → report
export default function App() {
  const [phase, setPhase] = useState('welcome')
  const [highMoments, setHighMoments] = useState([])
  const [selectedTalent, setSelectedTalent] = useState(null)

  // Transition state
  const [pendingPhase, setPendingPhase] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 统一的阶段切换 —— 通过 PhaseTransition 动画过渡
  const transitionTo = useCallback((targetPhase) => {
    if (isTransitioning) return
    setPendingPhase(targetPhase)
    setIsTransitioning(true)
  }, [isTransitioning])

  const handleTransitionMidpoint = useCallback(() => {
    if (pendingPhase) {
      setPhase(pendingPhase)
    }
  }, [pendingPhase])

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false)
    setPendingPhase(null)
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

  const handleAnalysisDone = useCallback(() => {
    transitionTo('report')
  }, [transitionTo])

  const handleRestart = useCallback(() => {
    setHighMoments([])
    setSelectedTalent(null)
    transitionTo('welcome')
  }, [transitionTo])

  return (
    <MobileFrame>
      {/* Phase 0: Welcome */}
      {phase === 'welcome' && (
        <WelcomeScreen onStart={() => transitionTo('onboard')} />
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

      {/* Phase Transition Overlay */}
      <PhaseTransition
        isActive={isTransitioning}
        onMidpoint={handleTransitionMidpoint}
        onComplete={handleTransitionComplete}
      />
    </MobileFrame>
  )
}
