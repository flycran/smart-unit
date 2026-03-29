import { useState } from 'react'
import './App.css'
import { useTranslation } from 'react-i18next'
import { useWeightUnit } from './utils/units'

function App() {
  const [inputValue, setInputValue] = useState<number>(1500000)
  const weightUnit = useWeightUnit()
  const { t, i18n } = useTranslation()

  const result = weightUnit.getUnit(inputValue)
  const formatted = weightUnit.format(inputValue, 2)

  const toggleLocale = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  return (
    <div className="app">
      <h1>{t('title')}</h1>
      <p className="subtitle">{t('subtitle')}</p>

      <div className="locale-switcher">
        <span>
          {t('currentLocale')}: <strong>{i18n.language === 'zh' ? '中文' : 'English'}</strong>
        </span>
        <button onClick={toggleLocale}>
          {t('switchTo')} {i18n.language === 'zh' ? 'English' : '中文'}
        </button>
      </div>

      <div className="input-section">
        <label>{t('inputLabel')}</label>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(Number(e.target.value))}
          min="0"
        />
      </div>

      <div className="result-section">
        <h3>{t('resultTitle')}</h3>
        <div className="result-item">
          <span className="label">{t('valueLabel')}:</span>
          <span className="value">{result.num.toFixed(2)}</span>
        </div>
        <div className="result-item">
          <span className="label">{t('unitLabel')}:</span>
          <span className="value">{result.unit}</span>
        </div>
        <div className="result-item">
          <span className="label">{t('formatLabel')}:</span>
          <span className="value highlight">{formatted}</span>
        </div>
      </div>

      <div className="examples">
        <h3>{t('examplesTitle')}</h3>
        {[500, 1500, 500000, 2500000, 5000000].map((g) => (
          <div key={g} className="example-item">
            <span className="ms">{g.toLocaleString()} g</span>
            <span className="arrow">→</span>
            <span className="output">{weightUnit.format(g, 2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
