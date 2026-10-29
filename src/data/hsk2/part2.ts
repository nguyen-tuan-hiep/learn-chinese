import { lesson } from '../dsl'

export const hsk2Part2 = [
  lesson(2, 6, `
title: 他比我高 | Tā bǐ wǒ gāo | Anh ấy cao hơn tôi
[words]
比 | bǐ | TỈ | so với, hơn | giới từ | Như "TỈ lệ", "so TỈ": đặt hai vật cạnh nhau để so sánh. Hình hai người đứng song song. | 哥哥比我高。 | Gēge bǐ wǒ gāo. | Anh trai cao hơn tôi.
高 | gāo | CAO | cao | tính từ | Như "CAO thấp", "cao nguyên". Hình toà nhà cao có cửa ở giữa. | 他很高。 | Tā hěn gāo. | Anh ấy rất cao.
哥哥 | gēge | CA CA | anh trai | danh từ | CA (anh, như "ca ca"): hai chữ 可 chồng lên nhau. Âm thứ hai đọc nhẹ. | 我哥哥是医生。 | Wǒ gēge shì yīshēng. | Anh trai tôi là bác sĩ.
弟弟 | dìdi | ĐỆ ĐỆ | em trai | danh từ | ĐỆ (em trai, như "huynh đệ"). Âm thứ hai đọc nhẹ. | 我弟弟八岁。 | Wǒ dìdi bā suì. | Em trai tôi tám tuổi.
姐姐 | jiějie | TỶ TỶ | chị gái | danh từ | TỶ (chị, như "tỷ muội"). Bộ nữ 女 bên trái. | 我姐姐在北京工作。 | Wǒ jiějie zài Běijīng gōngzuò. | Chị gái tôi làm việc ở Bắc Kinh.
妹妹 | mèimei | MUỘI MUỘI | em gái | danh từ | MUỘI (em gái, như "tỷ muội"). Bộ nữ 女 bên trái. | 我妹妹是学生。 | Wǒ mèimei shì xuésheng. | Em gái tôi là học sinh.
孩子 | háizi | HÀI TỬ | con cái, trẻ con | danh từ | HÀI (trẻ con, như "hài nhi") + TỬ (con). | 她有三个孩子。 | Tā yǒu sān ge háizi. | Cô ấy có ba đứa con.
男 | nán | NAM | nam, con trai | tính từ | Như "NAM nữ". Ruộng 田 trên, sức lực 力 dưới: người làm ruộng khoẻ mạnh. | 她有一个男孩子。 | Tā yǒu yí ge nán háizi. | Cô ấy có một cậu con trai. | 田 (điền, ruộng) + 力 (lực, sức)
女 | nǚ | NỮ | nữ, con gái | tính từ | Như "NỮ nhi". Hình người phụ nữ ngồi quỳ, hai tay đặt trước. | 我有三个女同学。 | Wǒ yǒu sān ge nǚ tóngxué. | Tôi có ba bạn học nữ.
[grammar] So sánh hơn với 比 | A + 比 + B + Tính từ (+ chênh lệch)
Tiếng Việt nói "A cao hơn B", còn tiếng Trung nói A + 比 + B + 高. Không đặt 很 hay 非常 trước tính từ trong câu có 比. Muốn nói hơn bao nhiêu thì đặt phần chênh lệch SAU tính từ: 高一点儿 (cao hơn một chút), 大三岁 (hơn ba tuổi).
> 哥哥比我高。 | Gēge bǐ wǒ gāo. | Anh trai cao hơn tôi.
> 我比他大三岁。 | Wǒ bǐ tā dà sān suì. | Tôi lớn hơn anh ấy ba tuổi.
o: Anh trai cao hơn tôi. | 哥哥 比 我 高 | Gēge bǐ wǒ gāo.
t: Tôi lớn hơn em trai ba tuổi. | 我比弟弟大三岁。 | Wǒ bǐ dìdi dà sān suì.
[grammar] Phủ định so sánh bằng 没有 | A + 没有 + B + Tính từ
"A không bằng B" dùng 没有, không dùng 不比 (不比 mang nghĩa khác, dễ gây hiểu nhầm). Ví dụ 弟弟没有我高 nghĩa là em trai không cao bằng tôi.
> 弟弟没有我高。 | Dìdi méiyǒu wǒ gāo. | Em trai không cao bằng tôi.
> 这个菜没有那个好吃。 | Zhège cài méiyǒu nàge hǎochī. | Món này không ngon bằng món kia.
o: Em trai không cao bằng tôi. | 弟弟 没有 我 高 | Dìdi méiyǒu wǒ gāo.
t: Cái này không đắt bằng cái kia. | 这个没有那个贵。 | Zhège méiyǒu nàge guì.
[grammar] Gọi anh chị em | 哥哥 · 姐姐 · 弟弟 · 妹妹
Tiếng Trung phân biệt rõ anh (哥哥), chị (姐姐), em trai (弟弟), em gái (妹妹). Hỏi gia đình: 你有哥哥吗？ 你家有几个孩子？ Khi nói về nhà mình thường không thêm 的: 我哥哥, 我妹妹.
> 你有哥哥吗？ | Nǐ yǒu gēge ma? | Bạn có anh trai không?
> 我有一个姐姐和一个妹妹。 | Wǒ yǒu yí ge jiějie hé yí ge mèimei. | Tôi có một chị gái và một em gái.
o: Tôi có một chị gái và một em gái. | 我 有 一 个 姐姐 和 一 个 妹妹 | Wǒ yǒu yí ge jiějie hé yí ge mèimei.
t: Bạn có anh trai không? | 你有哥哥吗？ | Nǐ yǒu gēge ma?
[dialogue] Anh em trong nhà | Anna hỏi Vương Minh về anh chị em.
Anna: 你有哥哥吗？ | Nǐ yǒu gēge ma? | Bạn có anh trai không?
Vương Minh: 有，我有一个哥哥和一个妹妹。 | Yǒu, wǒ yǒu yí ge gēge hé yí ge mèimei. | Có, mình có một anh trai và một em gái.
Anna: 你哥哥比你大几岁？ | Nǐ gēge bǐ nǐ dà jǐ suì? | Anh bạn lớn hơn bạn mấy tuổi?
Vương Minh: 他比我大五岁，也比我高。 | Tā bǐ wǒ dà wǔ suì, yě bǐ wǒ gāo. | Anh ấy lớn hơn mình năm tuổi, cũng cao hơn mình.
Anna: 你妹妹呢？ | Nǐ mèimei ne? | Còn em gái bạn?
Vương Minh: 她今年十八岁，没有我高。 | Tā jīnnián shíbā suì, méiyǒu wǒ gāo. | Năm nay em ấy mười tám tuổi, không cao bằng mình.
[dialogue] Chị gái của Vương Minh | Anna hỏi thăm gia đình chị gái Vương Minh.
Anna: 你姐姐有孩子吗？ | Nǐ jiějie yǒu háizi ma? | Chị bạn có con chưa?
Vương Minh: 有，她有一个男孩子，今年四岁。 | Yǒu, tā yǒu yí ge nán háizi, jīnnián sì suì. | Có, chị ấy có một cậu con trai, năm nay bốn tuổi.
Anna: 她先生在哪儿工作？ | Tā xiānsheng zài nǎr gōngzuò? | Chồng chị ấy làm việc ở đâu?
Vương Minh: 他在医院工作，是医生。 | Tā zài yīyuàn gōngzuò, shì yīshēng. | Anh ấy làm ở bệnh viện, là bác sĩ.
Anna: 他们的孩子比你妹妹小吗？ | Tāmen de háizi bǐ nǐ mèimei xiǎo ma? | Con của họ nhỏ hơn em gái bạn à?
Vương Minh: 是，他很小。 | Shì, tā hěn xiǎo. | Ừ, bé còn nhỏ lắm.
`),

  lesson(2, 7, `
title: 我想吃面条 | Wǒ xiǎng chī miàntiáo | Tôi muốn ăn mì
[words]
面条 | miàntiáo | MIẾN ĐIỀU | mì sợi | danh từ | Ở đây 面 là 麵 (bột mì), khác 面 (mặt) trong 前面; 条 là sợi dài. | 我想吃面条。 | Wǒ xiǎng chī miàntiáo. | Tôi muốn ăn mì.
牛奶 | niúnǎi | NGƯU NÃI | sữa bò | danh từ | NGƯU (bò, như "ngưu hoàng") + NÃI (sữa). | 我早上喝牛奶。 | Wǒ zǎoshang hē niúnǎi. | Buổi sáng tôi uống sữa.
鸡蛋 | jīdàn | KÊ ĐẢN | trứng gà | danh từ | KÊ (gà) + ĐẢN (trứng). | 我想吃一个鸡蛋。 | Wǒ xiǎng chī yí ge jīdàn. | Tôi muốn ăn một quả trứng.
羊肉 | yángròu | DƯƠNG NHỤC | thịt cừu, thịt dê | danh từ | DƯƠNG (dê, cừu) + NHỤC (thịt, như "cốt nhục"). | 他不吃羊肉。 | Tā bù chī yángròu. | Anh ấy không ăn thịt cừu.
鱼 | yú | NGƯ | cá | danh từ | Như "NGƯ ông" (ông chài). Hình con cá có đầu, thân và đuôi. | 我喜欢吃鱼。 | Wǒ xǐhuan chī yú. | Tôi thích ăn cá.
西瓜 | xīguā | TÂY QUA | dưa hấu | danh từ | TÂY (phương Tây) + QUA (dưa): thứ dưa từ phương Tây truyền sang. | 西瓜很好吃。 | Xīguā hěn hǎochī. | Dưa hấu rất ngon.
咖啡 | kāfēi | CÀ PHÊ | cà phê | danh từ | Phiên âm của "coffee", giống tiếng Việt "cà phê". Cả hai chữ đều có bộ khẩu 口. | 我要一杯咖啡。 | Wǒ yào yì bēi kāfēi. | Tôi lấy một cốc cà phê.
服务员 | fúwùyuán | PHỤC VỤ VIÊN | nhân viên phục vụ | danh từ | Giống hệt tiếng Việt: PHỤC VỤ VIÊN. Gọi người phục vụ thường nói 服务员！ | 服务员，我要一杯茶。 | Fúwùyuán, wǒ yào yì bēi chá. | Phục vụ ơi, cho tôi một cốc trà.
要 | yào | YÊU | muốn, cần; sẽ | động từ | Như "YÊU cầu" (đòi hỏi). Gọi món, mua hàng đều dùng 要. | 你要喝什么？ | Nǐ yào hē shénme? | Bạn muốn uống gì?
还 | hái | HOÀN | còn, vẫn, thêm | phó từ | Như "HOÀN" (trả lại), nhưng ở đây đọc hái và nghĩa là "còn, vẫn". | 你还要什么？ | Nǐ hái yào shénme? | Bạn còn cần gì nữa? | | huán
[grammar] 要: gọi món, muốn có | 要 + Danh từ  ·  要 + V
要 + danh từ nghĩa là "lấy, cho tôi" khi gọi món hay mua hàng: 我要一杯咖啡. 要 + động từ nghĩa là muốn hoặc phải làm gì. So với 想, 要 mạnh và dứt khoát hơn, vì thế khi gọi món người ta hay nói 我要… hơn 我想….
> 我要一杯咖啡。 | Wǒ yào yì bēi kāfēi. | Tôi lấy một cốc cà phê.
> 你要吃什么？ | Nǐ yào chī shénme? | Bạn muốn ăn gì?
o: Tôi lấy một cốc cà phê. | 我 要 一 杯 咖啡 | Wǒ yào yì bēi kāfēi.
t: Bạn muốn ăn gì? | 你要吃什么？ | Nǐ yào chī shénme?
[grammar] 还: còn, vẫn | 还 + V / Số lượng
还 đứng trước động từ, có hai nghĩa chính: "còn, thêm nữa" (你还要什么？ Bạn còn cần gì nữa?) và "vẫn" (他还在睡觉, anh ấy vẫn đang ngủ).
> 你还要什么？ | Nǐ hái yào shénme? | Bạn còn cần gì nữa?
> 他还在睡觉。 | Tā hái zài shuìjiào. | Anh ấy vẫn đang ngủ.
o: Bạn còn cần gì nữa? | 你 还 要 什么 | Nǐ hái yào shénme?
t: Anh ấy vẫn đang ngủ. | 他还在睡觉。 | Tā hái zài shuìjiào.
[grammar] Lượng từ cho đồ ăn thức uống | 杯 · 块 · 条 · 个
Đồ uống đựng trong cốc dùng 杯 (一杯牛奶). Miếng, lát dùng 块 (一块西瓜). Vật dài như con cá dùng 条 (一条鱼). Trứng và hầu hết trái cây dùng 个 (一个鸡蛋). Học lượng từ theo từng danh từ, đừng dịch từng chữ.
> 我要一杯牛奶。 | Wǒ yào yì bēi niúnǎi. | Tôi lấy một cốc sữa.
> 我想吃一块西瓜。 | Wǒ xiǎng chī yí kuài xīguā. | Tôi muốn ăn một miếng dưa hấu.
o: Tôi muốn ăn một miếng dưa hấu. | 我 想 吃 一 块 西瓜 | Wǒ xiǎng chī yí kuài xīguā.
t: Tôi lấy một cốc sữa. | 我要一杯牛奶。 | Wǒ yào yì bēi niúnǎi.
[dialogue] Gọi món ở quán | Vương Minh và Anna gọi món.
Vương Minh: 服务员，我要一杯咖啡。 | Fúwùyuán, wǒ yào yì bēi kāfēi. | Phục vụ ơi, cho tôi một cốc cà phê.
Anna: 我要一杯茶。 | Wǒ yào yì bēi chá. | Cho tôi một cốc trà.
Người phục vụ: 你们还要什么？ | Nǐmen hái yào shénme? | Hai bạn còn cần gì nữa không?
Vương Minh: 我想吃面条，还要一个鸡蛋。 | Wǒ xiǎng chī miàntiáo, hái yào yí ge jīdàn. | Mình muốn ăn mì, và thêm một quả trứng.
Anna: 我不吃羊肉，我想吃鱼。 | Wǒ bù chī yángròu, wǒ xiǎng chī yú. | Mình không ăn thịt cừu, mình muốn ăn cá.
Người phục vụ: 好的，请坐。 | Hǎo de, qǐng zuò. | Vâng, mời hai bạn ngồi.
[dialogue] Bữa sáng | Anna hỏi Vương Minh về bữa sáng.
Anna: 你早上吃什么？ | Nǐ zǎoshang chī shénme? | Buổi sáng bạn ăn gì?
Vương Minh: 我早上喝牛奶，吃鸡蛋。 | Wǒ zǎoshang hē niúnǎi, chī jīdàn. | Buổi sáng mình uống sữa, ăn trứng.
Anna: 你还喜欢吃什么？ | Nǐ hái xǐhuan chī shénme? | Bạn còn thích ăn gì nữa?
Vương Minh: 我喜欢吃西瓜。 | Wǒ xǐhuan chī xīguā. | Mình thích ăn dưa hấu.
Anna: 我也喜欢！我们去商店买一个西瓜吧。 | Wǒ yě xǐhuan! Wǒmen qù shāngdiàn mǎi yí ge xīguā ba. | Mình cũng thích! Chúng ta đi cửa hàng mua một quả dưa hấu nhé.
`),

  lesson(2, 8, `
title: 他跑得很快 | Tā pǎo de hěn kuài | Anh ấy chạy rất nhanh
[words]
运动 | yùndòng | VẬN ĐỘNG | thể thao; vận động | danh từ / động từ | Giống hệt tiếng Việt: VẬN ĐỘNG (thể thao). | 你喜欢什么运动？ | Nǐ xǐhuan shénme yùndòng? | Bạn thích môn thể thao nào?
跑步 | pǎobù | BÀO BỘ | chạy bộ | động từ | BÀO (chạy) + BỘ (bước, như "tản bộ"). Bộ túc 足 (chân) bên trái. | 我每天早上跑步。 | Wǒ měitiān zǎoshang pǎobù. | Mỗi sáng tôi chạy bộ.
游泳 | yóuyǒng | DU VỊNH | bơi | động từ | Bộ thuỷ 氵 (nước) ở cả hai chữ: nước là nơi để bơi. | 我喜欢游泳。 | Wǒ xǐhuan yóuyǒng. | Tôi thích bơi.
踢足球 | tī zúqiú | (đá) TÚC CẦU | đá bóng | cụm động từ | 足球 là TÚC CẦU (bóng chân). Bóng đá dùng 踢 (đá), bộ túc 足 bên trái. | 他喜欢踢足球。 | Tā xǐhuan tī zúqiú. | Anh ấy thích đá bóng.
打篮球 | dǎ lánqiú | (đánh) LAM CẦU | chơi bóng rổ | cụm động từ | LAM (cái giỏ) + CẦU (bóng): bóng ném vào giỏ. Dùng 打 cho bóng chơi bằng tay. | 我哥哥会打篮球。 | Wǒ gēge huì dǎ lánqiú. | Anh trai tôi biết chơi bóng rổ.
唱歌 | chànggē | XƯỚNG CA | hát | động từ | XƯỚNG (hát, như "xướng ngôn") + CA (bài hát). | 她唱歌唱得很好。 | Tā chànggē chàng de hěn hǎo. | Cô ấy hát rất hay.
跳舞 | tiàowǔ | KHIÊU VŨ | nhảy múa | động từ | KHIÊU (nhảy) + VŨ (múa). Giống "khiêu vũ" trong tiếng Việt. | 我们去跳舞吧。 | Wǒmen qù tiàowǔ ba. | Chúng ta đi nhảy nhé.
累 | lèi | LUỸ | mệt | tính từ | Như "tích LUỸ" nhưng nghĩa là mệt: người làm việc nhiều thì mệt. | 我今天很累。 | Wǒ jīntiān hěn lèi. | Hôm nay tôi rất mệt.
得 | de | ĐẮC | (trợ từ nối động từ với bổ ngữ) | trợ từ | Như "ĐẮC ý", "đắc lợi". Trong ngữ pháp, 得 nối động từ với phần nhận xét về cách làm. | 他跑得很快。 | Tā pǎo de hěn kuài. | Anh ấy chạy rất nhanh. | | dé
[grammar] Bổ ngữ trạng thái: V + 得 + Adj | S + V + 得 + (很) + Adj
Dùng để nhận xét cách làm hay mức độ của hành động: 他跑得很快 (anh ấy chạy rất nhanh). Nếu động từ có tân ngữ thì phải lặp động từ: 她唱歌唱得很好. Phủ định đặt 不 trước tính từ: 他跑得不快.
> 他跑得很快。 | Tā pǎo de hěn kuài. | Anh ấy chạy rất nhanh.
> 她唱歌唱得很好。 | Tā chànggē chàng de hěn hǎo. | Cô ấy hát rất hay.
o: Anh ấy chạy rất nhanh. | 他 跑 得 很 快 | Tā pǎo de hěn kuài.
t: Cô ấy hát rất hay. | 她唱歌唱得很好。 | Tā chànggē chàng de hěn hǎo.
[grammar] Hỏi và đáp về mức độ | V + 得 + 怎么样？
Hỏi "làm việc đó thế nào" dùng V + 得 + 怎么样. Trả lời bằng 得 + 很好, 不太好, 不错... Nhớ lặp động từ nếu có tân ngữ: 你游泳游得怎么样？
> 你游泳游得怎么样？ | Nǐ yóuyǒng yóu de zěnmeyàng? | Bạn bơi thế nào?
> 我游得不太好。 | Wǒ yóu de bú tài hǎo. | Tôi bơi không giỏi lắm.
o: Bạn chạy bộ thế nào? | 你 跑步 跑 得 怎么样 | Nǐ pǎobù pǎo de zěnmeyàng?
t: Tôi nhảy không giỏi lắm. | 我跳得不太好。 | Wǒ tiào de bú tài hǎo.
[grammar] Nói về môn thể thao | 打 + bóng tay · 踢 + bóng chân
Chọn động từ theo môn: 打 cho các môn chơi bằng tay hoặc vợt (打篮球), 踢 cho bóng chân (踢足球). Bơi và chạy bộ đã có động từ riêng nên không cần 打 hay 踢.
> 你喜欢什么运动？ | Nǐ xǐhuan shénme yùndòng? | Bạn thích môn thể thao nào?
> 我喜欢游泳和跑步。 | Wǒ xǐhuan yóuyǒng hé pǎobù. | Tôi thích bơi và chạy bộ.
o: Bạn thích môn thể thao nào? | 你 喜欢 什么 运动 | Nǐ xǐhuan shénme yùndòng?
t: Tôi thích bơi và chạy bộ. | 我喜欢游泳和跑步。 | Wǒ xǐhuan yóuyǒng hé pǎobù.
[dialogue] Thích môn gì? | Anna và Vương Minh nói về thể thao.
Anna: 你喜欢什么运动？ | Nǐ xǐhuan shénme yùndòng? | Bạn thích môn thể thao nào?
Vương Minh: 我喜欢打篮球，也喜欢踢足球。 | Wǒ xǐhuan dǎ lánqiú, yě xǐhuan tī zúqiú. | Mình thích chơi bóng rổ, cũng thích đá bóng.
Anna: 你踢得怎么样？ | Nǐ tī de zěnmeyàng? | Bạn đá thế nào?
Vương Minh: 踢得不太好，我哥哥踢得很好。 | Tī de bú tài hǎo, wǒ gēge tī de hěn hǎo. | Mình đá không giỏi lắm, anh trai mình đá rất giỏi.
Anna: 我不会打篮球，我喜欢游泳。 | Wǒ bú huì dǎ lánqiú, wǒ xǐhuan yóuyǒng. | Mình không biết chơi bóng rổ, mình thích bơi.
Vương Minh: 你游得好吗？ | Nǐ yóu de hǎo ma? | Bạn bơi giỏi không?
Anna: 游得很好，我每天都游泳。 | Yóu de hěn hǎo, wǒ měitiān dōu yóuyǒng. | Giỏi lắm, ngày nào mình cũng bơi.
[dialogue] Mệt rồi | Vương Minh vừa chạy bộ xong.
Anna: 你累了吗？ | Nǐ lèi le ma? | Bạn mệt rồi à?
Vương Minh: 累，我跑步跑了一个小时。 | Lèi, wǒ pǎobù pǎole yí ge xiǎoshí. | Mệt, mình chạy bộ cả tiếng đồng hồ.
Anna: 你跑得很快，休息一下吧。 | Nǐ pǎo de hěn kuài, xiūxi yíxià ba. | Bạn chạy rất nhanh, nghỉ một chút đi.
Anna: 晚上我们去唱歌吧。 | Wǎnshang wǒmen qù chànggē ba. | Tối nay chúng mình đi hát nhé.
Vương Minh: 好啊，可是我唱得不好。 | Hǎo a, kěshì wǒ chàng de bù hǎo. | Được thôi, nhưng mình hát không hay.
Anna: 没关系，我们一起跳舞吧。 | Méi guānxi, wǒmen yìqǐ tiàowǔ ba. | Không sao, chúng mình cùng nhảy nhé.
`),

  lesson(2, 9, `
title: 我生病了 | Wǒ shēngbìng le | Tôi bị ốm rồi
[words]
生病 | shēngbìng | SINH BỆNH | bị ốm, bị bệnh | động từ | SINH (sinh ra, mắc phải) + BỆNH. Bộ nạch 疒 (bệnh tật) trong chữ 病. | 我妈妈生病了。 | Wǒ māma shēngbìng le. | Mẹ tôi bị ốm rồi.
药 | yào | DƯỢC | thuốc | danh từ | Như "DƯỢC sĩ", "dược phẩm". Bộ thảo 艹 (cỏ cây): thuốc xưa làm từ cây cỏ. | 你吃药了吗？ | Nǐ chī yào le ma? | Bạn uống thuốc chưa?
让 | ràng | NHƯỜNG | bảo, để cho, nhường | động từ | Như "nhượng bộ", "chuyển NHƯỢNG". 让 + người + V: bảo hoặc cho phép ai làm gì. | 医生让我休息。 | Yīshēng ràng wǒ xiūxi. | Bác sĩ bảo tôi nghỉ ngơi.
别 | bié | BIỆT | đừng | phó từ | Như "ly BIỆT", "đặc BIỆT". Dùng để ngăn cản hoặc khuyên: 别 + V. | 你别去学校了。 | Nǐ bié qù xuéxiào le. | Bạn đừng đến trường nữa.
洗 | xǐ | TẨY | giặt, rửa, gội | động từ | Như "TẨY trần", "tẩy rửa". Bộ thuỷ 氵 (nước) bên trái. | 我想洗一下衣服。 | Wǒ xiǎng xǐ yíxià yīfu. | Tôi muốn giặt quần áo một chút.
正在 | zhèngzài | CHÍNH TẠI | đang (diễn ra) | phó từ | CHÍNH (đúng lúc) + TẠI (đang ở): đúng lúc đang làm. | 他正在睡觉。 | Tā zhèngzài shuìjiào. | Anh ấy đang ngủ.
着 | zhe | TRỨ | (trợ từ: đang ở trạng thái) | trợ từ | Đặt sau động từ để nói trạng thái đang kéo dài: 门开着 (cửa đang mở). Đọc nhẹ. | 门开着呢。 | Mén kāizhe ne. | Cửa đang mở. | | zháo
真 | zhēn | CHÂN | thật, thật là | phó từ | Như "CHÂN thật", "chân lý". 真 + tính từ để cảm thán: 真好 (thật là tốt). | 这个苹果真好吃。 | Zhège píngguǒ zhēn hǎochī. | Quả táo này ngon thật.
知道 | zhīdào | TRI ĐẠO | biết | động từ | TRI (biết, như "tri thức") + ĐẠO (lẽ, đường). Phủ định: 不知道. | 我不知道他的名字。 | Wǒ bù zhīdào tā de míngzi. | Tôi không biết tên anh ấy.
告诉 | gàosu | CÁO TỐ | nói cho biết, bảo | động từ | CÁO (thông báo, như "báo cáo") + TỐ (kể). Bộ ngôn 讠 ở chữ 诉. Âm thứ hai đọc nhẹ. | 请你告诉我，你叫什么名字。 | Qǐng nǐ gàosu wǒ, nǐ jiào shénme míngzi. | Xin bạn cho tôi biết tên bạn.
[grammar] 别 + V: đừng làm | 别 + V (+ 了)
别 dùng để khuyên hoặc ngăn ai đó: 别去 (đừng đi), 别说了 (đừng nói nữa). Thêm 了 ở cuối câu để bảo "không làm nữa". Nghe thân mật hơn 不要.
> 你别去学校了。 | Nǐ bié qù xuéxiào le. | Bạn đừng đến trường nữa.
> 别说了。 | Bié shuō le. | Đừng nói nữa.
o: Bạn đừng đến trường nữa. | 你 别 去 学校 了 | Nǐ bié qù xuéxiào le.
t: Đừng nói nữa. | 别说了。 | Bié shuō le.
[grammar] 让: bảo, cho phép | A + 让 + B + V
让 + người + động từ nghĩa là "bảo ai làm gì" hoặc "cho ai làm gì". Phủ định 不让 là "không cho phép". Thường gặp khi nói bác sĩ, bố mẹ, thầy cô bảo gì đó.
> 医生让我休息。 | Yīshēng ràng wǒ xiūxi. | Bác sĩ bảo tôi nghỉ ngơi.
> 妈妈不让我喝咖啡。 | Māma bú ràng wǒ hē kāfēi. | Mẹ không cho tôi uống cà phê.
o: Bác sĩ bảo tôi nghỉ ngơi. | 医生 让 我 休息 | Yīshēng ràng wǒ xiūxi.
t: Mẹ không cho tôi uống cà phê. | 妈妈不让我喝咖啡。 | Māma bú ràng wǒ hē kāfēi.
[grammar] 正在 và 着: đang làm, đang ở trạng thái | 正在 + V (+ 呢)  ·  V + 着
正在 nhấn mạnh đúng lúc hành động đang diễn ra: 他正在睡觉. V + 着 diễn tả trạng thái kéo dài sau khi hành động xong: 门开着 (cửa đang mở), 他坐着 (anh ấy đang ngồi). Cả hai thường kết thúc bằng 呢.
> 妈妈正在做饭。 | Māma zhèngzài zuòfàn. | Mẹ đang nấu cơm.
> 门开着呢。 | Mén kāizhe ne. | Cửa đang mở.
o: Mẹ đang nấu cơm. | 妈妈 正在 做饭 | Māma zhèngzài zuòfàn.
t: Cửa đang mở. | 门开着呢。 | Mén kāizhe ne.
[dialogue] Đi khám bệnh | Anna hỏi thăm Vương Minh đang ốm.
Anna: 你怎么了？ | Nǐ zěnme le? | Bạn sao thế?
Vương Minh: 我生病了，身体不好。 | Wǒ shēngbìng le, shēntǐ bù hǎo. | Mình bị ốm rồi, người không khoẻ.
Anna: 你去医院了吗？ | Nǐ qù yīyuàn le ma? | Bạn đi bệnh viện chưa?
Vương Minh: 去了，医生让我吃药，也让我休息。 | Qù le, yīshēng ràng wǒ chī yào, yě ràng wǒ xiūxi. | Đi rồi, bác sĩ bảo mình uống thuốc và nghỉ ngơi.
Anna: 那你别去学校了。 | Nà nǐ bié qù xuéxiào le. | Vậy bạn đừng đến trường nữa.
Vương Minh: 好，我在家休息。 | Hǎo, wǒ zài jiā xiūxi. | Ừ, mình ở nhà nghỉ.
Anna: 我下午给你打电话。 | Wǒ xiàwǔ gěi nǐ dǎ diànhuà. | Chiều mình gọi điện cho bạn.
[dialogue] Gọi điện | Anna gọi điện cho Vương Minh.
Anna: 喂，你在做什么呢？ | Wéi, nǐ zài zuò shénme ne? | A lô, bạn đang làm gì thế?
Vương Minh: 我正在洗衣服。 | Wǒ zhèngzài xǐ yīfu. | Mình đang giặt quần áo.
Anna: 你知道王老师在哪儿吗？ | Nǐ zhīdào Wáng lǎoshī zài nǎr ma? | Bạn có biết cô Vương ở đâu không?
Vương Minh: 我不知道，我可以告诉你她家在哪儿。 | Wǒ bù zhīdào, wǒ kěyǐ gàosu nǐ tā jiā zài nǎr. | Mình không biết, nhưng có thể cho bạn biết nhà cô ấy ở đâu.
Anna: 谢谢，你真好。 | Xièxie, nǐ zhēn hǎo. | Cảm ơn, bạn tốt thật.
`),

  lesson(2, 10, `
title: 你去过中国吗 | Nǐ qùguo Zhōngguó ma | Bạn từng đến Trung Quốc chưa
[words]
过 | guo | QUÁ | (từng, đã từng) | trợ từ | Như "quá khứ", "quá khứ". Đặt sau động từ để nói đã từng trải qua. Đọc nhẹ guo; khi là động từ "đi qua" đọc guò. | 我去过北京。 | Wǒ qùguo Běijīng. | Tôi từng đến Bắc Kinh. | | guò
次 | cì | THỨ | lần | lượng từ | Như "THỨ tự", "lần thứ". Số lần đứng SAU động từ: 去一次. | 我去过三次北京。 | Wǒ qùguo sān cì Běijīng. | Tôi đã đến Bắc Kinh ba lần.
考试 | kǎoshì | KHẢO THÍ | kỳ thi; thi | danh từ / động từ | KHẢO (thi, như "khảo cứu") + THÍ (thử, như "thí sinh"). | 明天有汉语考试。 | Míngtiān yǒu Hànyǔ kǎoshì. | Ngày mai có thi tiếng Hán.
课 | kè | KHOÁ | bài học, tiết học | danh từ | Như "KHOÁ học", "giáo khoá". Bộ ngôn 讠: lời giảng. | 我们八点上课。 | Wǒmen bā diǎn shàngkè. | Tám giờ chúng tôi vào học.
题 | tí | ĐỀ | đề bài, câu hỏi | danh từ | Như "chủ ĐỀ", "vấn ĐỀ". Dùng cho câu hỏi trong bài thi. | 这个题我做对了。 | Zhège tí wǒ zuòduì le. | Câu này tôi làm đúng rồi.
错 | cuò | THÁC | sai | tính từ | Như "THÁC loạn" (lẫn lộn). Bộ kim 钅 bên trái. Trái nghĩa với 对. | 这个字你写错了。 | Zhège zì nǐ xiěcuò le. | Chữ này bạn viết sai rồi.
对 | duì | ĐỐI | đúng; đối với | tính từ / giới từ | Như "ĐỐI diện", "ĐỐI đáp". Nghĩa "đúng" khi trả lời: 对！ là "đúng rồi!". | 你说得对。 | Nǐ shuō de duì. | Bạn nói đúng.
懂 | dǒng | ĐỔNG | hiểu | động từ | Bộ tâm 忄 (trái tim) bên trái: hiểu bằng cả lòng. Thường đi sau động từ: 听懂, 看懂. | 我没听懂。 | Wǒ méi tīngdǒng. | Tôi không nghe hiểu.
开始 | kāishǐ | KHAI THUỶ | bắt đầu | động từ | KHAI (mở) + THUỶ (đầu, như "nguyên thuỷ"). | 考试开始了。 | Kǎoshì kāishǐ le. | Kỳ thi bắt đầu rồi.
完 | wán | HOÀN | xong, hết | động từ | Như "HOÀN thành", "hoàn toàn". Đặt sau động từ để nói đã làm xong. | 我吃完饭了。 | Wǒ chīwán fàn le. | Tôi ăn cơm xong rồi.
第一 | dì yī | ĐỆ NHẤT | thứ nhất, đầu tiên | số từ | Như "ĐỆ NHẤT". 第 + số tạo thành số thứ tự: 第一, 第二, 第三. | 这是我第一次去北京。 | Zhè shì wǒ dì yī cì qù Běijīng. | Đây là lần đầu tiên tôi đến Bắc Kinh.
[grammar] V + 过: đã từng | S + V + 过 + O  ·  S + 没 + V + 过
过 đặt ngay sau động từ để nói một trải nghiệm trong quá khứ: 去过 (đã từng đến), 吃过 (đã từng ăn). Phủ định dùng 没(有) + V + 过 (chưa từng). Hỏi: …过…吗？ hoặc …过…没有？
> 你去过中国吗？ | Nǐ qùguo Zhōngguó ma? | Bạn từng đến Trung Quốc chưa?
> 我没去过北京。 | Wǒ méi qùguo Běijīng. | Tôi chưa từng đến Bắc Kinh.
o: Bạn từng đến Trung Quốc chưa? | 你 去 过 中国 吗 | Nǐ qùguo Zhōngguó ma?
t: Tôi chưa từng ăn cá. | 我没吃过鱼。 | Wǒ méi chīguo yú.
[grammar] Bổ ngữ kết quả: V + 完 / 对 / 错 / 懂 | V + Kết quả
Thêm kết quả vào ngay sau động từ để nói hành động đạt kết quả gì: 吃完 (ăn xong), 做对 (làm đúng), 写错 (viết sai), 听懂 (nghe hiểu). Phủ định dùng 没: 没听懂. Câu có kết quả thường kèm 了.
> 我吃完饭了。 | Wǒ chīwán fàn le. | Tôi ăn cơm xong rồi.
> 这个字你写错了。 | Zhège zì nǐ xiěcuò le. | Chữ này bạn viết sai rồi.
o: Tôi ăn cơm xong rồi. | 我 吃 完 饭 了 | Wǒ chīwán fàn le.
t: Tôi không nghe hiểu. | 我没听懂。 | Wǒ méi tīngdǒng.
[grammar] Số thứ tự và số lần | 第 + Số  ·  V + Số + 次
第 + số tạo số thứ tự: 第一次 (lần đầu tiên). Số lần đứng SAU động từ: 去过三次 (đã đi ba lần). Nếu có địa điểm, địa điểm đứng sau số lần: 去过三次北京.
> 这是我第一次去北京。 | Zhè shì wǒ dì yī cì qù Běijīng. | Đây là lần đầu tiên tôi đến Bắc Kinh.
> 我去过三次北京。 | Wǒ qùguo sān cì Běijīng. | Tôi đã đến Bắc Kinh ba lần.
o: Đây là lần đầu tiên tôi đến Bắc Kinh. | 这 是 我 第一 次 去 北京 | Zhè shì wǒ dì yī cì qù Běijīng.
t: Tôi đã đến Bắc Kinh ba lần. | 我去过三次北京。 | Wǒ qùguo sān cì Běijīng.
[dialogue] Bạn từng đến Trung Quốc chưa? | Hai bạn chuẩn bị chuyến đi.
Anna: 你去过中国吗？ | Nǐ qùguo Zhōngguó ma? | Bạn từng đến Trung Quốc chưa?
Vương Minh: 我去过三次，你呢？ | Wǒ qùguo sān cì, nǐ ne? | Mình đã đi ba lần, còn bạn?
Anna: 这是我第一次去。 | Zhè shì wǒ dì yī cì qù. | Đây là lần đầu tiên của mình.
Vương Minh: 你准备好了吗？ | Nǐ zhǔnbèi hǎo le ma? | Bạn chuẩn bị xong chưa?
Anna: 我已经准备好了。 | Wǒ yǐjīng zhǔnbèi hǎo le. | Mình đã chuẩn bị xong rồi.
[dialogue] Ngày mai có thi | Hai bạn nói chuyện về kỳ thi.
Vương Minh: 明天有汉语考试，你准备了吗？ | Míngtiān yǒu Hànyǔ kǎoshì, nǐ zhǔnbèi le ma? | Mai có thi tiếng Hán, bạn chuẩn bị chưa?
Anna: 我已经开始准备了。这个题你做对了吗？ | Wǒ yǐjīng kāishǐ zhǔnbèi le. Zhège tí nǐ zuòduì le ma? | Mình bắt đầu chuẩn bị rồi. Câu này bạn làm đúng chưa?
Vương Minh: 我做错了。你说得对。 | Wǒ zuòcuò le. Nǐ shuō de duì. | Mình làm sai rồi. Bạn nói đúng.
Anna: 你听懂老师说的了吗？ | Nǐ tīngdǒng lǎoshī shuō de le ma? | Bạn nghe hiểu điều cô giáo nói chưa?
Vương Minh: 没听懂，请你告诉我一下。 | Méi tīngdǒng, qǐng nǐ gàosu wǒ yíxià. | Chưa hiểu, nhờ bạn nói cho mình một chút.
`),
]
