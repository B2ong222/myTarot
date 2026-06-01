import { useMemo, useState } from 'react'
import OracleBox from '../components/OracleBox.jsx'
import TarotCard from '../components/TarotCard.jsx'
import { drawCards } from '../data/tarotCards.js'
import { useGemini } from '../hooks/useGemini.js'

const moods = ['행복', '우울', '설렘', '불안', '그냥']
const readingTypes = ['전체', '연애', '금전', '학업']
const positions = ['과거', '현재', '미래']

const initialForm = {
  name: '',
  birthDate: '',
  mood: '그냥',
  readingType: '전체',
}

function TarotPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [cards, setCards] = useState(() => drawCards(3))
  const [revealed, setRevealed] = useState([false, false, false])
  const [result, setResult] = useState('')
  const { generateOracle, loading, error } = useGemini()

  const allRevealed = useMemo(() => revealed.every(Boolean), [revealed])

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function startReading(event) {
    event.preventDefault()
    setCards(drawCards(3))
    setRevealed([false, false, false])
    setResult('')
    setStep(2)
  }

  async function revealCard(index) {
    const next = revealed.map((value, cardIndex) => (cardIndex === index ? true : value))
    setRevealed(next)

    if (next.every(Boolean)) {
      const prompt = [
        `${form.name}님의 3장 타로 운세를 해석해줘.`,
        `생년월일: ${form.birthDate}`,
        `현재 기분: ${form.mood}`,
        `운세 종류: ${form.readingType}`,
        `과거: ${cards[0].name} - ${cards[0].meaning}`,
        `현재: ${cards[1].name} - ${cards[1].meaning}`,
        `미래: ${cards[2].name} - ${cards[2].meaning}`,
      ].join('\n')

      const oracle = await generateOracle(prompt)
      setResult(oracle)
      setStep(3)
    }
  }

  function resetReading() {
    setForm(initialForm)
    setCards(drawCards(3))
    setRevealed([false, false, false])
    setResult('')
    setStep(1)
  }

  return (
    <div className="page-stack">
      <div className="section-heading">
        <span className="section-kicker">Three Cards</span>
        <h2>타로 리딩</h2>
      </div>

      <div className="stepper" aria-label="타로 리딩 단계">
        {[1, 2, 3].map((item) => (
          <span className={step === item ? 'active' : ''} key={item}>
            {item}
          </span>
        ))}
      </div>

      {step === 1 ? (
        <form className="panel form-grid" onSubmit={startReading}>
          <label>
            이름
            <input name="name" onChange={updateForm} required type="text" value={form.name} />
          </label>
          <label>
            생년월일
            <input name="birthDate" onChange={updateForm} required type="date" value={form.birthDate} />
          </label>
          <label>
            기분
            <select name="mood" onChange={updateForm} value={form.mood}>
              {moods.map((mood) => (
                <option key={mood}>{mood}</option>
              ))}
            </select>
          </label>
          <label>
            운세 종류
            <select name="readingType" onChange={updateForm} value={form.readingType}>
              {readingTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <button className="primary-button" type="submit">
            카드 펼치기
          </button>
        </form>
      ) : null}

      {step === 2 ? (
        <section className="panel">
          <p className="form-hint">세 장을 모두 클릭하면 해석이 시작됩니다.</p>
          <div className="reading-grid">
            {cards.map((card, index) => (
              <TarotCard
                card={card}
                key={`${card.id}-${positions[index]}`}
                label={positions[index]}
                onClick={() => revealCard(index)}
                revealed={revealed[index]}
              />
            ))}
          </div>
          {allRevealed && loading ? <p className="oracle-loading">세 시간의 그림자를 엮는 중...</p> : null}
        </section>
      ) : null}

      {step === 3 ? (
        <>
          <OracleBox title={`${form.name}님의 ${form.readingType} 운세`} text={result} loading={loading} error={error} />
          <button className="primary-button" onClick={resetReading} type="button">
            다시하기
          </button>
        </>
      ) : null}
    </div>
  )
}

export default TarotPage
