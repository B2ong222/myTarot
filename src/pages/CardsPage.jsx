import { useMemo, useState } from 'react'
import TarotCard from '../components/TarotCard.jsx'
import { tarotCards } from '../data/tarotCards.js'

function CardsPage() {
  const [query, setQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)

  const filteredCards = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) {
      return tarotCards
    }

    return tarotCards.filter((card) =>
      [card.name, card.english, card.meaning].some((value) => value.toLowerCase().includes(keyword)),
    )
  }, [query])

  return (
    <div className="page-stack">
      <div className="section-heading">
        <span className="section-kicker">Major Arcana</span>
        <h2>카드 도감</h2>
      </div>

      <label className="search-field">
        <span>카드 검색</span>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름, 영문명, 의미"
          type="search"
          value={query}
        />
      </label>

      <section className="catalog-grid">
        {filteredCards.map((card) => (
          <TarotCard card={card} compact key={card.id} label={card.name} onClick={() => setSelectedCard(card)} />
        ))}
      </section>

      {selectedCard ? (
        <div className="modal-backdrop" onClick={() => setSelectedCard(null)} role="presentation">
          <section className="modal-panel" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedCard(null)} type="button">
              닫기
            </button>
            <div className="modal-title">
              <span className="card-symbol">{selectedCard.symbol}</span>
              <div>
                <span className="section-kicker">{selectedCard.english}</span>
                <h2>{selectedCard.name}</h2>
              </div>
            </div>
            <p>{selectedCard.meaning}</p>
            <div className="meaning-grid">
              <article>
                <h3>정방향</h3>
                <p>{selectedCard.upright}</p>
              </article>
              <article>
                <h3>역방향</h3>
                <p>{selectedCard.reversed}</p>
              </article>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default CardsPage
