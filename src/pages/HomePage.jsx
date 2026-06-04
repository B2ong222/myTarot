import { useEffect, useMemo, useState } from 'react'
import OracleBox from '../components/OracleBox.jsx'
import TarotCard from '../components/TarotCard.jsx'
import { getDailyCard } from '../data/tarotCards.js'
import { useGemini } from '../hooks/useGemini.js'
import { horoscopes } from '../data/horoscopes.js'

function getTodaySign() {
  const now = new Date()
  const m = now.getMonth() + 1
  const d = now.getDate()
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return horoscopes.find(s => s.id === 'aries')
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return horoscopes.find(s => s.id === 'taurus')
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return horoscopes.find(s => s.id === 'gemini')
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return horoscopes.find(s => s.id === 'cancer')
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return horoscopes.find(s => s.id === 'leo')
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return horoscopes.find(s => s.id === 'virgo')
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return horoscopes.find(s => s.id === 'libra')
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return horoscopes.find(s => s.id === 'scorpio')
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return horoscopes.find(s => s.id === 'sagittarius')
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return horoscopes.find(s => s.id === 'capricorn')
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return horoscopes.find(s => s.id === 'aquarius')
  return horoscopes.find(s => s.id === 'pisces')
}

function HomePage() {
  const dailyCard = useMemo(() => getDailyCard(new Date()), [])
  const todaySign = useMemo(() => getTodaySign(), [])

  const [message, setMessage] = useState('')
  const [selectedSign, setSelectedSign] = useState(null)
  const [horoscopeText, setHoroscopeText] = useState('')
  const [horoscopeLoading, setHoroscopeLoading] = useState(false)

  const { generateOracle, loading, error } = useGemini()

  useEffect(() => {
    let ignore = false
    async function loadMessage() {
      const today = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
      }).format(new Date())
      const result = await generateOracle(
        `${today}의 오늘의 타로 카드는 ${dailyCard.name}(${dailyCard.english})입니다. 카드 의미는 "${dailyCard.meaning}"입니다. 오늘의 한줄 메시지를 만들어줘.`,
      )
      if (!ignore) setMessage(result)
    }
    loadMessage()
    return () => { ignore = true }
  }, [dailyCard, generateOracle])

  async function handleSignClick(sign) {
    if (selectedSign?.id === sign.id) {
      setSelectedSign(null)
      setHoroscopeText('')
      return
    }
    setSelectedSign(sign)
    setHoroscopeText('')
    setHoroscopeLoading(true)
    const oracle = await generateOracle(
      `${sign.name}(${sign.period}, ${sign.element} 원소)의 이번주 운세를 사랑, 일, 조심할 징조를 포함해서 알려줘.`,
    )
    setHoroscopeText(oracle)
    setHoroscopeLoading(false)
  }

  return (
    <div className="page-stack">
      {/* ── 오늘의 타로 ── */}
      <section className="hero-section">
        <div className="hero-copy">
          <span className="section-kicker">Today</span>
          <h2>오늘의 운세</h2>
          <p>날짜가 바뀌면 카드도 바뀝니다. 오늘의 그림자가 고른 한 장을 확인하세요.</p>
        </div>
        <TarotCard card={dailyCard} label="오늘의 카드" />
      </section>

      <OracleBox title="오늘의 한줄 메시지" text={message} loading={loading} error={error} />

      {/* ── 별자리 ── */}
      <section>
        <div className="section-heading" style={{ marginBottom: '1rem' }}>
          <span className="section-kicker">Zodiac</span>
          <h2>별자리 운세</h2>
          {todaySign && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.25rem 0 0' }}>
              오늘은 <span style={{ color: 'var(--gold)' }}>{todaySign.symbol} {todaySign.name}</span>의 날입니다
            </p>
          )}
        </div>

        <div className="zodiac-grid">
          {horoscopes.map((sign) => (
            <button
              key={sign.id}
              className={`zodiac-card${selectedSign?.id === sign.id ? ' active' : ''}${todaySign?.id === sign.id ? ' today-sign' : ''}`}
              onClick={() => handleSignClick(sign)}
              type="button"
            >
              <span>{sign.symbol}</span>
              <strong>{sign.name}</strong>
              <small>{sign.period}</small>
            </button>
          ))}
        </div>

        {selectedSign && (
          <div style={{ marginTop: '1rem' }}>
            <OracleBox
              title={`${selectedSign.name} 이번주 운세`}
              text={horoscopeText}
              loading={horoscopeLoading}
              error={null}
            />
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
