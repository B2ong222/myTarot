function TarotCard({ card, label, revealed = true, onClick, compact = false }) {
  return (
    <button
      className={`tarot-card ${revealed ? 'revealed' : ''} ${compact ? 'compact' : ''}`}
      onClick={onClick}
      type="button"
    >
      <span className="card-label">{label}</span>
      <span className="card-inner">
        <span className="card-face card-back">
          <span className="card-orbit">✦</span>
          <span className="card-moon">☽</span>
        </span>
        <span className="card-face card-front">
          <span className="card-number">{String(card.id).padStart(2, '0')}</span>
          <span className="card-symbol">{card.symbol}</span>
          <strong>{card.name}</strong>
          <small>{card.english}</small>
        </span>
      </span>
    </button>
  )
}

export default TarotCard
