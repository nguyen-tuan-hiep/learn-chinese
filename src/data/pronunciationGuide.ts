import { PRON_LESSONS } from './pronunciation'
import type { Tone } from '@/lib/pinyin'

export type SoundKind = 'initials' | 'finals'
export interface SoundGuide {
  id: string; group: string; kind: SoundKind; label: string; pinyin: string; say: string
  approximate: string; mouth: string; caution: string
}
// Vietnamese cues are editorial mnemonics, not IPA or literal transcriptions.
// Phonetic reference: Open University Pronunciation Guide; MIT Wheatley, Sounds and symbols.
const hints: Record<string, [string, string, string]> = {
  b: ['p nhẹ, không bật hơi', 'Khép hai môi rồi mở nhanh; luồng hơi ít.', 'Không đọc thành b hữu thanh tiếng Việt. So sánh b–p.'],
  p: ['p bật hơi', 'Khép môi rồi bật ra với luồng hơi rõ; thử bằng tờ giấy.', 'Khác b ở luồng hơi, không phải ở độ to.'],
  m: ['gần m', 'Khép môi, để hơi qua mũi.', 'Nghe cả vận mẫu và thanh điệu trong âm mẫu.'],
  f: ['gần ph', 'Răng trên chạm nhẹ môi dưới, thổi hơi qua khe.', 'Không khép cả hai môi như p.'],
  d: ['gần t không bật hơi', 'Đầu lưỡi chạm lợi trên rồi nhả, hơi ít.', 'Không đọc thành d hoặc đ tiếng Việt.'],
  t: ['gần th, có bật hơi', 'Đầu lưỡi chạm lợi trên rồi nhả với luồng hơi rõ.', 'So sánh d–t bằng tờ giấy.'],
  n: ['gần n', 'Đầu lưỡi chạm lợi trên; hơi qua mũi.', 'Phân biệt n với l bằng đường thoát hơi.'],
  l: ['gần l', 'Đầu lưỡi chạm lợi trên; hơi thoát hai bên lưỡi.', 'Không đưa hơi chủ yếu qua mũi như n.'],
  g: ['gần c/k không bật hơi', 'Nâng phần sau lưỡi chạm vòm mềm rồi nhả.', 'Không đọc thành g/gh tiếng Việt.'],
  k: ['k bật hơi', 'Tư thế như g nhưng nhả ra với luồng hơi mạnh hơn.', 'Không thay bằng kh ma sát tiếng Việt.'],
  h: ['gần kh nhẹ', 'Giữ khe hẹp ở phần sau lưỡi để hơi cọ qua.', 'Là hơi ma sát; khác k bật ra sau khi chặn hơi.'],
  j: ['gần ch nhẹ', 'Đầu lưỡi hướng xuống, mặt lưỡi nâng gần ngạc cứng; không bật hơi.', 'Không uốn đầu lưỡi như zh.'],
  q: ['ch có bật hơi', 'Tư thế như j, nhả với luồng hơi rõ.', 'Không đọc theo chữ q tiếng Việt.'],
  x: ['gần x, lưỡi đưa ra trước', 'Đầu lưỡi hướng xuống; hơi cọ qua khe giữa mặt lưỡi và ngạc.', 'Không dùng khẩu hình uốn lưỡi của sh.'],
  zh: ['gần tr, không bật hơi', 'Nâng đầu lưỡi về phía sau lợi trên rồi nhả.', 'Không cần cuộn lưỡi quá sâu; so sánh zh–ch.'],
  ch: ['tr có bật hơi', 'Tư thế như zh, nhả với luồng hơi rõ.', 'Khác q ở vị trí lưỡi.'],
  sh: ['gợi s uốn lưỡi', 'Nâng đầu lưỡi về sau lợi, giữ khe để hơi cọ qua.', 'Cách đọc s tiếng Việt khác theo vùng; ưu tiên mẫu nghe.'],
  r: ['không có âm Việt tương đương sát', 'Nâng đầu lưỡi về sau lợi như sh, có rung dây thanh.', 'Không rung đầu lưỡi liên tục như một số cách đọc r tiếng Việt.'],
  z: ['t + x nối rất nhanh', 'Đầu lưỡi chặn rồi nhả vào khe hẹp gần răng; không bật hơi.', 'Là một âm liền, không đọc thành hai âm tiết.'],
  c: ['t + x có bật hơi', 'Tư thế như z nhưng nhả với luồng hơi rõ.', 'Không đọc là c/k tiếng Việt.'],
  s: ['gần x', 'Đầu lưỡi gần răng dưới, hơi qua khe gần răng trên.', 'Phân biệt với sh uốn lưỡi.'],
  a: ['gần a', 'Mở miệng rộng, lưỡi thấp.', 'Giữ âm rõ rồi thêm thanh điệu.'],
  o: ['gần ô; có chuyển âm nhẹ', 'Tròn môi; nghe cách âm thay đổi trong bo, po, mo, fo.', 'Không áp một âm ô tiếng Việt cho mọi tổ hợp.'],
  e: ['gần ơ', 'Miệng hé, môi không tròn, lưỡi hơi lùi.', 'Không đọc thành e tiếng Việt; trong ie/üe âm này thay đổi.'],
  i: ['gần i trong yi, ji', 'Môi hơi dẹt, mặt lưỡi nâng cao về trước.', 'Sau z/c/s và zh/ch/sh/r, chữ i có cách đọc khác; không đọc thành i thông thường.'],
  u: ['gần u', 'Tròn môi, nâng phần sau lưỡi.', 'Phân biệt u với ü.'],
  ü: ['không có âm Việt tương đương sát', 'Giữ lưỡi ở tư thế i rồi tròn môi như u.', 'Không tách thành hai âm u-i. Sau j/q/x/y, ü thường viết u.'],
  ai: ['gần ai', 'Từ a lướt sang i trong cùng âm tiết.', 'Không ngắt giữa hai nguyên âm.'],
  ei: ['gần ây/êi', 'Từ ê lướt về i.', 'Không đọc thành hai âm tiết ê–i.'],
  ao: ['gần ao', 'Từ a lướt về âm cuối tròn môi.', 'Nghe độ mở của nguyên âm đầu.'],
  ou: ['gần âu/ôu', 'Từ ô lướt về u, môi tròn dần.', 'Không đọc thành o–u rời nhau.'],
  an: ['gần an', 'Bắt đầu a, kết thúc bằng đầu lưỡi chạm lợi trên.', 'Đuôi n khác ng trong ang.'],
  en: ['gần ân/ơn', 'Âm giữa không tròn môi; kết thúc bằng n.', 'Phân biệt en–eng.'],
  in: ['gần in', 'Đọc i rồi kết thúc bằng n.', 'Không đổi đuôi n thành ng.'],
  un: ['gần uân', 'Ghép u + en liền; sau phụ âm thường viết gọn un.', 'Dạng đầy đủ uen; jun/qun/xun dùng ün, không phải uen.'],
  ün: ['gợi in với môi tròn', 'Giữ lưỡi phía trước, tròn môi, kết thúc bằng n.', 'yun/jun/qun/xun bỏ hai chấm trên ü.'],
  ang: ['gần ang', 'Miệng mở, phần sau lưỡi đóng đuôi ng.', 'Không dùng đầu lưỡi đóng đuôi n.'],
  eng: ['gần âng/ơng', 'Từ nguyên âm giữa tới đuôi ng.', 'Khác en ở vị trí đóng âm cuối.'],
  ing: ['gần inh nhưng nghe đuôi ng', 'Bắt đầu i, kết thúc bằng phần sau lưỡi.', 'Cách đọc inh tiếng Việt thay đổi theo vùng; nghe mẫu để điều chỉnh.'],
  ong: ['gần ung', 'Tròn môi, kết thúc bằng ng.', 'Không đọc máy móc theo ong tiếng Việt.'],
  ia: ['i + a nối liền', 'Từ i lướt sang a trong một âm tiết.', 'Không đọc thành hai âm i–a.'],
  ie: ['gần iê', 'Từ i lướt sang ê, miệng mở thêm.', 'e ở đây không đọc như e đứng riêng.'],
  ua: ['gần oa', 'Từ u lướt sang a, môi mở dần.', 'Giữ một âm tiết.'],
  uo: ['gần uô', 'Từ u lướt sang nguyên âm tròn môi mở hơn.', 'Không thêm âm cuối c hoặc t.'],
  üe: ['gợi ü + ê', 'Bắt đầu bằng ü rồi mở sang ê.', 'Không thay ü bằng u thông thường; yue viết không có hai chấm.'],
  iao: ['gợi iao liền', 'Lướt i tới ao trong một âm tiết.', 'Không ngắt thành i–ao.'],
  iu: ['gần iêu', 'Lướt i + ou liền, môi tròn về cuối.', 'Dạng đầy đủ iou, sau phụ âm viết iu.'],
  ui: ['gần uây', 'Lướt u + ei liền trong một âm tiết.', 'Dạng đầy đủ uei, không đọc như ui tiếng Việt.'],
  uai: ['gần oai', 'Lướt u + ai, môi mở dần.', 'Thanh mẫu đứng trước vẫn giữ cách bật hơi riêng.'],
  ian: ['gần iên', 'Từ i sang nguyên âm mở rồi đóng n.', 'Không đọc i-an rời nhau.'],
  uan: ['gần oan', 'Từ u sang an, kết thúc bằng n.', 'Phân biệt uan và üan trong juan/quan/xuan.'],
  üan: ['gợi uyên', 'Giữ lưỡi phía trước và môi tròn lúc bắt đầu, kết thúc n.', 'yuan/juan/quan/xuan bỏ hai chấm trên ü.'],
  iang: ['gần iang', 'Ghép i + ang liền, kết thúc ng.', 'Đuôi ng khác n trong ian.'],
  uang: ['gần oang', 'Ghép u + ang liền, kết thúc ng.', 'Không bỏ đuôi ng.'],
  iong: ['không có âm Việt tương đương sát', 'Bắt đầu với lưỡi phía trước, môi tròn, kết thúc ng.', 'Nghe mẫu xiong; không tách i–ong thành hai âm tiết.'],
  ueng: ['gợi u + âng', 'Lướt u vào eng; khi đứng riêng viết weng.', 'Không nhầm với wen (uen) kết thúc n.'],
  er: ['gợi ơ có uốn lưỡi', 'Đọc nguyên âm đồng thời nâng đầu lưỡi về sau.', 'Không đọc thành ơ + r thành hai âm.'],
}

const extra = [
  { id: 'f-ei', label: 'ei', pinyin: 'bēi', say: '杯', group: 'finals' },
  { id: 'f-ueng', label: 'ueng', pinyin: 'wēng', say: '翁', group: 'finals-2' },
]
export const SOUND_GUIDE: SoundGuide[] = [
  ...PRON_LESSONS.filter(l => l.id !== 'tones').flatMap(l => l.items.map(item => ({ ...item, group: l.id }))),
  ...extra,
].map(item => {
  const label = item.label!
  const [approximate, mouth, caution] = hints[label]
  const group = item.group.startsWith('initials') ? item.group : ['a','o','e','i','u','ü'].includes(label) ? 'vowels' : ['ai','ei','ao','ou'].includes(label) ? 'diphthongs' : ['an','en','in','un','ün','ang','eng','ing','ong','ueng'].includes(label) ? 'nasals' : label === 'er' ? 'er' : 'compound'
  return { id: item.id, group, kind: item.group.startsWith('initials') ? 'initials' : 'finals', label, pinyin: item.id === 'f-o' ? 'bō' : item.pinyin, say: item.id === 'f-o' ? '波' : item.say, approximate, mouth, caution }
})

export const SOUND_GROUPS = [
  { id: 'initials-1', title: 'Môi và đầu lưỡi · b p m f d t n l' },
  { id: 'initials-2', title: 'Phần sau và mặt lưỡi · g k h j q x' },
  { id: 'initials-3', title: 'Đầu lưỡi và uốn lưỡi · zh ch sh r z c s' },
  { id: 'vowels', title: 'Âm đơn · a o e i u ü' },
  { id: 'diphthongs', title: 'Âm ghép cơ bản · ai ei ao ou' },
  { id: 'nasals', title: 'Âm cuối mũi · n và ng' },
  { id: 'compound', title: 'Vận mẫu bắt đầu bằng i/u/ü' },
  { id: 'er', title: 'Âm đặc biệt · er' },
]
export const TONE_GUIDE: { tone: Tone; label: string; mark: string; pinyin: string; say: string; direction: string; caution: string }[] = [
  { tone: 1, label: 'Thanh 1', mark: '¯', pinyin: 'mā', say: '妈', direction: 'Cao và tương đối đều.', caution: 'Giữ cao độ ổn định, không cần gồng giọng.' },
  { tone: 2, label: 'Thanh 2', mark: '´', pinyin: 'má', say: '麻', direction: 'Từ mức giữa đi lên.', caution: 'Dấu giống dấu sắc, nhưng không đồng nhất với thanh sắc tiếng Việt.' },
  { tone: 3, label: 'Thanh 3', mark: 'ˇ', pinyin: 'mǎ', say: '马', direction: 'Xuống thấp; khi đọc riêng có thể nhấc lên cuối.', caution: 'Trong câu thường chỉ đọc thấp; không cố võng đầy đủ ở mọi vị trí.' },
  { tone: 4, label: 'Thanh 4', mark: '`', pinyin: 'mà', say: '骂', direction: 'Từ cao xuống nhanh.', caution: 'Không quy đổi thành thanh huyền hay thanh nặng tiếng Việt.' },
  { tone: 5, label: 'Thanh nhẹ', mark: 'không dấu', pinyin: 'māma', say: '妈妈', direction: 'Âm ma thứ hai ngắn, nhẹ; cao độ phụ thuộc âm trước.', caution: 'Nghe cả từ 妈妈; thanh nhẹ không có một đường cao độ cố định.' },
]
