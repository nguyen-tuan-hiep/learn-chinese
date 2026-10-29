import { lesson } from '../dsl'

export const hsk2Part3 = [
  lesson(2, 11, `
title: 因为下雨，所以我没去 | Yīnwèi xiàyǔ, suǒyǐ wǒ méi qù | Vì trời mưa nên tôi không đi
[words]
因为 | yīnwèi | NHÂN VI | bởi vì, vì | liên từ | NHÂN (nguyên nhân, như "nhân quả") + VI (vì). Chỉ nguyên nhân. | 因为下雨，我没去学校。 | Yīnwèi xiàyǔ, wǒ méi qù xuéxiào. | Vì trời mưa nên tôi không đến trường.
所以 | suǒyǐ | SỞ DĨ | cho nên, vì vậy | liên từ | Như "SỞ DĨ" trong tiếng Việt: lý do là vậy. Chỉ kết quả. | 我生病了，所以没去上班。 | Wǒ shēngbìng le, suǒyǐ méi qù shàngbān. | Tôi bị ốm nên không đi làm.
虽然 | suīrán | TUY NHIÊN | tuy, mặc dù | liên từ | Giống "TUY NHIÊN" trong tiếng Việt, nhưng ở đây là "tuy rằng…". | 虽然这个菜很贵，但是很好吃。 | Suīrán zhège cài hěn guì, dànshì hěn hǎochī. | Tuy món này đắt nhưng rất ngon.
但是 | dànshì | ĐÃN THỊ | nhưng, tuy nhiên | liên từ | ĐÃN (nhưng, chỉ) + THỊ. Hay đi cặp với 虽然. | 我很累，但是很高兴。 | Wǒ hěn lèi, dànshì hěn gāoxìng. | Tôi rất mệt nhưng rất vui.
为什么 | wèishénme | VI THẬP MA | tại sao | đại từ nghi vấn | VI (vì) + 什么 (cái gì): "vì cái gì". Đứng trước động từ hoặc đầu câu. | 你为什么没去？ | Nǐ wèishénme méi qù? | Tại sao bạn không đi?
可能 | kěnéng | KHẢ NĂNG | có thể, có khả năng | phó từ | Giống hệt "KHẢ NĂNG": điều gì đó có thể xảy ra. | 明天可能会下雨。 | Míngtiān kěnéng huì xiàyǔ. | Ngày mai có thể sẽ mưa.
希望 | xīwàng | HI VỌNG | hy vọng, mong | động từ | Giống hệt tiếng Việt: HI VỌNG. | 我希望你快乐。 | Wǒ xīwàng nǐ kuàilè. | Tôi mong bạn vui vẻ.
意思 | yìsi | Ý TỨ | ý nghĩa | danh từ | Như "ý TỨ": điều muốn nói. Hỏi nghĩa của từ: 什么意思？ Âm thứ hai đọc nhẹ. | 这个字是什么意思？ | Zhège zì shì shénme yìsi? | Chữ này nghĩa là gì?
快乐 | kuàilè | KHOÁI LẠC | vui vẻ, hạnh phúc | tính từ | Giống hệt "KHOÁI LẠC": vui sướng. Hay dùng trong lời chúc: 生日快乐！ | 祝你生日快乐。 | Zhù nǐ shēngrì kuàilè. | Chúc bạn sinh nhật vui vẻ.
生日 | shēngrì | SINH NHẬT | sinh nhật | danh từ | Giống hệt tiếng Việt: SINH NHẬT. | 明天是我的生日。 | Míngtiān shì wǒ de shēngrì. | Ngày mai là sinh nhật tôi.
它 | tā | THA | nó (chỉ vật, con vật) | đại từ | Cùng âm tā với 他 và 她, nhưng dùng cho đồ vật và con vật. Bộ miên 宀 (mái nhà). | 这是我的猫，它很小。 | Zhè shì wǒ de māo, tā hěn xiǎo. | Đây là con mèo của tôi, nó còn nhỏ.
[grammar] 因为…所以… | 因为 + Nguyên nhân，所以 + Kết quả
Giống tiếng Việt "vì… nên…". Điểm khác: tiếng Việt có thể bỏ một trong hai từ, tiếng Trung cũng bỏ được 因为 hoặc 所以 nhưng người học nên dùng đủ cặp cho dễ nhớ. Chủ ngữ đứng sau 因为 hoặc 所以, không đứng trước chúng nếu hai vế có cùng chủ ngữ.
> 因为下雨，所以我没去学校。 | Yīnwèi xiàyǔ, suǒyǐ wǒ méi qù xuéxiào. | Vì trời mưa nên tôi không đến trường.
> 我生病了，所以没去上班。 | Wǒ shēngbìng le, suǒyǐ méi qù shàngbān. | Tôi bị ốm nên không đi làm.
o: Vì trời mưa nên tôi không đến trường. | 因为 下雨 所以 我 没 去 学校 | Yīnwèi xiàyǔ, suǒyǐ wǒ méi qù xuéxiào.
t: Vì tôi mệt nên tôi muốn nghỉ ngơi. | 因为我累了，所以我想休息。 | Yīnwèi wǒ lèi le, suǒyǐ wǒ xiǎng xiūxi.
[grammar] 虽然…但是… | 虽然 + Vế nhượng bộ，但是 + Vế chính
Giống "tuy… nhưng…". Điểm khác với tiếng Việt: tiếng Trung hay dùng đủ cặp 虽然…但是… và 但是 không thể bỏ nếu muốn câu nghe tự nhiên. Vế sau là ý chính người nói muốn nhấn.
> 虽然这个菜很贵，但是很好吃。 | Suīrán zhège cài hěn guì, dànshì hěn hǎochī. | Tuy món này đắt nhưng rất ngon.
> 虽然我很累，但是我很高兴。 | Suīrán wǒ hěn lèi, dànshì wǒ hěn gāoxìng. | Tuy tôi mệt nhưng tôi rất vui.
o: Tuy tôi mệt nhưng tôi rất vui. | 虽然 我 很 累 但是 我 很 高兴 | Suīrán wǒ hěn lèi, dànshì wǒ hěn gāoxìng.
t: Tuy món này đắt nhưng rất ngon. | 虽然这个菜很贵，但是很好吃。 | Suīrán zhège cài hěn guì, dànshì hěn hǎochī.
[grammar] 为什么, 可能, 希望 | 为什么 + V · 可能 + V · 希望 + câu
为什么 đứng trước động từ để hỏi lý do, và thường được trả lời bằng 因为…. 可能 (có thể) đứng trước động từ để nói điều chưa chắc chắn. 希望 + cả câu: mong rằng… Chú ý 可能 chỉ khả năng xảy ra, khác 可以 (được phép).
> 你为什么没去学校？ | Nǐ wèishénme méi qù xuéxiào? | Tại sao bạn không đến trường?
> 我希望明天不下雨。 | Wǒ xīwàng míngtiān bú xiàyǔ. | Tôi mong ngày mai trời không mưa.
o: Tại sao bạn không đến trường? | 你 为什么 没 去 学校 | Nǐ wèishénme méi qù xuéxiào?
t: Ngày mai có thể sẽ mưa. | 明天可能会下雨。 | Míngtiān kěnéng huì xiàyǔ.
[dialogue] Sao bạn không đi học? | Anna hỏi vì sao Vương Minh nghỉ học.
Anna: 你为什么没去学校？ | Nǐ wèishénme méi qù xuéxiào? | Tại sao bạn không đến trường?
Vương Minh: 因为我生病了，所以没去。 | Yīnwèi wǒ shēngbìng le, suǒyǐ méi qù. | Vì mình bị ốm nên không đi.
Anna: 你现在怎么样？ | Nǐ xiànzài zěnmeyàng? | Bây giờ bạn thế nào?
Vương Minh: 虽然还有一点儿累，但是比昨天好。 | Suīrán hái yǒu yìdiǎnr lèi, dànshì bǐ zuótiān hǎo. | Tuy còn hơi mệt nhưng đã khá hơn hôm qua.
Anna: 希望你明天可以去学校。 | Xīwàng nǐ míngtiān kěyǐ qù xuéxiào. | Mong là mai bạn có thể đến trường.
[dialogue] Sinh nhật của Vương Minh | Hai bạn nói về sinh nhật.
Anna: 明天是你的生日吗？ | Míngtiān shì nǐ de shēngrì ma? | Mai là sinh nhật bạn à?
Vương Minh: 是，明天是我二十岁的生日。 | Shì, míngtiān shì wǒ èrshí suì de shēngrì. | Ừ, mai là sinh nhật hai mươi tuổi của mình.
Anna: 生日快乐！明天可能下雨，你想做什么？ | Shēngrì kuàilè! Míngtiān kěnéng xiàyǔ, nǐ xiǎng zuò shénme? | Sinh nhật vui vẻ! Mai có thể mưa, bạn muốn làm gì?
Vương Minh: 虽然下雨，但是我们可以在家吃面条。 | Suīrán xiàyǔ, dànshì wǒmen kěyǐ zài jiā chī miàntiáo. | Tuy trời mưa nhưng chúng mình có thể ở nhà ăn mì.
Anna: 好啊！为什么吃面条？ | Hǎo a! Wèishénme chī miàntiáo? | Được thôi! Tại sao lại ăn mì?
Vương Minh: 因为中国人过生日吃面条。 | Yīnwèi Zhōngguó rén guò shēngrì chī miàntiáo. | Vì người Trung Quốc đón sinh nhật bằng ăn mì.
`),

  lesson(2, 12, `
title: 明天会下雪吗 | Míngtiān huì xiàxuě ma | Ngày mai có tuyết rơi không
[words]
晴 | qíng | TÌNH | trời nắng, quang đãng | tính từ | Như "TÌNH" trong "tình thiên" (trời nắng). Bộ nhật 日 (mặt trời) bên trái. | 今天是晴天。 | Jīntiān shì qíngtiān. | Hôm nay là ngày nắng. | 日 (nhật, mặt trời) + 青 (thanh)
阴 | yīn | ÂM | âm u, nhiều mây | tính từ | Như "ÂM dương", "âm u". Trời âm u thiếu nắng. | 明天是阴天。 | Míngtiān shì yīntiān. | Ngày mai trời âm u.
雪 | xuě | TUYẾT | tuyết | danh từ | Như "TUYẾT trắng", "băng tuyết". Bộ vũ 雨 (mưa) ở trên. | 我没看过雪。 | Wǒ méi kànguo xuě. | Tôi chưa từng thấy tuyết.
去年 | qùnián | KHỨ NIÊN | năm ngoái | danh từ | KHỨ (đã qua, như "quá khứ") + NIÊN (năm). | 我去年去过北京。 | Wǒ qùnián qùguo Běijīng. | Năm ngoái tôi đã đến Bắc Kinh.
日 | rì | NHẬT | ngày | danh từ | Như "NHẬT" trong "sinh nhật". Dùng trong văn viết thay cho 号 khi nói ngày tháng. | 今天是九月一日。 | Jīntiān shì jiǔ yuè yī rì. | Hôm nay là ngày 1 tháng 9.
百 | bǎi | BÁCH | trăm | số từ | Như "BÁCH niên", "bách khoa". | 这件衣服一百块。 | Zhè jiàn yīfu yì bǎi kuài. | Chiếc áo này một trăm tệ.
千 | qiān | THIÊN | nghìn | số từ | Như "THIÊN" trong "thiên binh vạn mã". Hình chữ 十 có nét phẩy. | 这个手机三千块。 | Zhège shǒujī sānqiān kuài. | Chiếc điện thoại này ba nghìn tệ.
零 | líng | LINH | số không; lẻ | số từ | Như "LINH" (rơi rụng, tản mác). Dùng khi có số 0 ở giữa: 一百零五. | 一百零五 | yì bǎi líng wǔ | một trăm linh năm
两 | liǎng | LƯỠNG | hai (khi đếm số lượng) | số từ | Như "LƯỠNG toàn" (cả hai bên). Khi đếm vật, người dùng 两 chứ không phải 二. | 我有两个哥哥。 | Wǒ yǒu liǎng ge gēge. | Tôi có hai anh trai.
就 | jiù | TỰU | ngay, sớm, thì | phó từ | Như "thành TỰU" (đạt được). Trong ngữ pháp 就 nhấn mạnh việc xảy ra sớm, ngay, hoặc nhanh. | 我五点就起床了。 | Wǒ wǔ diǎn jiù qǐchuáng le. | Năm giờ tôi đã dậy rồi.
[grammar] Nói về thời tiết | 今天 + 是 + 晴天 / 阴天  ·  下雨 / 下雪
晴天 là ngày nắng, 阴天 là ngày âm u. Hiện tượng mưa tuyết dùng động từ 下: 下雨 (mưa), 下雪 (tuyết rơi). Hỏi thời tiết: 天气怎么样？ Dự báo: 明天会下雪吗？
> 今天是晴天。 | Jīntiān shì qíngtiān. | Hôm nay là ngày nắng.
> 明天会下雪吗？ | Míngtiān huì xiàxuě ma? | Ngày mai có tuyết rơi không?
o: Hôm nay là ngày nắng. | 今天 是 晴天 | Jīntiān shì qíngtiān.
t: Ngày mai trời âm u. | 明天是阴天。 | Míngtiān shì yīntiān.
[grammar] 两 và 二 | 两 + Lượng từ  ·  二 trong số đếm
Khi đếm số lượng vật hay người, dùng 两: 两个人, 两本书, 两点 (hai giờ). Khi đọc số, số thứ tự, số điện thoại thì dùng 二: 二十, 第二, 十二, 二月. Trước 百 và 千 thường dùng 两: 两百, 两千.
> 我有两个哥哥。 | Wǒ yǒu liǎng ge gēge. | Tôi có hai anh trai.
> 现在两点。 | Xiànzài liǎng diǎn. | Bây giờ là hai giờ.
o: Tôi có hai anh trai. | 我 有 两 个 哥哥 | Wǒ yǒu liǎng ge gēge.
t: Bây giờ là hai giờ. | 现在两点。 | Xiànzài liǎng diǎn.
[grammar] Số lớn: 百, 千, 零 | Số + 百 / 千  ·  零 giữa số
Đọc số lớn giống tiếng Việt: 一百 (một trăm), 一千 (một nghìn). Khi giữa hai số có số 0 thì đọc 零: 一百零五 (105), 三千零二十 (3020). Số chẵn trăm khi nói giá thường lược 块: 两百.
> 这件衣服两百块。 | Zhè jiàn yīfu liǎng bǎi kuài. | Chiếc áo này hai trăm tệ.
> 一百零五 | yì bǎi líng wǔ | một trăm linh năm
o: Chiếc áo này hai trăm tệ. | 这 件 衣服 两 百 块 | Zhè jiàn yīfu liǎng bǎi kuài.
t: Một trăm linh năm. | 一百零五 | yì bǎi líng wǔ
[grammar] 就: sớm, ngay | 就 + V
就 đứng trước động từ, nhấn mạnh việc xảy ra sớm hơn dự kiến hoặc sẽ xảy ra ngay. 我八点就到学校了 (tám giờ tôi đã đến trường rồi, tức là sớm). 他明天就回来 (ngày mai anh ấy sẽ về ngay).
> 我八点就到学校了。 | Wǒ bā diǎn jiù dào xuéxiào le. | Tám giờ tôi đã đến trường rồi.
> 他明天就回来。 | Tā míngtiān jiù huílai. | Ngày mai anh ấy sẽ về ngay.
o: Tám giờ tôi đã đến trường rồi. | 我 八 点 就 到 学校 了 | Wǒ bā diǎn jiù dào xuéxiào le.
t: Ngày mai anh ấy sẽ về ngay. | 他明天就回来。 | Tā míngtiān jiù huílai.
[dialogue] Dự báo thời tiết | Anna và Vương Minh nói về thời tiết.
Anna: 明天天气怎么样？ | Míngtiān tiānqì zěnmeyàng? | Mai thời tiết thế nào?
Vương Minh: 明天是阴天，可能会下雪。 | Míngtiān shì yīntiān, kěnéng huì xiàxuě. | Mai trời âm u, có thể có tuyết.
Anna: 真的吗？我没看过雪。 | Zhēn de ma? Wǒ méi kànguo xuě. | Thật không? Mình chưa từng thấy tuyết.
Vương Minh: 你去北京的时候，可能可以看到。 | Nǐ qù Běijīng de shíhou, kěnéng kěyǐ kàndào. | Khi bạn đến Bắc Kinh, có thể sẽ thấy.
Anna: 太好了！我希望明天是晴天。 | Tài hǎo le! Wǒ xīwàng míngtiān shì qíngtiān. | Tuyệt quá! Mình mong mai là ngày nắng.
[dialogue] Ngày tháng và giá cả | Hai bạn đi chợ.
Anna: 今天几号？ | Jīntiān jǐ hào? | Hôm nay ngày mấy?
Vương Minh: 今天十月二十日。 | Jīntiān shí yuè èrshí rì. | Hôm nay là ngày 20 tháng 10.
Anna: 这件衣服多少钱？ | Zhè jiàn yīfu duōshao qián? | Chiếc áo này bao nhiêu tiền?
Vương Minh: 两百块，是去年买的。 | Liǎng bǎi kuài, shì qùnián mǎi de. | Hai trăm tệ, mua từ năm ngoái.
Anna: 太贵了，我就买一件白色的。 | Tài guì le, wǒ jiù mǎi yí jiàn báisè de. | Đắt quá, mình chỉ mua một chiếc màu trắng thôi.
`),

  lesson(2, 13, `
title: 请再说一次 | Qǐng zài shuō yí cì | Xin nói lại một lần nữa
[words]
卖 | mài | MẠI | bán | động từ | Như "MẠI dâm", "thương mại". 卖 giống 买 nhưng có thêm 十 ở trên: có tiền mà BÁN thì thêm vào. | 这个商店卖手机。 | Zhège shāngdiàn mài shǒujī. | Cửa hàng này bán điện thoại.
票 | piào | PHIẾU | vé; phiếu | danh từ | Như "PHIẾU bầu", "bưu phiếu". Dùng cho vé tàu, vé máy bay, vé xem phim. | 我买了一张票。 | Wǒ mǎile yì zhāng piào. | Tôi đã mua một vé.
手机 | shǒujī | THỦ CƠ | điện thoại di động | danh từ | THỦ (tay) + CƠ (máy): máy cầm tay. | 我的手机在桌子上。 | Wǒ de shǒujī zài zhuōzi shang. | Điện thoại của tôi ở trên bàn.
手表 | shǒubiǎo | THỦ BIỂU | đồng hồ đeo tay | danh từ | THỦ (tay) + BIỂU (đồng hồ, như "biểu"). | 这个手表很漂亮。 | Zhège shǒubiǎo hěn piàoliang. | Chiếc đồng hồ này rất đẹp.
铅笔 | qiānbǐ | DUYÊN BÚT | bút chì | danh từ | DUYÊN (chì) + BÚT (bút). Bộ kim 钅 bên trái chữ 铅 và bộ trúc 竹 trên chữ 笔. | 桌子上有一个铅笔。 | Zhuōzi shang yǒu yí ge qiānbǐ. | Trên bàn có một cây bút chì.
报纸 | bàozhǐ | BÁO CHỈ | tờ báo | danh từ | BÁO (thông báo, tin tức) + CHỈ (giấy). Bộ ty 纟 trong chữ 纸. | 爸爸每天看报纸。 | Bàba měitiān kàn bàozhǐ. | Bố mỗi ngày đều đọc báo.
姓 | xìng | TÍNH | họ; mang họ | động từ / danh từ | Như "TÍNH danh" (họ tên). Bộ nữ 女 vì thời xưa họ theo mẹ. | 我姓王。 | Wǒ xìng Wáng. | Tôi họ Vương.
说话 | shuōhuà | THUYẾT THOẠI | nói chuyện | động từ | THUYẾT (nói) + THOẠI (lời). Cùng bộ ngôn 讠. | 请你别说话。 | Qǐng nǐ bié shuōhuà. | Xin bạn đừng nói chuyện.
再 | zài | TÁI | lại, nữa, tiếp | phó từ | Như "TÁI ngộ", "tái hôn". Dùng cho việc CHƯA xảy ra: lại làm một lần nữa. | 请你再说一次。 | Qǐng nǐ zài shuō yí cì. | Xin bạn nói thêm một lần nữa.
外 | wài | NGOẠI | ngoài; nước ngoài | danh từ phương vị | Như "NGOẠI quốc", "ngoại thành". Đặt sau danh từ: 门外. | 学校外面有一个商店。 | Xuéxiào wàimiàn yǒu yí ge shāngdiàn. | Bên ngoài trường có một cửa hàng.
[grammar] 再: lại, nữa (việc chưa xảy ra) | 再 + V
再 nghĩa là sẽ làm lại lần nữa trong tương lai: 请再说一次 (xin nói thêm một lần), 明天再来 (mai lại đến). Tiếng Trung còn có 又 cho việc ĐÃ lặp lại, sẽ học sau. Mẹo nhớ: 再见 (tái kiến) nghĩa là "sẽ gặp lại".
> 请再说一次。 | Qǐng zài shuō yí cì. | Xin nói lại một lần nữa.
> 明天你再来吧。 | Míngtiān nǐ zài lái ba. | Ngày mai bạn lại đến nhé.
o: Xin nói lại một lần nữa. | 请 再 说 一 次 | Qǐng zài shuō yí cì.
t: Ngày mai bạn lại đến nhé. | 明天你再来吧。 | Míngtiān nǐ zài lái ba.
[grammar] Hỏi họ tên lịch sự | 您贵姓？  ·  我姓 + Họ，叫 + Tên
姓 + họ để nói họ của mình. Hỏi họ lịch sự dùng 您贵姓？ (quý danh là gì ạ?), trả lời 我姓王. Sau đó mới nói tên đầy đủ: 我姓王，叫王明. Không dùng 贵 để nói về họ của chính mình.
> 请问，您贵姓？ | Qǐngwèn, nín guì xìng? | Xin hỏi, ông/bà họ gì ạ?
> 我姓王，叫王明。 | Wǒ xìng Wáng, jiào Wáng Míng. | Tôi họ Vương, tên là Vương Minh.
o: Tôi họ Vương, tên là Vương Minh. | 我 姓 王 叫 王明 | Wǒ xìng Wáng, jiào Wáng Míng.
t: Xin hỏi, ông họ gì ạ? | 请问，您贵姓？ | Qǐngwèn, nín guì xìng?
[grammar] 外面 và 里面 | Danh từ + 外面  ·  Danh từ + 里面
Giống 左边 và 旁边, từ chỉ phương vị đứng SAU danh từ. 里面 là bên trong, 外面 là bên ngoài. Khi đã nói rõ danh từ, đôi khi chỉ cần 里 hoặc 外.
> 学校外面有一个商店。 | Xuéxiào wàimiàn yǒu yí ge shāngdiàn. | Bên ngoài trường có một cửa hàng.
> 房间里面有一个电视。 | Fángjiān lǐmiàn yǒu yí ge diànshì. | Trong phòng có một cái tivi.
o: Bên ngoài trường có một cửa hàng. | 学校 外面 有 一 个 商店 | Xuéxiào wàimiàn yǒu yí ge shāngdiàn.
t: Trong phòng có một cái tivi. | 房间里面有一个电视。 | Fángjiān lǐmiàn yǒu yí ge diànshì.
[dialogue] Mua điện thoại | Anna hỏi mua điện thoại ở cửa hàng.
Anna: 请问，这个商店卖手机吗？ | Qǐngwèn, zhège shāngdiàn mài shǒujī ma? | Xin hỏi, cửa hàng này có bán điện thoại không?
Người bán: 卖，您想买什么样的？ | Mài, nín xiǎng mǎi shénme yàng de? | Có bán, bạn muốn mua loại nào?
Anna: 我想买一个新的，这个多少钱？ | Wǒ xiǎng mǎi yí ge xīn de, zhège duōshao qián? | Mình muốn mua cái mới, cái này bao nhiêu tiền?
Người bán: 两千块。 | Liǎng qiān kuài. | Hai nghìn tệ.
Anna: 太贵了！便宜一点儿吧。 | Tài guì le! Piányi yìdiǎnr ba. | Đắt quá! Rẻ hơn một chút đi.
Người bán: 好，一千八百块。 | Hǎo, yì qiān bā bǎi kuài. | Được, một nghìn tám trăm tệ.
Anna: 请再说一次。 | Qǐng zài shuō yí cì. | Xin bạn nói lại một lần nữa.
[dialogue] Làm quen và xin số | Anna làm quen với một bạn mới.
Anna: 请问，您贵姓？ | Qǐngwèn, nín guì xìng? | Xin hỏi, bạn họ gì ạ?
Vương Minh: 我姓王，叫王明。 | Wǒ xìng Wáng, jiào Wáng Míng. | Mình họ Vương, tên là Vương Minh.
Anna: 请再说一次，我没听懂。 | Qǐng zài shuō yí cì, wǒ méi tīngdǒng. | Xin bạn nói lại một lần nữa, mình chưa nghe hiểu.
Vương Minh: 我姓王。 | Wǒ xìng Wáng. | Mình họ Vương.
Anna: 你可以告诉我你的手机号吗？ | Nǐ kěyǐ gàosu wǒ nǐ de shǒujī hào ma? | Bạn có thể cho mình số điện thoại của bạn không?
Vương Minh: 可以，你给我一个铅笔吧。 | Kěyǐ, nǐ gěi wǒ yí ge qiānbǐ ba. | Được, bạn đưa mình một cây bút chì nhé.
`),

  lesson(2, 14, `
title: 大家都很忙 | Dàjiā dōu hěn máng | Mọi người đều rất bận
[words]
大家 | dàjiā | ĐẠI GIA | mọi người, mọi người trong nhóm | đại từ | ĐẠI (lớn, tất cả) + GIA (nhà): cả nhà, cả mọi người. Dùng khi chào cả nhóm: 大家好！ | 大家好！ | Dàjiā hǎo! | Chào mọi người!
忙 | máng | MANG | bận | tính từ | Như "MANG" trong "bận mang". Bộ tâm 忄 (lòng) + 亡: lòng bồn chồn vì nhiều việc. | 我今天很忙。 | Wǒ jīntiān hěn máng. | Hôm nay tôi rất bận. | 忄(tâm, lòng) + 亡 (vong)
眼睛 | yǎnjing | NHÃN TINH | mắt | danh từ | NHÃN (mắt, như "nhãn quan") + TINH (con ngươi). Cùng bộ mục 目. Âm thứ hai đọc nhẹ. | 她的眼睛很漂亮。 | Tā de yǎnjing hěn piàoliang. | Mắt cô ấy rất đẹp.
事情 | shìqing | SỰ TÌNH | việc, sự việc | danh từ | Như "SỰ việc" + "tình": việc xảy ra. Âm thứ hai đọc nhẹ. | 我有很多事情。 | Wǒ yǒu hěn duō shìqing. | Tôi có rất nhiều việc.
帮助 | bāngzhù | BANG TRỢ | giúp đỡ; sự giúp đỡ | động từ / danh từ | BANG (giúp, như "bang trợ") + TRỢ (hỗ trợ). | 谢谢你的帮助。 | Xièxie nǐ de bāngzhù. | Cảm ơn sự giúp đỡ của bạn.
妻子 | qīzi | THÊ TỬ | vợ | danh từ | THÊ (vợ, như "thê tử"). Văn nói hay dùng 太太 hoặc 老婆. | 他的妻子是老师。 | Tā de qīzi shì lǎoshī. | Vợ anh ấy là giáo viên.
丈夫 | zhàngfu | TRƯỢNG PHU | chồng | danh từ | Như "đại TRƯỢNG PHU". Âm thứ hai đọc nhẹ. | 她的丈夫在医院工作。 | Tā de zhàngfu zài yīyuàn gōngzuò. | Chồng cô ấy làm việc ở bệnh viện.
[grammar] Câu hỏi chính phản | V + 不 + V  ·  Adj + 不 + Adj
Ngoài hỏi bằng 吗, tiếng Trung hỏi lặp lại dạng khẳng định rồi phủ định: 你忙不忙？ 他去不去？ Đây là cách hỏi trung lập, nghe tự nhiên. Khi dùng cách này thì KHÔNG thêm 吗 ở cuối. Âm 不 giữa đọc nhẹ: máng bu máng.
> 你忙不忙？ | Nǐ máng bu máng? | Bạn có bận không?
> 他去不去学校？ | Tā qù bu qù xuéxiào? | Anh ấy có đến trường không?
o: Bạn có bận không? | 你 忙 不 忙 | Nǐ máng bu máng?
t: Anh ấy có đi không? | 他去不去？ | Tā qù bu qù?
[grammar] 大家 và 都 | 大家 + 都 + V / Adj
大家 là "mọi người", mặc định số nhiều nên hay đi với 都: 大家都很忙. Trong lời chào cả nhóm dùng 大家好！ Khác 你们 ở chỗ 大家 có thể gồm cả người nói.
> 大家都很忙。 | Dàjiā dōu hěn máng. | Mọi người đều rất bận.
> 大家好！ | Dàjiā hǎo! | Chào mọi người!
o: Mọi người đều rất bận. | 大家 都 很 忙 | Dàjiā dōu hěn máng.
t: Chào mọi người! | 大家好！ | Dàjiā hǎo!
[grammar] Nhờ giúp đỡ: 请 + người + V | 请 + Người + V  ·  帮助 + Người
请 + người + động từ nghĩa là "nhờ ai làm gì". 帮助 vừa là động từ (请你帮助我) vừa là danh từ (谢谢你的帮助). Trả lời: 好的, 没问题 (không vấn đề gì). Chú ý: nhờ người lớn tuổi thì dùng 您.
> 请你帮助我。 | Qǐng nǐ bāngzhù wǒ. | Xin bạn giúp tôi.
> 谢谢你的帮助。 | Xièxie nǐ de bāngzhù. | Cảm ơn sự giúp đỡ của bạn.
o: Xin bạn giúp tôi. | 请 你 帮助 我 | Qǐng nǐ bāngzhù wǒ.
t: Cảm ơn sự giúp đỡ của bạn. | 谢谢你的帮助。 | Xièxie nǐ de bāngzhù.
[dialogue] Ai cũng bận | Anna hỏi Vương Minh về gia đình.
Anna: 大家都很忙吗？ | Dàjiā dōu hěn máng ma? | Mọi người đều bận à?
Vương Minh: 是啊，大家都很忙。我姐姐的丈夫也在公司。 | Shì a, dàjiā dōu hěn máng. Wǒ jiějie de zhàngfu yě zài gōngsī. | Ừ, ai cũng bận. Chồng chị mình cũng ở công ty.
Anna: 你姐姐忙不忙？ | Nǐ jiějie máng bu máng? | Chị bạn có bận không?
Vương Minh: 她很忙，因为事情很多。 | Tā hěn máng, yīnwèi shìqing hěn duō. | Chị ấy rất bận vì nhiều việc.
Anna: 我可以帮助她吗？ | Wǒ kěyǐ bāngzhù tā ma? | Mình có thể giúp chị ấy không?
Vương Minh: 谢谢你，她希望你可以帮助她。 | Xièxie nǐ, tā xīwàng nǐ kěyǐ bāngzhù tā. | Cảm ơn bạn, chị ấy mong bạn có thể giúp.
[dialogue] Vợ chồng anh trai | Hai bạn gặp anh chị của Vương Minh.
Anna: 你看，那是你哥哥的妻子吗？ | Nǐ kàn, nà shì nǐ gēge de qīzi ma? | Bạn xem, đó là vợ anh trai bạn à?
Vương Minh: 对，她的眼睛很漂亮。 | Duì, tā de yǎnjing hěn piàoliang. | Đúng, mắt chị ấy rất đẹp.
Anna: 她比你哥哥高吗？ | Tā bǐ nǐ gēge gāo ma? | Chị ấy cao hơn anh bạn không?
Vương Minh: 没有我哥哥高。 | Méiyǒu wǒ gēge gāo. | Chị ấy không cao bằng anh mình.
Anna: 她工作忙不忙？ | Tā gōngzuò máng bu máng? | Chị ấy làm việc có bận không?
Vương Minh: 不太忙，她今天休息。 | Bú tài máng, tā jīntiān xiūxi. | Không bận lắm, hôm nay chị ấy nghỉ.
`),

  lesson(2, 15, `
title: 我去机场送朋友 | Wǒ qù jīchǎng sòng péngyou | Tôi ra sân bay tiễn bạn
[words]
出 | chū | XUẤT | ra, đi ra | động từ | Như "XUẤT hiện", "xuất phát". Hình cây mọc ra khỏi cái hố. 出去 = đi ra ngoài. | 他出去了。 | Tā chūqu le. | Anh ấy ra ngoài rồi.
进 | jìn | TIẾN | vào, tiến vào | động từ | Như "TIẾN bộ", "tiến vào". Bộ sước 辶 (đi) bên trái. | 请进。 | Qǐng jìn. | Mời vào.
玩 | wán | NGOẠN | chơi, đi chơi | động từ | Như "ngoạn mục" (ngắm cảnh đẹp). Bộ ngọc 王 bên trái: chơi với đồ ngọc. | 我们去玩吧。 | Wǒmen qù wán ba. | Chúng ta đi chơi nhé.
送 | sòng | TỐNG | tiễn; tặng; đưa | động từ | Như "TỐNG tiễn". Bộ sước 辶 (đi): đi cùng để tiễn. | 我去机场送朋友。 | Wǒ qù jīchǎng sòng péngyou. | Tôi ra sân bay tiễn bạn.
等 | děng | ĐẲNG | chờ, đợi | động từ | Như "ĐẲNG" trong "đẳng cấp" (đợi đủ hạng). Bộ trúc 竹 ở trên. | 请等一下。 | Qǐng děng yíxià. | Xin chờ một chút.
找 | zhǎo | — | tìm | động từ | Chữ do người Trung Quốc tạo ra, không có âm Hán Việt thông dụng. Tay 扌 (bên trái) cầm giáo 戈 để tìm kiếm. | 我在找我的手机。 | Wǒ zài zhǎo wǒ de shǒujī. | Tôi đang tìm điện thoại của tôi. | 扌(thủ, tay) + 戈 (qua, giáo)
笑 | xiào | TIẾU | cười | động từ | Như "TIẾU ngạo" (cười ngạo nghễ). Bộ trúc 竹 ở trên: cây trúc đung đưa như người cười. | 她笑了。 | Tā xiào le. | Cô ấy cười.
[grammar] 快要…了 và 要…了: sắp | 快要 / 要 / 快 + V + 了
Dùng để nói một việc sắp xảy ra: 火车快要到了 (tàu sắp đến). Có thể rút gọn thành 要…了 hoặc 快…了. Khi có từ chỉ thời điểm cụ thể (ví dụ 明天) thì chỉ dùng 要…了, không dùng 快要.
> 火车快要到了。 | Huǒchē kuàiyào dào le. | Tàu sắp đến rồi.
> 我要去机场了。 | Wǒ yào qù jīchǎng le. | Tôi sắp ra sân bay rồi.
o: Tàu sắp đến rồi. | 火车 快要 到 了 | Huǒchē kuàiyào dào le.
t: Kỳ thi sắp bắt đầu rồi. | 考试快要开始了。 | Kǎoshì kuàiyào kāishǐ le.
[grammar] Bổ ngữ xu hướng: 来 và 去 | V + 来 / 去
来 chỉ hướng về phía người nói, 去 chỉ hướng ra xa người nói: 进来 (vào đây), 进去 (vào đó), 出来, 出去, 回来, 回去. Cùng một động tác nhưng đứng ở đâu nói thì chọn 来 hay 去.
> 请进来。 | Qǐng jìnlai. | Mời vào đây.
> 他出去了。 | Tā chūqu le. | Anh ấy ra ngoài rồi.
o: Mời vào đây. | 请 进来 | Qǐng jìnlai.
t: Anh ấy ra ngoài rồi. | 他出去了。 | Tā chūqu le.
[grammar] 一边…一边…: vừa… vừa… | S + 一边 + V1 + 一边 + V2
Hai hành động diễn ra cùng lúc bởi cùng một người: 一边走一边说话 (vừa đi vừa nói chuyện). Mỗi 一边 đứng trước một động từ, và cả hai động từ đều là động từ có thể kéo dài.
> 她一边走一边笑。 | Tā yìbiān zǒu yìbiān xiào. | Cô ấy vừa đi vừa cười.
> 我们一边吃饭一边说话。 | Wǒmen yìbiān chīfàn yìbiān shuōhuà. | Chúng tôi vừa ăn cơm vừa nói chuyện.
o: Chúng tôi vừa ăn vừa nói chuyện. | 我们 一边 吃饭 一边 说话 | Wǒmen yìbiān chīfàn yìbiān shuōhuà.
t: Cô ấy vừa đi vừa cười. | 她一边走一边笑。 | Tā yìbiān zǒu yìbiān xiào.
[dialogue] Đi tìm điện thoại | Vương Minh tìm điện thoại trước khi ra sân bay.
Anna: 你在找什么？ | Nǐ zài zhǎo shénme? | Bạn đang tìm gì thế?
Vương Minh: 我在找手机，我要去机场送朋友。 | Wǒ zài zhǎo shǒujī, wǒ yào qù jīchǎng sòng péngyou. | Mình đang tìm điện thoại, mình phải ra sân bay tiễn bạn.
Anna: 手机在桌子上。 | Shǒujī zài zhuōzi shang. | Điện thoại ở trên bàn.
Vương Minh: 谢谢！你想和我一起去吗？ | Xièxie! Nǐ xiǎng hé wǒ yìqǐ qù ma? | Cảm ơn! Bạn muốn đi cùng mình không?
Anna: 好，我们一边走一边说话吧。 | Hǎo, wǒmen yìbiān zǒu yìbiān shuōhuà ba. | Được, chúng mình vừa đi vừa nói chuyện nhé.
[dialogue] Ở sân bay | Vương Minh và Anna tiễn Lâm.
Anna: 他来了，你看！ | Tā lái le, nǐ kàn! | Anh ấy đến rồi, bạn xem!
Lâm: 你们好！谢谢你们来送我。 | Nǐmen hǎo! Xièxie nǐmen lái sòng wǒ. | Chào hai bạn! Cảm ơn hai bạn đến tiễn mình.
Vương Minh: 别客气。时间快要到了，你快进去吧。 | Bié kèqi. Shíjiān kuàiyào dào le, nǐ kuài jìnqu ba. | Đừng khách sáo. Sắp đến giờ rồi, bạn mau vào đi.
Lâm: 好，再见！希望你们快乐。 | Hǎo, zàijiàn! Xīwàng nǐmen kuàilè. | Được, tạm biệt! Mong hai bạn vui vẻ.
Anna: 再见！ | Zàijiàn! | Tạm biệt!
`),
]
