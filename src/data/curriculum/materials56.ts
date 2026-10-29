import type { CourseLesson, ConfusablePair, Dialogue, GrammarPoint, Reading, Sentence } from '../types'
import { HSK5 } from './level5'
import { HSK6 } from './level6'
import { TEXTBOOK_LESSONS } from './textbookLessons'

/**
 * Alignment record for HSK 5–6. Textbook titles and volume boundaries are
 * transcribed from the HSK Standard Course syllabi. The readings below are
 * original website practice texts, not textbook passages.
 *
 * HSK 5 lesson grammar foci are cross-referenced against HSK University’s
 * lesson-indexed grammar guide (secondary reference); they are not represented
 * as publisher-authored Vietnamese explanations. HSK 6 grammar and confusable
 * pairs are mapped from CLEC's lesson-indexed syllabus transcription
 * (secondary reference), with Vietnamese explanations and examples authored
 * for this site.
 *
 * Sources:
 * - https://www.mandarin.ac.cn/textbook/hsk-5a-syllabus.html
 * - https://www.mandarin.ac.cn/textbook/hsk-5b-syllabus.html
 * - https://www.mandarin.ac.cn/textbook/hsk-6a-syllabus.html
 * - https://www.mandarin.ac.cn/textbook/hsk-6b-syllabus.html
 * - https://hskuniversity.com/hsk-5/grammar/ (secondary grammar cross-reference)
 * - https://www.clecspain.org/images/hanban/cursos/contenito-curso-hsk5.pdf
 * - https://www.clecspain.org/images/hanban/cursos/contenito-curso-hsk6.pdf
 *   (CLEC-hosted lesson-by-lesson syllabus reproductions; secondary transcription)
 */

export interface TextbookMaterial {
  grammar: GrammarPoint[]
  dialogues: Dialogue[]
  readings: Reading[]
  sections: string[]
  exercises: string[]
  /** Site-authored comparison notes mapped to lessons; not copied from textbook lists. */
  confusables: ConfusablePair[]
}

const GRAMMAR5: { title: string; pattern: string; hanzi: string; pinyin: string; vi: string }[] = [
  { title: '如何', pattern: '如何 + động từ', hanzi: '我们应该如何保护环境？', pinyin: 'Wǒmen yīnggāi rúhé bǎohù huánjìng?', vi: 'Chúng ta nên bảo vệ môi trường như thế nào?' },
  { title: '以来', pattern: 'mốc thời gian + 以来', hanzi: '多年以来，这座城市发生了很大变化。', pinyin: 'Duōnián yǐlái, zhè zuò chéngshì fāshēng le hěn dà biànhuà.', vi: 'Suốt nhiều năm qua, thành phố này đã thay đổi rất nhiều.' },
  { title: '各自', pattern: '各自 + động từ', hanzi: '会议结束后，大家各自回家。', pinyin: 'Huìyì jiéshù hòu, dàjiā gèzì huí jiā.', vi: 'Cuộc họp kết thúc, mọi người tự về nhà.' },
  { title: '至今', pattern: 'mốc thời gian + 至今', hanzi: '这个习惯一直保持至今。', pinyin: 'Zhège xíguàn yìzhí bǎochí zhìjīn.', vi: 'Thói quen này vẫn được duy trì cho đến nay.' },
  { title: '起来', pattern: 'động từ + 起来', hanzi: '天气渐渐冷起来了。', pinyin: 'Tiānqì jiànjiàn lěng qǐlái le.', vi: 'Thời tiết dần trở lạnh.' },
  { title: '替', pattern: '替 + người + động từ', hanzi: '我替你把材料交给老师。', pinyin: 'Wǒ tì nǐ bǎ cáiliào jiāo gěi lǎoshī.', vi: 'Tôi nộp tài liệu cho thầy/cô thay bạn.' },
  { title: '瞎', pattern: '瞎 + động từ', hanzi: '不要瞎猜，先看清楚事实。', pinyin: 'Bú yào xiā cāi, xiān kàn qīngchu shìshí.', vi: 'Đừng đoán mò, hãy nhìn rõ sự thật trước.' },
  { title: '倒', pattern: '倒 + động từ/tính từ', hanzi: '他倒很愿意听听大家的意见。', pinyin: 'Tā dào hěn yuànyì tīngting dàjiā de yìjiàn.', vi: 'Anh ấy lại rất sẵn lòng nghe ý kiến mọi người.' },
  { title: '算', pattern: '算 + danh từ/tính từ', hanzi: '这次合作算是一个好的开始。', pinyin: 'Zhè cì hézuò suàn shì yí ge hǎo de kāishǐ.', vi: 'Lần hợp tác này có thể xem là một khởi đầu tốt.' },
  { title: '毕竟', pattern: '毕竟 + mệnh đề', hanzi: '这件事毕竟关系到大家的生活。', pinyin: 'Zhè jiàn shì bìjìng guānxì dào dàjiā de shēnghuó.', vi: 'Dù sao việc này cũng liên quan đến cuộc sống của mọi người.' },
  { title: '过来', pattern: 'động từ + 过来', hanzi: '休息一会儿以后，她的精神恢复过来了。', pinyin: 'Xiūxi yíhuǐr yǐhòu, tā de jīngshén huīfù guòlái le.', vi: 'Nghỉ một lúc, tinh thần cô ấy đã hồi phục.' },
  { title: '以及', pattern: 'A、B 以及 C', hanzi: '我们要保护森林、河流以及野生动物。', pinyin: 'Wǒmen yào bǎohù sēnlín, héliú yǐjí yěshēng dòngwù.', vi: 'Chúng ta cần bảo vệ rừng, sông ngòi và cả động vật hoang dã.' },
  { title: '何况', pattern: 'mệnh đề 1，更何况 + mệnh đề 2', hanzi: '新人都能完成这项工作，更何况有经验的人呢？', pinyin: 'Xīnrén dōu néng wánchéng zhè xiàng gōngzuò, gèng hékuàng yǒu jīngyàn de rén ne?', vi: 'Người mới còn làm được việc này, huống chi người có kinh nghiệm?' },
  { title: '所谓', pattern: '所谓 + danh từ/khái niệm', hanzi: '所谓成功，不只是得到别人的认可。', pinyin: 'Suǒwèi chénggōng, bù zhǐ shì dédào biérén de rènkě.', vi: 'Cái gọi là thành công không chỉ là được người khác công nhận.' },
  { title: '过', pattern: 'động từ + 得/不 + 过', hanzi: '我说不过他，只好请老师来判断。', pinyin: 'Wǒ shuō bú guò tā, zhǐhǎo qǐng lǎoshī lái pànduàn.', vi: 'Tôi tranh luận không lại anh ấy, đành mời thầy/cô phân xử.' },
  { title: '即', pattern: 'A，即 B', hanzi: '这次活动分为两部分，即讲座和讨论。', pinyin: 'Zhè cì huódòng fēn wéi liǎng bùfen, jí jiǎngzuò hé tǎolùn.', vi: 'Hoạt động lần này chia làm hai phần, tức là diễn thuyết và thảo luận.' },
  { title: '以', pattern: '以 + phương tiện/căn cứ + động từ', hanzi: '我们应该以事实为依据。', pinyin: 'Wǒmen yīnggāi yǐ shìshí wéi yījù.', vi: 'Chúng ta nên lấy sự thật làm căn cứ.' },
  { title: '极其', pattern: '极其 + tính từ nhiều âm tiết', hanzi: '保护水资源对每个人都极其重要。', pinyin: 'Bǎohù shuǐ zīyuán duì měi ge rén dōu jíqí zhòngyào.', vi: 'Bảo vệ tài nguyên nước vô cùng quan trọng với mỗi người.' },
  { title: '般', pattern: 'danh từ + 般 + tính từ', hanzi: '夜晚般安静的山村让人忘记了时间。', pinyin: 'Yèwǎn bān ānjìng de shāncūn ràng rén wàngjì le shíjiān.', vi: 'Ngôi làng yên tĩnh như đêm xuống khiến người ta quên thời gian.' },
  { title: '毫无', pattern: '毫无 + danh từ', hanzi: '他对这个话题毫无兴趣。', pinyin: 'Tā duì zhège huàtí háowú xìngqù.', vi: 'Anh ấy hoàn toàn không hứng thú với chủ đề này.' },
  { title: '死记硬背', pattern: '死记硬背 + nội dung', hanzi: '学语言不能死记硬背，还要理解词语的用法。', pinyin: 'Xué yǔyán bù néng sǐjì-yìngbèi, hái yào lǐjiě cíyǔ de yòngfǎ.', vi: 'Học ngôn ngữ không thể chỉ học vẹt, còn phải hiểu cách dùng từ.' },
  { title: '自从', pattern: '自从 + mốc + 以后', hanzi: '自从搬到这里以后，她一直坚持种花。', pinyin: 'Zìcóng bān dào zhèlǐ yǐhòu, tā yìzhí jiānchí zhòng huā.', vi: 'Từ khi chuyển đến đây, cô ấy luôn kiên trì trồng hoa.' },
  { title: '一致', pattern: 'ý kiến/đặc điểm + 一致', hanzi: '讨论以后，大家的意见基本一致。', pinyin: 'Tǎolùn yǐhòu, dàjiā de yìjiàn jīběn yízhì.', vi: 'Sau khi thảo luận, ý kiến của mọi người cơ bản thống nhất.' },
  { title: '…来', pattern: 'khoảng thời gian + 来', hanzi: '她在乡村支教一年多来，认识了许多孩子。', pinyin: 'Tā zài xiāngcūn zhījiào yì nián duō lái, rènshi le xǔduō háizi.', vi: 'Trong hơn một năm dạy học tình nguyện ở nông thôn, cô ấy đã quen nhiều em nhỏ.' },
  { title: '一连', pattern: '一连 + khoảng thời gian/số lần', hanzi: '他一连工作了三个晚上，终于完成了报告。', pinyin: 'Tā yìlián gōngzuò le sān ge wǎnshang, zhōngyú wánchéng le bàogào.', vi: 'Anh ấy làm việc liền ba buổi tối, cuối cùng cũng hoàn thành báo cáo.' },
  { title: '至于', pattern: '至于 + chủ đề', hanzi: '先解决交通问题，至于费用我们再讨论。', pinyin: 'Xiān jiějué jiāotōng wèntí, zhìyú fèiyòng wǒmen zài tǎolùn.', vi: 'Hãy giải quyết vấn đề giao thông trước; còn chi phí, chúng ta sẽ bàn sau.' },
  { title: '眼睁睁', pattern: '眼睁睁地 + 看着 + tình huống', hanzi: '我们不能眼睁睁地看着河水被污染。', pinyin: 'Wǒmen bù néng yǎnzhēngzhēng de kànzhe héshuǐ bèi wūrǎn.', vi: 'Chúng ta không thể trơ mắt nhìn nước sông bị ô nhiễm.' },
  { title: '宁可', pattern: '宁可 A，也不 B', hanzi: '我宁可多走十分钟，也不愿意迟到。', pinyin: 'Wǒ nìngkě duō zǒu shí fēnzhōng, yě bú yuànyì chídào.', vi: 'Tôi thà đi thêm mười phút còn hơn đến muộn.' },
  { title: '凭', pattern: '凭 + căn cứ/năng lực + kết quả', hanzi: '她凭自己的努力获得了大家的认可。', pinyin: 'Tā píng zìjǐ de nǔlì huòdé le dàjiā de rènkě.', vi: 'Cô ấy nhờ nỗ lực của mình mà được mọi người công nhận.' },
  { title: '万一', pattern: '万一 + giả định，（就）+ kết quả', hanzi: '万一计划有变，我们要及时通知大家。', pinyin: 'Wànyī jìhuà yǒu biàn, wǒmen yào jíshí tōngzhī dàjiā.', vi: 'Nếu chẳng may kế hoạch thay đổi, chúng ta cần báo cho mọi người kịp thời.' },
  { title: '不至于', pattern: '不至于 + kết quả', hanzi: '只要提前准备，就不至于手忙脚乱。', pinyin: 'Zhǐyào tíqián zhǔnbèi, jiù bú zhìyú shǒumángjiǎoluàn.', vi: 'Chỉ cần chuẩn bị trước thì sẽ không đến nỗi luống cuống.' },
  { title: '嗯', pattern: '嗯 + lời đáp/tiếp nhận ý kiến', hanzi: '嗯，你说得有道理，我们再想想办法。', pinyin: 'Ǹg, nǐ shuō de yǒu dàolǐ, wǒmen zài xiǎngxiang bànfǎ.', vi: 'Ừ, bạn nói có lý, chúng ta nghĩ thêm cách nhé.' },
  { title: '轻易', pattern: '不 + 轻易 + động từ', hanzi: '他不会轻易放弃自己的目标。', pinyin: 'Tā bú huì qīngyì fàngqì zìjǐ de mùbiāo.', vi: 'Anh ấy sẽ không dễ dàng từ bỏ mục tiêu của mình.' },
  { title: '逐步', pattern: '逐步 + động từ/tính từ', hanzi: '经过努力，村里逐步改善了饮水条件。', pinyin: 'Jīngguò nǔlì, cūnli zhúbù gǎishàn le yǐnshuǐ tiáojiàn.', vi: 'Sau nhiều nỗ lực, điều kiện nước sinh hoạt trong làng dần được cải thiện.' },
  { title: '与其', pattern: '与其 A，不如 B', hanzi: '与其抱怨，不如先找解决办法。', pinyin: 'Yǔqí bàoyuàn, bùrú xiān zhǎo jiějué bànfǎ.', vi: 'Thay vì phàn nàn, chi bằng tìm cách giải quyết trước.' },
  { title: '除非', pattern: '除非 + điều kiện，否则 + kết quả', hanzi: '除非得到大家的同意，否则我们不能开始。', pinyin: 'Chúfēi dédào dàjiā de tóngyì, fǒuzé wǒmen bù néng kāishǐ.', vi: 'Trừ khi được mọi người đồng ý, nếu không chúng ta không thể bắt đầu.' },
]

// Lesson-indexed headings cross-referenced from the secondary HSK University
// guide. The page reports 109 points total; these labels are not publisher
// verification. Explanations/examples below are short site-authored notes.
const EXTRA_GRAMMAR5: Record<number, string[]> = {
  1: ['靠', '居然'], 2: ['临', '立刻'], 3: ['勿', '包括', '时刻'], 4: ['顶', '得不行', '反而'],
  5: ['从而', '有助于', '为'], 6: ['说不定', '似的', '纷纷'], 7: ['分别', '便'], 8: ['来来去去', '要不'],
  9: ['作为', '曾经'], 10: ['逐渐', '或许'], 11: ['所', '相当'], 12: ['程度', '数'], 13: ['何必', '多亏'],
  14: ['则', '起'], 15: ['迟早', '再三'], 16: ['个别', '非'], 17: ['平常', '宁可'], 18: ['其余', '可见'],
  19: ['闻', '趁'], 20: ['假如'], 21: ['偶然', '尽快'], 22: ['一旦', '难免', '自从'],
  23: ['某', '幸亏'], 24: ['至于'], 25: ['哪怕', '朝', '简直'], 26: ['总算', '至于'],
  27: ['未必', '过于'], 28: ['乃至', '凭'], 29: ['干脆', '万一', '不如'], 30: ['无意', '有利', '至于'],
  31: ['嗯', '轻易'], 32: ['密切', '尽量', '逐步'], 33: ['照常', '难怪', '与其'],
  34: ['总之'], 35: ['赶快', '片', '根本'], 36: ['直', '反正'],
}

// Supplemental contrasts are authored for this site and mapped by lesson
// topic/vocabulary; they are not claimed to reproduce the books' phrase lists.
const CONFUSABLES5: [string, string, string][] = [
  ['如何','怎么','如何偏书面，怎么更常用于口语。'],['悄悄','偷偷','悄悄强调动作轻、声音小；偷偷强调不让别人知道。'],['舒适','舒服','舒适偏书面，常形容环境；舒服更口语，也可描述身体感受。'],['满足','满意','满足常说需求得到实现；满意表达主观认可。'],['美丽','优美','美丽形容外观；优美常形容姿态、文字或环境的和谐。'],['打听','询问','打听常指向他人探听消息；询问是正式地提出问题。'],['忽然','突然','两者都表示意外发生；突然也可作形容词，忽然多作副词。'],['彼此','互相','彼此指双方或多方；互相强调动作相向发生。'],
  ['亲自','自己','亲自强调本人到场做；自己强调主体是本人而非别人。'],['显示','显得','显示表示显露/展示；显得表示给人某种印象。'],['持续','继续','持续强调状态不断；继续强调动作接着进行。'],['发达','发展','发达描述达到较高水平；发展描述变化和成长过程。'],['激烈','强烈','激烈多形容冲突或竞争；强烈多形容感受、愿望或程度。'],['通常','常常','通常说一般规律；常常说频繁发生。'],['胜利','成功','胜利多用于竞争或斗争获胜；成功强调达到目标。'],['临时','暂时','临时指临近需要时安排；暂时指一段有限时间。'],['忽视','轻视','忽视是没有注意；轻视是认为不重要。'],['目前','现在','目前偏正式地指当前阶段；现在可指此刻或当下时期。'],
  ['怀念','想念','怀念常回想过去的人事；想念表示思念某人或某地。'],['记录','纪录','记录是记下/所记内容；纪录是某项最高或最好成绩。'],['硬','坚硬','硬可指不柔软或态度强；坚硬主要形容物体质地。'],['偶然','偶尔','偶然指非必然发生；偶尔指发生频率低。'],['单独','独自','单独强调没有与其他事物一起；独自强调一个人行动。'],['发表','发布','发表常用于意见、文章；发布常用于消息、命令。'],['严肃','严格','严肃指态度庄重；严格指要求或标准高。'],['总算','终于','总算常含费力后松一口气；终于强调经过过程后结果发生。'],['损失','失去','损失常指财物或利益受损；失去强调不再拥有。'],['反应','反映','反应是对刺激的回应；反映是显示情况或把意见报告出来。'],['挤','拥挤','挤可作动作/状态；拥挤形容人或物密集。'],['的确','确实','两者都表示事实如此；的确语气更强调确认。'],['接近','靠近','接近可指距离近或程度相似；靠近强调空间上移近。'],['轻易','容易','轻易常说不谨慎地做或很快做；容易表示难度低。'],['鼓励','鼓舞','鼓励是给人支持；鼓舞强调使人振奋。'],['表现','体现','表现是具体呈现；体现强调抽象特征通过事物显出。'],['羽毛','毛发','羽毛属于鸟类；毛发泛指人或动物的毛。'],['出汗','流汗','两者近义；出汗较中性，流汗突出汗液流出。'],['花草','植物','花草指花和草等常见观赏植物；植物是更广的类别。'],
]

// CLEC PDF lists two lesson components: grammar/language focus (a) and the
// contrast pair (b). These are transcribed as secondary source data.
const GRAMMAR6_SOURCE: Record<number, string[]> = {
  1:['巴不得','别提多……了'],2:['恨不得','顿时','不由得'],3:['番','过于','着呢'],4:['乘机','不料','未免'],5:['而已','固然','无非'],6:['唯独','明明','大不了'],7:['于','致使','并非'],
  8:['对……而言','有关','不瞒你说'],9:['通红/雪白','说A就A','得要命'],10:['以至','即便','所在'],11:['统统','以……为……','该干吗干吗'],12:['不妨','务必','鉴于'],13:['便于','犹如','和……相比'],14:['数量短语重叠','难以','免得'],15:['时而','不禁','无不'],16:['换句话说','为……所……','足以'],17:['东A西B','中（zhòng）','姑且'],18:['随即','宁愿','A归A'],19:['进而','得以','偏偏'],20:['况且','大','倒不如'],
  21:['以免','嫌'],22:['动不动','甲乙丙丁……'],23:['加以','大大/远远'],24:['紧缩句','特意'],25:['即将','能A就A'],26:['别说','来来回回'],27:['左……右……','不成'],28:['与“个”相关的格式','向来'],29:['预先','……也好，……也罢'],30:['不时','多多少少'],31:['逐','归根到底'],32:['哪怕','反之'],33:['A的A，B的B','一时'],
  34:['尚且','当'],35:['终究','愈……愈……'],36:['一经','本着 + 名词'],37:['为……起见','暂且'],38:['屡次','依据'],39:['任意','尚未'],40:['（把）……放在眼里','不无'],
}
const CONFUSABLES6: [string,string][] = [
  ['人家','别人'],['体谅','原谅'],['起码','至少'],['恰巧','正好'],['专程','专门'],['创立','创办'],['日益','越来越'],
  ['极端','极度'],['索性','干脆'],['凡是','所有'],['急切','急忙'],['不得已','不得不'],['一向','一度'],['鼓动','鼓励'],['拥有','具有'],['以便','便于'],['势必','一定'],['连同','一起'],['历来','从来'],['将近','将要'],
  ['不免','未免'],['担保','保证'],['万分','十分'],['特意','故意'],['大致','大体'],['挨','受'],['一贯','一直'],['气势','气魄'],['诸','各'],['容忍','忍受'],['胡乱','随便'],['许可','允许'],['现场','当场'],
  ['温和','温柔'],['连年','连续'],['截止','终止'],['恐惧','恐怖'],['就近','附近'],['乐趣','兴趣'],['顽强','坚强'],
]

function sourceGrammar6(lesson: CourseLesson): GrammarPoint[] {
  return (GRAMMAR6_SOURCE[lesson.number] ?? []).map((heading, index) => ({
    id: `hsk6-g${String(lesson.number).padStart(2, '0')}-clec-${index + 1}`,
    title: `Điểm ngôn ngữ đối chiếu: ${heading}`,
    pattern: `${heading} + cấu trúc theo ngữ cảnh`,
    explanation: `Mục “${heading}” được liệt kê ở bài này trong bản syllabus HSK 6 do CLEC Spain đăng tải. Đây là đối chiếu thứ cấp; diễn giải tiếng Việt được biên soạn cho website.`,
    examples: [],
    drills: [],
  }))
}

function confusables6(lesson: CourseLesson): ConfusablePair[] {
  const [a,b] = CONFUSABLES6[lesson.number - 1]
  return [{ a, b, difference: `“${a}” và “${b}” có sắc thái/cách kết hợp khác nhau; đây là cặp đối chiếu theo syllabus CLEC (nguồn thứ cấp).`, examples: [{ hanzi: `“${a}”和“${b}”不能在所有语境中互换。`, pinyin: `“${a}” hé “${b}” bù néng zài suǒyǒu yǔjìng zhōng hùhuàn.`, vi: `“${a}” và “${b}” không thể thay thế cho nhau trong mọi ngữ cảnh.` }] }]
}

function confusablesFor(lesson: CourseLesson): ConfusablePair[] {
  const [a, b, difference] = CONFUSABLES5[lesson.number - 1]
  const example: Sentence = { hanzi: `“${a}”和“${b}”意思有别，要结合上下文选择。`, pinyin: `“${a}” hé “${b}” yìsi yǒu bié, yào jiéhé shàngxiàwén xuǎnzé.`, vi: `“${a}” và “${b}” khác cách dùng; cần chọn theo ngữ cảnh.` }
  const secondaryPairSeen = lesson.number <= 20 || (lesson.number >= 22 && lesson.number <= 33)
  return [{ a, b, difference: `${secondaryPairSeen ? 'Cặp được liệt kê trong syllabus CLEC (đối chiếu thứ cấp). ' : 'Cặp bổ trợ do website biên soạn do chưa trích xuất được dòng cặp từ nguồn. '}${difference}`, examples: [example] }]
}

function extraGrammar(lesson: CourseLesson): GrammarPoint[] {
  return (EXTRA_GRAMMAR5[lesson.number] ?? []).map((heading, index) => ({
    id: `hsk5-g${String(lesson.number).padStart(2, '0')}-secondary-${index + 1}`,
    title: `Đối chiếu bổ sung: ${heading}`,
    pattern: `${heading} + cụm từ/mệnh đề theo ngữ cảnh`,
    explanation: `“${heading}” là mục được liệt kê cho bài này trong hướng dẫn ngữ pháp HSK University (nguồn thứ cấp). Đây là ghi chú ngắn do website biên soạn; cần xem ngữ cảnh và bài học để xác định cách dùng cụ thể.`,
    examples: [],
    drills: [],
  }))
}

function focusWord(lesson: CourseLesson) {
  return lesson.words.find((word) => word.pos === 'danh từ' && word.pinyin && !/[0-9:]/.test(word.pinyin))
    ?? lesson.words.find((word) => word.pinyin && !/[0-9:]/.test(word.pinyin))
    ?? lesson.words[0]
}

function grammarFor(level: 5 | 6, lesson: CourseLesson): GrammarPoint[] {
  if (level === 6) return sourceGrammar6(lesson)
  const { title, pattern, hanzi, pinyin, vi } = GRAMMAR5[lesson.number - 1]
  return [{
    id: `hsk5-g${String(lesson.number).padStart(2, '0')}-bookmap`,
    title: `Trọng điểm đối chiếu: ${title}`,
    pattern,
    explanation: `Mục này được xếp theo bài trong tài liệu đối chiếu ngữ pháp HSK 5. Hãy đọc điểm ngôn ngữ cùng bài khóa “${TEXTBOOK_LESSONS[5][lesson.number - 1].hanzi}”; phần diễn giải bằng tiếng Việt là nội dung biên soạn cho website.`,
    examples: [{ hanzi, pinyin, vi }],
    drills: [],
  }, ...extraGrammar(lesson)]
}

function createReading(level: 5 | 6, lesson: CourseLesson): Reading[] {
  const bookEntry = TEXTBOOK_LESSONS[level][lesson.number - 1]
  const focus = focusWord(lesson)
  if (!focus) return []
  const scenes: { sentences: Sentence[]; questions: Reading['questions'] }[] = [
    {
      sentences: [
        { hanzi: `这一课从“${focus.hanzi}”谈起，提出了一个值得观察的问题。`, pinyin: `Zhè yí kè cóng “${focus.pinyin}” tán qǐ, tíchū le yí ge zhídé guānchá de wèntí.`, vi: `Bài “${bookEntry.vi}” bắt đầu từ “${focus.meaning}” và nêu một vấn đề đáng quan sát.` },
        { hanzi: '小林没有马上下结论，而是先找来几份资料。', pinyin: 'Xiǎo Lín méiyǒu mǎshàng xià jiélùn, ér shì xiān zhǎo lái jǐ fèn zīliào.', vi: 'Tiểu Lâm chưa vội kết luận mà tìm một vài tài liệu trước.' },
        { hanzi: '他把不同的情况放在一起比较，发现原因并不只有一个。', pinyin: 'Tā bǎ bùtóng de qíngkuàng fàng zài yìqǐ bǐjiào, fāxiàn yuányīn bìng bù zhǐ yǒu yí ge.', vi: 'Cậu đặt các tình huống khác nhau cạnh nhau để so sánh và nhận ra nguyên nhân không chỉ có một.' },
        { hanzi: '讨论结束后，大家决定继续收集证据，再提出办法。', pinyin: 'Tǎolùn jiéshù hòu, dàjiā juédìng jìxù shōují zhèngjù, zài tíchū bànfǎ.', vi: 'Sau buổi thảo luận, mọi người quyết định tiếp tục thu thập bằng chứng rồi mới đề xuất giải pháp.' },
      ],
      questions: [
        { q: '小林先做了什么？', choices: ['找资料', '马上下结论', '离开现场', '改变题目'], answer: 0, explain: '第二句说他先找来几份资料。' },
        { q: '比较不同情况后，他发现什么？', choices: ['原因不止一个', '所有情况相同', '资料没有用', '问题已经结束'], answer: 0, explain: '第三句指出原因并不只有一个。' },
        { q: '大家为什么继续收集证据？', choices: ['为了再提出办法', '为了停止讨论', '为了避免比较', '为了换一个小组'], answer: 0, explain: '最后一句说收集证据之后再提出办法。' },
      ],
    },
    {
      sentences: [
        { hanzi: `在本课主题的课堂活动中，大家先分享自己对“${focus.hanzi}”的经验。`, pinyin: `Zài běn kè zhǔtí de kètáng huódòng zhōng, dàjiā xiān fēnxiǎng zìjǐ duì “${focus.pinyin}” de jīngyàn.`, vi: `Trong hoạt động trên lớp về “${bookEntry.vi}”, mọi người chia sẻ trải nghiệm của mình về “${focus.meaning}”.` },
        { hanzi: '有的同学讲了家里的做法，有的同学介绍了自己的看法。', pinyin: 'Yǒu de tóngxué jiǎng le jiālǐ de zuòfǎ, yǒu de tóngxué jièshào le zìjǐ de kànfǎ.', vi: 'Có bạn kể cách làm ở nhà, có bạn trình bày quan điểm của mình.' },
        { hanzi: '老师把这些意见写下来，请大家看看它们有什么相同和不同。', pinyin: 'Lǎoshī bǎ zhèxiē yìjiàn xiě xiàlái, qǐng dàjiā kànkan tāmen yǒu shénme xiāngtóng hé bùtóng.', vi: 'Thầy/cô ghi lại các ý kiến và mời cả lớp tìm điểm giống, khác nhau.' },
        { hanzi: '最后，同学们选出一个可以在本周试行的办法。', pinyin: 'Zuìhòu, tóngxuémen xuǎn chū yí ge kěyǐ zài běn zhōu shìxíng de bànfǎ.', vi: 'Cuối cùng, các bạn chọn một cách có thể thử áp dụng trong tuần này.' },
      ],
      questions: [
        { q: '同学们在课堂上先做什么？', choices: ['分享个人经验', '选出最后办法', '写考试答案', '离开教室'], answer: 0, explain: '第一句说明大家先分享经验。' },
        { q: '老师把意见写下来后，让大家比较什么？', choices: ['相同和不同', '价格和日期', '远近和方向', '姓名和电话'], answer: 0, explain: '第三句明确提出比较相同与不同。' },
        { q: '他们选出的办法有什么特点？', choices: ['本周可以试行', '已经被取消', '只能在家使用', '不需要讨论'], answer: 0, explain: '最后一句说办法可以在本周试行。' },
      ],
    },
    {
      sentences: [
        { hanzi: `这个题目让研究小组注意到“${focus.hanzi}”与周围环境的关系。`, pinyin: `Zhège tímù ràng yánjiū xiǎozǔ zhùyì dào “${focus.pinyin}” yǔ zhōuwéi huánjìng de guānxì.`, vi: `Chủ điểm “${bookEntry.vi}” giúp nhóm nghiên cứu chú ý đến mối liên hệ giữa “${focus.meaning}” và môi trường xung quanh.` },
        { hanzi: '他们连续几天在同一时间做记录，也拍下了现场的变化。', pinyin: 'Tāmen liánxù jǐ tiān zài tóng yí shíjiān zuò jìlù, yě pāi xià le xiànchǎng de biànhuà.', vi: 'Trong vài ngày liên tiếp, họ ghi chép vào cùng một thời điểm và chụp lại những thay đổi tại chỗ.' },
        { hanzi: '把记录放在一起以后，变化的方向就清楚多了。', pinyin: 'Bǎ jìlù fàng zài yìqǐ yǐhòu, biànhuà de fāngxiàng jiù qīngchu duō le.', vi: 'Sau khi đặt các ghi chép cạnh nhau, hướng thay đổi trở nên rõ ràng hơn.' },
        { hanzi: '小组把结果告诉社区，希望更多人也来观察。', pinyin: 'Xiǎozǔ bǎ jiéguǒ gàosu shèqū, xīwàng gèng duō rén yě lái guānchá.', vi: 'Nhóm thông báo kết quả cho cộng đồng và hy vọng nhiều người cùng quan sát.' },
      ],
      questions: [
        { q: '研究小组记录了多长时间？', choices: ['连续几天', '只记录一次', '一个月以后', '整个冬天'], answer: 0, explain: '第二句写明他们连续几天做记录。' },
        { q: '什么时候变化方向更清楚？', choices: ['把记录放在一起以后', '拍照之前', '告诉社区以前', '停止观察以后'], answer: 0, explain: '第三句给出了直接答案。' },
        { q: '小组告诉社区结果的目的是什么？', choices: ['邀请更多人观察', '结束全部记录', '隐藏现场变化', '更换研究主题'], answer: 0, explain: '最后一句说希望更多人也来观察。' },
      ],
    },
    {
      sentences: [
        { hanzi: `为了弄清本课中的一个问题，阿敏先向有经验的人请教“${focus.hanzi}”。`, pinyin: `Wèile nòng qīng běn kè zhōng de yí ge wèntí, Ā Mǐ xiān xiàng yǒu jīngyàn de rén qǐngjiào “${focus.pinyin}”.`, vi: `Để làm rõ một vấn đề trong “${bookEntry.vi}”, A Mẫn hỏi người có kinh nghiệm về “${focus.meaning}”.` },
        { hanzi: '她把听到的建议分成几类，并找出最常见的一种。', pinyin: 'Tā bǎ tīngdào de jiànyì fēn chéng jǐ lèi, bìng zhǎo chū zuì chángjiàn de yì zhǒng.', vi: 'Cô phân loại các lời khuyên đã nghe và tìm ra loại thường gặp nhất.' },
        { hanzi: '试过以后，她发现这个办法需要根据情况调整。', pinyin: 'Shì guò yǐhòu, tā fāxiàn zhège bànfǎ xūyào gēnjù qíngkuàng tiáozhěng.', vi: 'Sau khi thử, cô nhận ra cách này cần được điều chỉnh tùy tình hình.' },
        { hanzi: '她把自己的结果记下来，准备下次再和大家交流。', pinyin: 'Tā bǎ zìjǐ de jiéguǒ jì xiàlái, zhǔnbèi xià cì zài hé dàjiā jiāoliú.', vi: 'Cô ghi lại kết quả của mình để lần sau trao đổi với mọi người.' },
      ],
      questions: [
        { q: '阿敏先向谁请教？', choices: ['有经验的人', '刚来的客人', '学校门卫', '路边的司机'], answer: 0, explain: '第一句说她向有经验的人请教。' },
        { q: '她试过办法后有什么发现？', choices: ['要根据情况调整', '每次都完全一样', '不需要记录', '不能和别人交流'], answer: 0, explain: '第三句说明办法需要按情况调整。' },
        { q: '她为什么记录结果？', choices: ['下次和大家交流', '马上丢掉建议', '避免再次尝试', '改变所有分类'], answer: 0, explain: '最后一句说明她准备下次交流。' },
      ],
    },
  ]
  const sceneIndex = (lesson.number + (level === 6 ? 1 : 0)) % scenes.length
  const { sentences, questions } = scenes[sceneIndex]
  return [{
    id: `hsk${level}-${String(lesson.number).padStart(2, '0')}-site-reading`,
    title: `Bài khóa luyện tập do website biên soạn theo sách · ${bookEntry.hanzi}`,
    sentences,
    questions,
  }]
}

function material(level: 5 | 6, lesson: CourseLesson): TextbookMaterial {
  const focus = focusWord(lesson)
  if (!focus) return { grammar: [], dialogues: [], readings: [], sections: [], exercises: [], confusables: [] }
  return {
    grammar: grammarFor(level, lesson),
    dialogues: [],
    readings: createReading(level, lesson),
    sections: level === 5
      ? ['Bài khóa luyện tập do website biên soạn theo sách', 'Từ mới', 'Điểm ngôn ngữ', 'Cụm từ dễ nhầm', 'Luyện tập']
      : ['Bài khóa luyện tập do website biên soạn theo sách', 'Từ mới', 'Điểm ngôn ngữ', 'Cụm từ dễ nhầm', 'Luyện tập'],
    exercises: [
      `Chọn từ mới trong bài để tóm tắt chủ điểm “${TEXTBOOK_LESSONS[level][lesson.number - 1].vi}” bằng 2–3 câu.`,
      `Dùng trọng điểm “${grammarFor(level, lesson)[0]?.title ?? 'ngữ pháp của bài'}” để viết một câu mới về chủ đề bài học.`,
      'Đọc bài khóa luyện tập do website biên soạn, trả lời câu hỏi và nêu bằng chứng trong đoạn.',
    ],
    confusables: level === 5 ? confusablesFor(lesson) : confusables6(lesson),
  }
}

export const TEXTBOOK_MATERIALS_56: Record<string, TextbookMaterial> = Object.fromEntries([
  ...HSK5.lessons.map((lesson) => [lesson.id, material(5, lesson)] as const),
  ...HSK6.lessons.map((lesson) => [lesson.id, material(6, lesson)] as const),
])
