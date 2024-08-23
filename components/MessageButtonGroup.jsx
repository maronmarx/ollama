"use client";
import MessageButton from './MessageButton';
function MessageButtonGroup({ handleModelType, handleEvaluateModel, handleShareModel, handleDeployModel, setShowInputArea }) {
  const handleButtonClick = (action) => {
    setShowInputArea(false);
    setTimeout(() => {
      action();
    }, 0);
  };

  return (
    <div className="flex items-center space-x-2">
      <MessageButton text="Créer le modèle de prédiction" onClick={() => handleButtonClick(() => handleModelType('prediction'))} />
      <MessageButton text="Évaluer la performance du modèle de prédiction" onClick={() => handleButtonClick(() => handleEvaluateModel('evaluatePrediction'))} />
      <MessageButton text="Partager le projet" onClick={() => handleButtonClick(() => handleShareModel('shared'))} />
      <MessageButton text="Déployer le projet" onClick={() => handleButtonClick(() => handleDeployModel('Deploy'))} />
    </div>
  );
}

export default MessageButtonGroup;