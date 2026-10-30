import type { Dialogue, GrammarPoint, Reading, Sentence } from '../types'

/**
 * Book-aligned learning plan for HSK Standard Course 1–2.
 * Lesson headings and grammar sequence are transcribed as short labels from the
 * HSK Standard Course TOCs and the 1–2 Grammar Chart. Explanations, examples,
 * dialogues and prompts below are original website material, not book text.
 * Sources: https://www.hskstandardcourse.com/hsk-standard-course-level-1/hsk-standard-course-1-textbook/
 * https://www.hskstandardcourse.com/hsk-standard-course-level-2/hsk-standard-course-2-textbook/
 * https://www.chinesezerotohero.com/wp-content/uploads/2018/06/HSK-1-2-Standard-Course-Grammar-Chart.pdf
 * HSK 1 lessons 1–2 are pronunciation-focused in the book; the website teaches
 * that content separately at /pronunciation and keeps the dialogues here. Book guide:
 * https://admin.ci.cn/profile/upload/2024/11/12/65917988_20241112093930A776.pdf
 */
export type BookSection12 = 'text' | 'newWords' | 'languagePoints' | 'exercises' | 'comprehensiveExercises'

export interface BookGrammar12 {
  title: string
  pattern: string
  explanation: string
  example: Sentence
}

export interface LessonMaterial12 {
  level: 1 | 2
  lesson: number
  sections: BookSection12[]
  grammar: BookGrammar12[]
  dialogues: Dialogue[]
  exercisePrompts: string[]
}

type G = [string, string, string, string, string, string]
const g = (rows: G[]): BookGrammar12[] => rows.map(([title, pattern, explanation, hanzi, pinyin, vi]) => ({
  title, pattern, explanation, example: { hanzi, pinyin, vi },
}))

const line = (speaker: string, hanzi: string, pinyin: string, vi: string) => ({ speaker, hanzi, pinyin, vi })
const d = (id: string, title: string, scene: string, turns: [string, string, string, string][]): Dialogue => ({
  id, title, scene, lines: turns.map(([speaker, hanzi, pinyin, vi]) => line(speaker, hanzi, pinyin, vi)),
})
const baseSections: BookSection12[] = ['text', 'newWords', 'languagePoints', 'exercises', 'comprehensiveExercises']

const hsk1: LessonMaterial12[] = [
  { level: 1, lesson: 1, sections: ['text', 'newWords', 'exercises'], grammar: [], dialogues: [d('hsk1-01-a', '你好', 'Hai người gặp nhau và chào hỏi.', [['A','你好！','Nǐ hǎo!','Xin chào!'],['B','你好！','Nǐ hǎo!','Xin chào!']])], exercisePrompts: ['Đóng vai hai người mới gặp nhau, dùng 你好 để chào và đáp lời.', 'Dùng 您好 để chào một người lớn tuổi hoặc thầy cô.'] },
  { level: 1, lesson: 2, sections: ['text', 'newWords', 'exercises'], grammar: [], dialogues: [d('hsk1-02-a', '谢谢', 'Một người cảm ơn, người kia đáp lời.', [['A','谢谢你！','Xièxie nǐ!','Cảm ơn bạn!'],['B','不客气！','Bú kèqi!','Không có gì!'],['A','再见！','Zàijiàn!','Tạm biệt!']])], exercisePrompts: ['Đóng vai cảm ơn bằng 谢谢 và đáp lời bằng 不客气.', 'Thực hành nói 再见 khi kết thúc cuộc trò chuyện.'] },
  { level: 1, lesson: 3, sections: baseSections, grammar: g([
    ['什么 · hỏi “gì”','什么 + vị trí cần hỏi','什么 đứng đúng vị trí của thông tin chưa biết trong câu.','你叫什么名字？','Nǐ jiào shénme míngzi?','Bạn tên là gì?'],
    ['什么 + danh từ','什么 + N','什么 đứng trước danh từ để hỏi loại hoặc tên sự vật.','你喝什么茶？','Nǐ hē shénme chá?','Bạn uống trà gì?'],
    ['不是 · phủ định 是','Chủ ngữ + 不是 + danh từ','不 đứng trước 是 để phủ định nhận định về thân phận hoặc loại.','我不是老师。','Wǒ bú shì lǎoshī.','Tôi không phải giáo viên.'],
    ['是 · câu nhận định','Chủ ngữ + 是 + danh từ','是 nối chủ ngữ với danh từ chỉ thân phận hoặc phân loại.','我是学生。','Wǒ shì xuésheng.','Tôi là học sinh.'],
    ['吗 · câu hỏi có/không','Câu kể + 吗？','Thêm 吗 ở cuối câu kể để hỏi người nghe xác nhận.','你是学生吗？','Nǐ shì xuésheng ma?','Bạn là học sinh phải không?'],
  ]), dialogues: [d('hsk1-03-a','你叫什么名字','Hai người mới quen hỏi tên nhau.',[['A','你好！你叫什么名字？','Nǐ hǎo! Nǐ jiào shénme míngzi?','Xin chào! Bạn tên là gì?'],['B','我叫王明。你呢？','Wǒ jiào Wáng Míng. Nǐ ne?','Tôi tên Vương Minh. Còn bạn?'],['A','我叫李月。','Wǒ jiào Lǐ Yuè.','Tôi tên Lý Nguyệt.']])], exercisePrompts:['Thay tên trong mẫu hỏi đáp và tự giới thiệu.','Chọn 是 hoặc 不是 để hoàn thành câu.'] },
  { level: 1, lesson: 4, sections: baseSections, grammar: g([
    ['谁 · hỏi người','谁 + vị trí cần hỏi','谁 thay cho người chưa biết và đứng tại vị trí của người đó.','她是谁？','Tā shì shéi?','Cô ấy là ai?'],
    ['哪 + lượng từ + danh từ','哪 + M + N','哪 hỏi lựa chọn; lượng từ đứng giữa 哪 và danh từ.','你是哪国人？','Nǐ shì nǎ guó rén?','Bạn là người nước nào?'],
    ['的 · sở hữu','Người sở hữu + 的 + danh từ','的 nối người sở hữu với danh từ; có thể lược trong vài quan hệ gần gũi.','她是我的老师。','Tā shì wǒ de lǎoshī.','Cô ấy là giáo viên của tôi.'],
    ['呢 · hỏi tiếp chủ đề','Danh từ/đại từ + 呢？','呢 giúp hỏi tiếp về người hoặc việc vừa được nhắc đến.','我是学生，你呢？','Wǒ shì xuésheng, nǐ ne?','Tôi là học sinh, còn bạn?'],
  ]), dialogues:[d('hsk1-04-a','她是我的汉语老师','Học sinh giới thiệu giáo viên và hỏi về người đi cùng.',[['A','她是谁？','Tā shì shéi?','Cô ấy là ai?'],['B','她是我的汉语老师。','Tā shì wǒ de Hànyǔ lǎoshī.','Cô ấy là giáo viên tiếng Trung của tôi.'],['A','那个学生呢？','Nàge xuésheng ne?','Còn học sinh kia thì sao?'],['B','他是王老师的学生。','Tā shì Wáng lǎoshī de xuésheng.','Cậu ấy là học sinh của thầy Vương.']])], exercisePrompts:['Ghép người sở hữu với đồ vật/nghề nghiệp bằng 的.','Dùng 谁 và 哪 để hỏi về người trong lớp.'] },
  { level: 1, lesson: 5, sections: baseSections, grammar:g([
    ['几 + lượng từ + danh từ','几 + M + N','几 thường hỏi số lượng nhỏ; lượng từ đứng giữa 几 và danh từ.','你有几个孩子？','Nǐ yǒu jǐ ge háizi?','Bạn có mấy người con?'],
    ['Số 1–99','十位 + 个位','Số từ 1–99 được ghép theo hàng chục và hàng đơn vị.','她今年二十岁。','Tā jīnnián èrshí suì.','Năm nay cô ấy hai mươi tuổi.'],
    ['了 · tuổi mới/đã đến tuổi','Số tuổi + 了','了 cuối câu đánh dấu tuổi đã đạt đến con số nêu ra.','女儿二十岁了。','Nǚ’ér èrshí suì le.','Con gái đã 20 tuổi rồi.'],
    ['多大 · hỏi tuổi','Chủ ngữ + 多大（了）？','多大 hỏi tuổi hoặc kích thước; ngữ cảnh xác định nghĩa.','你女儿多大了？','Nǐ nǚ’ér duō dà le?','Con gái bạn bao nhiêu tuổi rồi?'],
  ]), dialogues:[d('hsk1-05-a','她的女儿今年20岁了','Hai người hỏi thăm tuổi con của nhau.',[['A','你女儿多大了？','Nǐ nǚ’ér duō dà le?','Con gái bạn bao nhiêu tuổi rồi?'],['B','她今年二十岁了。','Tā jīnnián èrshí suì le.','Năm nay con bé 20 tuổi rồi.'],['A','你儿子呢？','Nǐ érzi ne?','Còn con trai bạn?'],['B','他今年十八岁。','Tā jīnnián shíbā suì.','Năm nay cháu 18 tuổi.']])], exercisePrompts:['Đọc số tuổi thành tiếng; chú ý cách ghép số hàng chục.','Hỏi và trả lời tuổi bằng 几岁 và 多大.'] },
  { level: 1, lesson: 6, sections:baseSections, grammar:g([
    ['会 + động từ · biết làm','Chủ ngữ + 会 + động từ','会 diễn tả kỹ năng đã học hoặc khả năng thực hiện một việc.','我会说汉语。','Wǒ huì shuō Hànyǔ.','Tôi biết nói tiếng Trung.'],
    ['很 + tính từ','Chủ ngữ + 很 + tính từ','很 thường nối chủ ngữ với tính từ; không phải lúc nào cũng nhấn mạnh “rất”.','她很好。','Tā hěn hǎo.','Cô ấy khỏe/tốt.'],
    ['怎么 + động từ · hỏi cách làm','怎么 + V','怎么 hỏi phương thức hoặc cách thực hiện hành động.','这个字怎么读？','Zhège zì zěnme dú?','Chữ này đọc thế nào?'],
  ]), dialogues:[d('hsk1-06-a','我会说汉语','Hai bạn trao đổi về ngôn ngữ mình biết.',[['A','你会说汉语吗？','Nǐ huì shuō Hànyǔ ma?','Bạn biết nói tiếng Trung không?'],['B','我会说一点儿。','Wǒ huì shuō yìdiǎnr.','Tôi biết nói một chút.'],['A','这个字怎么读？','Zhège zì zěnme dú?','Chữ này đọc thế nào?'],['B','我也不知道。','Wǒ yě bù zhīdào.','Tôi cũng không biết.']])], exercisePrompts:['Dùng 会 nói ba việc bạn biết làm.','Hỏi cách đọc từ mới bằng 怎么读.'] },
  { level: 1, lesson: 7, sections:baseSections, grammar:g([
    ['日期 · ngày tháng','Tháng + 号/日 + 星期','Ngày tháng đi theo thứ tự tháng, ngày, thứ; 号 thường dùng trong khẩu ngữ.','今天九月二号，星期四。','Jīntiān jiǔ yuè èr hào, xīngqī sì.','Hôm nay là thứ Năm, ngày 2 tháng 9.'],
    ['Lược 是 trong câu giới thiệu','Chủ ngữ + danh từ/tính từ','Trong câu nhận định đơn giản, có thể lược 是 trước tuổi hoặc thông tin trực tiếp.','我汉语老师三十三岁。','Wǒ Hànyǔ lǎoshī sānshísān suì.','Giáo viên tiếng Trung của tôi 33 tuổi.'],
    ['去 + địa điểm + động từ','去 + place + V','去 nêu nơi đến, tiếp theo là mục đích/hành động tại nơi đó.','我去学校学习。','Wǒ qù xuéxiào xuéxí.','Tôi đến trường học.'],
  ]), dialogues:[d('hsk1-07-a','今天几号','Hai người hỏi ngày và kế hoạch đến trường.',[['A','今天几号？','Jīntiān jǐ hào?','Hôm nay ngày mấy?'],['B','今天九月二号，星期四。','Jīntiān jiǔ yuè èr hào, xīngqī sì.','Hôm nay thứ Năm, ngày 2 tháng 9.'],['A','你去学校吗？','Nǐ qù xuéxiào ma?','Bạn có đến trường không?'],['B','我去学校学习汉语。','Wǒ qù xuéxiào xuéxí Hànyǔ.','Tôi đến trường học tiếng Trung.']])],exercisePrompts:['Nói ngày sinh hoặc ngày học bằng tháng, ngày, thứ.','Dùng 去 + địa điểm + động từ để kể kế hoạch.'] },
  { level: 1, lesson: 8, sections:baseSections, grammar:g([
    ['想 · muốn làm','想 + động từ','想 đứng trước động từ để nêu mong muốn hoặc dự định.','我想喝茶。','Wǒ xiǎng hē chá.','Tôi muốn uống trà.'],
    ['多少 + danh từ','多少 + N','多少 hỏi số lượng, thường dùng khi chưa biết số lượng lớn hay nhỏ.','你有多少本书？','Nǐ yǒu duōshao běn shū?','Bạn có bao nhiêu quyển sách?'],
    ['个 và 口 · lượng từ','Số từ + 个/口 + danh từ','个 dùng rộng rãi; 口 thường đếm thành viên trong gia đình.','我家有五口人。','Wǒ jiā yǒu wǔ kǒu rén.','Nhà tôi có năm người.'],
    ['元/块 · tiền tệ','Số tiền + 元/块','元 là cách ghi trang trọng; 块 phổ biến trong lời nói.','一杯茶十块。','Yì bēi chá shí kuài.','Một cốc trà 10 tệ.'],
  ]), dialogues:[d('hsk1-08-a','我想喝茶','Khách gọi trà và hỏi giá.',[['A','你想喝什么？','Nǐ xiǎng hē shénme?','Bạn muốn uống gì?'],['B','我想喝茶。','Wǒ xiǎng hē chá.','Tôi muốn uống trà.'],['A','一杯茶十块。','Yì bēi chá shí kuài.','Một cốc trà 10 tệ.'],['B','好，给我一杯。','Hǎo, gěi wǒ yì bēi.','Được, cho tôi một cốc.']])],exercisePrompts:['Chọn 个 hoặc 口 để điền vào chỗ trống.','Đóng vai gọi đồ uống, hỏi số lượng và giá.'] },
  { level:1, lesson:9, sections:baseSections, grammar:g([
    ['在 · ở tại','Người/vật + 在 + địa điểm','在 nêu vị trí của người hoặc vật.','他在椅子下面。','Tā zài yǐzi xiàmiàn.','Anh ấy ở dưới ghế.'],
    ['哪儿 · hỏi nơi chốn','Chủ ngữ + 在哪儿？','哪儿 thay cho địa điểm cần hỏi.','我的杯子在哪儿？','Wǒ de bēizi zài nǎr?','Cốc của tôi ở đâu?'],
    ['在 + địa điểm + động từ','Chủ ngữ + 在 + place + V','Địa điểm đứng sau 在 và trước động từ để nêu nơi hành động diễn ra.','我在朋友家喝茶。','Wǒ zài péngyou jiā hē chá.','Tôi uống trà ở nhà bạn.'],
    ['呢 · hỏi tiếp vị trí','Đại từ/nơi chốn + 呢？','呢 tạo câu hỏi tiếp nối theo chủ đề đã biết.','他在哪儿呢？','Tā zài nǎr ne?','Anh ấy đang ở đâu nhỉ?'],
  ]), dialogues:[d('hsk1-09-a','你的儿子在哪儿工作','Hai người hỏi nơi làm việc của con trai.',[['A','你儿子在哪儿工作？','Nǐ érzi zài nǎr gōngzuò?','Con trai bạn làm việc ở đâu?'],['B','他在北京工作。','Tā zài Běijīng gōngzuò.','Anh ấy làm việc ở Bắc Kinh.'],['A','他住在哪儿？','Tā zhù zài nǎr?','Anh ấy sống ở đâu?'],['B','他住在公司旁边。','Tā zhù zài gōngsī pángbiān.','Anh ấy sống cạnh công ty.']])],exercisePrompts:['Hỏi và trả lời vị trí bằng 在哪儿.','Đặt địa điểm trước động từ sau 在.'] },
  { level:1, lesson:10, sections:baseSections, grammar:g([
    ['Địa điểm + 有/没有','Place + 有/没有 + danh từ','有 nêu sự tồn tại tại địa điểm; 没有 phủ định sự tồn tại.','椅子下面有一只猫。','Yǐzi xiàmiàn yǒu yì zhī māo.','Dưới ghế có một con mèo.'],
    ['和 · nối danh từ','N1 + 和 + N2','和 nối các danh từ cùng vai trò trong câu.','爸爸、妈妈和我在家。','Bàba, māma hé wǒ zài jiā.','Bố, mẹ và tôi ở nhà.'],
    ['能 · xin phép/khả năng','能 + động từ？','能 dùng để hỏi khả năng hoặc xin phép làm việc gì.','我能坐这儿吗？','Wǒ néng zuò zhèr ma?','Tôi có thể ngồi đây không?'],
    ['请 + động từ','请 + V','请 đặt trước động từ để tạo lời mời/yêu cầu lịch sự.','请坐。','Qǐng zuò.','Mời ngồi.'],
  ]), dialogues:[d('hsk1-10-a','我能坐这儿吗','Một khách xin phép ngồi và được mời vào.',[['A','请问，这儿有人吗？','Qǐngwèn, zhèr yǒu rén ma?','Xin hỏi, chỗ này có người không?'],['B','没有人。','Méi yǒu rén.','Không có ai.'],['A','我能坐这儿吗？','Wǒ néng zuò zhèr ma?','Tôi có thể ngồi đây không?'],['B','可以，请坐。','Kěyǐ, qǐng zuò.','Được, mời ngồi.']])],exercisePrompts:['Mô tả đồ vật/người có hoặc không có ở một nơi.','Luyện xin phép bằng 能……吗 và đáp lời lịch sự.'] },
  { level:1, lesson:11, sections:baseSections, grammar:g([
    ['Giờ và phút','Số + 点 + số + 分','点 chỉ giờ, 分 chỉ phút; có thể dùng 半 để nói 30 phút.','现在十一点十分。','Xiànzài shíyī diǎn shí fēn.','Bây giờ là 11 giờ 10 phút.'],
    ['上午/下午','上午/下午 + giờ','上午 và 下午 đứng trước giờ để phân biệt buổi sáng/chiều.','下午三点十分见。','Xiàwǔ sān diǎn shí fēn jiàn.','Gặp lúc 3 giờ 10 chiều.'],
    ['Thời gian trong câu','Chủ ngữ + thời gian + động từ / thời gian + chủ ngữ + động từ','Cụm thời gian thường đứng trước động từ, sau hoặc trước chủ ngữ.','妈妈六点做饭。','Māma liù diǎn zuò fàn.','Mẹ nấu cơm lúc sáu giờ.'],
    ['前 · trước / cách đây','Mốc thời gian + 前; thời lượng + 前','前 chỉ thời điểm trước một mốc hoặc khoảng thời gian tính lùi.','一个星期前我在北京。','Yí ge xīngqī qián wǒ zài Běijīng.','Một tuần trước tôi ở Bắc Kinh.'],
  ]), dialogues:[d('hsk1-11-a','现在几点','Hai người xác nhận giờ và lịch gặp.',[['A','现在几点？','Xiànzài jǐ diǎn?','Bây giờ là mấy giờ?'],['B','下午三点十分。','Xiàwǔ sān diǎn shí fēn.','Ba giờ mười chiều.'],['A','我们几点见？','Wǒmen jǐ diǎn jiàn?','Mấy giờ chúng ta gặp?'],['B','六点前见。','Liù diǎn qián jiàn.','Gặp trước sáu giờ nhé.']])],exercisePrompts:['Nghe giờ rồi viết bằng chữ Hán.','Đặt cụm thời gian vào hai vị trí tự nhiên trong câu.'] },
  { level:1, lesson:12, sections:baseSections, grammar:g([
    ['怎么样 · hỏi thế nào','Danh từ + 怎么样？','怎么样 hỏi đánh giá hoặc tình trạng của sự vật/người.','明天天气怎么样？','Míngtiān tiānqì zěnmeyàng?','Thời tiết ngày mai thế nào?'],
    ['Lược 的 trong một số cụm','Danh từ + danh từ / tính từ','的 có thể lược trong một số tổ hợp quen thuộc hoặc khi quan hệ đã rõ.','我身体不太好。','Wǒ shēntǐ bú tài hǎo.','Sức khỏe tôi không được tốt lắm.'],
    ['太 + tính từ (+ 了)','太 + A (+ 了)','太 biểu thị mức độ vượt mong đợi; câu cảm thán thường thêm 了.','今天太冷了。','Jīntiān tài lěng le.','Hôm nay lạnh quá.'],
    ['不太 + tính từ','不太 + A','不太 giảm nhẹ mức độ phủ định: không … lắm.','明天不太冷。','Míngtiān bú tài lěng.','Ngày mai không lạnh lắm.'],
    ['会 · khả năng tương lai','会 + động từ','会 có thể diễn tả điều dự đoán sẽ xảy ra.','明天会下雨吗？','Míngtiān huì xiàyǔ ma?','Ngày mai trời sẽ mưa không?'],
  ]), dialogues:[d('hsk1-12-a','明天天气怎么样','Hai người nói về dự báo ngày mai.',[['A','明天天气怎么样？','Míngtiān tiānqì zěnmeyàng?','Thời tiết ngày mai thế nào?'],['B','明天会下雨。','Míngtiān huì xiàyǔ.','Ngày mai sẽ mưa.'],['A','会很冷吗？','Huì hěn lěng ma?','Trời sẽ lạnh lắm không?'],['B','不太冷。','Bú tài lěng.','Không lạnh lắm.']])],exercisePrompts:['Đặt câu hỏi với 怎么样 về thời tiết/sức khỏe.','Phân biệt 太 và 不太 qua hai tình huống.'] },
  { level:1, lesson:13, sections:baseSections, grammar:g([
    ['喂 · mở đầu cuộc gọi','喂，……吗？','喂 dùng khi bắt đầu nghe/gọi điện thoại.','喂，李老师在家吗？','Wèi, Lǐ lǎoshī zài jiā ma?','A lô, thầy Lý có ở nhà không?'],
    ['在/没在 + động từ (+ 呢)','在 + V (+ 呢) / 没(有)在 + V','在 trước động từ chỉ hành động đang diễn ra; phủ định dùng 没(有).','他在学做中国菜呢。','Tā zài xué zuò Zhōngguó cài ne.','Anh ấy đang học nấu món Trung Quốc.'],
    ['Số 1 đọc yāo trong số điện thoại','Số điện thoại: 一 → yāo','Khi đọc số điện thoại, 一 thường đọc yāo để dễ phân biệt.','我的电话是138。','Wǒ de diànhuà shì yāo sān bā.','Số của tôi là 138.'],
    ['吧 · đề nghị nhẹ nhàng','Động từ + 吧','吧 làm lời đề nghị hoặc gợi ý bớt trực tiếp.','我们坐吧。','Wǒmen zuò ba.','Chúng ta ngồi nhé.'],
  ]), dialogues:[d('hsk1-13-a','他在学做中国菜呢','Gọi điện hỏi thăm người đang nấu ăn.',[['A','喂，王先生在家吗？','Wèi, Wáng xiānsheng zài jiā ma?','A lô, ông Vương có ở nhà không?'],['B','他在学做中国菜呢。','Tā zài xué zuò Zhōngguó cài ne.','Ông ấy đang học nấu món Trung Quốc.'],['A','请他给我打电话吧。','Qǐng tā gěi wǒ dǎ diànhuà ba.','Nhờ ông ấy gọi cho tôi nhé.'],['B','好。','Hǎo.','Được.']])],exercisePrompts:['Đóng vai gọi điện, hỏi người kia có ở nhà không.','Mô tả hành động đang diễn ra với 在……呢.'] },
  { level:1, lesson:14, sections:baseSections, grammar:g([
    ['了 · hành động đã hoàn tất','S + V + 了 + O / S + V + O + 了','了 sau động từ đánh dấu hành động đã xảy ra; 了 cuối câu nhấn mạnh tình huống mới.','她买了很多衣服。','Tā mǎi le hěn duō yīfu.','Cô ấy đã mua nhiều quần áo.'],
    ['没 + động từ · phủ định quá khứ','S + 没(有) + V + O','没 phủ định việc đã xảy ra; không dùng 了 sau động từ trong cấu trúc này.','她没去商店。','Tā méi qù shāngdiàn.','Cô ấy đã không đi cửa hàng.'],
    ['后 · sau/một khoảng nữa','Mốc/thời lượng + 后','后 chỉ thời điểm sau mốc hoặc khoảng thời gian trôi qua.','五点后我回家。','Wǔ diǎn hòu wǒ huí jiā.','Sau 5 giờ tôi về nhà.'],
    ['啊 · sắc thái thân mật','Câu + 啊','啊 thể hiện cảm xúc hoặc làm lời đáp thân mật hơn.','好啊！','Hǎo a!','Được chứ!'],
    ['都 + danh từ/đại từ','Chủ ngữ số nhiều + 都 + vị ngữ','都 bao quát toàn bộ nhóm đã được nêu.','我们都是学生。','Wǒmen dōu shì xuésheng.','Chúng tôi đều là học sinh.'],
  ]), dialogues:[d('hsk1-14-a','她买了很多衣服','Bạn bè hỏi về việc mua sắm hôm qua.',[['A','你昨天去商店了吗？','Nǐ zuótiān qù shāngdiàn le ma?','Hôm qua bạn đi cửa hàng à?'],['B','去了，我买了很多衣服。','Qù le, wǒ mǎi le hěn duō yīfu.','Có, tôi đã mua nhiều quần áo.'],['A','你买了什么？','Nǐ mǎi le shénme?','Bạn đã mua gì?'],['B','我买了衣服和鞋。','Wǒ mǎi le yīfu hé xié.','Tôi mua quần áo và giày.']])],exercisePrompts:['Chuyển câu kể sang phủ định quá khứ với 没.','Kể hai việc đã làm hôm qua bằng 了.'] },
  { level:1, lesson:15, sections:baseSections, grammar:g([
    ['是……的 · nhấn mạnh thông tin về việc đã xảy ra','Chủ ngữ + 是 + thông tin + động từ + 的','是……的 làm nổi bật thời gian, nơi chốn hoặc cách thức của sự việc đã xảy ra.','我是坐飞机来的。','Wǒ shì zuò fēijī lái de.','Tôi đã đến bằng máy bay.'],
    ['年 · năm','Năm + 年','年 đọc từng chữ số khi nói năm cụ thể.','我二〇二五年来北京。','Wǒ èr líng èr wǔ nián lái Běijīng.','Tôi đến Bắc Kinh năm 2025.'],
  ]), dialogues:[d('hsk1-15-a','我是坐飞机来的','Hai người hỏi cách và thời điểm đến.',[['A','你是怎么来的？','Nǐ shì zěnme lái de?','Bạn đến bằng cách nào?'],['B','我是坐飞机来的。','Wǒ shì zuò fēijī lái de.','Tôi đến bằng máy bay.'],['A','你是哪年来的？','Nǐ shì nǎ nián lái de?','Bạn đến năm nào?'],['B','我是二〇二五年来的。','Wǒ shì èr líng èr wǔ nián lái de.','Tôi đến năm 2025.']])],exercisePrompts:['Dùng 是……的 hỏi/đáp về cách đi lại.','Đọc một năm bằng tiếng Trung.'] },
]

const hsk2: LessonMaterial12[] = [
  {level:2,lesson:1,sections:baseSections,grammar:g([
    ['要 · dự định/muốn','要 + động từ','要 nêu ý định hoặc việc sắp làm; ngữ cảnh quyết định sắc thái.','我明天要去北京。','Wǒ míngtiān yào qù Běijīng.','Ngày mai tôi định đi Bắc Kinh.'],
    ['最 · mức cao nhất','最 + tính từ/động từ tâm lý','最 đứng trước từ miêu tả để nêu mức độ cao nhất.','九月最好。','Jiǔ yuè zuì hǎo.','Tháng Chín là đẹp nhất.'],
    ['几 / 十几 / 几十 / 多 · số lượng ước lượng','几 + M + N; 十几; 几十; 二十多','Các cách này diễn đạt số lượng ước chừng, không nêu con số chính xác.','这里有二十多家饭馆。','Zhèlǐ yǒu èrshí duō jiā fànguǎn.','Ở đây có hơn 20 quán ăn.'],
  ]),dialogues:[d('hsk2-01-a','九月去北京旅游最好','Hai người bàn thời điểm đi Bắc Kinh.',[['A','你什么时候去北京？','Nǐ shénme shíhou qù Běijīng?','Khi nào bạn đi Bắc Kinh?'],['B','九月去最好。','Jiǔ yuè qù zuì hǎo.','Đi tháng Chín là đẹp nhất.'],['A','要去几天？','Yào qù jǐ tiān?','Bạn định đi mấy ngày?'],['B','十几天吧。','Shí jǐ tiān ba.','Chắc khoảng mười mấy ngày.']])],exercisePrompts:['Nói kế hoạch bằng 要 và nêu lựa chọn tốt nhất với 最.','Ước lượng số ngày bằng 十几/几十/多.']},
  {level:2,lesson:2,sections:baseSections,grammar:g([
    ['Câu hỏi chính phản','V + 不 + V / A + 不 + A','Lặp động từ hoặc tính từ với 不 để hỏi lựa chọn có/không.','你每天去不去？','Nǐ měitiān qù bu qù?','Ngày nào bạn cũng đi chứ?'],
    ['是不是 · xác nhận','是不是 + câu / câu + 是不是？','是不是 hỏi người nghe xác nhận một phỏng đoán.','你是不是每天六点起床？','Nǐ shì bu shì měitiān liù diǎn qǐchuáng?','Có phải ngày nào bạn cũng dậy lúc sáu giờ không?'],
    ['每 + lượng từ + danh từ (+ 都)','每 + M + N (+ 都) + V','每 tạo nghĩa “mỗi”; 都 nhấn mạnh tính đều đặn/toàn bộ.','我每天六点起床。','Wǒ měitiān liù diǎn qǐchuáng.','Ngày nào tôi cũng dậy lúc sáu giờ.'],
    ['多 + tính từ · hỏi mức độ','多 + A？','多 đứng trước tính từ để hỏi mức độ/độ lớn.','你多高？','Nǐ duō gāo?','Bạn cao bao nhiêu?'],
  ]),dialogues:[d('hsk2-02-a','我每天六点起床','Hai người so sánh giờ thức dậy.',[['A','你每天几点起床？','Nǐ měitiān jǐ diǎn qǐchuáng?','Mỗi ngày bạn thức dậy lúc mấy giờ?'],['B','我每天六点起床。','Wǒ měitiān liù diǎn qǐchuáng.','Ngày nào tôi cũng dậy lúc sáu giờ.'],['A','你周末也起这么早吗？','Nǐ zhōumò yě qǐ zhème zǎo ma?','Cuối tuần bạn cũng dậy sớm vậy à?'],['B','周末我起得晚一点儿。','Zhōumò wǒ qǐ de wǎn yìdiǎnr.','Cuối tuần tôi dậy muộn hơn một chút.']])],exercisePrompts:['Tạo câu hỏi chính phản với động từ sinh hoạt.','Phỏng vấn bạn học về thói quen mỗi ngày.']},
  {level:2,lesson:3,sections:baseSections,grammar:g([
    ['的 · lược danh từ đã rõ','Cụm bổ nghĩa + 的 (N)','Khi danh từ đã biết, có thể lược danh từ sau 的 để tránh lặp.','红色的是我的。','Hóngsè de shì wǒ de.','Cái màu đỏ là của tôi.'],
    ['一下 · làm thử/làm một chút','V + 一下','一下 làm lời yêu cầu nhẹ nhàng hoặc nói hành động diễn ra ngắn.','你看一下这个。','Nǐ kàn yíxià zhège.','Bạn xem cái này một chút.'],
    ['真 · thật là/rất','真 + tính từ (+ 啊)','真 biểu thị cảm nhận hoặc đánh giá với mức độ đáng kể.','这个真好看！','Zhège zhēn hǎokàn!','Cái này đẹp thật!'],
  ]),dialogues:[d('hsk2-03-a','左边那个红色的是我的','Hai người tìm chiếc túi trong cửa hàng.',[['A','哪个包是你的？','Nǎge bāo shì nǐ de?','Túi nào là của bạn?'],['B','左边那个红色的是我的。','Zuǒbian nàge hóngsè de shì wǒ de.','Cái màu đỏ bên trái là của tôi.'],['A','这个真好看。','Zhège zhēn hǎokàn.','Cái này đẹp thật.'],['B','你看一下里面。','Nǐ kàn yíxià lǐmian.','Bạn xem bên trong thử đi.']])],exercisePrompts:['Lược danh từ lặp lại sau 的.','Dùng 一下 để yêu cầu nhẹ nhàng.']},
  {level:2,lesson:4,sections:baseSections,grammar:g([
    ['是……的 · nhấn mạnh người/thời gian/cách thức','是 + thành phần nhấn mạnh + V + 的','Cấu trúc này nêu rõ ai làm, làm khi nào hoặc bằng cách nào trong sự việc đã xảy ra.','这个工作是他帮我介绍的。','Zhège gōngzuò shì tā bāng wǒ jièshào de.','Công việc này là do anh ấy giới thiệu cho tôi.'],
    ['的时候 · vào lúc/khi','Mệnh đề/thời điểm + 的时候','的时候 tạo cụm thời gian làm bối cảnh cho hành động.','我来北京的时候认识了他。','Wǒ lái Běijīng de shíhou rènshi le tā.','Khi đến Bắc Kinh tôi đã quen anh ấy.'],
    ['已经……了 · đã','已经 + V/A + 了','已经 nhấn mạnh tình trạng/hành động đã đạt đến thời điểm hiện tại.','他已经工作两年了。','Tā yǐjīng gōngzuò liǎng nián le.','Anh ấy đã làm việc được hai năm rồi.'],
  ]),dialogues:[d('hsk2-04-a','这个工作是他帮我介绍的','Bạn bè hỏi nhau về công việc mới.',[['A','你现在的工作怎么样？','Nǐ xiànzài de gōngzuò zěnmeyàng?','Công việc hiện tại của bạn thế nào?'],['B','很好，是朋友帮我介绍的。','Hěn hǎo, shì péngyou bāng wǒ jièshào de.','Rất tốt, là bạn tôi giới thiệu giúp.'],['A','你已经工作多久了？','Nǐ yǐjīng gōngzuò duō jiǔ le?','Bạn đã làm được bao lâu rồi?'],['B','已经两年了。','Yǐjīng liǎng nián le.','Được hai năm rồi.']])],exercisePrompts:['Nói rõ người giới thiệu một việc bằng 是……的.','Kể mốc thời gian bắt đầu bằng 的时候.']},
  {level:2,lesson:5,sections:baseSections,grammar:g([
    ['就 · thế thì/vậy thì','Điều kiện/tình huống + 就 + kết quả','就 nối tình huống với quyết định hoặc kết quả phù hợp.','你喜欢就买吧。','Nǐ xǐhuan jiù mǎi ba.','Bạn thích thì mua đi.'],
    ['还好 · cũng được','还 + 好/可以','还好 đánh giá mức vừa phải, không quá tốt cũng không quá tệ.','昨天的考试还好。','Zuótiān de kǎoshì hái hǎo.','Bài thi hôm qua cũng được.'],
    ['有点儿 · hơi, có chút','有点儿 + tính từ','有点儿 thường nêu mức độ hơi nhiều theo hướng người nói chưa hài lòng.','今天有点儿冷。','Jīntiān yǒudiǎnr lěng.','Hôm nay hơi lạnh.'],
  ]),dialogues:[d('hsk2-05-a','就买这件吧','Khách quyết định mua áo sau khi thử.',[['A','这件衣服怎么样？','Zhè jiàn yīfu zěnmeyàng?','Chiếc áo này thế nào?'],['B','颜色真好看。','Yánsè zhēn hǎokàn.','Màu đẹp thật.'],['A','有点儿贵。','Yǒudiǎnr guì.','Hơi đắt.'],['B','你喜欢就买这件吧。','Nǐ xǐhuan jiù mǎi zhè jiàn ba.','Bạn thích thì mua chiếc này đi.']])],exercisePrompts:['Đưa ra quyết định với 就.','Phân biệt 还好 (đánh giá) và 有点儿 (mức độ).']},
  {level:2,lesson:6,sections:baseSections,grammar:g([
    ['怎么 · hỏi lý do/nguyên nhân','怎么 + mệnh đề？','怎么 ngoài nghĩa “bằng cách nào” còn hỏi lý do khi đi với tình huống bất thường.','你怎么不吃了？','Nǐ zěnme bù chī le?','Sao bạn không ăn nữa?'],
    ['Lượng từ lặp + 都','每/个个/人人 + 都 + vị ngữ','Lặp lượng từ nhấn mạnh tất cả thành viên/đơn vị đều có đặc điểm đó.','同学们个个都很高兴。','Tóngxuémen gègè dōu hěn gāoxìng.','Các bạn học sinh ai nấy đều vui.'],
    ['因为……所以……','因为 + nguyên nhân，所以 + kết quả','因为 nêu lý do; 所以 dẫn hệ quả. Một vế có thể lược nếu ngữ cảnh rõ.','因为不饿，所以我不吃了。','Yīnwèi bú è, suǒyǐ wǒ bù chī le.','Vì không đói nên tôi không ăn nữa.'],
  ]),dialogues:[d('hsk2-06-a','你怎么不吃了','Bạn cùng bàn hỏi vì sao người kia dừng ăn.',[['A','你怎么不吃了？','Nǐ zěnme bù chī le?','Sao bạn không ăn nữa?'],['B','我已经吃饱了。','Wǒ yǐjīng chī bǎo le.','Tôi ăn no rồi.'],['A','因为菜不好吃吗？','Yīnwèi cài bù hǎochī ma?','Vì món ăn không ngon à?'],['B','不是，因为我不饿了。','Bú shì, yīnwèi wǒ bú è le.','Không, vì tôi hết đói rồi.']])],exercisePrompts:['Trả lời câu hỏi “怎么不……了” bằng nguyên nhân.','Nối nguyên nhân và kết quả với 因为……所以…….']},
  {level:2,lesson:7,sections:baseSections,grammar:g([
    ['还/还没 · vẫn/chưa','还 + V/A; 还没 + V','还 nêu trạng thái tiếp tục; 还没 phủ định việc chưa xảy ra đến thời điểm nói.','八点了，他还在睡觉。','Bā diǎn le, tā hái zài shuìjiào.','Tám giờ rồi mà anh ấy vẫn đang ngủ.'],
    ['Thời gian + 就 · sớm/ngay','Mốc thời gian + 就 + V','就 cho biết sự việc xảy ra sớm hoặc nhanh hơn dự kiến.','同学们七点半就来了。','Tóngxuémen qī diǎn bàn jiù lái le.','Các bạn học sinh đã đến từ 7 giờ rưỡi.'],
    ['离 · khoảng cách đến','Nơi 1 + 离 + nơi 2 + khoảng cách/tính từ','离 nối hai địa điểm rồi nêu khoảng cách hoặc độ xa gần.','我家离公司不远。','Wǒ jiā lí gōngsī bù yuǎn.','Nhà tôi cách công ty không xa.'],
    ['呢 · nhấn mạnh tình huống đang tiếp diễn','Mệnh đề + 呢','呢 cuối câu nhấn mạnh trạng thái vẫn tiếp diễn hoặc trái dự đoán.','他还在学习呢。','Tā hái zài xuéxí ne.','Anh ấy vẫn đang học đấy.'],
  ]),dialogues:[d('hsk2-07-a','你家离公司远吗','Hai đồng nghiệp so sánh đường đi làm.',[['A','你家离公司远吗？','Nǐ jiā lí gōngsī yuǎn ma?','Nhà bạn cách công ty xa không?'],['B','不远，坐车二十分钟。','Bù yuǎn, zuò chē èrshí fēnzhōng.','Không xa, đi xe 20 phút.'],['A','你几点出门？','Nǐ jǐ diǎn chūmén?','Bạn ra khỏi nhà lúc mấy giờ?'],['B','七点半就出门了。','Qī diǎn bàn jiù chūmén le.','Tôi ra khỏi nhà từ 7 giờ rưỡi.']])],exercisePrompts:['So sánh khoảng cách bằng 离.','Đặt câu với 还没 và thời gian + 就.']},
  {level:2,lesson:8,sections:baseSections,grammar:g([
    ['好吗 · hỏi ý kiến/đề nghị','Mệnh đề + 好吗？','好吗 ở cuối câu để hỏi người nghe có đồng ý với đề nghị không.','明天下午给我打电话好吗？','Míngtiān xiàwǔ gěi wǒ dǎ diànhuà hǎo ma?','Chiều mai gọi cho tôi nhé, được không?'],
    ['再 · làm tiếp/sau đó','再 + V','再 nói hành động sẽ lặp lại hoặc xảy ra sau thời điểm hiện tại.','让我想想再告诉你。','Ràng wǒ xiǎngxiang zài gàosu nǐ.','Để tôi nghĩ rồi nói bạn sau.'],
    ['请/让/叫 + người + động từ','请/让/叫 + người + V','Các động từ này nêu lời mời, cho phép hoặc nhờ/yêu cầu ai làm việc gì.','我请你吃饭。','Wǒ qǐng nǐ chīfàn.','Tôi mời bạn ăn cơm.'],
    ['Động từ lặp · làm một chút','VV / V一V','Lặp động từ diễn tả hành động ngắn, thử làm hoặc làm nhẹ nhàng.','你看看这件衣服。','Nǐ kànkan zhè jiàn yīfu.','Bạn xem chiếc áo này thử.'],
  ]),dialogues:[d('hsk2-08-a','让我想想再告诉你','Một người xin thời gian suy nghĩ trước khi trả lời.',[['A','我们明天去看电影，好吗？','Wǒmen míngtiān qù kàn diànyǐng, hǎo ma?','Ngày mai chúng ta đi xem phim nhé?'],['B','让我想想再告诉你。','Ràng wǒ xiǎngxiang zài gàosu nǐ.','Để tôi nghĩ rồi nói bạn sau.'],['A','好，你再看看时间。','Hǎo, nǐ zài kànkan shíjiān.','Được, bạn xem lại thời gian nhé.'],['B','我晚上给你打电话。','Wǒ wǎnshang gěi nǐ dǎ diànhuà.','Tối tôi sẽ gọi cho bạn.']])],exercisePrompts:['Đưa ra lời mời và hỏi ý kiến bằng 好吗.','Dùng 再 diễn tả việc sẽ làm sau.']},
  {level:2,lesson:9,sections:baseSections,grammar:g([
    ['Bổ ngữ kết quả','Động từ + bổ ngữ kết quả','Bổ ngữ theo sau động từ cho biết hành động đạt kết quả nào; phủ định thường dùng 没.','我做完作业了。','Wǒ zuò wán zuòyè le.','Tôi làm xong bài tập rồi.'],
    ['从……到……','从 + điểm đầu + 到 + điểm cuối','从 và 到 lần lượt nêu điểm bắt đầu và kết thúc trong không gian/thời gian/phạm vi.','从老师到学生都来了。','Cóng lǎoshī dào xuésheng dōu lái le.','Từ giáo viên đến học sinh đều đã đến.'],
    ['第 + số + lượng từ','第 + số + M + N','第 đặt trước số thứ tự để biến số đếm thành thứ tự.','这是我做的第四道题。','Zhè shì wǒ zuò de dì sì dào tí.','Đây là câu hỏi thứ tư tôi làm.'],
  ]),dialogues:[d('hsk2-09-a','题太多，我没做完','Hai bạn trao đổi về bài tập chưa hoàn thành.',[['A','作业做完了吗？','Zuòyè zuò wán le ma?','Bạn làm xong bài tập chưa?'],['B','题太多，我没做完。','Tí tài duō, wǒ méi zuò wán.','Bài nhiều quá, tôi chưa làm xong.'],['A','你做到第几题了？','Nǐ zuò dào dì jǐ tí le?','Bạn làm đến câu thứ mấy rồi?'],['B','做到第四题。','Zuò dào dì sì tí.','Đến câu thứ tư.']])],exercisePrompts:['Chọn bổ ngữ kết quả phù hợp và phủ định bằng 没.','Nêu khoảng từ… đến… bằng 从……到…….']},
  {level:2,lesson:10,sections:baseSections,grammar:g([
    ['不要/别 · lời cấm/khuyên','不要/别 + V','不要 và 别 đứng trước động từ để khuyên hoặc yêu cầu ai đừng làm.','别找了，手机在桌子上呢。','Bié zhǎo le, shǒujī zài zhuōzi shang ne.','Đừng tìm nữa, điện thoại ở trên bàn kìa.'],
    ['别……了 · dừng hành động','别 + V + 了','了 làm rõ yêu cầu chấm dứt hành động đang diễn ra.','别玩儿手机了。','Bié wánr shǒujī le.','Đừng chơi điện thoại nữa.'],
    ['对 · đánh giá/ảnh hưởng đến','Sự việc + 对 + đối tượng + tính từ/有帮助','对 đưa đối tượng chịu tác động hoặc phạm vi đánh giá.','运动对身体有帮助。','Yùndòng duì shēntǐ yǒu bāngzhù.','Vận động có lợi cho sức khỏe.'],
  ]),dialogues:[d('hsk2-10-a','别找了，手机在桌子上呢','Một người tìm điện thoại, bạn chỉ vị trí.',[['A','我的手机呢？','Wǒ de shǒujī ne?','Điện thoại của tôi đâu?'],['B','别找了，在桌子上呢。','Bié zhǎo le, zài zhuōzi shang ne.','Đừng tìm nữa, ở trên bàn kìa.'],['A','谢谢你。','Xièxie nǐ.','Cảm ơn bạn.'],['B','别客气。','Bié kèqi.','Đừng khách sáo.']])],exercisePrompts:['Chuyển lời nhắc thành yêu cầu với 别/不要.','Nói một hoạt động có lợi cho sức khỏe bằng 对.']},
  {level:2,lesson:11,sections:baseSections,grammar:g([
    ['Mệnh đề + 的 + danh từ','Mệnh đề miêu tả + 的 + N','Cụm có 的 đứng trước danh từ để nói rõ người/vật nào.','我妈妈做的饭很好吃。','Wǒ māma zuò de fàn hěn hǎochī.','Món cơm mẹ tôi nấu rất ngon.'],
    ['比 · so sánh hơn','A + 比 + B + tính từ','比 đặt giữa hai đối tượng; tính từ theo sau, không thêm 很 trong câu cơ bản.','他比我大三岁。','Tā bǐ wǒ dà sān suì.','Anh ấy lớn hơn tôi ba tuổi.'],
    ['没有 · so sánh không bằng','A + 没有 + B + tính từ','没有 so sánh A không đạt mức độ bằng B.','哥哥没有姐姐高。','Gēge méiyǒu jiějie gāo.','Anh trai không cao bằng chị gái.'],
    ['可能 · có lẽ/có thể','可能 + vị ngữ','可能 biểu thị phỏng đoán chưa chắc chắn.','她可能不来。','Tā kěnéng bù lái.','Có lẽ cô ấy không đến.'],
  ]),dialogues:[d('hsk2-11-a','他比我大三岁','Hai người nói về tuổi và món ăn gia đình.',[['A','你哥哥多大？','Nǐ gēge duō dà?','Anh trai bạn bao nhiêu tuổi?'],['B','他比我大三岁。','Tā bǐ wǒ dà sān suì.','Anh ấy lớn hơn tôi ba tuổi.'],['A','他做的饭好吃吗？','Tā zuò de fàn hǎochī ma?','Cơm anh ấy nấu ngon không?'],['B','可能没有我妈妈做的好吃。','Kěnéng méiyǒu wǒ māma zuò de hǎochī.','Có lẽ không ngon bằng mẹ tôi nấu.']])],exercisePrompts:['So sánh hai người/vật bằng 比 và 没有.','Miêu tả danh từ bằng mệnh đề + 的.']},
  {level:2,lesson:12,sections:baseSections,grammar:g([
    ['Bổ ngữ trạng thái với 得','V + 得 + tính từ/trạng thái','得 nối động từ với phần miêu tả cách/mức độ hành động.','我跑得很快。','Wǒ pǎo de hěn kuài.','Tôi chạy rất nhanh.'],
    ['Động từ + tân ngữ + động từ + 得','V + O + V + 得 + bổ ngữ','Khi động từ có tân ngữ, lặp động từ trước 得 để đưa bổ ngữ theo sau.','姐姐唱歌唱得很好。','Jiějie chànggē chàng de hěn hǎo.','Chị gái hát rất hay.'],
    ['So sánh cách làm với 得比','V + 得 + 比 + người + tính từ / 比 + người + V + 得 + tính từ','得 đặt trước hoặc sau cụm 比 để so sánh mức độ thực hiện hành động.','他学得比我快。','Tā xué de bǐ wǒ kuài.','Anh ấy học nhanh hơn tôi.'],
  ]),dialogues:[d('hsk2-12-a','你穿得太少了','Hai người nhận xét cách ăn mặc trong ngày lạnh.',[['A','你今天穿得太少了。','Nǐ jīntiān chuān de tài shǎo le.','Hôm nay bạn mặc ít quá.'],['B','我觉得还好。','Wǒ juéde hái hǎo.','Tôi thấy cũng ổn.'],['A','你跑得比我快，去拿件衣服吧。','Nǐ pǎo de bǐ wǒ kuài, qù ná jiàn yīfu ba.','Bạn chạy nhanh hơn tôi, đi lấy áo nhé.'],['B','好，我马上去。','Hǎo, wǒ mǎshàng qù.','Được, tôi đi ngay.']])],exercisePrompts:['Bổ sung phần 得 để miêu tả hành động.','So sánh tốc độ/cách làm của hai người.']},
  {level:2,lesson:13,sections:baseSections,grammar:g([
    ['着 · trạng thái duy trì','V + 着 + O','着 sau động từ chỉ trạng thái còn duy trì sau hành động.','门开着呢。','Mén kāizhe ne.','Cửa đang mở.'],
    ['没(有) + V + 着 · phủ định trạng thái','没(有) + V + 着 + O','没 phủ định việc trạng thái được tạo ra/đang được duy trì.','他没拿着铅笔。','Tā méi názhe qiānbǐ.','Anh ấy không cầm bút chì.'],
    ['不是……吗 · hỏi xác nhận','不是 + mệnh đề + 吗？','Mẫu này nhắc lại thông tin người nói cho là đúng để xác nhận hoặc bày tỏ ngạc nhiên.','你不是北京人吗？','Nǐ bú shì Běijīng rén ma?','Bạn chẳng phải người Bắc Kinh sao?'],
    ['往 + phương hướng','往 + direction + V','往 đứng trước phương hướng và động từ để nêu hướng chuyển động.','一直往东走。','Yìzhí wǎng dōng zǒu.','Cứ đi thẳng về phía đông.'],
  ]),dialogues:[d('hsk2-13-a','门开着呢','Một người báo tình trạng cửa và chỉ đường.',[['A','门怎么开着呢？','Mén zěnme kāizhe ne?','Sao cửa đang mở thế?'],['B','刚才有人进来。','Gāngcái yǒu rén jìnlái.','Vừa nãy có người đi vào.'],['A','他往哪儿走了？','Tā wǎng nǎr zǒu le?','Anh ấy đi về hướng nào?'],['B','往东边去了。','Wǎng dōngbian qù le.','Đi về phía đông rồi.']])],exercisePrompts:['Mô tả trạng thái bằng 着.','Chỉ đường với 往 + phương hướng + động từ.']},
  {level:2,lesson:14,sections:baseSections,grammar:g([
    ['过 · kinh nghiệm','V + 过 (+ O)','过 đặt sau động từ để nói từng có trải nghiệm; phủ định dùng 没(有).','我去过中国。','Wǒ qù guo Zhōngguó.','Tôi từng đến Trung Quốc.'],
    ['没(有) + V + 过 · chưa từng','没(有) + V + 过','Phủ định kinh nghiệm dùng 没(有) trước động từ, giữ 过 sau động từ.','我没有看过那个电影。','Wǒ méiyǒu kàn guo nàge diànyǐng.','Tôi chưa từng xem bộ phim đó.'],
    ['虽然……但是……','虽然 + nhượng bộ，但是 + kết quả','虽然 nêu sự thật trái kỳ vọng; 但是 dẫn kết quả thực tế.','虽然下雨，但是我们去了。','Suīrán xiàyǔ, dànshì wǒmen qù le.','Tuy trời mưa nhưng chúng tôi vẫn đi.'],
    ['过 + số lần','V + 过 + số + 次 (+ O)','次 đếm số lần trải nghiệm một hành động.','我坐过三次飞机。','Wǒ zuò guo sān cì fēijī.','Tôi từng đi máy bay ba lần.'],
  ]),dialogues:[d('hsk2-14-a','你看过那个电影吗','Hai người bàn về bộ phim đã xem.',[['A','你看过那个电影吗？','Nǐ kàn guo nàge diànyǐng ma?','Bạn đã xem bộ phim đó chưa?'],['B','看过，我看过两次。','Kàn guo, wǒ kàn guo liǎng cì.','Xem rồi, tôi xem hai lần rồi.'],['A','虽然时间很长，但是很好看。','Suīrán shíjiān hěn cháng, dànshì hěn hǎokàn.','Tuy thời lượng dài nhưng rất hay.'],['B','是啊，我还想再看一次。','Shì a, wǒ hái xiǎng zài kàn yí cì.','Ừ, tôi còn muốn xem lại lần nữa.']])],exercisePrompts:['Hỏi nhau đã từng làm việc gì bằng 过.','Nêu hai vế nhượng bộ với 虽然……但是…….']},
  {level:2,lesson:15,sections:baseSections,grammar:g([
    ['就要……了 · sắp sửa','Thời gian + 就要 + V + 了','就要……了 báo sự việc sắp xảy ra trong tương lai gần.','新年就要到了。','Xīnnián jiù yào dào le.','Năm mới sắp đến rồi.'],
    ['都……了 · đã đến mức/thời điểm','都 + thời gian/trạng thái + 了','都……了 nhấn mạnh thời điểm hoặc mức độ đã đạt đến; thường kèm lời giục/đề nghị.','都八点了，快起床吧。','Dōu bā diǎn le, kuài qǐchuáng ba.','Tám giờ rồi, dậy nhanh đi.'],
  ]),dialogues:[d('hsk2-15-a','新年就要到了','Gia đình chuẩn bị đón năm mới.',[['A','新年就要到了，你准备好了吗？','Xīnnián jiù yào dào le, nǐ zhǔnbèi hǎo le ma?','Năm mới sắp đến rồi, bạn chuẩn bị xong chưa?'],['B','还没有，东西都买了吗？','Hái méiyǒu, dōngxi dōu mǎi le ma?','Chưa, mọi thứ đã mua hết chưa?'],['A','都买好了。','Dōu mǎi hǎo le.','Mua hết rồi.'],['B','太好了，我们一起准备吧。','Tài hǎo le, wǒmen yìqǐ zhǔnbèi ba.','Tốt quá, chúng ta cùng chuẩn bị nhé.']])],exercisePrompts:['Dùng 就要……了 nói một sự kiện sắp tới.','Dùng 都……了 để nhấn mạnh thời điểm và đưa lời đề nghị.']},
]

const toGrammarPoints = (level: number, lesson: number, grammar: BookGrammar12[]): GrammarPoint[] => grammar.map((point, index) => {
  const id = `hsk${level}-g${String(lesson).padStart(2, '0')}-${index + 1}`
  const { hanzi, pinyin, vi } = point.example
  return {
    id,
    title: point.title,
    pattern: point.pattern,
    explanation: point.explanation,
    examples: [point.example],
    drills: [
      { type: 'order', vi, tokens: [...hanzi], pinyin },
      { type: 'translate', vi, hanzi, pinyin },
    ],
  }
})

/** Ready-to-merge textbook-aligned material keyed by the existing lesson IDs. */
export const TEXTBOOK_MATERIALS_12: Record<string, {
  grammar: GrammarPoint[]
  dialogues: Dialogue[]
  readings: Reading[]
  sections: string[]
  exercises: string[]
  confusables: []
}> = Object.fromEntries([...hsk1, ...hsk2].map((material) => {
  const key = `hsk${material.level}-${String(material.lesson).padStart(2, '0')}`
  return [key, {
    grammar: toGrammarPoints(material.level, material.lesson, material.grammar),
    dialogues: material.dialogues,
    readings: [],
    sections: material.sections,
    exercises: material.exercisePrompts,
    confusables: [],
  }]
}))

export const HSK12_MATERIAL_COUNTS = { 1: hsk1.length, 2: hsk2.length }
