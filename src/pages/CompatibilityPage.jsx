import { useState } from 'react'
import OracleBox from '../components/OracleBox.jsx'
import { useGemini } from '../hooks/useGemini.js'

const initialForm = {
  firstName: '',
  firstBirthDate: '',
  secondName: '',
  secondBirthDate: '',
}

function CompatibilityPage() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState('')
  const { generateOracle, loading, error } = useGemini()

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitCompatibility(event) {
    event.preventDefault()
    const oracle = await generateOracle(
      `${form.firstName}(${form.firstBirthDate})와 ${form.secondName}(${form.secondBirthDate})의 궁합을 분석해줘. 끌림, 충돌, 오래가기 위한 조언을 포함해줘.`,
    )
    setResult(oracle)
  }

  return (
    <div className="page-stack">
      <div className="section-heading">
        <span className="section-kicker">Compatibility</span>
        <h2>궁합</h2>
      </div>

      <form className="panel form-grid two-column-form" onSubmit={submitCompatibility}>
        <label>
          첫 번째 이름
          <input name="firstName" onChange={updateForm} required type="text" value={form.firstName} />
        </label>
        <label>
          첫 번째 생년월일
          <input
            name="firstBirthDate"
            onChange={updateForm}
            required
            type="date"
            value={form.firstBirthDate}
          />
        </label>
        <label>
          두 번째 이름
          <input name="secondName" onChange={updateForm} required type="text" value={form.secondName} />
        </label>
        <label>
          두 번째 생년월일
          <input
            name="secondBirthDate"
            onChange={updateForm}
            required
            type="date"
            value={form.secondBirthDate}
          />
        </label>
        <button className="primary-button" type="submit">
          궁합 보기
        </button>
      </form>

      {result || loading ? <OracleBox title="두 사람의 그림자 궁합" text={result} loading={loading} error={error} /> : null}
    </div>
  )
}

export default CompatibilityPage
