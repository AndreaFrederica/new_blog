<template>
  <div
    class="github-stats-container card-base p-6 rounded-xl"
    :class="$attrs.class"
    :data-username="effectiveUsername"
    :data-use-image-fallback="String(useImageFallback)"
    :data-lang="effectiveLang"
  >
    <!-- GitHub Activity Calendar -->
    <div class="mb-8">
      <h3 class="text-xl font-bold mb-4 text-90">
        {{ i18n(I18nKey.githubContributionCalendar, effectiveLang) }}
      </h3>
      <div class="card-base p-4">
        <div id="github-calendar" data-region="calendar" class="w-full overflow-x-auto image-frame">
          <img
            :src="calendarImageUrl"
            :alt="`${effectiveUsername} GitHub Calendar`"
            class="w-full"
            @error="onCalendarError"
          />
          <div v-if="calendarError" class="text-75 mt-2">
            {{ i18n(I18nKey.githubLoading, effectiveLang) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Stats (Images for stability) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Profile Stats -->
      <div class="card-base p-6">
        <h3 class="text-lg font-bold mb-4 text-90">
          {{ i18n(I18nKey.githubStatsInfo, effectiveLang) }}
        </h3>
        <div id="profile-stats" data-region="profile-stats" class="space-y-3 image-frame">
          <img
            :src="statsImageUrl"
            :alt="`${effectiveUsername} GitHub Stats`"
            class="w-full"
            @error="onStatsError"
          />
          <div v-if="statsError" class="text-75">
            {{ i18n(I18nKey.githubLoading, effectiveLang) }}
          </div>
        </div>
      </div>

      <!-- Language Stats -->
      <div class="card-base p-6">
        <h3 class="text-lg font-bold mb-4 text-90">
          {{ i18n(I18nKey.githubLanguageDistribution, effectiveLang) }}
        </h3>
        <div id="language-chart" data-region="language-chart" class="h-64 image-frame">
          <img
            :src="topLangsImageUrl"
            :alt="`${effectiveUsername} Top Languages`"
            class="w-full"
            @error="onLangsError"
          />
          <div v-if="langsError" class="text-75 mt-2">
            {{ i18n(I18nKey.githubLoading, effectiveLang) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Repository List (link out) -->
    <div class="card-base p-6">
      <h3 class="text-lg font-bold mb-4 text-90">
        {{ i18n(I18nKey.githubPopularRepos, effectiveLang) }}
      </h3>
      <div id="repo-list" data-region="repo-list" class="space-y-3">
        <a
          class="repo-item cursor-pointer p-4 border border-black/10 dark:border-white/15 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition block"
          :href="`https://github.com/${effectiveUsername}?tab=repositories`"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-bold text-90 hover:text-[var(--primary)] transition">
              GitHub Repositories
            </h4>
          </div>
          <p class="text-sm text-75 mb-2">
            {{ i18n(I18nKey.githubLoading, effectiveLang) }}
          </p>
          <div class="flex items-center gap-2 text-xs text-50">
            <span>{{ i18n(I18nKey.githubStatsInfo, effectiveLang) }}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import I18nKey from '../i18n/i18nKey'
import { i18n } from '../i18n/translation'

interface Props {
  username?: string
  useImageFallback?: boolean
  lang?: string
}

const props = withDefaults(defineProps<Props>(), {
  username: 'AndreaFrederica',
  useImageFallback: true,
  lang: 'zh_cn',
})

const effectiveUsername = computed(() => props.username || 'AndreaFrederica')
const effectiveLang = computed(() => props.lang?.toLowerCase() || 'zh_cn')

const statsError = ref(false)
const langsError = ref(false)
const calendarError = ref(false)

// Using popular GitHub stat image providers for a no-API, reliable display
const statsImageUrl = computed(
  () => `https://github-readme-stats.vercel.app/api?username=${encodeURIComponent(effectiveUsername.value)}&show_icons=true&hide_rank=true&theme=transparent`
)
const topLangsImageUrl = computed(
  () => `https://github-readme-stats.vercel.app/api/top-langs/?username=${encodeURIComponent(effectiveUsername.value)}&layout=compact&theme=transparent`
)
const calendarImageUrl = computed(
  () => `https://github-readme-activity-graph.vercel.app/graph?username=${encodeURIComponent(effectiveUsername.value)}&theme=github-compact&area=true`
)

function onStatsError() { statsError.value = true }
function onLangsError() { langsError.value = true }
function onCalendarError() { calendarError.value = true }
</script>

<style>
  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(var(--black), 0.1);
  }
  /* 统一图片/图表的浅色背景和文本颜色 */
  .image-frame {
    background: rgba(var(--black), 0.03);
    color: rgba(var(--black), 0.8);
    border: 1px solid rgba(var(--black), 0.06);
    border-radius: 12px;
    padding: 12px;
  }
  .image-frame img {
    display: block;
    max-width: 100%;
    height: auto;
  }
  
  /* GitHub日历容器特殊样式 - 确保背景更明显 */
  #github-calendar.image-frame,
  .github-calendar{
    background: rgba(var(--black), 0.05) !important;
    border: 1px solid rgba(var(--black), 0.1) !important;
    min-height: 200px;
  }
  
  @media (prefers-color-scheme: dark) {
    .image-frame {
      background: rgba(var(--white), 0.03);
      color: rgba(var(--white), 0.9);
      border: 1px solid rgba(var(--white), 0.08);
    }
    #github-calendar.image-frame,
    .github-calendar{
      background: rgba(var(--white), 0.04) !important;
      border: 1px solid rgba(var(--white), 0.08) !important;
    }
  }
</style>

