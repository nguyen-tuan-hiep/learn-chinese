import type { CharType } from './charComponents'

/** Hand-written English memory notes for every character introduced in HSK 1.
 * Row: char | kind | story. Kind: t pictograph, c indicative, h compound,
 * s phonetic-semantic, m borrowed, k hard-to-split simplified form. Stories are memory aids:
 * where the real origin is obscure, they say so or give a clearly-marked tip. */
const ROWS = `你|s|亻 (person) + 尔 (ěr, sound hint): the person standing in front of you is “YOU”.
好|h|A woman 女 holding a child 子: mother and child together is GOOD.
您|h|你 placed above 心 (heart): someone you hold in your heart with respect, polite “YOU”.
们|s|亻 (person) + 门 (mén, door, sound hint): a group of people at the door marks the PLURAL.
对|h|又 (hand) + 寸 (inch, measuring): a hand measuring until it fits, so CORRECT, matching.
不|m|Originally a flower stalk under the horizon 一; later borrowed to mean NOT.
起|s|走 (walk) + 己 (jǐ, sound hint): GET UP to start walking.
没|s|氵 (water) + 殳: sunk out of sight in the water, so there is NONE.
关|k|Simplified from 關: a bar across two door leaves, so to CLOSE; also RELATION.
系|h|A hand 丿 joining silk threads 糸: to tie, to CONNECT.
早|h|The sun 日 just rising above a treetop 十: EARLY morning.
安|h|A woman 女 under a roof 宀: a home at rest is PEACEFUL, SAFE.
晚|s|日 (sun) + 免 (miǎn, sound hint): the sun is excused from work, it is LATE, EVENING.
各|h|A foot 夂 walking to the doorway 口: everyone goes to their own home, EACH.
位|h|亻 (person) + 立 (stand): the place where a person stands, a POSITION; a polite measure word for people.
呀|s|口 (mouth) + 牙 (yá, tooth, sound hint): the sound “ya!” from the mouth.
谢|s|讠 (speech) + 射 (shè, sound hint): words of THANKS.
客|s|宀 (roof) + 各 (gè, sound hint): people arriving at your house from everywhere are GUESTS.
气|t|Three strokes like wisps of steam rising: AIR, vapour.
再|c|Two layers stacked in the same frame: once more, AGAIN.
见|h|Simplified from 見: an eye 目 on top of legs 儿, a person with wide eyes who SEES.
多|h|Two pieces of meat 夕 piled up: MANY.
大|t|A person with arms and legs stretched wide: BIG.
家|h|A pig 豕 under a roof 宀: a household that can keep a pig is a FAMILY, a HOME.
来|m|Originally a wheat plant (來); borrowed for its sound to mean COME.
会|h|People 人 gathering like clouds 云: a MEETING; also to KNOW HOW to do.
叫|s|口 (mouth) + 丩 (sound hint): open your mouth to CALL out a name.
什|s|亻 (person) + 十 (shí, sound hint); in 什么 it means “what”.
么|k|A simplified form used only in 什么, 怎么, 这么. Tip: a silk thread 幺 cut short.
名|h|Evening 夕 + mouth 口: in the dark you can't see faces, so you call out a NAME.
字|s|A child 子 (zǐ, sound hint) under a roof 宀: characters multiply like children, a CHARACTER.
我|m|Originally a saw-toothed halberd (扌 + 戈); borrowed to mean I, ME.
是|h|The sun 日 above 正 (upright): under the sun all is plainly RIGHT, “TO BE”.
老|t|An old person, bent, with long hair and a walking stick 匕: OLD.
师|h|Simplified from 師: a place where crowds gather; the one who leads them is the TEACHER.
吗|s|口 (mouth) + 马 (mǎ, sound hint): the “ma” at the end of a question.
学|h|A child 子 under a roof 冖, hands above guiding it: to STUDY.
生|t|A sprout pushing up out of the ground 土: to be BORN, to live.
人|t|A person leaning forward mid-stride; the two strokes are two legs.
中|c|A vertical stroke right through the MIDDLE of a box 口.
国|h|A border 囗 around precious jade 玉: a COUNTRY.
美|h|A big 大 sheep 羊: a fat sheep is BEAUTIFUL, and tasty.
籍|s|⺮ (bamboo) + 耤 (sound hint): old registers were written on bamboo slips, a REGISTER.
姓|h|女 (woman) + 生 (birth): in ancient times the family name came from the mother, a SURNAME.
哪|s|口 (mouth) + 那 (nà, sound hint): asking “WHICH?”.
里|h|Fields 田 on earth 土: a place with fields is a village; INSIDE.
自|t|A picture of a nose; Chinese people point to their nose to say “me”, so SELF.
她|s|女 (woman) + 也: like 他 but with the woman radical, “SHE”.
谁|s|讠 (speech) + 隹 (zhuī, bird, sound hint): asking “WHO?”.
的|s|白 (white) + 勺 (sháo, sound hint): the white bullseye of a target; the particle “'s”.
汉|s|氵 (water): the Han River, then the Han dynasty, the HAN people.
语|s|讠 (speech) + 吾 (wú, sound hint): spoken words, LANGUAGE.
呢|s|口 (mouth) + 尼 (ní, sound hint): end-of-sentence particle, “and what about…?”.
他|s|亻 (person) + 也: another person, “HE”.
同|h|A cover 冂 over a mouth 口: every mouth from one mould, the SAME.
朋|h|Two strings of shells (now written like two 月) side by side: FRIENDS.
友|h|Two hands 𠂇 and 又 clasping each other: FRIEND.
有|h|A hand 𠂇 holding a piece of meat 月: to HAVE.
口|t|A picture of an open MOUTH.
女|t|A kneeling WOMAN with hands crossed in front.
儿|t|A child's two legs (simplified from 兒): CHILD.
几|m|A picture of a small table; borrowed to ask HOW MANY.
岁|h|A mountain 山 that has seen many evenings 夕: the passing years, AGE.
了|t|A baby wrapped up so its arms don't show: FINISHED.
今|c|A cover 人 over a line: right at this moment, NOW.
年|t|A person carrying a sheaf of grain on their back: one harvest is one YEAR.
一|c|One horizontal line: ONE.
二|c|Two lines: TWO.
三|c|Three lines: THREE.
四|m|Once written as four lines; later borrowed a mouth shape 囗 with 儿 to tell it apart: FOUR.
五|c|Two lines for heaven and earth with a cross between them: FIVE.
六|m|A picture of a hut roof; borrowed as the number SIX.
七|c|A line chopped across (its old meaning was “cut”); borrowed as SEVEN.
八|c|Two strokes parting to either side, originally “divide”; the number EIGHT.
九|m|A picture of a bent arm; borrowed as the number NINE.
十|c|Horizontal and vertical crossing, all four directions complete: TEN.
说|s|讠 (speech) + 兑 (duì, sound hint): to SPEAK.
妈|s|女 (woman) + 马 (mǎ, sound hint): MUM.
菜|s|艹 (grass) + 采 (cǎi, pick, sound hint): greens you pick, VEGETABLES, a DISH.
很|s|彳 (step) + 艮 (gèn, sound hint): VERY.
吃|s|口 (mouth) + 乞 (qǐ, sound hint): put it in your mouth, EAT.
做|h|亻 (person) + 故 (matter): a person at work, to DO, MAKE.
写|k|Simplified from 寫: to WRITE. Tip: a cover 冖 over a pen 与.
怎|s|乍 (zhà, sound hint) over 心 (heart): wondering in your heart, HOW.
读|s|讠 (speech) + 卖 (mài, sound hint): to READ aloud.
请|s|讠 (speech) + 青 (qīng, sound hint): words of INVITATION, please.
问|s|A mouth 口 in a doorway 门 (mén, sound hint): standing at the door to ASK.
天|c|A person 大 with a line 一 above the head: what is above you is the SKY; a DAY.
号|h|A mouth 口 with breath bursting out 丂: to shout, a NUMBER; a date in the month.
月|t|A picture of a crescent moon: MOON, MONTH.
星|s|日 (light) + 生 (shēng, sound hint): points of light, STARS.
期|s|月 (moon) + 其 (qí, sound hint): one cycle of the moon, a PERIOD.
昨|s|日 (day) + 乍 (zhà, sound hint): the day just gone, YESTERDAY.
明|h|Sun 日 and moon 月 shining together: BRIGHT; 明天 is tomorrow.
去|h|A person (now written 土) leaving a cave mouth 厶: to GO.
校|s|木 (wood) + 交 (jiāo, sound hint): a grounds with a wooden fence, a SCHOOL.
看|h|A hand 手 shading the eye 目 to look far: to LOOK, WATCH.
书|k|Simplified from 書: BOOK. Tip: a winding brush stroke with a drop of ink.
想|s|相 (xiāng, sound hint) over 心 (heart): in your heart you THINK, WANT.
喝|s|口 (mouth) + 曷 (hé, sound hint): to DRINK.
茶|h|Grass 艹, a person 人, a tree 木: someone picking leaves to brew TEA.
米|t|Grains of rice scattered around the stalk: RICE.
饭|s|饣 (food) + 反 (fǎn, sound hint): cooked rice, a MEAL.
下|c|A mark BELOW the horizontal line.
午|m|A picture of a rice pestle; borrowed for the hour of wǔ, NOON.
商|m|The name of the Shang dynasty; Shang people were good traders, so TRADE.
店|s|广 (wide roof) + 占 (zhàn, sound hint): a SHOP.
买|k|Simplified from 買 (shells were money): to BUY. Tip: 买 buy; 卖 sell has an extra 十 on top.
个|k|A stick 丨 under a cover 人: the general measure word.
杯|s|木 (wood) + 不 (sound hint): a CUP.
子|t|A swaddled baby with a big head and outstretched arms: CHILD.
这|k|辶 (walk) + 文: something that has come close to you, THIS.
那|m|Once the name of a place (阝 marks a town); borrowed to mean THAT.
少|h|小 (small) with a slash cutting a bit off: FEW.
钱|s|钅 (metal) + 戋 (sound hint): copper coins, MONEY.
块|s|土 (earth) + 夬 (guài, sound hint): a clod of earth, a LUMP; a yuan.
小|c|A stroke in the middle with two small dots beside it: SMALL.
猫|s|犭 (animal) + 苗 (miáo, sound hint): CAT, it even says “miao”.
在|s|才 (cái, sound hint) + 土 (earth): present on this ground, to BE AT.
狗|s|犭 (animal) + 句 (gōu, sound hint): DOG.
椅|s|木 (wood) + 奇 (qí, sound hint): a wooden CHAIR with a back.
面|t|A face with an eye in the middle: FACE; side; noodles.
工|t|A picture of a carpenter's square: WORK.
作|s|亻 (person) + 乍 (zhà, sound hint): a person who WORKS, makes.
医|h|An arrow 矢 in a box 匸: tools for treating wounds, MEDICINE.
院|s|阝 (earthen wall) + 完 (wán, sound hint): buildings inside a wall, a COURTYARD, institute.
爸|s|父 (father) + 巴 (bā, sound hint): DAD.
桌|s|卓 (zhuō, tall, sound hint) over 木 (wood): a TABLE.
上|c|A mark ABOVE the horizontal line.
电|t|Lightning flashing out of a cloud: ELECTRICITY.
脑|s|⺼ (flesh) + a head with hair: the BRAIN.
和|s|禾 (hé, grain, sound hint) + 口 (mouth): grain for every mouth means HARMONY; AND.
本|c|A line marking the ROOT of a tree 木: origin; a measure word for BOOKS.
前|h|A foot stepping on a boat moving ahead: FRONT, before.
后|k|Simplified form standing in for 後 (lagging steps): BEHIND, AFTER.
能|m|A picture of a strong bear; borrowed to mean CAN, ability.
坐|h|Two people 人 sitting on the ground 土: to SIT.
现|s|王 (jade) + 见 (jiàn, sound hint): jade coming into view, to APPEAR; now.
点|s|灬 (fire) + 占 (zhàn, sound hint): a scorched black spot, a DOT; o'CLOCK.
分|h|A knife 刀 splitting something in two 八: DIVIDE; MINUTE.
时|s|日 (sun) + 寸 (inch): measuring the sun's shadow tells the TIME.
候|s|亻 (person) + 矦 (hóu, sound hint): a person waiting; 时候 means “when”.
回|t|A whirlpool, ring within ring: to RETURN.
影|s|景 (jǐng, sound hint) + 彡 (rays of light): SHADOW, IMAGE.
住|s|亻 (person) + 主 (zhǔ, sound hint): a person who makes a place their own, to LIVE.
北|h|Two people standing back to back: the back; houses turn their backs to the NORTH.
京|t|A tall building on raised ground: the CAPITAL.
样|s|木 (tree) + 羊 (yáng, sound hint): a pattern, a KIND.
太|c|大 (big) with an extra dot: bigger than big, TOO.
热|s|执 (zhí, sound hint) over 灬 (fire): HOT.
冷|s|冫 (ice) + 令 (lìng, sound hint): COLD.
雨|t|Drops of water falling from a cloud: RAIN.
姐|s|女 (woman) + 且 (qiě, sound hint): OLDER SISTER.
身|t|A person with a big belly (pregnant): the BODY.
体|h|亻 (person) + 本 (root): the root of a person is the body, BODY.
爱|h|A hand 爫 covering 冖 a friend 友: to LOVE.
些|s|此 (cǐ, sound hint) + 二: SOME.
水|t|Water flowing down the middle with splashes on both sides: WATER.
果|t|Fruit 田 on top of a tree 木: FRUIT.
喂|s|口 (mouth) + 畏 (wèi, sound hint): the call “HELLO?” on the phone.
也|m|The original picture is unclear; borrowed to mean ALSO.
习|k|Simplified from 習 (a bird flapping its wings to learn to fly): to PRACTISE.
睡|s|目 (eye) + 垂 (chuí, droop, sound hint): eyelids drooping, to SLEEP.
觉|s|An eye 见 under a roof: waking up and noticing, to FEEL; in 睡觉 it's read jiào.
视|s|礻 + 见 (see): to LOOK at; 电视 is TV.
喜|h|A drum 壴 above a laughing mouth 口: drumming and singing, HAPPY.
欢|s|又 + 欠 (open mouth): mouth open with laughter, JOYFUL.
给|s|纟 (silk) + 合 (hé, sound hint): handing a thread to someone, to GIVE.
打|s|扌 (hand) + 丁 (dīng, nail, sound hint): a hand hammering a nail, to HIT.
话|h|讠 (speech) + 舌 (tongue): the tongue shapes WORDS.
吧|s|口 (mouth) + 巴 (bā, sound hint): the particle for “let's…”, “…right?”.
东|m|Originally a sack tied at both ends, borrowed for EAST. Tip: traditional 東 is the sun 日 rising behind a tree 木.
西|t|A picture of a nest; birds return to the nest when the sun sets in the WEST.
苹|s|艹 (grass) + 平 (píng, sound hint): 苹果 is an APPLE.
先|h|A foot stepping out ahead of a person 儿: to go FIRST.
开|h|Two hands 廾 lifting the bar 一 off a door: to OPEN.
车|t|A CART seen from above: body, axle and wheels.
钟|s|钅 (metal) + 中 (zhōng, sound hint): a BELL, a CLOCK.
衣|t|A collar on top and two flaps of cloth below: CLOTHES.
服|h|A hand 又 pressing a kneeling person 卩 beside a boat 月: to submit; CLOTHES.
漂|s|氵 (water) + 票 (piào, sound hint): to float on water; 漂亮 means PRETTY.
亮|h|A person 几 standing in a tall tower 亠口冖: BRIGHT.
啊|s|口 (mouth) + 阿 (ā, sound hint): the sound “AH!”.
都|s|阝 (town) + 者 (zhě, sound hint): a CAPITAL; read dōu it means ALL.
认|s|讠 (speech) + 人 (rén, sound hint): to RECOGNISE.
识|s|讠 (speech) + 只 (zhǐ, sound hint): to KNOW.
出|h|A foot 屮 stepping out of a pit 凵: to GO OUT.
租|s|禾 (grain) + 且 (qiě, sound hint): rent once paid in grain, to RENT.
高|t|A tower with many storeys: TALL.
兴|k|Simplified from 興 (many hands lifting together): EXCITED, happy.
听|s|口 (mouth) + 斤 (jīn, sound hint): to LISTEN.
飞|t|A bird's wings beating: to FLY.
机|s|木 (wood) + 几 (jī, sound hint): a wooden frame, a MACHINE.`

/** How a character was formed (the traditional six categories plus simplified forms). */
export type NoteKind = 'pictograph' | 'indicative' | 'compound' | 'phonetic' | 'borrowed' | 'simplified'

export const NOTE_KIND_LABEL: Record<NoteKind, string> = {
  pictograph: 'Pictograph', indicative: 'Indicative', compound: 'Compound',
  phonetic: 'Sound + meaning', borrowed: 'Borrowed', simplified: 'Simplified',
}

/** Fallback label from the generated data when a character has no hand-written note. */
export const CHAR_TYPE_LABEL: Record<CharType, string> = { pictographic: 'Pictograph', ideographic: 'Compound / indicative', pictophonetic: 'Sound + meaning' }

const KINDS: Record<string, NoteKind> = { t: 'pictograph', c: 'indicative', h: 'compound', s: 'phonetic', m: 'borrowed', k: 'simplified' }

export interface CharNote { kind: NoteKind; story: string }

export const CHAR_NOTES = new Map<string, CharNote>(ROWS.split('\n').map((row) => {
  const [char, kind, story] = row.split('|')
  return [char, { kind: KINDS[kind], story }]
}))
