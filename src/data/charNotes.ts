import type { CharType } from './charComponents'

/** Hand-written Vietnamese memory notes for every character introduced in HSK 1.
 * Row: char | Hán Việt | kind | story. Kind: t tượng hình, c chỉ sự, h hội ý,
 * s hình thanh, m mượn nghĩa (giả tá), k giản thể khó tách. Stories are memory aids:
 * where the real origin is obscure, they say so or give a clearly-marked mẹo. */
const ROWS = `你|nhĩ|s|亻 (người) + 尔 (nhĩ, gợi âm): người đang đứng trước mặt mình chính là “bạn”.
好|hảo|h|女 (mẹ) bế 子 (con): có mẹ có con là điều TỐT.
您|nâm|h|你 đặt trên 心 (trái tim): người mình để trong lòng mà kính trọng, “ngài”.
们|môn|s|亻 (người) + 门 (môn, cửa, gợi âm): một tốp người đứng trước cửa, chỉ số nhiều.
对|đối|h|又 (bàn tay) + 寸 (tấc, đo đạc): tay cầm thước đo cho khớp, nên là ĐÚNG, khớp ĐỐI.
不|bất|m|Hình gốc là cuống hoa dưới đường chân trời 一; về sau mượn để nói KHÔNG.
起|khởi|s|走 (chạy, đi) + 己 (kỷ, gợi âm): đứng DẬY để bước đi.
没|một|s|氵 (nước) + 殳: chìm mất trong nước, nên là KHÔNG CÓ.
关|quan|k|Giản thể của 關: thanh cài ngang chặn hai cánh cửa, nên là ĐÓNG, liên QUAN.
系|hệ|h|Bàn tay 丿 nối các sợi tơ 糸: buộc lại, liên HỆ.
早|tảo|h|Mặt trời 日 vừa nhô lên khỏi ngọn cây 十: buổi SỚM.
安|an|h|Người phụ nữ 女 ở dưới mái nhà 宀: trong nhà yên ổn, BÌNH AN.
晚|vãn|s|日 (mặt trời) + 免 (miễn, gợi âm): mặt trời được “miễn” làm việc, trời đã MUỘN, TỐI.
各|các|h|Bàn chân 夂 đi về cửa nhà 口: mỗi người về nhà mình, nên là MỖI, CÁC.
位|vị|h|亻 (người) + 立 (đứng): chỗ một người đứng, VỊ trí; từ đếm người lịch sự.
呀|nha|s|口 (miệng) + 牙 (nha, răng, gợi âm): tiếng “ya” bật ra từ miệng.
谢|tạ|s|讠 (lời nói) + 射 (xạ, gợi âm): nói lời CẢM TẠ.
客|khách|s|宀 (mái nhà) + 各 (các, gợi âm): người từ các nơi tìm đến nhà, là KHÁCH.
气|khí|t|Ba nét như ba làn hơi bốc lên trời: hơi, KHÍ.
再|tái|c|Hai lớp đồ vật chồng lên cùng một khung: thêm lần nữa, TÁI.
见|kiến|h|Giản thể của 見: con mắt 目 đặt trên người 儿, người mở to mắt NHÌN THẤY.
多|đa|h|Hai miếng thịt 夕 chồng lên nhau: NHIỀU.
大|đại|t|Người dang rộng hai tay, hai chân: TO, LỚN.
家|gia|h|Con lợn 豕 dưới mái nhà 宀: nhà nuôi được lợn là một GIA đình.
来|lai|m|Hình gốc là cây lúa mạch (來); mượn âm để nói ĐẾN.
会|hội|h|Người 人 tụ lại đông như mây 云: HỌP, HỘI; còn nghĩa là BIẾT làm.
叫|khiếu|s|口 (miệng) + 丩 (gợi âm): há miệng KÊU, GỌI tên.
什|thập|s|亻 (người) + 十 (thập, gợi âm); trong 什么 nghĩa là “gì”.
么|ma|k|Chữ giản thể chỉ dùng trong 什么, 怎么, 这么. Mẹo: sợi tơ 幺 bị cắt cụt.
名|danh|h|Buổi tối 夕 + miệng 口: trời tối không thấy mặt nên phải gọi TÊN.
字|tự|s|Đứa con 子 (tử, gợi âm) dưới mái nhà 宀: con cháu sinh sôi như CHỮ sinh ra chữ.
我|ngã|m|Hình gốc là một cây giáo răng cưa (扌 + 戈); mượn để nói TÔI.
是|thị|h|Mặt trời 日 ở trên, chữ 正 (ngay thẳng) ở dưới: dưới mặt trời mọi thứ rõ ĐÚNG, “LÀ”.
老|lão|t|Hình người già lưng còng, tóc dài, chống gậy 匕: GIÀ.
师|sư|h|Giản thể của 師: nơi nhiều người tụ về; người dẫn dắt họ là THẦY.
吗|ma|s|口 (miệng) + 马 (mã, gợi âm): tiếng “ma” ở cuối câu hỏi.
学|học|h|Đứa trẻ 子 dưới mái 冖, trên có đôi tay chỉ bảo: HỌC.
生|sinh|t|Mầm cây nhú lên khỏi mặt đất 土: SINH ra, sống.
人|nhân|t|Một người nghiêng mình bước đi, hai nét là hai chân.
中|trung|c|Một nét sổ xuyên qua chính GIỮA khung 口.
国|quốc|h|Biên giới 囗 bao quanh viên ngọc 玉 quý: ĐẤT NƯỚC.
美|mỹ|h|Con dê 羊 to 大: dê to béo là ĐẸP, ngon.
籍|tịch|s|⺮ (tre) + 耤 (gợi âm): sổ sách xưa viết trên thẻ tre, sổ hộ TỊCH.
姓|tính|h|女 (nữ) + 生 (sinh): họ ngày xưa theo người mẹ sinh ra, là HỌ.
哪|na|s|口 (miệng) + 那 (na, gợi âm): hỏi “NÀO?”.
里|lý|h|Ruộng 田 trên đất 土: nơi có ruộng có đất là làng; bên TRONG.
自|tự|t|Hình cái mũi; người Trung Quốc chỉ vào mũi khi nói “tôi”, nên là TỰ mình.
她|tha|s|女 (nữ) + 也: giống 他 nhưng đổi sang bộ nữ, “CÔ ẤY”.
谁|thùy|s|讠 (lời) + 隹 (chuy, chim, gợi âm): hỏi “AI?”.
的|đích|s|白 (trắng) + 勺 (chước, gợi âm): hồng tâm trắng của bia bắn là ĐÍCH; trợ từ “của”.
汉|hán|s|氵 (nước): tên sông Hán, rồi thành tên nhà Hán, người HÁN.
语|ngữ|s|讠 (lời) + 吾 (ngô, gợi âm): lời nói, NGÔN NGỮ.
呢|ni|s|口 (miệng) + 尼 (ni, gợi âm): trợ từ cuối câu “còn… thì sao?”.
他|tha|s|亻 (người) + 也: một người khác, “ANH ẤY”.
同|đồng|h|Khung 冂 úp lên một cái miệng 口: mọi miệng cùng một khuôn, CÙNG.
朋|bằng|h|Hai chuỗi vỏ sò (nay viết như hai 月) đứng cạnh nhau: BẠN BÈ.
友|hữu|h|Hai bàn tay 𠂇 và 又 nắm lấy nhau: BẠN HỮU.
有|hữu|h|Bàn tay 𠂇 cầm miếng thịt 月: CÓ.
口|khẩu|t|Hình cái miệng đang há.
女|nữ|t|Hình người phụ nữ quỳ, hai tay đan trước ngực.
儿|nhi|t|Hai chân của đứa trẻ (giản thể của 兒): TRẺ CON.
几|kỷ|m|Hình cái bàn nhỏ; mượn để hỏi MẤY.
岁|tuế|h|Núi 山 trải qua bao buổi chiều 夕: năm tháng, TUỔI.
了|liễu|t|Đứa trẻ quấn tã không thấy tay: đã XONG.
今|kim|c|Mái che 人 úp xuống một vạch: chính lúc NÀY.
年|niên|t|Người vác bó lúa trên lưng: một mùa gặt là một NĂM.
一|nhất|c|Một vạch ngang: MỘT.
二|nhị|c|Hai vạch: HAI.
三|tam|c|Ba vạch: BA.
四|tứ|m|Xưa viết bốn vạch; sau mượn hình cái miệng 囗 có 儿 cho dễ phân biệt: BỐN.
五|ngũ|c|Hai nét ngang là trời và đất, giữa có nét đan chéo: NĂM.
六|lục|m|Hình mái lều; mượn làm số SÁU.
七|thất|c|Một nét ngang bị chặt ngang (nghĩa gốc là cắt); mượn làm số BẢY.
八|bát|c|Hai nét tách ra hai bên, nghĩa gốc là chia; số TÁM.
九|cửu|m|Hình cánh tay cong; mượn làm số CHÍN.
十|thập|c|Ngang và sổ giao nhau, đủ bốn phương: MƯỜI.
说|thuyết|s|讠 (lời) + 兑 (đoài, gợi âm): NÓI.
妈|ma|s|女 (phụ nữ) + 马 (mã, gợi âm): MẸ.
菜|thái|s|艹 (cỏ) + 采 (thái, hái, gợi âm): rau hái về, RAU, MÓN ăn.
很|ngận|s|彳 (bước đi) + 艮 (cấn, gợi âm): RẤT.
吃|ngật|s|口 (miệng) + 乞 (khất, gợi âm): đưa vào miệng, ĂN.
做|tố|h|亻 (người) + 故 (việc): người làm việc, LÀM.
写|tả|k|Giản thể của 寫: VIẾT. Mẹo: mái che 冖 trên cây bút 与.
怎|chẩm|s|乍 (sạ, gợi âm) trên 心 (lòng): trong lòng băn khoăn, THẾ NÀO.
读|độc|s|讠 (lời) + 卖 (mại, gợi âm): ĐỌC thành tiếng.
请|thỉnh|s|讠 (lời) + 青 (thanh, gợi âm): lời MỜI, xin.
问|vấn|s|Cái miệng 口 trong cánh cửa 门 (môn, gợi âm): đứng ở cửa mà HỎI.
天|thiên|c|Người 大 với vạch 一 trên đầu: thứ ở trên đầu là TRỜI; NGÀY.
号|hiệu|h|Miệng 口 với hơi bật ra 丂: kêu to, HIỆU, SỐ; ngày trong tháng.
月|nguyệt|t|Hình vầng trăng khuyết: TRĂNG, THÁNG.
星|tinh|s|日 (ánh sáng) + 生 (sinh, gợi âm): những đốm sáng, NGÔI SAO.
期|kỳ|s|月 (trăng) + 其 (kỳ, gợi âm): một vòng trăng, KỲ hạn.
昨|tạc|s|日 (ngày) + 乍 (sạ, gợi âm): ngày vừa qua, HÔM QUA.
明|minh|h|Mặt trời 日 và mặt trăng 月 cùng chiếu: SÁNG; 明天 là ngày mai.
去|khứ|h|Người (nay viết 土) rời khỏi cửa hang 厶: ĐI.
校|hiệu|s|木 (gỗ) + 交 (giao, gợi âm): khu có rào gỗ, TRƯỜNG.
看|khán|h|Bàn tay 手 che trên mắt 目 để nhìn xa: XEM, NHÌN.
书|thư|k|Giản thể của 書: SÁCH. Mẹo: nét bút ngoằn ngoèo kèm một chấm mực.
想|tưởng|s|相 (tương, gợi âm) trên 心 (lòng): trong lòng NGHĨ, MUỐN.
喝|hát|s|口 (miệng) + 曷 (hạt, gợi âm): UỐNG.
茶|trà|h|Cỏ 艹, người 人, cây 木: người hái lá cây pha TRÀ.
米|mễ|t|Những hạt gạo rơi quanh thân lúa: GẠO.
饭|phạn|s|饣 (ăn) + 反 (phản, gợi âm): CƠM.
下|hạ|c|Một dấu nằm DƯỚI vạch ngang.
午|ngọ|m|Hình cái chày giã gạo; mượn làm giờ NGỌ, buổi TRƯA.
商|thương|m|Tên nhà Thương; người nhà Thương giỏi buôn bán, nên là THƯƠNG mại.
店|điếm|s|广 (mái nhà rộng) + 占 (chiêm, gợi âm): CỬA HÀNG.
买|mãi|k|Giản thể của 買 (vỏ sò là tiền): MUA. Mẹo: 买 mua; 卖 bán có thêm 十 trên đầu.
个|cá|k|Một cây 丨 dưới mái 人: từ đếm CÁI, CHIẾC.
杯|bôi|s|木 (gỗ) + 不 (gợi âm): CỐC, chén.
子|tử|t|Em bé quấn tã, đầu to, hai tay dang: CON.
这|giá|k|辶 (đi) + 文: thứ đã đi tới gần mình, NÀY.
那|na|m|Xưa là tên một vùng đất (阝 là thành ấp); mượn để nói KIA.
少|thiểu|h|小 (nhỏ) bị một nét phẩy cắt bớt: ÍT.
钱|tiền|s|钅 (kim loại) + 戋 (gợi âm): TIỀN đồng.
块|khối|s|土 (đất) + 夬 (quyết, gợi âm): cục đất, KHỐI; đồng (tiền).
小|tiểu|c|Một nét ở giữa, hai chấm nhỏ hai bên: NHỎ.
猫|miêu|s|犭 (thú) + 苗 (miêu, gợi âm): MÈO.
在|tại|s|才 (tài, gợi âm) + 土 (đất): có mặt trên đất này, Ở, TẠI.
狗|cẩu|s|犭 (thú) + 句 (câu, gợi âm): CHÓ.
椅|ỷ|s|木 (gỗ) + 奇 (kỳ, gợi âm): GHẾ tựa bằng gỗ.
面|diện|t|Khuôn mặt với con mắt ở giữa: MẶT; phía; mì.
工|công|t|Hình cái thước thợ: CÔNG việc.
作|tác|s|亻 (người) + 乍 (sạ, gợi âm): người LÀM.
医|y|h|Mũi tên 矢 trong hộp 匸: dụng cụ chữa vết thương, Y.
院|viện|s|阝 (tường đất) + 完 (hoàn, gợi âm): khu nhà có tường, VIỆN.
爸|ba|s|父 (cha) + 巴 (ba, gợi âm): BỐ.
桌|trác|s|卓 (trác, cao, gợi âm) trên 木 (gỗ): BÀN.
上|thượng|c|Một dấu nằm TRÊN vạch ngang.
电|điện|t|Tia chớp xẹt ra từ đám mây: ĐIỆN.
脑|não|s|⺼ (thịt) + cái đầu có tóc: bộ NÃO.
和|hòa|s|禾 (hòa, lúa, gợi âm) + 口 (miệng): có lúa bỏ miệng thì HÒA thuận; VÀ.
本|bản|c|Vạch ngang đánh dấu GỐC cây 木: gốc, BẢN; QUYỂN.
前|tiền|h|Bàn chân bước trên thuyền tiến tới: phía TRƯỚC.
后|hậu|k|Giản thể thay cho 後 (bước chậm phía sau): SAU.
能|năng|m|Hình con gấu khỏe; mượn nghĩa CÓ THỂ, NĂNG lực.
坐|tọa|h|Hai người 人 ngồi trên đất 土: NGỒI.
现|hiện|s|王 (ngọc) + 见 (kiến, gợi âm): ngọc lộ ra thấy được, HIỆN ra.
点|điểm|s|灬 (lửa) + 占 (chiêm, gợi âm): vết chấm cháy đen, ĐIỂM; GIỜ.
分|phân|h|Con dao 刀 cắt đôi 八: CHIA; PHÚT.
时|thời|s|日 (mặt trời) + 寸 (tấc): đo bóng mặt trời mà biết THỜI gian.
候|hậu|s|亻 (người) + 矦 (hầu, gợi âm): người chờ đợi; 时候 là lúc.
回|hồi|t|Hình xoáy nước cuộn vòng trong vòng: QUAY VỀ.
影|ảnh|s|景 (cảnh, gợi âm) + 彡 (tia sáng): BÓNG, ẢNH.
住|trú|s|亻 (người) + 主 (chủ, gợi âm): người làm chủ một chỗ, Ở.
北|bắc|h|Hai người quay lưng vào nhau: cái lưng; nhà quay lưng về phía BẮC.
京|kinh|t|Tòa nhà cao dựng trên nền đất: KINH ĐÔ.
样|dạng|s|木 (cây) + 羊 (dương, gợi âm): KIỂU, DẠNG.
太|thái|c|大 (to) thêm một chấm: to quá mức, QUÁ.
热|nhiệt|s|执 (chấp, gợi âm) trên 灬 (lửa): NÓNG.
冷|lãnh|s|冫 (băng) + 令 (lệnh, gợi âm): LẠNH.
雨|vũ|t|Những giọt nước rơi xuống từ đám mây: MƯA.
姐|thư|s|女 (nữ) + 且 (thả, gợi âm): CHỊ.
身|thân|t|Người có cái bụng to (mang thai): THÂN mình.
体|thể|h|亻 (người) + 本 (gốc): gốc của con người là cơ thể, THÂN THỂ.
爱|ái|h|Bàn tay 爫 che chở 冖 người bạn 友: YÊU.
些|ta|s|此 (thử, gợi âm) + 二: MỘT VÀI.
水|thủy|t|Dòng nước chảy ở giữa, bọt nước hai bên: NƯỚC.
果|quả|t|Trái cây 田 trên cành cây 木: QUẢ.
喂|uy|s|口 (miệng) + 畏 (úy, gợi âm): tiếng gọi “A LÔ”.
也|dã|m|Hình gốc chưa rõ; mượn để nói CŨNG.
习|tập|k|Giản thể của 習 (chim vỗ cánh tập bay): LUYỆN TẬP.
睡|thụy|s|目 (mắt) + 垂 (thùy, rủ xuống, gợi âm): mi mắt rủ xuống, NGỦ.
觉|giác|s|Con mắt 见 dưới mái nhà: tỉnh ra mà thấy, cảm GIÁC; trong 睡觉 đọc jiào.
视|thị|s|礻 + 见 (thấy): NHÌN, xem; 电视 là ti vi.
喜|hỉ|h|Cái trống 壴 trên cái miệng 口 đang cười: đánh trống ca hát, VUI.
欢|hoan|s|又 + 欠 (há miệng): há miệng cười vui, HOAN hỉ.
给|cấp|s|纟 (tơ) + 合 (hợp, gợi âm): nối tơ đưa cho người, CHO.
打|đả|s|扌 (tay) + 丁 (đinh, gợi âm): tay đóng đinh, ĐÁNH.
话|thoại|h|讠 (lời) + 舌 (lưỡi): lưỡi uốn thành LỜI NÓI.
吧|ba|s|口 (miệng) + 巴 (ba, gợi âm): trợ từ “nhé”, “đi”.
东|đông|m|Gốc là cái bao buộc hai đầu, mượn chỉ phía ĐÔNG. Mẹo: phồn thể 東 như mặt trời 日 mọc sau cây 木.
西|tây|t|Hình tổ chim; chim về tổ khi mặt trời lặn ở phía TÂY.
苹|bình|s|艹 (cỏ) + 平 (bình, gợi âm): 苹果 là QUẢ TÁO.
先|tiên|h|Bàn chân bước trước người 儿: đi TRƯỚC.
开|khai|h|Hai tay 廾 nâng thanh cài 一 khỏi cửa: MỞ.
车|xa|t|Cỗ XE nhìn từ trên xuống: thùng xe, trục và bánh.
钟|chung|s|钅 (kim loại) + 中 (trung, gợi âm): CHUÔNG, ĐỒNG HỒ.
衣|y|t|Cổ áo ở trên, hai vạt áo ở dưới: ÁO.
服|phục|h|Bàn tay 又 ép người quỳ 卩 bên con thuyền 月: phục tùng; QUẦN ÁO.
漂|phiêu|s|氵 (nước) + 票 (phiếu, gợi âm): trôi trên nước; 漂亮 là ĐẸP.
亮|lượng|h|Người 几 đứng trên lầu cao 亠口冖: SÁNG.
啊|a|s|口 (miệng) + 阿 (a, gợi âm): tiếng “A!”.
都|đô|s|阝 (thành ấp) + 者 (giả, gợi âm): KINH ĐÔ; đọc dōu là ĐỀU.
认|nhận|s|讠 (lời) + 人 (nhân, gợi âm): NHẬN biết.
识|thức|s|讠 (lời) + 只 (chỉ, gợi âm): BIẾT, thức.
出|xuất|h|Bàn chân 屮 bước ra khỏi hố 凵: RA.
租|tô|s|禾 (lúa) + 且 (thả, gợi âm): tiền thuê trả bằng lúa, THUÊ.
高|cao|t|Lầu tháp nhiều tầng: CAO.
兴|hưng|k|Giản thể của 興 (nhiều tay cùng nâng): HƯNG phấn, VUI.
听|thính|s|口 (miệng) + 斤 (cân, gợi âm): NGHE.
飞|phi|t|Cánh chim đang vỗ: BAY.
机|cơ|s|木 (gỗ) + 几 (kỷ, gợi âm): khung máy bằng gỗ, MÁY.`

/** How a character was formed, as taught in Vietnamese ("lục thư" plus simplified forms). */
export type NoteKind = 'pictograph' | 'indicative' | 'compound' | 'phonetic' | 'borrowed' | 'simplified'

export const NOTE_KIND_LABEL: Record<NoteKind, string> = {
  pictograph: 'Tượng hình', indicative: 'Chỉ sự', compound: 'Hội ý',
  phonetic: 'Hình thanh', borrowed: 'Mượn nghĩa', simplified: 'Giản thể',
}

/** Fallback label from the generated data when a character has no hand-written note. */
export const CHAR_TYPE_LABEL: Record<CharType, string> = { pictographic: 'Tượng hình', ideographic: 'Hội ý / Chỉ sự', pictophonetic: 'Hình thanh' }

const KINDS: Record<string, NoteKind> = { t: 'pictograph', c: 'indicative', h: 'compound', s: 'phonetic', m: 'borrowed', k: 'simplified' }

export interface CharNote { hanViet: string; kind: NoteKind; story: string }

export const CHAR_NOTES = new Map<string, CharNote>(ROWS.split('\n').map((row) => {
  const [char, hanViet, kind, story] = row.split('|')
  return [char, { hanViet, kind: KINDS[kind], story }]
}))
