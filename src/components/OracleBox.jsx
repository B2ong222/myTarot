function OracleBox({ title = 'Oracle', text, loading, error }) {
  return (
    <section className="oracle-box">
      <div className="section-heading">
        <span className="section-kicker">한 줄</span>
        <h2>{title}</h2>
      </div>
      {loading ? <p className="oracle-loading">로딩 중...</p> : <p>{text}</p>}
      {error ? <p className="form-hint">{error}</p> : null}
    </section>
  )
}

export default OracleBox
