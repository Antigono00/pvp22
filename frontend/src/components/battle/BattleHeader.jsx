// src/components/battle/BattleHeader.jsx
import React, { useState, useEffect } from 'react';

const BattleHeader = ({ 
  turn, 
  playerEnergy, 
  enemyEnergy,
  difficulty,
  activePlayer,
  maxEnergy = 25,
  playerActiveSynergies = [],
  enemyActiveSynergies = []
}) => {
  // Mobile detection
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = windowWidth <= 768;
  const isVerySmall = windowWidth <= 400;
  
  // Helper to get synergy icons
  const getSynergyIcon = (synergy) => {
    const synergyIcons = {
      'species': '👥',
      'legendary_presence': '⭐',
      'stat_synergy': '💪',
      'form_protection': '🛡️',
      'balanced_team': '⚖️',
      'full_field': '🔥',
      'fortress_formation': '🏰',
      'arcane_resonance': '✨',
      'blitz_assault': '⚡',
      'enduring_will': '🔋',
      'swift_casting': '🌟'
    };
    
    return synergy.icon || synergyIcons[synergy.type] || '🎯';
  };
  
  // Calculate total synergy bonus
  const calculateTotalBonus = (synergies) => {
    if (!synergies || synergies.length === 0) return 0;
    return synergies.reduce((total, syn) => total + (syn.bonus || 0), 0);
  };
  
  const playerTotalBonus = calculateTotalBonus(playerActiveSynergies);
  const enemyTotalBonus = calculateTotalBonus(enemyActiveSynergies);
  
  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'hard': return '#FF9800';
      case 'expert': return '#FF5722';
      default: return '#4CAF50';
    }
  };
  
  // Mobile layout with minimal content
  if (isMobile) {
    return (
      <div className="battle-header">
        <div className="battle-info">
          {/* Turn indicator */}
          <div className="turn-counter">
            <span className="turn-number">{turn}</span>
            {!isVerySmall && <span className="turn-label">TURN</span>}
          </div>
          
          {/* Difficulty badge */}
          <div className="difficulty-indicator" 
               style={{ backgroundColor: getDifficultyColor(difficulty) }}>
            {isVerySmall ? difficulty.charAt(0).toUpperCase() : difficulty.toUpperCase()}
          </div>
          
          {/* Active player indicator */}
          <div className={`active-player-indicator ${activePlayer === 'enemy' ? 'enemy-active' : 'player-active'}`}>
            {activePlayer === 'player' ? 
              (isVerySmall ? '👤' : 'YOUR TURN') : 
              (isVerySmall ? '🤖' : 'ENEMY TURN')}
          </div>
        </div>
        
        {/* Synergy totals - Only show if we have synergies */}
        {(playerTotalBonus > 0 || enemyTotalBonus > 0) && (
          <div className="synergy-section">
            {playerTotalBonus > 0 && (
              <div className="synergy-total player">
                <div className="synergy-total-value">+{Math.round(playerTotalBonus * 100)}%</div>
                <div className="synergy-total-label">YOUR SYNERGY</div>
              </div>
            )}
            
            {enemyTotalBonus > 0 && (
              <div className="synergy-total enemy">
                <div className="synergy-total-value">+{Math.round(enemyTotalBonus * 100)}%</div>
                <div className="synergy-total-label">ENEMY SYNERGY</div>
              </div>
            )}
          </div>
        )}
        
        {/* Energy displays */}
        <div className="energy-displays">
          <div className="player-energy">
            <div className="energy-label">YOUR ENERGY</div>
            <div className="energy-value">{playerEnergy}</div>
          </div>
          
          <div className="enemy-energy">
            <div className="energy-label">ENEMY ENERGY</div>
            <div className="energy-value">{enemyEnergy}</div>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop layout with hover details
  return (
    <div className="battle-header">
      <div className="battle-info">
        {/* Turn and difficulty indicators */}
        <div className="turn-counter">
          <div className="turn-label">TURN</div>
          <div className="turn-number">{turn}</div>
        </div>
        
        <div className="difficulty-indicator" 
             style={{ backgroundColor: getDifficultyColor(difficulty) }}>
          {difficulty.toUpperCase()}
        </div>
        
        <div className={`active-player-indicator ${activePlayer === 'enemy' ? 'enemy-active' : 'player-active'}`}>
          {activePlayer === 'player' ? 'YOUR TURN' : 'ENEMY TURN'}
        </div>
      </div>
      
      {/* Synergy section with hover details */}
      <div className="synergy-section">
        {playerTotalBonus > 0 && (
          <div className="synergy-total player">
            <div className="synergy-total-value">+{Math.round(playerTotalBonus * 100)}%</div>
            <div className="synergy-total-label">YOUR SYNERGY</div>
            
            {/* Dropdown breakdown on hover */}
            <div className="synergy-breakdown">
              {playerActiveSynergies.map((synergy, index) => (
                <div key={index} className="synergy-breakdown-item">
                  <div className="synergy-name">
                    <span className="synergy-icon">{getSynergyIcon(synergy)}</span>
                    <span>{synergy.name || synergy.type}</span>
                  </div>
                  <div className="synergy-bonus">+{Math.round(synergy.bonus * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {enemyTotalBonus > 0 && (
          <div className="synergy-total enemy">
            <div className="synergy-total-value">+{Math.round(enemyTotalBonus * 100)}%</div>
            <div className="synergy-total-label">ENEMY SYNERGY</div>
            
            {/* Dropdown breakdown on hover */}
            <div className="synergy-breakdown enemy">
              {enemyActiveSynergies.map((synergy, index) => (
                <div key={index} className="synergy-breakdown-item">
                  <div className="synergy-name">
                    <span className="synergy-icon">{getSynergyIcon(synergy)}</span>
                    <span>{synergy.name || synergy.type}</span>
                  </div>
                  <div className="synergy-bonus">+{Math.round(synergy.bonus * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Energy displays */}
      <div className="energy-displays">
        <div className="player-energy">
          <div className="energy-label">YOUR ENERGY</div>
          <div className="energy-value">{playerEnergy}</div>
          <div className="energy-bar-container">
            <div className="energy-bar" 
                 style={{ width: `${Math.min(100, (playerEnergy / maxEnergy) * 100)}%` }} />
          </div>
        </div>
        
        <div className="enemy-energy">
          <div className="energy-label">ENEMY ENERGY</div>
          <div className="energy-value">{enemyEnergy}</div>
          <div className="energy-bar-container">
            <div className="energy-bar enemy" 
                 style={{ width: `${Math.min(100, (enemyEnergy / maxEnergy) * 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleHeader;
