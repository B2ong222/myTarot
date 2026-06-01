import { useCallback, useState } from 'react'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`

const fallbackText =
  '검은 촛불이 잠시 흔들리고 있습니다. 지금은 AI의 문이 닫혔지만, 카드의 속삭임은 분명합니다. 서두르지 말고 가장 먼저 떠오른 선택을 붙드세요.'

export function useGemini() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateOracle = useCallback(async (prompt) => {
    if (!API_KEY) {
      setError('VITE_GEMINI_API_KEY가 설정되지 않았습니다.')
      return fallbackText
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${prompt}\n\n말투는 신비롭고 시적으로, 약간 무섭게 써줘. 한국어로 4-7문장만 답해줘.`,
                },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error('Gemini API 호출에 실패했습니다.')
      }

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallbackText
    } catch (requestError) {
      setError(requestError.message)
      return fallbackText
    } finally {
      setLoading(false)
    }
  }, [])

  return { generateOracle, loading, error }
}
