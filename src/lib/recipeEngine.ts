import type { IngredientInfo } from '../data/ingredients'
import { ingredients as ingredientDictionary, ROOT_STYLE_INGREDIENTS } from '../data/ingredients'
import { signatureRecipes } from '../data/recipes'
import type { Recipe, RecipeIngredient } from '../types/recipe'

const MAX_DETECTED_INGREDIENTS = 4
const MAX_SUGGESTIONS = 3

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]}と${names[1]}`
  return names.join('・')
}

function prepLines(detected: IngredientInfo[]): string[] {
  return detected.map((ingredient) => `${ingredient.name}は${ingredient.prep}。`)
}

function mainIngredients(detected: IngredientInfo[]): RecipeIngredient[] {
  return detected.map((ingredient) => ({ name: ingredient.name, amount: ingredient.amount }))
}

interface StyleDefinition {
  emoji: string
  titleSuffix: string
  extraItems: string
  seasoning: (detected: IngredientInfo[]) => RecipeIngredient[]
  buildSteps: (detected: IngredientInfo[]) => string[]
}

const DEFAULT_EXTRA_ITEMS = '基本の調味料のみで作れます。'

// キムチのように味の系統がはっきりした食材が入っているときは、
// 標準の調味料（コンソメ・醤油だけ等）だとちぐはぐになるため、
// 系統に合う調味料・手順に差し替える。
function hasKimchi(detected: IngredientInfo[]): boolean {
  return detected.some((ingredient) => ingredient.name === 'キムチ')
}

const STYLES: Record<string, StyleDefinition> = {
  stirfry: {
    emoji: '🍳',
    titleSuffix: '炒め物',
    extraItems: DEFAULT_EXTRA_ITEMS,
    seasoning: (detected) =>
      hasKimchi(detected)
        ? [
            { name: 'コチュジャン', amount: '大さじ1' },
            { name: 'ごま油', amount: '大さじ1' },
            { name: '醤油', amount: '小さじ1' },
            { name: 'おろしニンニク', amount: '小さじ1/2' },
          ]
        : [
            { name: '醤油', amount: '大さじ1' },
            { name: '酒', amount: '大さじ1' },
            { name: '塩コショウ', amount: '少々' },
            { name: 'サラダ油', amount: '大さじ1' },
          ],
    buildSteps: (detected) => [
      ...prepLines(detected),
      `フライパンに油をひき、${detected[0].name}から順に中火で炒める。`,
      '火が通ってきたら残りの食材を加え、炒め合わせる。',
      hasKimchi(detected)
        ? 'コチュジャン・ごま油・醤油・ニンニクを加えて絡めれば出来上がり。'
        : '醤油・酒・塩コショウで味を調えれば出来上がり。',
    ],
  },
  simmer: {
    emoji: '🍲',
    titleSuffix: '煮物',
    extraItems: DEFAULT_EXTRA_ITEMS,
    seasoning: (detected) =>
      hasKimchi(detected)
        ? [
            { name: '水', amount: '200ml' },
            { name: '味噌', amount: '大さじ1' },
            { name: 'ごま油', amount: '小さじ1' },
          ]
        : [
            { name: '水', amount: '300ml' },
            { name: '醤油', amount: '大さじ2' },
            { name: 'みりん', amount: '大さじ2' },
            { name: '砂糖', amount: '大さじ1' },
          ],
    buildSteps: (detected) =>
      hasKimchi(detected)
        ? [
            ...prepLines(detected),
            '鍋にごま油を熱し、キムチ以外の食材を軽く炒める。',
            'キムチと水を加えて煮立て、中火で5分ほど煮る。',
            '味噌を溶き入れ、ひと煮立ちさせれば出来上がり。',
          ]
        : [
            ...prepLines(detected),
            '鍋に水を入れて火にかけ、沸騰したら食材を加える。',
            'アクを取りながら中火で5分ほど煮る。',
            '醤油・みりん・砂糖を加え、落し蓋をして10分ほど煮含めれば出来上がり。',
          ],
  },
  soup: {
    emoji: '🥣',
    titleSuffix: 'スープ',
    extraItems: DEFAULT_EXTRA_ITEMS,
    seasoning: (detected) =>
      hasKimchi(detected)
        ? [
            { name: '水', amount: '400ml' },
            { name: '鶏がらスープの素', amount: '小さじ2' },
            { name: '味噌', amount: '小さじ1' },
            { name: 'ごま油', amount: '小さじ1' },
          ]
        : [
            { name: '水', amount: '400ml' },
            { name: 'コンソメ顆粒', amount: '小さじ2' },
            { name: '塩コショウ', amount: '少々' },
          ],
    buildSteps: (detected) =>
      hasKimchi(detected)
        ? [
            ...prepLines(detected),
            '鍋にごま油を熱し、キムチ以外の食材を軽く炒める。',
            '水と鶏がらスープの素、キムチを加えて煮立てる。',
            '食材に火が通ったら味噌を溶き入れれば出来上がり。',
          ]
        : [
            ...prepLines(detected),
            '鍋に水とコンソメを入れて火にかける。',
            '食材を加え、やわらかくなるまで煮る。',
            '塩コショウで味を調えれば出来上がり。',
          ],
  },
  salad: {
    emoji: '🥗',
    titleSuffix: 'サラダ',
    extraItems: DEFAULT_EXTRA_ITEMS,
    seasoning: () => [
      { name: 'マヨネーズ', amount: '大さじ2' },
      { name: '醤油', amount: '小さじ1' },
    ],
    buildSteps: (detected) => [
      ...prepLines(detected),
      '生の食感が気になる食材は、さっと茹でるか電子レンジで加熱しておく。',
      'ボウルに食材を入れる。',
      'マヨネーズ・醤油を加えて和えれば出来上がり。',
    ],
  },
  namul: {
    emoji: '🌿',
    titleSuffix: 'ナムル',
    extraItems: DEFAULT_EXTRA_ITEMS,
    seasoning: () => [
      { name: 'ごま油', amount: '大さじ1' },
      { name: '鶏がらスープの素', amount: '小さじ1' },
      { name: 'すりごま', amount: '大さじ1' },
      { name: 'おろしニンニク', amount: '少々' },
      { name: '塩', amount: '少々' },
    ],
    buildSteps: (detected) => [
      ...prepLines(detected),
      '食材はさっと茹でるか電子レンジで加熱し、水気をよく切る。',
      'ボウルに食材を入れる。',
      'ごま油・鶏がらスープの素・すりごま・ニンニク・塩を加えて和えれば出来上がり。',
    ],
  },
  sweetvinegar: {
    emoji: '🍊',
    titleSuffix: '甘酢あん',
    extraItems: '片栗粉は水で溶いてから加えてください。',
    seasoning: () => [
      { name: 'ケチャップ', amount: '大さじ2' },
      { name: '酢', amount: '大さじ2' },
      { name: '砂糖', amount: '大さじ1' },
      { name: '醤油', amount: '大さじ1' },
      { name: '水溶き片栗粉', amount: '大さじ2' },
      { name: 'サラダ油', amount: '大さじ1' },
    ],
    buildSteps: (detected) => [
      ...prepLines(detected),
      `フライパンに油をひき、${detected[0].name}から順に中火で炒める。`,
      '全体に火が通ったら、ケチャップ・酢・砂糖・醤油を混ぜたタレを加えて絡める。',
      '水溶き片栗粉を加え、とろみがついたら出来上がり。',
    ],
  },
  foilbake: {
    emoji: '🎁',
    titleSuffix: 'ホイル焼き',
    extraItems: 'アルミホイルが必要です。',
    seasoning: () => [
      { name: 'バター', amount: '15g' },
      { name: '酒', amount: '大さじ1' },
      { name: 'ポン酢', amount: '大さじ2' },
    ],
    buildSteps: (detected) => [
      ...prepLines(detected),
      'アルミホイルに食材をすべてのせる。',
      '酒をふりかけ、バターをのせて包む。',
      'フライパンかグリルで中火10〜12分蒸し焼きにする。',
      '仕上げにポン酢をかければ出来上がり。',
    ],
  },
  gratin: {
    emoji: '🧀',
    titleSuffix: 'チーズグラタン',
    extraItems: DEFAULT_EXTRA_ITEMS,
    seasoning: () => [
      { name: 'バター', amount: '20g' },
      { name: '小麦粉', amount: '大さじ2' },
      { name: '牛乳', amount: '300ml' },
      { name: 'ピザ用チーズ', amount: '80g' },
      { name: '塩コショウ', amount: '少々' },
    ],
    buildSteps: (detected) => [
      ...prepLines(detected),
      'フライパンにバターを溶かし、食材を炒める。',
      '小麦粉を加えて粉っぽさがなくなるまで炒め、牛乳を少しずつ加えてとろみをつける。',
      '塩コショウで味を調え、耐熱皿に入れてチーズをのせる。',
      'オーブントースターで焼き色がつくまで焼けば出来上がり。',
    ],
  },
  curry: {
    emoji: '🍛',
    titleSuffix: 'カレー',
    extraItems: DEFAULT_EXTRA_ITEMS,
    seasoning: () => [
      { name: '水', amount: '400ml' },
      { name: 'カレールウ', amount: '2〜3皿分' },
      { name: 'ご飯', amount: 'お好みで' },
    ],
    buildSteps: (detected) => [
      ...prepLines(detected),
      '鍋に油をひき、食材を炒める。',
      '水を加えて煮立て、アクを取りながら食材がやわらかくなるまで煮る。',
      '一度火を止めてカレールウを溶かし入れる。',
      '再び弱火にかけ、とろみがつくまで煮込めば出来上がり。ご飯にかけてどうぞ。',
    ],
  },
}

type StyleKey = keyof typeof STYLES

const ALL_STYLES = Object.keys(STYLES) as StyleKey[]

// 生食向き・特殊な食材は、合わない調理法（グラタンやカレーなど）を除外する。
// ここに載っていない食材はすべてのスタイルに対応できるとみなす。
const STYLE_OVERRIDES: Record<string, StyleKey[]> = {
  // 生でシャキシャキ食べるのが基本で、こってり煮込む・焼き込む料理には向かない
  'レタス': ['salad', 'stirfry', 'soup'],
  'きゅうり': ['salad', 'stirfry', 'soup'],
  '豆苗': ['salad', 'stirfry', 'soup'],
  'みょうが': ['salad', 'soup'],
  'セロリ': ['salad', 'stirfry', 'soup', 'simmer'],
  // 食感が繊細で、煮込み過ぎたり焼き込んだりすると水っぽくなる
  'もやし': ['stirfry', 'soup', 'salad', 'namul'],
  // 発酵食品でクセが強く、洋風のこってりした料理と合わせにくい
  '納豆': ['soup'],
  'キムチ': ['stirfry', 'soup', 'simmer', 'gratin'],
}

function getCompatibleStyles(ingredient: IngredientInfo): StyleKey[] {
  return STYLE_OVERRIDES[ingredient.name] ?? ALL_STYLES
}

const SEAFOOD_INGREDIENTS = new Set(['鮭', 'えび', 'さば缶', 'ツナ缶'])
const NAMUL_FRIENDLY_INGREDIENTS = new Set([
  'もやし',
  'にんじん',
  'ほうれん草',
  '小松菜',
  '豆腐',
  '大根',
  'きゅうり',
  '豆苗',
])

// 検出された食材すべてが対応できるスタイルの共通部分だけを候補にする。
// こうすることで「レタスと牛肉のチーズグラタン」のような、食材とスタイルが
// 噛み合わない組み合わせを提案しないようにする。
// さらに、食材の傾向（魚介・根菜・ナムル向き等）によって優先順位を変え、
// 毎回同じ3スタイルばかりにならないようにする。
function pickStyleKeys(detected: IngredientInfo[]): StyleKey[] {
  const compatible = ALL_STYLES.filter((style) =>
    detected.every((ingredient) => getCompatibleStyles(ingredient).includes(style)),
  )

  const hasRoot = detected.some((ingredient) => ROOT_STYLE_INGREDIENTS.has(ingredient.name))
  const hasSeafood = detected.some((ingredient) => SEAFOOD_INGREDIENTS.has(ingredient.name))
  const hasNamulFriendly = detected.some((ingredient) =>
    NAMUL_FRIENDLY_INGREDIENTS.has(ingredient.name),
  )

  let priority: StyleKey[]
  if (hasSeafood) {
    priority = ['foilbake', 'stirfry', 'soup', 'gratin', 'sweetvinegar', 'simmer', 'namul', 'salad', 'curry']
  } else if (hasRoot) {
    priority = ['simmer', 'curry', 'sweetvinegar', 'stirfry', 'soup', 'gratin', 'namul', 'salad', 'foilbake']
  } else if (hasNamulFriendly) {
    priority = ['namul', 'stirfry', 'sweetvinegar', 'soup', 'gratin', 'salad', 'simmer', 'foilbake', 'curry']
  } else {
    priority = ['stirfry', 'sweetvinegar', 'soup', 'gratin', 'salad', 'namul', 'simmer', 'foilbake', 'curry']
  }

  return priority.filter((style) => compatible.includes(style))
}

function buildRecipeForStyle(
  styleKey: keyof typeof STYLES,
  detected: IngredientInfo[],
  idSuffix: string,
): Recipe {
  const style = STYLES[styleKey]
  const joinedNames = joinNames(detected.map((d) => d.name))
  return {
    id: `gen-${styleKey}-${idSuffix}`,
    title: `${joinedNames}の${style.titleSuffix}`,
    requiredKeywords: detected.map((d) => d.name),
    servings: '2人分',
    ingredients: [...mainIngredients(detected), ...style.seasoning(detected)],
    extraItems: style.extraItems,
    steps: style.buildSteps(detected),
    emoji: style.emoji,
  }
}

// 入力文に登場する順番で、辞書に登録された食材を最大4つまで検出する
function detectIngredients(inputText: string): IngredientInfo[] {
  const matches = ingredientDictionary
    .map((ingredient) => ({ ingredient, index: inputText.indexOf(ingredient.name) }))
    .filter((match) => match.index !== -1)
    .sort((a, b) => a.index - b.index)

  return matches.slice(0, MAX_DETECTED_INGREDIENTS).map((match) => match.ingredient)
}

// 手作りレシピのうち、キーワードが2つ以上一致するものを優先候補として探す
function findBestSignatureMatch(inputText: string): Recipe | null {
  let best: Recipe | null = null
  let bestScore = 0

  for (const recipe of signatureRecipes) {
    const score = recipe.requiredKeywords.filter((keyword) => inputText.includes(keyword)).length
    if (score >= 2 && score > bestScore) {
      bestScore = score
      best = recipe
    }
  }

  return best
}

export function getRecipeSuggestions(inputText: string): Recipe[] {
  const normalized = inputText.trim()
  if (!normalized) return []

  const suggestions: Recipe[] = []

  const signatureMatch = findBestSignatureMatch(normalized)
  if (signatureMatch) {
    suggestions.push(signatureMatch)
  }

  const detected = detectIngredients(normalized)
  if (detected.length > 0) {
    const idSuffix = detected.map((d) => d.name).join('-')
    for (const styleKey of pickStyleKeys(detected)) {
      if (suggestions.length >= MAX_SUGGESTIONS) break
      suggestions.push(buildRecipeForStyle(styleKey, detected, `${idSuffix}-${styleKey}`))
    }
  }

  return suggestions.slice(0, MAX_SUGGESTIONS)
}
