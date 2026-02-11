import { useState, useEffect } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import QuantumAnimation from './components/QuantumAnimation';
import ResultCard from './components/ResultCard';
import BackgroundParticles from './components/BackgroundParticles';
import { getQuantumData } from './utils/quantumLogic';

function App() {
  const [stage, setStage] = useState('input');
  const [data, setData] = useState(null);
  const [visibleComponent, setVisibleComponent] = useState('input');

  const handleConfirm = (name, sentence) => {
    const result = getQuantumData(name, sentence);
    setData(result);
    // Transition: Input (Fade Out) -> Animation (Fade In)
    setTimeout(() => {
      setStage('animating');
      setVisibleComponent('animating');
    }, 500); // Wait for input form to fade out
  };

  const handleAnimationComplete = () => {
    // Transition: Animation (Fade Out handled in component) -> Result (Fade In)
    setStage('result');
    setVisibleComponent('result');
  };

  const handleReset = () => {
    // Transition: Result (Fade Out handled in component) -> Input (Fade In)
    setVisibleComponent('input');
    setTimeout(() => {
      setData(null);
      setStage('input');
    }, 500);
  };

  return (
    <>
      <BackgroundParticles />
      <div className="quantum-app">
        {stage === 'input' && visibleComponent === 'input' && (
          <InputForm onConfirm={handleConfirm} />
        )}

        {stage === 'animating' && (
          <QuantumAnimation onComplete={handleAnimationComplete} />
        )}

        {stage === 'result' && data && (
          <ResultCard data={data} onReset={handleReset} />
        )}
      </div>
    </>
  );
}

export default App;
