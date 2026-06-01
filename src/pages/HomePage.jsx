import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import OracleBox from '../components/OracleBox.jsx'
import TarotCard from '../components/TarotCard.jsx'
import { getDailyCard } from '../data/tarotCards.js'
import { useGemini } from '../hooks/useGemini.js'

const quickLinks = [
  { to: '/tarot', title: '3장 타로 리딩', text: '과거, 현재, 미래가 같은 탁자에 놓입니다.' },
  { to: '/horoscope', title: '별자리 운세', text: '이번 주 당신의 하늘을 읽습니다.' },
  { to: '/cards', title: '카드 도감', text: '22장의 문을 하나씩 열어보세요.' },
  { to: '/compatibility', title: '궁합', text: '두 이름 사이의 어두운 실을 더듬습니다.' },
]

function HomePage() {
  const dailyCard = useMemo(() => getDailyCard(new Date()), [])
  const [message, setMessage] = useState('')
  const { generateOracle, loading, error } = useGemini()

  useEffect(() => {
    let ignore = false

    async function loadMessage() {
      const today = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date())

      const result = await generateOracle(
        `${today}의 오늘의 타로 카드는 ${dailyCard.name}(${dailyCard.english})입니다. 카드 의미는 "${dailyCard.meaning}"입니다. 오늘의 한줄 메시지를 만들어줘.`,
      )

      if (!ignore) {
        setMessage(result)
      }
    }

    loadMessage()

    return () => {
      ignore = true
    }
  }, [dailyCard, generateOracle])

  return (
    <div className="page-stack">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="section-kicker">Today</span>
          <h2>오늘의 운세</h2>
          <p>날짜가 바뀌면 카드도 바뀝니다. 오늘의 그림자가 고른 한 장을 확인하세요.</p>
        </div>
        <TarotCard card={dailyCard} label="오늘의 카드" />
      </section>

      <OracleBox title="오늘의 한줄 메시지" text={message} loading={loading} error={error} />

      <section className="quick-grid">
        {quickLinks.map((link) => (
          <Link className="quick-card" key={link.to} to={link.to}>
            <h3>{link.title}</h3>
            <p>{link.text}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}

export default HomePage
