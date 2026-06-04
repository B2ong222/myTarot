import { useState } from "react";
import OracleBox from "../components/OracleBox.jsx";
import { useGemini } from "../hooks/useGemini.js";

const initialForm = {
  firstName: "",
  firstBirthDate: "",
  secondName: "",
  secondBirthDate: "",
};

function CompatibilityPage() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState("");
  const { generateOracle, loading, error } = useGemini();

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitCompatibility(event) {
    event.preventDefault();

    const oracle = await generateOracle(`
${form.firstName} (${form.firstBirthDate})
${form.secondName} (${form.secondBirthDate})

두 사람의 연애 궁합을 분석해줘.

반드시 아래 형식으로 답변해줘.

💖 궁합 점수: XX%

💘 서로 끌리는 점
- 한 문장

⚡ 주의할 점
- 한 문장

💕 한 줄 조언
- 한 문장
`);

    setResult(oracle);
  }

  return (
    <div className="page-stack">
      <div className="section-heading">
        <span className="section-kicker">Compatibility</span>
        <h2>궁합</h2>
      </div>

      <form
        className="panel form-grid two-column-form"
        onSubmit={submitCompatibility}
      >
        <label>
          첫 번째 이름
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={updateForm}
            required
          />
        </label>

        <label>
          첫 번째 생년월일
          <input
            type="date"
            name="firstBirthDate"
            value={form.firstBirthDate}
            onChange={updateForm}
            required
          />
        </label>

        <label>
          두 번째 이름
          <input
            type="text"
            name="secondName"
            value={form.secondName}
            onChange={updateForm}
            required
          />
        </label>

        <label>
          두 번째 생년월일
          <input
            type="date"
            name="secondBirthDate"
            value={form.secondBirthDate}
            onChange={updateForm}
            required
          />
        </label>

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "궁합 보는 중..." : "궁합 보기"}
        </button>
      </form>

      {(result || loading) && (
        <OracleBox
          title="💖 두 사람의 궁합 결과"
          text={result}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}

export default CompatibilityPage;