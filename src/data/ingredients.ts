export interface IngredientInfo {
  name: string
  amount: string
  prep: string
}

// たんぱく質系（16種）
const proteins: IngredientInfo[] = [
  { name: '鶏肉', amount: '200g', prep: '一口大に切る' },
  { name: '豚肉', amount: '150g', prep: '食べやすい大きさに切る' },
  { name: '牛肉', amount: '150g', prep: '食べやすい大きさに切る' },
  { name: 'ひき肉', amount: '150g', prep: 'そのまま使う' },
  { name: 'ベーコン', amount: '4枚', prep: '1cm幅に切る' },
  { name: 'ウインナー', amount: '4本', prep: '斜め薄切りにする' },
  { name: '卵', amount: '2個', prep: '溶きほぐす' },
  { name: '豆腐', amount: '1丁（300g）', prep: '食べやすい大きさに切り、軽く水切りする' },
  { name: '厚揚げ', amount: '1枚（150g）', prep: '一口大に切る' },
  { name: '油揚げ', amount: '1枚', prep: '短冊切りにする' },
  { name: '納豆', amount: '2パック', prep: 'よく混ぜておく' },
  { name: 'ツナ缶', amount: '1缶（70g）', prep: '缶汁を軽く切る' },
  { name: 'さば缶', amount: '1缶（190g）', prep: '缶汁を軽く切る' },
  { name: '鮭', amount: '2切れ', prep: '一口大に切る' },
  { name: 'えび', amount: '10尾', prep: '殻と背わたを取る' },
  { name: 'ちくわ', amount: '3本', prep: '斜め切りにする' },
]

// 野菜・きのこ・その他（34種）
const others: IngredientInfo[] = [
  { name: 'キャベツ', amount: '1/4個', prep: 'ざく切りにする' },
  { name: 'もやし', amount: '1袋（200g）', prep: 'さっと洗って水気を切る' },
  { name: '玉ねぎ', amount: '1個', prep: '薄切りにする' },
  { name: 'にんじん', amount: '1本', prep: '細切りにする' },
  { name: 'じゃがいも', amount: '2個', prep: '一口大に切る' },
  { name: 'きゅうり', amount: '1本', prep: '薄切りにする' },
  { name: 'なす', amount: '2本', prep: '乱切りにする' },
  { name: 'ピーマン', amount: '3個', prep: '細切りにする' },
  { name: 'パプリカ', amount: '1個', prep: '細切りにする' },
  { name: 'ほうれん草', amount: '1束', prep: '4cm幅に切る' },
  { name: '小松菜', amount: '1束', prep: '4cm幅に切る' },
  { name: '白菜', amount: '1/4個', prep: 'ざく切りにする' },
  { name: '大根', amount: '1/3本', prep: 'いちょう切りにする' },
  { name: 'ねぎ', amount: '1本', prep: '斜め薄切りにする' },
  { name: 'にら', amount: '1束', prep: '4cm幅に切る' },
  { name: 'ブロッコリー', amount: '1株', prep: '小房に分ける' },
  { name: 'アスパラ', amount: '1束', prep: '斜め切りにする' },
  { name: 'かぼちゃ', amount: '1/4個', prep: '一口大に切る' },
  { name: 'トマト', amount: '2個', prep: 'くし切りにする' },
  { name: 'しめじ', amount: '1パック', prep: '石づきを取ってほぐす' },
  { name: 'えのき', amount: '1パック', prep: '石づきを取ってほぐす' },
  { name: 'しいたけ', amount: '4枚', prep: '薄切りにする' },
  { name: 'れんこん', amount: '200g', prep: '薄い半月切りにする' },
  { name: 'ごぼう', amount: '1本', prep: 'ささがきにする' },
  { name: 'さつまいも', amount: '1本', prep: '一口大に切る' },
  { name: 'オクラ', amount: '10本', prep: '小口切りにする' },
  { name: 'ズッキーニ', amount: '1本', prep: '輪切りにする' },
  { name: '豆苗', amount: '1袋', prep: '根元を落として半分に切る' },
  { name: 'キムチ', amount: '100g', prep: '食べやすい大きさに切る' },
  { name: '冷凍ミックスベジタブル', amount: '100g', prep: '解凍しておく' },
  { name: 'レタス', amount: '1/2玉', prep: '食べやすい大きさにちぎる' },
  { name: 'セロリ', amount: '1本', prep: '筋を取り、斜め薄切りにする' },
  { name: 'チンゲン菜', amount: '2株', prep: '根元を落とし、葉と軸に分けて切る' },
  { name: 'みょうが', amount: '3個', prep: '縦半分に切って薄切りにする' },
]

export const ingredients: IngredientInfo[] = [...proteins, ...others]

// 煮物にすると美味しい食材（どちらかがこれに該当する組み合わせは煮物にする）
export const ROOT_STYLE_INGREDIENTS = new Set([
  '大根',
  'にんじん',
  'じゃがいも',
  'かぼちゃ',
  'れんこん',
  'ごぼう',
  'さつまいも',
])
