import type { CourseLesson } from '../types'
import { s, w } from './helpers'

export const lesson02: CourseLesson = {
  id: 'hsk1-02',
  level: 1,
  number: 2,
  title: '谢谢你',
  titlePinyin: 'Xièxie nǐ',
  titleVi: 'Cảm ơn bạn',
  words: [
    w('xiexie', '谢谢', 'xièxie', 'TẠ TẠ', 'cảm ơn', 'động từ',
      'Như "cảm TẠ", "đa TẠ". Bộ ngôn 讠 (lời nói): cảm ơn là nói ra lời. Âm thứ hai đọc thanh nhẹ.',
      [s('谢谢你！', 'Xièxie nǐ!', 'Cảm ơn bạn!'), s('谢谢您！', 'Xièxie nín!', 'Cảm ơn ông/bà!')],
      { parts: '讠(ngôn, lời nói) + 射 (xạ, bắn)' }),
    w('bu', '不', 'bù', 'BẤT', 'không', 'phó từ',
      'Như "BẤT ngờ", "BẤT hợp pháp". Đứng trước thanh 4 thì đọc thành bú.',
      [s('不好。', 'Bù hǎo.', 'Không tốt.')]),
    w('bukeqi', '不客气', 'bú kèqi', 'BẤT KHÁCH KHÍ', 'không có gì, đừng khách sáo', 'cụm từ',
      'Nghĩa đen: "đừng khách khí", đáp lại lời cảm ơn. 不 đứng trước 客 (thanh 4) nên đọc bú.',
      [s('不客气。', 'Bú kèqi.', 'Không có gì.')],
      { parts: '不 (bất) + 客 (khách) + 气 (khí)' }),
    w('zaijian', '再见', 'zàijiàn', 'TÁI KIẾN', 'tạm biệt', 'động từ',
      '再 (tái, lại) + 见 (kiến, gặp) = gặp lại. Như "tái ngộ". Chữ 见 có hình con mắt 目 đặt trên đôi chân 儿: đi đến để nhìn thấy.',
      [s('再见！', 'Zàijiàn!', 'Tạm biệt!')],
      { parts: '再 (tái, lại) + 见 (kiến, gặp)' }),
    w('duoxie', '多谢', 'duōxiè', 'ĐA TẠ', 'cảm ơn nhiều', 'động từ',
      '多 (đa, nhiều) + 谢 (tạ, cảm ơn): lời cảm ơn nhấn mạnh hơn 谢谢.',
      [s('多谢你！', 'Duōxiè nǐ!', 'Cảm ơn bạn nhiều!')]),
    w('xiexiedajia', '谢谢大家', 'xièxie dàjiā', 'TẠ TẠ ĐẠI GIA', 'cảm ơn mọi người', 'cụm từ',
      '谢谢 (cảm ơn) + 大家 (mọi người): dùng khi cảm ơn cả nhóm.',
      [s('谢谢大家！', 'Xièxie dàjiā!', 'Cảm ơn mọi người!')]),
    w('laian', '来安', 'lái ān', 'LAI AN', 'đến bình an (cụm luyện âm)', 'cụm từ',
      'Cụm luyện thanh điệu để phân biệt lái và ān; ưu tiên nghe và bắt chước.',
      [s('你来。', 'Nǐ lái.', 'Bạn đến đây.')]),
    w('zaijian2', '再会', 'zàihuì', 'TÁI HỘI', 'hẹn gặp lại', 'động từ',
      '再 (lại) + 会 (gặp): cách nói hẹn gặp lại, gần nghĩa với 再见.',
      [s('再会！', 'Zàihuì!', 'Hẹn gặp lại!')]),
  ],
  grammar: [
    {
      id: 'g-thanks',
      title: 'Cảm ơn ai đó: 谢谢 + người',
      pattern: '谢谢 + đại từ',
      explanation:
        'Muốn cảm ơn một người cụ thể thì đặt người đó sau 谢谢. Câu đáp lại thường gặp nhất là 不客气.',
      examples: [
        s('谢谢你！', 'Xièxie nǐ!', 'Cảm ơn bạn!'),
        s('谢谢您！', 'Xièxie nín!', 'Cảm ơn ông/bà!'),
        s('谢谢你们！', 'Xièxie nǐmen!', 'Cảm ơn các bạn!'),
      ],
      drills: [
        { type: 'order', vi: 'Cảm ơn các bạn!', tokens: ['谢谢', '你们'], pinyin: 'Xièxie nǐmen!' },
        { type: 'translate', vi: 'Cảm ơn ông/bà!', hanzi: '谢谢您！', pinyin: 'Xièxie nín!' },
      ],
    },
    {
      id: 'g-bu',
      title: 'Biến điệu của 不',
      pattern: '不 bù + thanh 4 → bú',
      explanation:
        '不 bình thường đọc thanh 4 (bù). Khi đứng trước một âm thanh 4 khác, 不 đọc thành thanh 2 (bú). Khác với quy tắc 3–3, ở đây pinyin thường được VIẾT luôn theo cách đọc: bú kèqi.',
      examples: [
        s('不好。', 'Bù hǎo.', 'Không tốt. (hǎo thanh 3 → giữ bù)'),
        s('不客气。', 'Bú kèqi.', 'Không có gì. (kè thanh 4 → bú)'),
      ],
      drills: [{ type: 'translate', vi: 'Không có gì.', hanzi: '不客气。', pinyin: 'Bú kèqi.' }],
    },
  ],
  dialogues: [
    {
      id: 'd1',
      title: 'Cảm ơn',
      scene: 'Anna giúp Vương Minh nhặt quyển sách bị rơi.',
      lines: [
        { speaker: 'Vương Minh', ...s('谢谢你！', 'Xièxie nǐ!', 'Cảm ơn bạn!') },
        { speaker: 'Anna', ...s('不客气。', 'Bú kèqi.', 'Không có gì.') },
      ],
    },
    {
      id: 'd2',
      title: 'Tan học',
      scene: 'Cuối giờ, học sinh chào cô giáo ra về.',
      lines: [
        { speaker: 'Học sinh', ...s('谢谢您！', 'Xièxie nín!', 'Em cảm ơn cô!') },
        { speaker: 'Cô giáo', ...s('不客气。再见！', 'Bú kèqi. Zàijiàn!', 'Không có gì. Tạm biệt!') },
        { speaker: 'Học sinh', ...s('再见！', 'Zàijiàn!', 'Tạm biệt cô!') },
      ],
    },
  ],
}
