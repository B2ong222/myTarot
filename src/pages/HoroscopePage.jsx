import { useState } from 'react'
import OracleBox from '../components/OracleBox.jsx'
import { horoscopes } from '../data/horoscopes.js'
import { useGemini } from '../hooks/useGemini.js'

function HoroscopePage() {
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState('')
  const { generateOracle, loading, error } = useGemini()

  async function selectSign(sign) {
    setSelected(sign)
    setResult('')
    const oracle = await generateOracle(
      `${sign.name}(${sign.period}, ${sign.element} 원소)의 이번주 운세를 사랑, 일, 조심할 징조를 포함해서 알려줘.`,
    )
    setResult(oracle)
  }

  return (
    <div className="page-stack">
      <div className="section-heading">
        <span className="section-kicker">Zodiac</span>
        <h2>별자리 운세</h2>
      </div>

      <section className="zodiac-grid">
        {horoscopes.map((sign) => (
          <button
            className={selected?.id === sign.id ? 'zodiac-card active' : 'zodiac-card'}
            key={sign.id}
            onClick={() => selectSign(sign)}
            type="button"
          >
            <span>{sign.symbol}</span>
            <strong>{sign.name}</strong>
            <small>{sign.period}</small>
          </button>
        ))}
      </section>

      {selected ? (
        <OracleBox title={`${selected.name} 이번주 운세`} text={result} loading={loading} error={error} />
      ) : null}
    </div>
  )
}

export default HoroscopePage
