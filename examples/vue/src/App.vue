<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWeightUnit } from './utils/units'

import './App.css'
const { t, locale } = useI18n()
const inputValue = ref<number>(1500000)
const weightUnit = useWeightUnit()

const result = computed(() => weightUnit.getUnit(inputValue.value))
t('title11')
const formatted = computed(() => weightUnit.format(inputValue.value, 2))

const toggleLocale = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
</script>

<template>
  <div class="app">
    <h1>{{ t('title') }}</h1>
    <p class="subtitle">{{ t('subtitle') }}</p>

    <div class="locale-switcher">
      <span>
        {{ t('currentLocale') }}: <strong>{{ locale === 'zh' ? '中文' : 'English' }}</strong>
      </span>
      <button @click="toggleLocale">
        {{ t('switchTo') }} {{ locale === 'zh' ? 'English' : '中文' }}
      </button>
    </div>

    <div class="input-section">
      <label>{{ t('inputLabel') }}</label>
      <input
        type="number"
        v-model.number="inputValue"
        min="0"
      />
    </div>

    <div class="result-section">
      <h3>{{ t('resultTitle') }}</h3>
      <div class="result-item">
        <span class="label">{{ t('valueLabel') }}:</span>
        <span class="value">{{ result.num.toFixed(2) }}</span>
      </div>
      <div class="result-item">
        <span class="label">{{ t('unitLabel') }}:</span>
        <span class="value">{{ result.unit }}</span>
      </div>
      <div class="result-item">
        <span class="label">{{ t('formatLabel') }}:</span>
        <span class="value highlight">{{ formatted }}</span>
      </div>
    </div>

    <div class="examples">
      <h3>{{ t('examplesTitle') }}</h3>
      <div v-for="g in [500, 1500, 500000, 2500000, 5000000]" :key="g" class="example-item">
        <span class="ms">{{ g.toLocaleString() }} g</span>
        <span class="arrow">→</span>
        <span class="output">{{ weightUnit.format(g, 2) }}</span>
      </div>
    </div>
  </div>
</template>
