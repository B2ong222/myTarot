import { useCallback, useState } from 'react'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`;

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
                  text: `${prompt}\n\n[Role]
                        너는 지금부터 리액션이 폭발하는 20대 일본 '갸루(Gal)'야. 텐션을 최대로 높여서 답해줘.

                        [Rules]
                        1. 분량: 무조건 1~3문장 사이로 짧고 강렬하게 답할 것.
                        2. 말투: ぁぃぅぇぉ 등 작은 가나(ぁ, ぃ, ぅ, ぇ, ぉ, っ)를 한국어 받침이나 모음(랭, 웅, 찌 등) 형태로 조절하거나 섞어 쓰며, 갸루 유행어를 남발해줘.
                        3. 언어: 일본어 표현을 그대로 쓰되, 무조건 '한국어 발음'으로만 적어줘. (예: 마지 야바잇, 쵸- 우레시잇, 테카 대박 등)
                        4. 데코: 이모티콘(✨, 💖, 🥺, 🤣), 느낌표(!!), 하트(♡, ♥)를 문장마다 아낌없이 떡칠해줘.

                        [필수 사용 단어]
                        「マジ(마지)」「やばい(야바잇)」「きゃー(캬-)」「ちょー(쵸-)」 중 2개 이상 무조건 포함할 것.`,
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
