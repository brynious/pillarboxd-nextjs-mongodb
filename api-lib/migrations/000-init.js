const { MongoClient } = require('mongodb');
const axios = require('axios');
const slugify = require('slugify');
const { updateSeason } = require('./000-season');
const { updateEpisode } = require('./000-episode');
const { getVerifiedSlug } = require('../db/tmdb/slug');
require('dotenv').config();

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const seriesTmdbIds = [
      { tmdb_id: 11250, approved_specials: [] }, // Pasión de gavilanes
      { tmdb_id: 85552, approved_specials: [] }, // Euphoria
      { tmdb_id: 60574, approved_specials: [] }, // Peaky Blinders
      { tmdb_id: 71712, approved_specials: [] }, // The Good Doctor
      { tmdb_id: 99966, approved_specials: [] }, // 지금 우리 학교는
      { tmdb_id: 158280, approved_specials: [] }, // Two Conjectures About Marriage
      { tmdb_id: 1402, approved_specials: [] }, // The Walking Dead
      { tmdb_id: 158134, approved_specials: [] }, // Bigg Boss Ultimate
      { tmdb_id: 60735, approved_specials: [] }, // The Flash
      { tmdb_id: 116135, approved_specials: [] }, // Vikings: Valhalla
      { tmdb_id: 63174, approved_specials: [] }, // Lucifer
      { tmdb_id: 456, approved_specials: [] }, // The Simpsons
      { tmdb_id: 1416, approved_specials: [] }, // Grey's Anatomy
      { tmdb_id: 132712, approved_specials: [] }, // Secret Story: La casa de los secretos
      { tmdb_id: 2778, approved_specials: [] }, // Wheel of Fortune
      { tmdb_id: 108978, approved_specials: [] }, // Reacher
      { tmdb_id: 125030, approved_specials: [] }, // The Broken Marriage Vow
      { tmdb_id: 110492, approved_specials: [] }, // Peacemaker
      { tmdb_id: 65334, approved_specials: [] }, // Miraculous, les aventures de Ladybug et Chat Noir
      { tmdb_id: 135753, approved_specials: [] }, // 사랑의 꽈배기
      { tmdb_id: 37680, approved_specials: [] }, // Suits
      { tmdb_id: 104877, approved_specials: [] }, // Sen Çal Kapımı
      { tmdb_id: 80020, approved_specials: [] }, // スーパードラゴンボールヒーローズ
      { tmdb_id: 123249, approved_specials: [] }, // その着せ替え人形は恋をする
      { tmdb_id: 95057, approved_specials: [] }, // Superman & Lois
      { tmdb_id: 71790, approved_specials: [] }, // S.W.A.T.
      { tmdb_id: 966, approved_specials: [] }, // Hollyoaks
      { tmdb_id: 1399, approved_specials: [] }, // Game of Thrones
      { tmdb_id: 44217, approved_specials: [] }, // Vikings
      { tmdb_id: 139009, approved_specials: [] }, // Quanto Mais Vida, Melhor!
      { tmdb_id: 93405, approved_specials: [] }, // 오징어 게임
      { tmdb_id: 116416, approved_specials: [] }, // Big Brother 7/7
      { tmdb_id: 132375, approved_specials: [] }, // Um Lugar ao Sol
      { tmdb_id: 69050, approved_specials: [] }, // Riverdale
      { tmdb_id: 67335, approved_specials: [] }, // Sin senos sí hay paraíso
      { tmdb_id: 156135, approved_specials: [] }, // Ritmo salvaje
      { tmdb_id: 18165, approved_specials: [] }, // The Vampire Diaries
      { tmdb_id: 4614, approved_specials: [] }, // NCIS
      { tmdb_id: 107365, approved_specials: [] }, // Bel-Air
      { tmdb_id: 103786, approved_specials: [] }, // The Cuphead Show!
      { tmdb_id: 12971, approved_specials: [] }, // ドラゴンボールゼット
      { tmdb_id: 95479, approved_specials: [] }, // 呪術廻戦
      { tmdb_id: 114885, approved_specials: [] }, // Big Brother
      { tmdb_id: 115036, approved_specials: [] }, // The Book of Boba Fett
      { tmdb_id: 1622, approved_specials: [] }, // Supernatural
      { tmdb_id: 62715, approved_specials: [] }, // ドラゴンボール超（スーパー）
      { tmdb_id: 105214, approved_specials: [] }, // Oscuro deseo
      { tmdb_id: 62286, approved_specials: [] }, // Fear the Walking Dead
      { tmdb_id: 46260, approved_specials: [] }, // ナルト
      { tmdb_id: 158793, approved_specials: [] }, // Harina
      { tmdb_id: 93411, approved_specials: [] }, // عروس بيروت
      { tmdb_id: 90462, approved_specials: [] }, // Chucky
      { tmdb_id: 77169, approved_specials: [] }, // Cobra Kai
      { tmdb_id: 81356, approved_specials: [] }, // Sex Education
      { tmdb_id: 63333, approved_specials: [] }, // The Last Kingdom
      { tmdb_id: 112833, approved_specials: [] }, // 소년심판
      { tmdb_id: 79460, approved_specials: [] }, // Legacies
      { tmdb_id: 60625, approved_specials: [] }, // Rick and Morty
      { tmdb_id: 124010, approved_specials: [] }, // How I Met Your Father
      { tmdb_id: 2734, approved_specials: [] }, // Law & Order: Special Victims Unit
      { tmdb_id: 80240, approved_specials: [] }, // La Reina del Flow
      { tmdb_id: 44953, approved_specials: [] }, // El señor de los cielos
      { tmdb_id: 1900, approved_specials: [] }, // LIVE with Kelly and Ryan
      { tmdb_id: 71914, approved_specials: [] }, // The Wheel of Time
      { tmdb_id: 76669, approved_specials: [] }, // Élite
      { tmdb_id: 46952, approved_specials: [] }, // The Blacklist
      { tmdb_id: 76479, approved_specials: [] }, // The Boys
      { tmdb_id: 1396, approved_specials: [] }, // Breaking Bad
      { tmdb_id: 4057, approved_specials: [] }, // Criminal Minds
      { tmdb_id: 58841, approved_specials: [] }, // Chicago P.D.
      { tmdb_id: 111995, approved_specials: [] }, // Che succ3de?
      { tmdb_id: 1429, approved_specials: [] }, // 進撃の巨人
      { tmdb_id: 154490, approved_specials: [] }, // מהצד השני עם גיא זוהר
      { tmdb_id: 88329, approved_specials: [] }, // Hawkeye
      { tmdb_id: 2190, approved_specials: [] }, // South Park
      { tmdb_id: 5920, approved_specials: [] }, // The Mentalist
      { tmdb_id: 1434, approved_specials: [] }, // Family Guy
      { tmdb_id: 44006, approved_specials: [] }, // Chicago Fire
      { tmdb_id: 31910, approved_specials: [] }, // ナルト 疾風伝
      { tmdb_id: 75219, approved_specials: [] }, // 9-1-1
      { tmdb_id: 95665, approved_specials: [] }, // Inventing Anna
      { tmdb_id: 12637, approved_specials: [] }, // Rebelde
      { tmdb_id: 89393, approved_specials: [] }, // 9-1-1: Lone Star
      { tmdb_id: 60797, approved_specials: [] }, // Scorpion
      { tmdb_id: 119903, approved_specials: [] }, // Noovo Le Fil 17
      { tmdb_id: 122151, approved_specials: [] }, // Noovo Le Fil 22
      { tmdb_id: 85723, approved_specials: [] }, // Raised by Wolves
      { tmdb_id: 122152, approved_specials: [] }, // Noovo Le Fil Québec
      { tmdb_id: 1911, approved_specials: [] }, // Bones
      { tmdb_id: 113207, approved_specials: [] }, // Big Brother Célébrités
      { tmdb_id: 128839, approved_specials: [] }, // La Brea
      { tmdb_id: 71446, approved_specials: [] }, // La Casa de Papel
      { tmdb_id: 1408, approved_specials: [] }, // House
      { tmdb_id: 118011, approved_specials: [] }, // Dragon Ball Absalon
      { tmdb_id: 16286, approved_specials: [] }, // Yo soy Betty, la fea
      { tmdb_id: 66203, approved_specials: [] }, // Soy Luna
      { tmdb_id: 43348, approved_specials: [] }, // Pablo Escobar: El Patrón del Mal
      { tmdb_id: 154571, approved_specials: [] }, // Quero é Viver
      { tmdb_id: 79744, approved_specials: [] }, // The Rookie
      { tmdb_id: 48866, approved_specials: [] }, // The 100
      { tmdb_id: 124124, approved_specials: [] }, // Café con aroma de mujer
      { tmdb_id: 13840, approved_specials: [] }, // Schloss Einstein
      { tmdb_id: 31132, approved_specials: [] }, // Regular Show
      { tmdb_id: 95457, approved_specials: [] }, // 尚食
      { tmdb_id: 7821, approved_specials: [] }, // El Chavo Animado
      { tmdb_id: 84958, approved_specials: [] }, // Loki
      { tmdb_id: 1655, approved_specials: [] }, // PBS NewsHour
      { tmdb_id: 1668, approved_specials: [] }, // Friends
      { tmdb_id: 155138, approved_specials: [] }, // חדשות הערב
      { tmdb_id: 66732, approved_specials: [] }, // Stranger Things
      { tmdb_id: 118958, approved_specials: [] }, // One of Us Is Lying
      { tmdb_id: 73586, approved_specials: [] }, // Yellowstone
      { tmdb_id: 1419, approved_specials: [] }, // Castle
      { tmdb_id: 79699, approved_specials: [] }, // La hija del Mariachi
      { tmdb_id: 34524, approved_specials: [] }, // Teen Wolf
      { tmdb_id: 106651, approved_specials: [] }, // 지옥
      { tmdb_id: 128252, approved_specials: [] }, // El cartel de los sapos: El origen
      { tmdb_id: 61302, approved_specials: [] }, // Un souper presque parfait
      { tmdb_id: 12926, approved_specials: [] }, // Teresa
      { tmdb_id: 94605, approved_specials: [] }, // Arcane
      { tmdb_id: 82395, approved_specials: [] }, // Le Tricheur
      { tmdb_id: 155499, approved_specials: [] }, // Arelys Henao: canto para no llorar
      { tmdb_id: 79680, approved_specials: [] }, // Snowpiercer
      { tmdb_id: 67198, approved_specials: [] }, // Star Trek: Discovery
      { tmdb_id: 154828, approved_specials: [] }, // Vandaag Inside
      { tmdb_id: 1412, approved_specials: [] }, // Arrow
      { tmdb_id: 125474, approved_specials: [] }, // Naomi
      { tmdb_id: 39351, approved_specials: [] }, // Grimm
      { tmdb_id: 74428, approved_specials: [] }, // Rosario Tijeras
      { tmdb_id: 96777, approved_specials: [] }, // 고요의 바다
      { tmdb_id: 116450, approved_specials: [] }, // And Just Like That…
      { tmdb_id: 82856, approved_specials: [] }, // The Mandalorian
      { tmdb_id: 157285, approved_specials: [] }, // The Guardians of Justice
      { tmdb_id: 56570, approved_specials: [] }, // Outlander
      { tmdb_id: 12965, approved_specials: [] }, // María la del Barrio
      { tmdb_id: 1413, approved_specials: [] }, // American Horror Story
      { tmdb_id: 85271, approved_specials: [] }, // WandaVision
      { tmdb_id: 80623, approved_specials: [] }, // バキ
      { tmdb_id: 114925, approved_specials: [] }, // Pam & Tommy
      { tmdb_id: 112613, approved_specials: [] }, // 王様ランキング
      { tmdb_id: 2004, approved_specials: [] }, // Malcolm in the Middle
      { tmdb_id: 97400, approved_specials: [] }, // Midnight Mass
      { tmdb_id: 90239, approved_specials: [] }, // El juego de las llaves
      { tmdb_id: 62914, approved_specials: [] }, // Merlí
      { tmdb_id: 1100, approved_specials: [] }, // How I Met Your Mother
      { tmdb_id: 119316, approved_specials: [] }, // वागले की दुनिया
      { tmdb_id: 72637, approved_specials: [] }, // O11CE
      { tmdb_id: 13023, approved_specials: [] }, // El Chapulín Colorado
      { tmdb_id: 114156, approved_specials: [] }, // Érase una vez... Pero ya no
      { tmdb_id: 119857, approved_specials: [] }, // La meilleure boulangerie de France
      { tmdb_id: 65555, approved_specials: [] }, // Kara Sevda
      { tmdb_id: 5451, approved_specials: [] }, // Sin Senos no hay Paraíso
      { tmdb_id: 4604, approved_specials: [] }, // Smallville
      { tmdb_id: 2288, approved_specials: [] }, // Prison Break
      { tmdb_id: 105009, approved_specials: [] }, // 東京リベンジャーズ
      { tmdb_id: 76773, approved_specials: [] }, // Station 19
      { tmdb_id: 75006, approved_specials: [] }, // The Umbrella Academy
      { tmdb_id: 134949, approved_specials: [] }, // Rebelde
      { tmdb_id: 42705, approved_specials: [] }, // はじめの一歩
      { tmdb_id: 71728, approved_specials: [] }, // Young Sheldon
      { tmdb_id: 126280, approved_specials: [] }, // Sex/Life
      { tmdb_id: 112314, approved_specials: [] }, // Archive 81
      { tmdb_id: 70785, approved_specials: [] }, // Anne with an E
      { tmdb_id: 1433, approved_specials: [] }, // American Dad!
      { tmdb_id: 129600, approved_specials: [] }, // 範馬刃牙
      { tmdb_id: 15260, approved_specials: [] }, // Adventure Time
      { tmdb_id: 62688, approved_specials: [] }, // Supergirl
      { tmdb_id: 118357, approved_specials: [] }, // 1883
      { tmdb_id: 57243, approved_specials: [] }, // Doctor Who
      { tmdb_id: 30984, approved_specials: [] }, // ブリーチ
      { tmdb_id: 1431, approved_specials: [] }, // CSI: Crime Scene Investigation
      { tmdb_id: 85937, approved_specials: [] }, // 鬼滅の刃
      { tmdb_id: 117488, approved_specials: [] }, // Yellowjackets
      { tmdb_id: 4686, approved_specials: [] }, // Ben 10
      { tmdb_id: 80748, approved_specials: [] }, // FBI
      { tmdb_id: 1418, approved_specials: [] }, // The Big Bang Theory
      { tmdb_id: 1403, approved_specials: [] }, // Marvel's Agents of S.H.I.E.L.D.
      { tmdb_id: 91363, approved_specials: [] }, // What If...?
      { tmdb_id: 31917, approved_specials: [] }, // Pretty Little Liars
      { tmdb_id: 2224, approved_specials: [] }, // The Daily Show with Trevor Noah
      { tmdb_id: 32798, approved_specials: [] }, // Hawaii Five-0
      { tmdb_id: 37606, approved_specials: [] }, // The Amazing World of Gumball
      { tmdb_id: 17610, approved_specials: [] }, // NCIS: Los Angeles
      { tmdb_id: 60708, approved_specials: [] }, // Gotham
      { tmdb_id: 1421, approved_specials: [] }, // Modern Family
      { tmdb_id: 127549, approved_specials: [] }, // 佐々木と宮野
      { tmdb_id: 124271, approved_specials: [] }, // NCIS: Hawai'i
      { tmdb_id: 34307, approved_specials: [] }, // Shameless
      { tmdb_id: 4607, approved_specials: [] }, // Lost
      { tmdb_id: 82809, approved_specials: [] }, // Falsa identidad
      { tmdb_id: 62455, approved_specials: [] }, // Vis a vis
      { tmdb_id: 120452, approved_specials: [] }, // Dan Brown's The Lost Symbol
      { tmdb_id: 57532, approved_specials: [] }, // PAW Patrol
      { tmdb_id: 127235, approved_specials: [] }, // Invasion
      { tmdb_id: 129418, approved_specials: [] }, // Brand New Cherry Flavor
      { tmdb_id: 71912, approved_specials: [] }, // The Witcher
      { tmdb_id: 56295, approved_specials: [] }, // Halo 4: Forward Unto Dawn
      { tmdb_id: 87598, approved_specials: [] }, // Saimin Seishidou
      { tmdb_id: 96580, approved_specials: [] }, // Resident Alien
      { tmdb_id: 80079, approved_specials: [] }, // American Idol
      { tmdb_id: 63926, approved_specials: [] }, // ワンパンマン
      { tmdb_id: 133723, approved_specials: [] }, // Harry Potter: Hogwarts Tournament of Houses
      { tmdb_id: 98632, approved_specials: [] }, // اللعبة
      { tmdb_id: 103409, approved_specials: [] }, // 終末のハーレム
      { tmdb_id: 92396, approved_specials: [] }, // Lady, la vendedora de rosas
      { tmdb_id: 71789, approved_specials: [] }, // SEAL Team
      { tmdb_id: 12786, approved_specials: [] }, // Murdoch Mysteries
      { tmdb_id: 61889, approved_specials: [] }, // Marvel's Daredevil
      { tmdb_id: 100049, approved_specials: [] }, // トニカクカワイイ
      { tmdb_id: 113901, approved_specials: [] }, // Maradona: Sueño bendito
      { tmdb_id: 7458, approved_specials: [] }, // El Cartel de los Sapos
      { tmdb_id: 615, approved_specials: [] }, // Futurama
      { tmdb_id: 2691, approved_specials: [] }, // Two and a Half Men
      { tmdb_id: 40075, approved_specials: [] }, // Gravity Falls
      { tmdb_id: 123876, approved_specials: [] }, // 古見さんは、コミュ症です。
      { tmdb_id: 91239, approved_specials: [] }, // Bridgerton
      { tmdb_id: 549, approved_specials: [] }, // Law & Order
      { tmdb_id: 88396, approved_specials: [] }, // The Falcon and the Winter Soldier
      { tmdb_id: 67133, approved_specials: [] }, // MacGyver
      { tmdb_id: 52814, approved_specials: [] }, // Halo
      { tmdb_id: 60572, approved_specials: [] }, // ポケットモンスター
      { tmdb_id: 92685, approved_specials: [] }, // The Owl House
      { tmdb_id: 105, approved_specials: [] }, // Sex and the City
      { tmdb_id: 33238, approved_specials: [] }, // 런닝맨
      { tmdb_id: 92967, approved_specials: [] }, // Mucize Doktor
      { tmdb_id: 9027, approved_specials: [] }, // Rebelde Way
      { tmdb_id: 62643, approved_specials: [] }, // DC's Legends of Tomorrow
      { tmdb_id: 154911, approved_specials: [] }, // Além da Ilusão
      { tmdb_id: 107001, approved_specials: [] }, // 平穏世代の韋駄天達
      { tmdb_id: 69478, approved_specials: [] }, // The Handmaid's Tale
      { tmdb_id: 4743, approved_specials: [] }, // El internado
      { tmdb_id: 67136, approved_specials: [] }, // This Is Us
      { tmdb_id: 12225, approved_specials: [] }, // Peppa Pig
      { tmdb_id: 114868, approved_specials: [] }, // 終末のワルキューレ
      { tmdb_id: 91545, approved_specials: [] }, // Young Wallander
      { tmdb_id: 46896, approved_specials: [] }, // The Originals
      { tmdb_id: 2316, approved_specials: [] }, // The Office
      { tmdb_id: 154825, approved_specials: [] }, // 사내 맞선
      { tmdb_id: 46298, approved_specials: [] }, // ハンターｘハンター
      { tmdb_id: 80986, approved_specials: [] }, // DC's Stargirl
      { tmdb_id: 156918, approved_specials: [] }, // Bunt!
      { tmdb_id: 693, approved_specials: [] }, // Desperate Housewives
      { tmdb_id: 84553, approved_specials: [] }, // Blade Runner: Black Lotus
      { tmdb_id: 1620, approved_specials: [] }, // CSI: Miami
      { tmdb_id: 1981, approved_specials: [] }, // Charmed
      { tmdb_id: 124364, approved_specials: [] }, // From
      { tmdb_id: 112888, approved_specials: [] }, // 여신강림
      { tmdb_id: 48891, approved_specials: [] }, // Brooklyn Nine-Nine
      { tmdb_id: 66084, approved_specials: [] }, // Acapulco Shore
      { tmdb_id: 1516, approved_specials: [] }, // The A-Team
      { tmdb_id: 26663, approved_specials: [] }, // What's My Line?
      { tmdb_id: 1398, approved_specials: [] }, // The Sopranos
      { tmdb_id: 70523, approved_specials: [] }, // Dark
      { tmdb_id: 45815, approved_specials: [] }, // Avenida Brasil
      { tmdb_id: 80350, approved_specials: [] }, // New Amsterdam
      { tmdb_id: 47, approved_specials: [] }, // El Chavo del Ocho
      { tmdb_id: 5092, approved_specials: [] }, // 무한도전
      { tmdb_id: 117884, approved_specials: [] }, // 失格紋の最強賢者
      { tmdb_id: 95281, approved_specials: [] }, // S.O.Z: Soldados o Zombies
      { tmdb_id: 45950, approved_specials: [] }, // ハイスクールD×D
      { tmdb_id: 74016, approved_specials: [] }, // The Resident
      { tmdb_id: 63764, approved_specials: [] }, // Señora Acero
      { tmdb_id: 46296, approved_specials: [] }, // Spartacus
      { tmdb_id: 987, approved_specials: [] }, // General Hospital
      { tmdb_id: 94664, approved_specials: [] }, // 無職転生 ～異世界行ったら本気だす～
      { tmdb_id: 75450, approved_specials: [] }, // Titans
      { tmdb_id: 93544, approved_specials: [] }, // Top Boy
      { tmdb_id: 95557, approved_specials: [] }, // Invincible
      { tmdb_id: 85949, approved_specials: [] }, // Star Trek: Picard
      { tmdb_id: 1405, approved_specials: [] }, // Dexter
      { tmdb_id: 91557, approved_specials: [] }, // Ragnarok
      { tmdb_id: 1409, approved_specials: [] }, // Sons of Anarchy
      { tmdb_id: 13916, approved_specials: [] }, // DEATH NOTE
      { tmdb_id: 126787, approved_specials: [] }, // Si nos dejan
      { tmdb_id: 156077, approved_specials: [] }, // Soy Georgina
      { tmdb_id: 82428, approved_specials: [] }, // All American
      { tmdb_id: 4629, approved_specials: [] }, // Stargate SG-1
      { tmdb_id: 62650, approved_specials: [] }, // Chicago Med
      { tmdb_id: 35610, approved_specials: [] }, // 犬夜叉
      { tmdb_id: 117821, approved_specials: [] }, // WeCrashed
      { tmdb_id: 131927, approved_specials: [] }, // Dexter: New Blood
      { tmdb_id: 39272, approved_specials: [] }, // Once Upon a Time
      { tmdb_id: 61852, approved_specials: [] }, // Henry Danger
      { tmdb_id: 152483, approved_specials: [] }, // The Boys Presents: Diabolical
      { tmdb_id: 155895, approved_specials: [] }, // Juanpis González - La serie
      { tmdb_id: 121, approved_specials: [] }, // Doctor Who
      { tmdb_id: 35527, approved_specials: [] }, // La tormenta
      { tmdb_id: 77240, approved_specials: [] }, // キャプテン翼
      { tmdb_id: 16359, approved_specials: [] }, // Ricardo
      { tmdb_id: 60059, approved_specials: [] }, // Better Call Saul
      { tmdb_id: 94305, approved_specials: [] }, // The Walking Dead: World Beyond
      { tmdb_id: 117031, approved_specials: [] }, // People Puzzler
      { tmdb_id: 58710, approved_specials: [] }, // Carita de Ángel
      { tmdb_id: 93740, approved_specials: [] }, // Foundation
      { tmdb_id: 114892, approved_specials: [] }, // プラチナエンド
      { tmdb_id: 129035, approved_specials: [] }, // The Walking Dead: Origins
      { tmdb_id: 114695, approved_specials: [] }, // Marvel Studios: Legends
      { tmdb_id: 1415, approved_specials: [] }, // Elementary
      { tmdb_id: 1400, approved_specials: [] }, // Seinfeld
      { tmdb_id: 120142, approved_specials: [] }, // 錆喰いビスコ
      { tmdb_id: 44914, approved_specials: [] }, // La Patrona
      { tmdb_id: 56425, approved_specials: [] }, // グラップラー刃牙
      { tmdb_id: 69740, approved_specials: [] }, // Ozark
      { tmdb_id: 14506, approved_specials: [] }, // Thuis
      { tmdb_id: 37854, approved_specials: [] }, // ワンピース
      { tmdb_id: 16420, approved_specials: [] }, // 꽃보다 남자
      { tmdb_id: 136841, approved_specials: [] }, // リーマンズクラブ
      { tmdb_id: 153466, approved_specials: [] }, // משחקי הכיס
      { tmdb_id: 72306, approved_specials: [] }, // La piloto
      { tmdb_id: 1973, approved_specials: [] }, // 24
      { tmdb_id: 14750, approved_specials: [] }, // Na Wspólnej
      { tmdb_id: 62710, approved_specials: [] }, // Blindspot
      { tmdb_id: 79242, approved_specials: [] }, // Chilling Adventures of Sabrina
      { tmdb_id: 2221, approved_specials: [] }, // The View
      { tmdb_id: 63452, approved_specials: [] }, // Wer weiß denn sowas?
      { tmdb_id: 62852, approved_specials: [] }, // Billions
      { tmdb_id: 115810, approved_specials: [] }, // Amor Amor
      { tmdb_id: 23915, approved_specials: [] }, // Markus Lanz
      { tmdb_id: 4087, approved_specials: [] }, // The X-Files
      { tmdb_id: 110356, approved_specials: [] }, // 마이 네임
      { tmdb_id: 68734, approved_specials: [] }, // El Chema
      { tmdb_id: 1695, approved_specials: [] }, // Monk
      { tmdb_id: 72750, approved_specials: [] }, // Killing Eve
      { tmdb_id: 32415, approved_specials: [] }, // Conan
      { tmdb_id: 80752, approved_specials: [] }, // See
      { tmdb_id: 40605, approved_specials: [] }, // Die Harald Schmidt Show
      { tmdb_id: 1420, approved_specials: [] }, // New Girl
      { tmdb_id: 65708, approved_specials: [] }, // Taboo
      { tmdb_id: 133727, approved_specials: [] }, // Acapulco
      { tmdb_id: 2352, approved_specials: [] }, // The Nanny
      { tmdb_id: 65733, approved_specials: [] }, // ドラえもん
      { tmdb_id: 115857, approved_specials: [] }, // Madre solo hay dos
      { tmdb_id: 97513, approved_specials: [] }, // El internado: Las Cumbres
      { tmdb_id: 61374, approved_specials: [] }, // 東京喰種トーキョーグール
      { tmdb_id: 4194, approved_specials: [] }, // Star Wars: The Clone Wars
      { tmdb_id: 42444, approved_specials: [] }, // 聖闘士星矢
      { tmdb_id: 122194, approved_specials: [] }, // CSI: Vegas
      { tmdb_id: 76949, approved_specials: [] }, // La resistencia
      { tmdb_id: 119448, approved_specials: [] }, // A Serra
      { tmdb_id: 14424, approved_specials: [] }, // Malhação
      { tmdb_id: 122551, approved_specials: [] }, // Viral Scandal
      { tmdb_id: 45790, approved_specials: [] }, // ジョジョの奇妙な冒険
      { tmdb_id: 61175, approved_specials: [] }, // Steven Universe
      { tmdb_id: 31109, approved_specials: [] }, // Ben 10: Ultimate Alien
      { tmdb_id: 79611, approved_specials: [] }, // Charmed
      { tmdb_id: 87108, approved_specials: [] }, // Chernobyl
      { tmdb_id: 119243, approved_specials: [] }, // iCarly
      { tmdb_id: 66398, approved_specials: [] }, // Diomedes, el Cacique de La Junta
      { tmdb_id: 113036, approved_specials: [] }, // American Horror Stories
      { tmdb_id: 82883, approved_specials: [] }, // The Act
      { tmdb_id: 14814, approved_specials: [] }, // Keeping Up with the Kardashians
      { tmdb_id: 32692, approved_specials: [] }, // Blue Bloods
      { tmdb_id: 33987, approved_specials: [] }, // Corazon Valiente
      { tmdb_id: 94722, approved_specials: [] }, // Tagesschau
      { tmdb_id: 19614, approved_specials: [] }, // It
      { tmdb_id: 69291, approved_specials: [] }, // 小林さんちのメイドラゴン
      { tmdb_id: 65820, approved_specials: [] }, // Van Helsing
      { tmdb_id: 127581, approved_specials: [] }, // 4400
      { tmdb_id: 764, approved_specials: [] }, // Midsomer Murders
      { tmdb_id: 67915, approved_specials: [] }, // 쓸쓸하고 찬란하神-도깨비
      { tmdb_id: 129897, approved_specials: [] }, // Day of the Dead
      { tmdb_id: 42035, approved_specials: [] }, // El barco
      { tmdb_id: 32726, approved_specials: [] }, // Bob's Burgers
      { tmdb_id: 1705, approved_specials: [] }, // Fringe
      { tmdb_id: 93741, approved_specials: [] }, // Jurassic World: Camp Cretaceous
      { tmdb_id: 70672, approved_specials: [] }, // 아는 형님
      { tmdb_id: 655, approved_specials: [] }, // Star Trek: The Next Generation
      { tmdb_id: 39340, approved_specials: [] }, // 2 Broke Girls
      { tmdb_id: 121658, approved_specials: [] }, // FBI: International
      { tmdb_id: 135193, approved_specials: [] }, // Malverde: El Santo Patrón
      { tmdb_id: 873, approved_specials: [] }, // Columbo
      { tmdb_id: 102903, approved_specials: [] }, // Control Z
      { tmdb_id: 78191, approved_specials: [] }, // You
      { tmdb_id: 86248, approved_specials: [] }, // Upload
      { tmdb_id: 61222, approved_specials: [] }, // BoJack Horseman
      { tmdb_id: 100565, approved_specials: [] }, // ８６―エイティシックス―
      { tmdb_id: 14396, approved_specials: [] }, // The Adventures of Super Mario Bros. 3
      { tmdb_id: 79130, approved_specials: [] }, // Another Life
      { tmdb_id: 116479, approved_specials: [] }, // अनुपमा
      { tmdb_id: 790, approved_specials: [] }, // Agatha Christie's Poirot
      { tmdb_id: 94252, approved_specials: [] }, // Human Resources
      { tmdb_id: 709, approved_specials: [] }, // Robot Chicken
      { tmdb_id: 85349, approved_specials: [] }, // Amphibia
      { tmdb_id: 61709, approved_specials: [] }, // ドラゴンボール改「カイ」
      { tmdb_id: 90660, approved_specials: [] }, // ケンガンアシュラ
      { tmdb_id: 1395, approved_specials: [] }, // Gossip Girl
      { tmdb_id: 95439, approved_specials: [] }, // El final del paraíso
      { tmdb_id: 25707, approved_specials: [] }, // キャプテン翼
      { tmdb_id: 31072, approved_specials: [] }, // La familia P. Luche
      { tmdb_id: 113566, approved_specials: [] }, // DMZ
      { tmdb_id: 32651, approved_specials: [] }, // Интерны
      { tmdb_id: 121078, approved_specials: [] }, // 見える子ちゃん
      { tmdb_id: 61418, approved_specials: [] }, // Jane the Virgin
      { tmdb_id: 88055, approved_specials: [] }, // Servant
      { tmdb_id: 110070, approved_specials: [] }, // ホリミヤ
      { tmdb_id: 117030, approved_specials: [] }, // We Baby Bears
      { tmdb_id: 92749, approved_specials: [] }, // Moon Knight
      { tmdb_id: 94372, approved_specials: [] }, // FBI: Most Wanted
      { tmdb_id: 96677, approved_specials: [] }, // Lupin
      { tmdb_id: 80318, approved_specials: [] }, // CentoVetrine
      { tmdb_id: 63210, approved_specials: [] }, // Shadowhunters
      { tmdb_id: 80968, approved_specials: [] }, // Narcos: Mexico
      { tmdb_id: 4656, approved_specials: [] }, // WWE Raw
      { tmdb_id: 135292, approved_specials: [] }, // TRIBE NINE
      { tmdb_id: 61056, approved_specials: [] }, // How to Get Away with Murder
      { tmdb_id: 67178, approved_specials: [] }, // Marvel's The Punisher
      { tmdb_id: 3570, approved_specials: [] }, // 美少女戦士セーラームーン
      { tmdb_id: 114396, approved_specials: [] }, // 殺し愛
      { tmdb_id: 87083, approved_specials: [] }, // Formula 1: Drive to Survive
      { tmdb_id: 2038, approved_specials: [] }, // Drake & Josh
      { tmdb_id: 1639, approved_specials: [] }, // Heroes
      { tmdb_id: 89247, approved_specials: [] }, // Batwoman
      { tmdb_id: 83111, approved_specials: [] }, // Jenni Rivera: Mariposa de Barrio
      { tmdb_id: 89901, approved_specials: [] }, // Dickinson
      { tmdb_id: 7677, approved_specials: [] }, // 우리 결혼했어요
      { tmdb_id: 1606, approved_specials: [] }, // Ghost Whisperer
      { tmdb_id: 14929, approved_specials: [] }, // Heartland
      { tmdb_id: 30983, approved_specials: [] }, // 名探偵コナン
      { tmdb_id: 66788, approved_specials: [] }, // 13 Reasons Why
      { tmdb_id: 42009, approved_specials: [1188308] }, // Black Mirror
      { tmdb_id: 80411, approved_specials: [] }, // Erkenci Kuş
      { tmdb_id: 155645, approved_specials: [] }, // Señorita 89
      { tmdb_id: 7225, approved_specials: [] }, // Merlin
      { tmdb_id: 89641, approved_specials: [] }, // 좋아하면 울리는
      { tmdb_id: 62560, approved_specials: [] }, // Mr. Robot
      { tmdb_id: 155082, approved_specials: [] }, // העולם היום
      { tmdb_id: 5371, approved_specials: [] }, // iCarly
      { tmdb_id: 45140, approved_specials: [] }, // Teen Titans Go!
      { tmdb_id: 158168, approved_specials: [] }, // 相逢时节
      { tmdb_id: 6744, approved_specials: [] }, // The Merv Griffin Show
      { tmdb_id: 21510, approved_specials: [] }, // White Collar
      { tmdb_id: 63401, approved_specials: [] }, // We Bare Bears
      { tmdb_id: 67075, approved_specials: [] }, // モブサイコ100
      { tmdb_id: 97175, approved_specials: [] }, // Fate: The Winx Saga
      { tmdb_id: 580, approved_specials: [] }, // Star Trek: Deep Space Nine
      { tmdb_id: 62046, approved_specials: [] }, // Scream Queens
      { tmdb_id: 57041, approved_specials: [] }, // 銀魂
      { tmdb_id: 291, approved_specials: [] }, // Coronation Street
      { tmdb_id: 135864, approved_specials: [] }, // Nisser
      { tmdb_id: 34899, approved_specials: [] }, // Muhteşem Yüzyıl
      { tmdb_id: 132559, approved_specials: [] }, // The Croods: Family Tree
      { tmdb_id: 133086, approved_specials: [] }, // La venganza de las Juanas
      { tmdb_id: 91759, approved_specials: [] }, // 愛．回家之開心速遞
      { tmdb_id: 63247, approved_specials: [] }, // Westworld
      { tmdb_id: 4556, approved_specials: [] }, // Scrubs
      { tmdb_id: 84669, approved_specials: [] }, // 五等分の花嫁
      { tmdb_id: 6040, approved_specials: [] }, // Ben 10: Alien Force
      { tmdb_id: 14743, approved_specials: [] }, // El Cor de la Ciutat
      { tmdb_id: 128022, approved_specials: [] }, // La edad de la ira
      { tmdb_id: 61923, approved_specials: [] }, // Star vs. the Forces of Evil
      { tmdb_id: 46004, approved_specials: [] }, // デート・ア・ライブ
      { tmdb_id: 95486, approved_specials: [] }, // 你微笑时很美
      { tmdb_id: 71018, approved_specials: [] }, // sin 七つの大罪
      { tmdb_id: 73870, approved_specials: [] }, // Génial!
      { tmdb_id: 125712, approved_specials: [] }, // 異世界美少女受肉おじさんと
      { tmdb_id: 119955, approved_specials: [] }, // Dr. 브레인
      { tmdb_id: 4630, approved_specials: [] }, // The Fairly OddParents
      { tmdb_id: 3452, approved_specials: [] }, // Frasier
      { tmdb_id: 74204, approved_specials: [] }, // Big Mouth
      { tmdb_id: 63510, approved_specials: [] }, // 進撃！ 巨人中学校
      { tmdb_id: 130206, approved_specials: [] }, // 幻想三國誌
      { tmdb_id: 2661, approved_specials: [] }, // 仮面ライダ
      { tmdb_id: 2458, approved_specials: [] }, // CSI: NY
      { tmdb_id: 110316, approved_specials: [] }, // 今際の国のアリス
      { tmdb_id: 1855, approved_specials: [] }, // Star Trek: Voyager
      { tmdb_id: 2426, approved_specials: [] }, // Angel
      { tmdb_id: 2025, approved_specials: [] }, // Beverly Hills, 90210
      { tmdb_id: 82, approved_specials: [] }, // Animaniacs
      { tmdb_id: 62110, approved_specials: [] }, // 暗殺教室
      { tmdb_id: 46331, approved_specials: [] }, // Under the Dome
      { tmdb_id: 103254, approved_specials: [] }, // 半妖の夜叉姫
      { tmdb_id: 4229, approved_specials: [] }, // Dexter's Laboratory
      { tmdb_id: 34860, approved_specials: [] }, // 忍たま乱太郎
      { tmdb_id: 70828, approved_specials: [] }, // Alias JJ
      { tmdb_id: 61593, approved_specials: [] }, // Mr. Pickles
      { tmdb_id: 1424, approved_specials: [] }, // Orange Is the New Black
      { tmdb_id: 65930, approved_specials: [] }, // 僕のヒーローアカデミア
      { tmdb_id: 31251, approved_specials: [] }, // Victorious
      { tmdb_id: 103768, approved_specials: [] }, // Sweet Tooth
      { tmdb_id: 65844, approved_specials: [] }, // この素晴らしい世界に祝福を！
      { tmdb_id: 94810, approved_specials: [] }, // Adventure Time: Distant Lands
      { tmdb_id: 31572, approved_specials: [] }, // ルパン三世
      { tmdb_id: 897, approved_specials: [] }, // The Grim Adventures of Billy and Mandy
      { tmdb_id: 66579, approved_specials: [] }, // Tres veces Ana
      { tmdb_id: 1447, approved_specials: [] }, // Psych
      { tmdb_id: 96648, approved_specials: [] }, // 스위트홈
      { tmdb_id: 81723, approved_specials: [] }, // The Gilded Age
      { tmdb_id: 46195, approved_specials: [] }, // 化物語
      { tmdb_id: 63714, approved_specials: [] }, // Porta dos Fundos
      { tmdb_id: 83121, approved_specials: [] }, // かぐや様は告らせたい～天才たちの恋愛頭脳戦～
      { tmdb_id: 72305, approved_specials: [] }, // 賭ケグルイ
      { tmdb_id: 46639, approved_specials: [] }, // American Gods
      { tmdb_id: 76719, approved_specials: [] }, // The Rain
      { tmdb_id: 3934, approved_specials: [] }, // Mickey Mouse Clubhouse
      { tmdb_id: 73481, approved_specials: [] }, // Ecomoda
      { tmdb_id: 31911, approved_specials: [] }, // 鋼の錬金術師 FULLMETAL ALCHEMIST
      { tmdb_id: 117310, approved_specials: [] }, // ドールズフロントライン
      { tmdb_id: 115646, approved_specials: [] }, // Lisa
      { tmdb_id: 90, approved_specials: [] }, // Mayday
      { tmdb_id: 107602, approved_specials: [] }, // 5 chefs dans ma cuisine
      { tmdb_id: 57706, approved_specials: [] }, // らんま½
      { tmdb_id: 79501, approved_specials: [] }, // Doom Patrol
      { tmdb_id: 81772, approved_specials: [] }, // Oteckovia
      { tmdb_id: 30826, approved_specials: [] }, // La rosa de Guadalupe
      { tmdb_id: 100414, approved_specials: [] }, // Suspicion
      { tmdb_id: 43168, approved_specials: [] }, // Naruto SD[すごいどりょく] ロック・リーの青春フルパワー忍伝
      { tmdb_id: 34391, approved_specials: [] }, // Marvel's Ultimate Spider-Man
      { tmdb_id: 19885, approved_specials: [] }, // Sherlock
      { tmdb_id: 134029, approved_specials: [] }, // True Story
      { tmdb_id: 96316, approved_specials: [] }, // 彼女、お借りします
      { tmdb_id: 99121, approved_specials: [] }, // Walker
      { tmdb_id: 65942, approved_specials: [] }, // Re：ゼロから始める異世界生活
      { tmdb_id: 95601, approved_specials: [] }, // Merlí. Sapere Aude
      { tmdb_id: 4601, approved_specials: [] }, // Law & Order: Criminal Intent
      { tmdb_id: 76231, approved_specials: [] }, // Mayans M.C.
      { tmdb_id: 87739, approved_specials: [] }, // The Queen's Gambit
      { tmdb_id: 111141, approved_specials: [] }, // Maid
      { tmdb_id: 61223, approved_specials: [] }, // アカメが斬る!
      { tmdb_id: 76121, approved_specials: [] }, // ダーリン・イン・ザ・フランキス
      { tmdb_id: 60585, approved_specials: [] }, // Bosch
      { tmdb_id: 71886, approved_specials: [] }, // Siren
      { tmdb_id: 104032, approved_specials: [] }, // 賢者の弟子を名乗る賢者
      { tmdb_id: 49036, approved_specials: [] }, // 乡村爱情
      { tmdb_id: 129495, approved_specials: [] }, // Clickbait
      { tmdb_id: 64196, approved_specials: [] }, // オーバーロード
      { tmdb_id: 65494, approved_specials: [] }, // The Crown
      { tmdb_id: 18011, approved_specials: [] }, // Vecinos
      { tmdb_id: 5522, approved_specials: [] }, // Doña Bárbara
      { tmdb_id: 7842, approved_specials: [] }, // The Tom and Jerry Show
      { tmdb_id: 126118, approved_specials: [] }, // Chapelwaite
      { tmdb_id: 66840, approved_specials: [] }, // Bull
      { tmdb_id: 106617, approved_specials: [] }, // 大侠霍元甲
      { tmdb_id: 118821, approved_specials: [] }, // 世界最高の暗殺者、異世界貴族に転生する
      { tmdb_id: 60743, approved_specials: [] }, // Constantine
      { tmdb_id: 75865, approved_specials: [] }, // からかい上手の高木さん
      { tmdb_id: 2527, approved_specials: [] }, // Emmerdale
      { tmdb_id: 64190, approved_specials: [] }, // Volle Kanne
      { tmdb_id: 52, approved_specials: [] }, // That '70s Show
      { tmdb_id: 346, approved_specials: [] }, // American Dragon: Jake Long
      { tmdb_id: 62474, approved_specials: [] }, // Badehotellet
      { tmdb_id: 2129, approved_specials: [] }, // The Adventures of Jimmy Neutron: Boy Genius
      { tmdb_id: 61602, approved_specials: [] }, // Cumbia Ninja
      { tmdb_id: 93392, approved_specials: [] }, // Raising Dion
      { tmdb_id: 126824, approved_specials: [] }, // The Patrick Star Show
      { tmdb_id: 102966, approved_specials: [] }, // 100 días para enamorarnos
      { tmdb_id: 62823, approved_specials: [] }, // Scream: The TV Series
      { tmdb_id: 10283, approved_specials: [] }, // Archer
      { tmdb_id: 82739, approved_specials: [] }, // 青春ブタ野郎はバニーガール先輩の夢を見ない
      { tmdb_id: 95, approved_specials: [] }, // Buffy the Vampire Slayer
      { tmdb_id: 90937, approved_specials: [] }, // ビースターズ
      { tmdb_id: 2098, approved_specials: [] }, // Batman: The Animated Series
      { tmdb_id: 13945, approved_specials: [] }, // Gute Zeiten, schlechte Zeiten
      { tmdb_id: 98986, approved_specials: [] }, // 宇崎ちゃんは遊びたい！
      { tmdb_id: 45, approved_specials: [] }, // Top Gear
      { tmdb_id: 3500, approved_specials: [] }, // RBD: La Familia
      { tmdb_id: 888, approved_specials: [] }, // Spider-Man
      { tmdb_id: 71024, approved_specials: [] }, // Castlevania
      { tmdb_id: 115304, approved_specials: [] }, // Entrelazados
      { tmdb_id: 127865, approved_specials: [] }, // Kastanjemanden
      { tmdb_id: 71411, approved_specials: [] }, // El Chapo
      { tmdb_id: 68340, approved_specials: [] }, // El Chapulín Colorado animado
      { tmdb_id: 39852, approved_specials: [] }, // The Sinner
      { tmdb_id: 121964, approved_specials: [] }, // ヴァニタスの手記
      { tmdb_id: 63639, approved_specials: [] }, // The Expanse
      { tmdb_id: 157936, approved_specials: [] }, // Por Ti
      { tmdb_id: 86550, approved_specials: [] }, // Y: The Last Man
      { tmdb_id: 62992, approved_specials: [] }, // DAS!
      { tmdb_id: 52910, approved_specials: [] }, // 정글의 법칙
      { tmdb_id: 67575, approved_specials: [] }, // 楽しいムーミン一家
      { tmdb_id: 63351, approved_specials: [] }, // Narcos
      { tmdb_id: 66330, approved_specials: [] }, // 더블유
      { tmdb_id: 1220, approved_specials: [] }, // The Graham Norton Show
      { tmdb_id: 1407, approved_specials: [] }, // Homeland
      { tmdb_id: 48865, approved_specials: [] }, // Reign
      { tmdb_id: 129680, approved_specials: [] }, // I Know What You Did Last Summer
      { tmdb_id: 121787, approved_specials: [] }, // takt op.Destiny
      { tmdb_id: 49011, approved_specials: [] }, // Mom
      { tmdb_id: 3854, approved_specials: [] }, // The Spectacular Spider-Man
      { tmdb_id: 1660, approved_specials: [] }, // I Dream of Jeannie
      { tmdb_id: 137569, approved_specials: [] }, // Élite Historias Breves: Phillipe Caye Felipe
      { tmdb_id: 31654, approved_specials: [] }, // デジモンアドベンチャー
      { tmdb_id: 39429, approved_specials: [] }, // 유희열의 스케치북
      { tmdb_id: 33217, approved_specials: [] }, // Young Justice
      { tmdb_id: 605, approved_specials: [] }, // Sabrina, the Teenage Witch
      { tmdb_id: 137570, approved_specials: [] }, // Élite Historias Breves: Samuel Omar
      { tmdb_id: 62211, approved_specials: [] }, // Sonic Boom
      { tmdb_id: 73021, approved_specials: [] }, // Disenchantment
      { tmdb_id: 93693, approved_specials: [] }, // Are You Afraid of the Dark?
      { tmdb_id: 120168, approved_specials: [] }, // ¿Quién mató a Sara?
      { tmdb_id: 86382, approved_specials: [] }, // The Stand
      { tmdb_id: 95269, approved_specials: [] }, // 地縛少年花子くん
      { tmdb_id: 1823, approved_specials: [] }, // The Love Boat
      { tmdb_id: 31356, approved_specials: [] }, // Big Time Rush
      { tmdb_id: 900, approved_specials: [] }, // Skins
      { tmdb_id: 502, approved_specials: [] }, // Sesame Street
      { tmdb_id: 604, approved_specials: [] }, // Teen Titans
      { tmdb_id: 61345, approved_specials: [] }, // Z Nation
      { tmdb_id: 60622, approved_specials: [] }, // Fargo
      { tmdb_id: 253, approved_specials: [] }, // Star Trek
      { tmdb_id: 40008, approved_specials: [] }, // Hannibal
      { tmdb_id: 77341, approved_specials: [] }, // Enemigo íntimo
      { tmdb_id: 114118, approved_specials: [] }, // 간 떨어지는 동거
      { tmdb_id: 2710, approved_specials: [] }, // It's Always Sunny in Philadelphia
      { tmdb_id: 62741, approved_specials: [] }, // 神様はじめました
      { tmdb_id: 1877, approved_specials: [] }, // Phineas and Ferb
      { tmdb_id: 25778, approved_specials: [] }, // Familie
      { tmdb_id: 21641, approved_specials: [] }, // Good Luck Charlie
      { tmdb_id: 135385, approved_specials: [] }, // Mil Colmillos
      { tmdb_id: 79649, approved_specials: [] }, // Project Blue Book
      { tmdb_id: 158043, approved_specials: [] }, // Vlady & Miró
      { tmdb_id: 120734, approved_specials: [] }, // Just Beyond
      { tmdb_id: 74577, approved_specials: [] }, // The End of the F***ing World
      { tmdb_id: 4376, approved_specials: [] }, // JAG
      { tmdb_id: 47699, approved_specials: [] }, // Reina de Corazones
      { tmdb_id: 14210, approved_specials: [] }, // Polizeiruf 110
      { tmdb_id: 153519, approved_specials: [] }, // Neymar: O Caos Perfeito
      { tmdb_id: 14658, approved_specials: [] }, // Survivor
      { tmdb_id: 1411, approved_specials: [] }, // Person of Interest
      { tmdb_id: 60554, approved_specials: [1152428] }, // Star Wars Rebels
      { tmdb_id: 136248, approved_specials: [] }, // Tales of the Walking Dead
      { tmdb_id: 137571, approved_specials: [] }, // Elite Histórias Breves: Patrick
      { tmdb_id: 52823, approved_specials: [] }, // 주간 아이돌
      { tmdb_id: 7869, approved_specials: [] }, // The Penguins of Madagascar
      { tmdb_id: 47640, approved_specials: [] }, // The Strain
      { tmdb_id: 46786, approved_specials: [] }, // Bates Motel
      { tmdb_id: 68267, approved_specials: [] }, // Trollhunters: Tales of Arcadia
      { tmdb_id: 83097, approved_specials: [] }, // 約束のネバーランド
      { tmdb_id: 104699, approved_specials: [] }, // Shaman King
      { tmdb_id: 60866, approved_specials: [] }, // iZombie
      { tmdb_id: 96884, approved_specials: [] }, // ドラゴンクエスト ダイの大冒険
      { tmdb_id: 141, approved_specials: [] }, // Cheers
      { tmdb_id: 537, approved_specials: [] }, // Hey Arnold!
      { tmdb_id: 67116, approved_specials: [] }, // Lethal Weapon
      { tmdb_id: 94295, approved_specials: [] }, // フットサルボーイズ!!!!!
      { tmdb_id: 36406, approved_specials: [] }, // 遊☆戯☆王
      { tmdb_id: 72705, approved_specials: [] }, // Marvel's Spider-Man
      { tmdb_id: 136322, approved_specials: [] }, // Dragons: The Nine Realms
      { tmdb_id: 130330, approved_specials: [] }, // 華燈初上
      { tmdb_id: 79593, approved_specials: [] }, // Magnum P.I.
      { tmdb_id: 38472, approved_specials: [] }, // Marvel's Jessica Jones
      { tmdb_id: 107113, approved_specials: [] }, // Only Murders in the Building
      { tmdb_id: 4616, approved_specials: [] }, // Xena: Warrior Princess
      { tmdb_id: 80213, approved_specials: [] }, // The Purge
      { tmdb_id: 4313, approved_specials: [] }, // Full House
      { tmdb_id: 95396, approved_specials: [] }, // Severance
      { tmdb_id: 115911, approved_specials: [] }, // オリエント
      { tmdb_id: 8358, approved_specials: [] }, // Lie to Me
      { tmdb_id: 124067, approved_specials: [] }, // Winning Time: The Rise of the Lakers Dynasty
      { tmdb_id: 113808, approved_specials: [] }, // 精霊幻想記
      { tmdb_id: 33880, approved_specials: [] }, // The Legend of Korra
      { tmdb_id: 83639, approved_specials: [] }, // เด็กใหม่
      { tmdb_id: 65701, approved_specials: [] }, // Good Mythical Morning
      { tmdb_id: 83095, approved_specials: [] }, // 盾の勇者の成り上がり
      { tmdb_id: 59427, approved_specials: [] }, // Marvel's Avengers Assemble
      { tmdb_id: 102088, approved_specials: [] }, // 現実主義勇者の王国再建記
      { tmdb_id: 4419, approved_specials: [] }, // Real Time with Bill Maher
      { tmdb_id: 2122, approved_specials: [] }, // King of the Hill
      { tmdb_id: 35790, approved_specials: [] }, // カードキャプターさくら
      { tmdb_id: 117581, approved_specials: [] }, // Ginny & Georgia
      { tmdb_id: 114395, approved_specials: [] }, // 아름다웠던 우리에게
      { tmdb_id: 110309, approved_specials: [] }, // SK∞ エスケーエイト
      { tmdb_id: 153378, approved_specials: [] }, // F4 Thailand: หัวใจรักสี่ดวงดาว Boys Over Flowers
      { tmdb_id: 92553, approved_specials: [] }, // Heels
      { tmdb_id: 46994, approved_specials: [] }, // Slugterra
      { tmdb_id: 130372, approved_specials: [] }, // Doogie Kamealoha, M.D.
      { tmdb_id: 94796, approved_specials: [] }, // 사랑의 불시착
      { tmdb_id: 113756, approved_specials: [] }, // 舌尖上的心跳
      { tmdb_id: 5835, approved_specials: [] }, // Goosebumps
      { tmdb_id: 41149, approved_specials: [] }, // Die Rosenheim-Cops
      { tmdb_id: 80743, approved_specials: [] }, // Insatiable
      { tmdb_id: 77184, approved_specials: [] }, // Halo: The Fall of Reach
      { tmdb_id: 50035, approved_specials: [] }, // Clarence
      { tmdb_id: 2085, approved_specials: [] }, // Courage the Cowardly Dog
      { tmdb_id: 121926, approved_specials: [] }, // 絶対BLになる世界vs絶対BLになりたくない男
      { tmdb_id: 68507, approved_specials: [] }, // His Dark Materials
      { tmdb_id: 10545, approved_specials: [] }, // True Blood
      { tmdb_id: 16961, approved_specials: [] }, // Café con Aroma de Mujer
      { tmdb_id: 86831, approved_specials: [] }, // Love, Death & Robots
      { tmdb_id: 99053, approved_specials: [] }, // Médicos, línea de vida
      { tmdb_id: 1920, approved_specials: [] }, // Twin Peaks
      { tmdb_id: 61865, approved_specials: [] }, // When Calls the Heart
      { tmdb_id: 94280, approved_specials: [] }, // Steven Universe Future
      { tmdb_id: 31586, approved_specials: [] }, // La Reina del Sur
      { tmdb_id: 134088, approved_specials: [] }, // Μουσικό Κουτί
      { tmdb_id: 76572, approved_specials: [] }, // 斗罗大陆
      { tmdb_id: 33765, approved_specials: [] }, // My Little Pony: Friendship Is Magic
      { tmdb_id: 4386, approved_specials: [] }, // Baywatch
      { tmdb_id: 1667, approved_specials: [] }, // Saturday Night Live
      { tmdb_id: 79696, approved_specials: [] }, // Manifest
      { tmdb_id: 90855, approved_specials: [] }, // 聖闘士星矢: Knights of the Zodiac
      { tmdb_id: 104157, approved_specials: [] }, // Katla
      { tmdb_id: 85174, approved_specials: [] }, // 小女ラムネ
      { tmdb_id: 94502, approved_specials: [] }, // Chepe Fortuna
      { tmdb_id: 66465, approved_specials: [] }, // The Kapil Sharma Show
      { tmdb_id: 18347, approved_specials: [] }, // Community
      { tmdb_id: 72002, approved_specials: [] }, // Dynasty
      { tmdb_id: 39859, approved_specials: [] }, // Awkward.
      { tmdb_id: 2290, approved_specials: [] }, // Stargate Atlantis
      { tmdb_id: 88989, approved_specials: [] }, // Nine Perfect Strangers
      { tmdb_id: 96462, approved_specials: [] }, // 사이코지만 괜찮아
      { tmdb_id: 688, approved_specials: [] }, // The West Wing
      { tmdb_id: 97180, approved_specials: [] }, // Selena: The Series
      { tmdb_id: 132719, approved_specials: [] }, // La Casa de Papel: de Tokio a Berlín
      { tmdb_id: 60833, approved_specials: [] }, // 魔法科高校の劣等生
      { tmdb_id: 115689, approved_specials: [] }, // La bandida
      { tmdb_id: 32231, approved_specials: [] }, // 大秦帝国
      { tmdb_id: 137520, approved_specials: [] }, // 불가살
      { tmdb_id: 1972, approved_specials: [] }, // Battlestar Galactica
      { tmdb_id: 92866, approved_specials: [] }, // La table de Kim
      { tmdb_id: 4274, approved_specials: [] }, // Tom & Jerry Kids Show
      { tmdb_id: 39358, approved_specials: [] }, // Revenge
      { tmdb_id: 97727, approved_specials: [] }, // Inside Job
      { tmdb_id: 2304, approved_specials: [] }, // Thomas & Friends
      { tmdb_id: 97754, approved_specials: [] }, // Young Rock
      { tmdb_id: 61459, approved_specials: [] }, // 寄生獣 セイの格率
      { tmdb_id: 114863, approved_specials: [] }, // Mentiras verdaderas
      { tmdb_id: 1446, approved_specials: [] }, // Floricienta
      { tmdb_id: 65282, approved_specials: [] }, // 나 혼자 산다
      { tmdb_id: 4586, approved_specials: [] }, // Gilmore Girls
      { tmdb_id: 93449, approved_specials: [] }, // Tamron Hall
      { tmdb_id: 33907, approved_specials: [] }, // Downton Abbey
      { tmdb_id: 4608, approved_specials: [] }, // 30 Rock
      { tmdb_id: 93484, approved_specials: [] }, // Jupiter's Legacy
      { tmdb_id: 46922, approved_specials: [] }, // Ben 10: Omniverse
      { tmdb_id: 2022, approved_specials: [] }, // The Batman
      { tmdb_id: 8592, approved_specials: [] }, // Parks and Recreation
      { tmdb_id: 70637, approved_specials: [] }, // ロクでなし魔術講師と禁忌教典
      { tmdb_id: 1423, approved_specials: [] }, // Ray Donovan
      { tmdb_id: 3034, approved_specials: [] }, // Tatort
      { tmdb_id: 156802, approved_specials: [] }, // Bilardo, el doctor del fútbol
      { tmdb_id: 158284, approved_specials: [] }, // Allererste Sahne – Wer backt am besten?
      { tmdb_id: 41956, approved_specials: [] }, // Death in Paradise
      { tmdb_id: 44277, approved_specials: [] }, // 神探狄仁杰
      { tmdb_id: 79141, approved_specials: [] }, // 刺客伍六七
      { tmdb_id: 110562, approved_specials: [] }, // Sadakatsiz
      { tmdb_id: 2384, approved_specials: [] }, // Knight Rider
      { tmdb_id: 890, approved_specials: [] }, // 新世紀エヴァンゲリオン
      { tmdb_id: 112077, approved_specials: [] }, // Scenes from a Marriage
      { tmdb_id: 107124, approved_specials: [] }, // Animaniacs
      { tmdb_id: 8514, approved_specials: [] }, // RuPaul's Drag Race
      { tmdb_id: 61389, approved_specials: [] }, // 聖闘士星矢 THE LOST CANVAS 冥王神話
      { tmdb_id: 75758, approved_specials: [] }, // Lost in Space
      { tmdb_id: 38693, approved_specials: [] }, // Ninjago: Masters of Spinjitzu
      { tmdb_id: 40424, approved_specials: [] }, // 頭文字 D
      { tmdb_id: 4454, approved_specials: [] }, // Will & Grace
      { tmdb_id: 91801, approved_specials: [] }, // 魔入りました！入間くん
      { tmdb_id: 38974, approved_specials: [] }, // Jessie
      { tmdb_id: 4613, approved_specials: [] }, // Band of Brothers
      { tmdb_id: 2309, approved_specials: [] }, // Danny Phantom
      { tmdb_id: 92806, approved_specials: [] }, // On va se le dire
      { tmdb_id: 45782, approved_specials: [] }, // ソードアート・オンライン
      { tmdb_id: 1781, approved_specials: [] }, // Little House on the Prairie
      { tmdb_id: 1428, approved_specials: [] }, // MythBusters
      { tmdb_id: 79818, approved_specials: [] }, // 流星花园
      { tmdb_id: 82596, approved_specials: [] }, // Emily in Paris
      { tmdb_id: 60863, approved_specials: [] }, // ハイキュー!!
      { tmdb_id: 4385, approved_specials: [] }, // The Colbert Report
      { tmdb_id: 137599, approved_specials: [] }, // 星辰大海
      { tmdb_id: 134375, approved_specials: [] }, // The Endgame
      { tmdb_id: 76331, approved_specials: [] }, // Succession
      { tmdb_id: 158396, approved_specials: [] }, // Krakowskie potwory
      { tmdb_id: 73223, approved_specials: [] }, // ブラッククローバー
      { tmdb_id: 6809, approved_specials: [] }, // El hormiguero 3.0
      { tmdb_id: 128826, approved_specials: [] }, // 怪人開発部の黒井津さん
      { tmdb_id: 77606, approved_specials: [] }, // The Boss Baby: Back in Business
      { tmdb_id: 30801, approved_specials: [] }, // 1박 2일
      { tmdb_id: 64432, approved_specials: [] }, // The Magicians
      { tmdb_id: 36, approved_specials: [] }, // Medium
      { tmdb_id: 59941, approved_specials: [] }, // The Tonight Show Starring Jimmy Fallon
      { tmdb_id: 117023, approved_specials: [] }, // Sky Rojo
      { tmdb_id: 118588, approved_specials: [] }, // 黒ギャルになったから親友としてみた。
      { tmdb_id: 103157, approved_specials: [] }, // 俺だけ入れる隠しダンジョン ～こっそり鍛えて世界最強～
      { tmdb_id: 79, approved_specials: [] }, // Dora the Explorer
      { tmdb_id: 45783, approved_specials: [] }, // 黒子のバスケ
      { tmdb_id: 123591, approved_specials: [] }, // Les Schtroumpfs
      { tmdb_id: 4610, approved_specials: [] }, // Hannah Montana
      { tmdb_id: 45857, approved_specials: [] }, // 家庭教師ヒットマン REBORN!
      { tmdb_id: 1435, approved_specials: [] }, // The Good Wife
      { tmdb_id: 119845, approved_specials: [] }, // Power Book IV: Force
      { tmdb_id: 1996, approved_specials: [] }, // The Flintstones
      { tmdb_id: 114503, approved_specials: [] }, // Turner & Hooch
      { tmdb_id: 125694, approved_specials: [] }, // Be Loved in House 約・定～I do
      { tmdb_id: 314, approved_specials: [] }, // Star Trek: Enterprise
      { tmdb_id: 62649, approved_specials: [] }, // Superstore
      { tmdb_id: 89456, approved_specials: [] }, // Primal
      { tmdb_id: 69568, approved_specials: [] }, // 恶魔少爷别吻我
      { tmdb_id: 1417, approved_specials: [] }, // Glee
      { tmdb_id: 31991, approved_specials: [] }, // WWE NXT
      { tmdb_id: 130523, approved_specials: [] }, // Braqueurs: La série
      { tmdb_id: 71740, approved_specials: [] }, // 40 y 20
      { tmdb_id: 6390, approved_specials: [] }, // Escape to the Country
      { tmdb_id: 49009, approved_specials: [] }, // The Goldbergs
      { tmdb_id: 131083, approved_specials: [] }, // 錆色のアーマ-黎明-
      { tmdb_id: 78004, approved_specials: [] }, // デスノート NEW GENERATION
      { tmdb_id: 2530, approved_specials: [] }, // Mr. Bean: The Animated Series
      { tmdb_id: 86823, approved_specials: [] }, // みるタイツ
      { tmdb_id: 105556, approved_specials: [] }, // イジらないで、長瀞さん
      { tmdb_id: 160, approved_specials: [] }, // Teenage Mutant Hero Turtles
      { tmdb_id: 20477, approved_specials: [] }, // Wogan
      { tmdb_id: 67872, approved_specials: [] }, // Nosotros los Guapos
      { tmdb_id: 71694, approved_specials: [] }, // Snowfall
      { tmdb_id: 67166, approved_specials: [] }, // El marginal
      { tmdb_id: 61381, approved_specials: [] }, // black-ish
      { tmdb_id: 158913, approved_specials: [] }, // Dale Gas
      { tmdb_id: 64163, approved_specials: [] }, // 新妹魔王の契約者
      { tmdb_id: 66078, approved_specials: [] }, // 双星の陰陽師
      { tmdb_id: 63152, approved_specials: [] }, // Critical Role
      { tmdb_id: 11053, approved_specials: [] }, // Daniel Boone
      { tmdb_id: 90461, approved_specials: [] }, // Monsters at Work
      { tmdb_id: 46262, approved_specials: [] }, // Doc McStuffins
      { tmdb_id: 246, approved_specials: [] }, // Avatar: The Last Airbender
      { tmdb_id: 4546, approved_specials: [] }, // Curb Your Enthusiasm
      { tmdb_id: 63770, approved_specials: [] }, // The Late Show with Stephen Colbert
      { tmdb_id: 66859, approved_specials: [] }, // Better Things
      { tmdb_id: 4482, approved_specials: [] }, // Bewitched
      { tmdb_id: 37584, approved_specials: [] }, // 一騎当千
      { tmdb_id: 93808, approved_specials: [] }, // Tribes of Europa
      { tmdb_id: 117376, approved_specials: [] }, // 빈센조
      { tmdb_id: 74440, approved_specials: [] }, // Harley Quinn
      { tmdb_id: 127571, approved_specials: [] }, // Guerra de vecinos
      { tmdb_id: 99071, approved_specials: [] }, // 回復術士のやり直し
      { tmdb_id: 61440, approved_specials: [] }, // ストライク・ザ・ブラッド
      { tmdb_id: 61387, approved_specials: [] }, // NCIS: New Orleans
      { tmdb_id: 4238, approved_specials: [] }, // The King of Queens
      { tmdb_id: 46648, approved_specials: [] }, // True Detective
      { tmdb_id: 28136, approved_specials: [] }, // るろうに剣心 明治剣客浪漫譚
      { tmdb_id: 132992, approved_specials: [] }, // 我家浴缸的二三事
      { tmdb_id: 42556, approved_specials: [] }, // 謎の彼女X
      { tmdb_id: 2875, approved_specials: [] }, // MacGyver
      { tmdb_id: 97546, approved_specials: [] }, // Ted Lasso
      { tmdb_id: 80825, approved_specials: [] }, // Jesus
      { tmdb_id: 67744, approved_specials: [] }, // Mindhunter
      { tmdb_id: 98123, approved_specials: [] }, // 仙王的日常生活
      { tmdb_id: 67026, approved_specials: [] }, // Designated Survivor
      { tmdb_id: 138506, approved_specials: [] }, // Amar profundo
      { tmdb_id: 13126, approved_specials: [] }, // Matinee Theater
      { tmdb_id: 156854, approved_specials: [] }, // 깨물고싶은
      { tmdb_id: 80006, approved_specials: [] }, // Good Trouble
      { tmdb_id: 86430, approved_specials: [] }, // Your Honor
      { tmdb_id: 80564, approved_specials: [] }, // バナナフィッシュ
      { tmdb_id: 133903, approved_specials: [] }, // Marvel's Hit-Monkey
      { tmdb_id: 4303, approved_specials: [] }, // Superman: The Animated Series
      { tmdb_id: 64706, approved_specials: [] }, // 監獄学園
      { tmdb_id: 12433, approved_specials: [] }, // Ein Fall für zwei
      { tmdb_id: 61692, approved_specials: [] }, // Fresh Off the Boat
      { tmdb_id: 65676, approved_specials: [] }, // やはり俺の青春ラブコメはまちがっている。
      { tmdb_id: 35753, approved_specials: [] }, // ゼロの使い魔
      { tmdb_id: 10957, approved_specials: [] }, // Australian Survivor
      { tmdb_id: 68421, approved_specials: [] }, // Altered Carbon
      { tmdb_id: 116041, approved_specials: [] }, // 결혼작사 이혼작곡
      { tmdb_id: 115004, approved_specials: [] }, // Mare of Easttown
      { tmdb_id: 34634, approved_specials: [] }, // Gold Rush
      { tmdb_id: 124629, approved_specials: [] }, // Mestres da Sabotagem
      { tmdb_id: 121792, approved_specials: [] }, // 明日ちゃんのセーラー服
      { tmdb_id: 41889, approved_specials: [] }, // Top Boy
      { tmdb_id: 157717, approved_specials: [] }, // Young, Famous & African
      { tmdb_id: 1438, approved_specials: [] }, // The Wire
      { tmdb_id: 4658, approved_specials: [] }, // ALF
      { tmdb_id: 112202, approved_specials: [] }, // 斗罗大陆
      { tmdb_id: 47665, approved_specials: [] }, // Black Sails
      { tmdb_id: 82684, approved_specials: [] }, // 転生したらスライムだった件
      { tmdb_id: 3611, approved_specials: [] }, // Cow and Chicken
      { tmdb_id: 112463, approved_specials: [] }, // CUE!
      { tmdb_id: 138955, approved_specials: [] }, // Dragons Rescue Riders: Heroes of the Sky
      { tmdb_id: 77236, approved_specials: [] }, // A Discovery of Witches
      { tmdb_id: 41727, approved_specials: [] }, // Banshee
      { tmdb_id: 157237, approved_specials: [] }, // Armastus
      { tmdb_id: 97186, approved_specials: [] }, // Love, Victor
      { tmdb_id: 72311, approved_specials: [] }, // 大军师司马懿之军师联盟
      { tmdb_id: 103108, approved_specials: [] }, // MDR um 4
      { tmdb_id: 1450, approved_specials: [] }, // The Closer
      { tmdb_id: 86836, approved_specials: [] }, // なんでここに先生が!?
      { tmdb_id: 44317, approved_specials: [] }, // 聖闘士星矢Ω
      { tmdb_id: 46881, approved_specials: [] }, // Corona de lágrimas
      { tmdb_id: 65270, approved_specials: [] }, // 라디오스타
      { tmdb_id: 4177, approved_specials: [] }, // Perry Mason
      { tmdb_id: 30991, approved_specials: [] }, // カウボーイビバップ
      { tmdb_id: 4239, approved_specials: [] }, // Married... with Children
      { tmdb_id: 44305, approved_specials: [] }, // DreamWorks Dragons
      { tmdb_id: 7482, approved_specials: [] }, // Leverage
      { tmdb_id: 56426, approved_specials: [] }, // こちら葛飾区亀有公園前派出所
      { tmdb_id: 58937, approved_specials: [] }, // Masters of Sex
      { tmdb_id: 117549, approved_specials: [] }, // 一不小心捡到爱
      { tmdb_id: 129888, approved_specials: [] }, // 스물다섯 스물하나
      { tmdb_id: 60637, approved_specials: [] }, // Griselda Blanco: La viuda negra
      { tmdb_id: 62705, approved_specials: [] }, // Married at First Sight
      { tmdb_id: 5687, approved_specials: [] }, // The Smurfs
      { tmdb_id: 101253, approved_specials: [] }, // Alpha Forum
      { tmdb_id: 118541, approved_specials: [] }, // 転スラ日記 転生したらスライムだった件
      { tmdb_id: 1215, approved_specials: [] }, // Californication
      { tmdb_id: 40663, approved_specials: [] }, // 相棒
      { tmdb_id: 3022, approved_specials: [] }, // Rugrats
      { tmdb_id: 83100, approved_specials: [] }, // どろろ
      { tmdb_id: 9890, approved_specials: [] }, // The Dick Cavett Show
      { tmdb_id: 23587, approved_specials: [] }, // 金田一少年の事件簿
      { tmdb_id: 71663, approved_specials: [] }, // Black Lightning
      { tmdb_id: 132238, approved_specials: [] }, // Usamimi Bouken-tan: Sekuhara Shinagara Sekai o Sukue
      { tmdb_id: 31724, approved_specials: [] }, // コードギアス 反逆のルルーシュ
      { tmdb_id: 126035, approved_specials: [] }, // 알고있지만,
      { tmdb_id: 68126, approved_specials: [] }, // Vikingane
      { tmdb_id: 3626, approved_specials: [] }, // American Idol
      { tmdb_id: 93394, approved_specials: [] }, // Cuna de lobos
      { tmdb_id: 118924, approved_specials: [] }, // Marvel Studios: Assembled
      { tmdb_id: 156130, approved_specials: [] }, // America's Got Talent: Extreme
      { tmdb_id: 61663, approved_specials: [] }, // 四月は君の嘘
      { tmdb_id: 186, approved_specials: [] }, // Weeds
      { tmdb_id: 34109, approved_specials: [] }, // Bakugan Battle Brawlers
      { tmdb_id: 103960, approved_specials: [] }, // Richard Osman's House of Games
      { tmdb_id: 46880, approved_specials: [] }, // The Fosters
      { tmdb_id: 108291, approved_specials: [] }, // 설강화
      { tmdb_id: 46533, approved_specials: [] }, // The Americans
      { tmdb_id: 69998, approved_specials: [] }, // Hugo Chávez, El Comandante
      { tmdb_id: 62126, approved_specials: [] }, // Marvel's Luke Cage
      { tmdb_id: 66676, approved_specials: [] }, // Queen of the South
      { tmdb_id: 95594, approved_specials: [] }, // Fast & Furious Spy Racers
      { tmdb_id: 42025, approved_specials: [] }, // Mako Mermaids: An H2O Adventure
      { tmdb_id: 60802, approved_specials: [] }, // The Last Ship
      { tmdb_id: 68814, approved_specials: [] }, // 힘쎈여자 도봉순
      { tmdb_id: 67637, approved_specials: [] }, // Hasta que te conocí
      { tmdb_id: 111499, approved_specials: [] }, // De brutas, nada
      { tmdb_id: 79008, approved_specials: [] }, // Luis Miguel: La Serie
      { tmdb_id: 1338, approved_specials: [] }, // Alarm für Cobra 11 – Die Autobahnpolizei
      { tmdb_id: 111255, approved_specials: [] }, // ワンダーエッグ・プライオリティ
      { tmdb_id: 68073, approved_specials: [] }, // The Loud House
      { tmdb_id: 114501, approved_specials: [] }, // Dug Days
      { tmdb_id: 105971, approved_specials: [] }, // The Bad Batch
      { tmdb_id: 61550, approved_specials: [] }, // Marvel's Agent Carter
      { tmdb_id: 135020, approved_specials: [] }, // Σε Ξένα Χέρια
      { tmdb_id: 75387, approved_specials: [] }, // 致我们单纯的小美好
      { tmdb_id: 122585, approved_specials: [] }, // Billie vs Benjamin
      { tmdb_id: 46928, approved_specials: [] }, // Sofia the First
      { tmdb_id: 152674, approved_specials: [] }, // 沉睡花园
      { tmdb_id: 61378, approved_specials: [] }, // Madam Secretary
      { tmdb_id: 4625, approved_specials: [] }, // The New Batman Adventures
      { tmdb_id: 137895, approved_specials: [] }, // The Center Seat: 55 Years of Star Trek
      { tmdb_id: 64752, approved_specials: [] }, // The Lion Guard
      { tmdb_id: 4606, approved_specials: [] }, // Garfield and Friends
      { tmdb_id: 117896, approved_specials: [] }, // 홍천기
      { tmdb_id: 106159, approved_specials: [] }, // Debris
      { tmdb_id: 62428, approved_specials: [] }, // 聖闘士星矢 黄金魂
      { tmdb_id: 70204, approved_specials: [] }, // 순풍산부인과
      { tmdb_id: 118169, approved_specials: [] }, // Colin in Black & White
      { tmdb_id: 154346, approved_specials: [] }, // O Livro Negro do Padre Dinis
      { tmdb_id: 1892, approved_specials: [] }, // The Fresh Prince of Bel-Air
      { tmdb_id: 100883, approved_specials: [] }, // Never Have I Ever
      { tmdb_id: 16183, approved_specials: [] }, // A Grande Família
      { tmdb_id: 87944, approved_specials: [] }, // Rafael Orozco - El Idolo
      { tmdb_id: 97525, approved_specials: [] }, // 不滅のあなたへ
      { tmdb_id: 1908, approved_specials: [] }, // Miami Vice
      { tmdb_id: 62017, approved_specials: [] }, // The Man in the High Castle
      { tmdb_id: 67595, approved_specials: [] }, // L'Échappée
      { tmdb_id: 13354, approved_specials: [] }, // Question Time
      { tmdb_id: 194585, approved_specials: [] }, // Sayang Tak Dikenang
      { tmdb_id: 194690, approved_specials: [] }, // The Real Peaky Blinders
      { tmdb_id: 24270, approved_specials: [] }, // Maybrit Illner
      { tmdb_id: 4589, approved_specials: [] }, // Arrested Development
      { tmdb_id: 1871, approved_specials: [] }, // EastEnders
      { tmdb_id: 109330, approved_specials: [] }, // Madagascar: A Little Wild
      { tmdb_id: 99002, approved_specials: [] }, // Pieces of Her
      { tmdb_id: 96026, approved_specials: [] }, // La semaine des 4 Julie
      { tmdb_id: 136796, approved_specials: [] }, // L'Amour flou
      { tmdb_id: 127425, approved_specials: [] }, // Jaguar
      { tmdb_id: 39483, approved_specials: [] }, // Major Crimes
      { tmdb_id: 55216, approved_specials: [] }, // Scènes de ménages
      { tmdb_id: 100834, approved_specials: [] }, // Veneno
      { tmdb_id: 90677, approved_specials: [] }, // Fate/Grand Order -絶対魔獣戦線バビロニア-
      { tmdb_id: 74387, approved_specials: [] }, // Final Space
      { tmdb_id: 1930, approved_specials: [] }, // The Beverly Hillbillies
      { tmdb_id: 99489, approved_specials: [] }, // 펜트하우스
      { tmdb_id: 66857, approved_specials: [] }, // Shooter
      { tmdb_id: 9160, approved_specials: [] }, // キャンディ・キャンディ
      { tmdb_id: 27845, approved_specials: [] }, // テニスの王子様
      { tmdb_id: 4588, approved_specials: [] }, // ER
      { tmdb_id: 86346, approved_specials: [] }, // El Bronx
      { tmdb_id: 656, approved_specials: [] }, // Curious George
      { tmdb_id: 3764, approved_specials: [] }, // Hustle
      { tmdb_id: 42445, approved_specials: [] }, // Borgen
      { tmdb_id: 5080, approved_specials: [] }, // Doctors
      { tmdb_id: 81144, approved_specials: [] }, // The Neighborhood
      { tmdb_id: 123446, approved_specials: [] }, // ジャヒー様はくじけない！
      { tmdb_id: 74823, approved_specials: [] }, // Çukur
      { tmdb_id: 1422, approved_specials: [] }, // The Middle
      { tmdb_id: 131495, approved_specials: [] }, // James De Musical
      { tmdb_id: 157047, approved_specials: [] }, // Brownsville Bred
      { tmdb_id: 51817, approved_specials: [] }, // Teenage Mutant Ninja Turtles
      { tmdb_id: 236, approved_specials: [] }, // The Flash
      { tmdb_id: 78173, approved_specials: [] }, // Dragons: Race to the Edge
      { tmdb_id: 32608, approved_specials: [] }, // Ancient Aliens
      { tmdb_id: 60694, approved_specials: [] }, // Last Week Tonight with John Oliver
      { tmdb_id: 10938, approved_specials: [] }, // Bob the Builder
      { tmdb_id: 4575, approved_specials: [] }, // Lizzie McGuire
      { tmdb_id: 81354, approved_specials: [] }, // Ratched
      { tmdb_id: 156002, approved_specials: [] }, // Sander en de kloof
      { tmdb_id: 34376, approved_specials: [] }, // Los hombres de Paco
      { tmdb_id: 10926, approved_specials: [] }, // ソニックX
      { tmdb_id: 155275, approved_specials: [] }, // Maricucha
      { tmdb_id: 1425, approved_specials: [] }, // House of Cards
      { tmdb_id: 106, approved_specials: [] }, // The Andy Griffith Show
      { tmdb_id: 4336, approved_specials: [] }, // Drawn Together
      { tmdb_id: 14509, approved_specials: [] }, // In aller Freundschaft
    ];

    for (const series of seriesTmdbIds) {
      const tmdb_id = series.tmdb_id;
      const seriesData = await getTmdbApiSeriesData(
        series.tmdb_id,
        series.approved_specials
      );

      if (seriesData.number_of_episodes > 100) continue;
      if (
        !seriesData.origin_country.includes('GB') &&
        !seriesData.origin_country.includes('US')
      )
        continue;
      if (!seriesData.languages.includes('en')) continue;

      console.log(seriesData.name);

      seriesData.slug = await getVerifiedSlug(client, 'tv_series', seriesData);
      const [cast, crew] = await getTmdbSeriesCredits(seriesData.tmdb_id);
      seriesData.cast = cast;
      seriesData.crew = crew;

      await upsertObjToDB(client, 'tv_series', seriesData);
      for (const season of seriesData.seasons) {
        if (season.season_number === 0 && series.approved_specials.length === 0)
          continue;

        const seasonData = await updateSeason(
          client,
          tmdb_id,
          season.season_number
        );
        for (const episode of seasonData.episodes) {
          await updateEpisode(
            client,
            tmdb_id,
            season.season_number,
            episode.episode_number,
            series.approved_specials
          );
        }
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Client closed');
    client.close();
  }
};

const getTmdbApiSeriesData = async (tmdb_id, approved_specials) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    const data = resp.data;
    const seriesProperties = {
      approved_specials: approved_specials,
      backdrop_path: data.backdrop_path,
      created_by: data.created_by,
      episode_run_time: data.episode_run_time,
      first_air_date: data.first_air_date,
      homepage: data.homepage,
      in_production: data.in_production,
      languages: data.languages,
      last_air_date: data.last_air_date,
      name: data.name,
      next_episode_to_air: data.next_episode_to_air,
      number_of_episodes: data.number_of_episodes,
      number_of_seasons: data.number_of_seasons,
      origin_country: data.origin_country,
      original_language: data.original_language,
      original_name: data.original_name,
      overview: data.overview,
      popularity: data.popularity,
      poster_path: data.poster_path,
      seasons: data.seasons,
      slug: slugify(data.name, { lower: true, strict: true }),
      spoken_languages: data.spoken_languages,
      status: data.status,
      tagline: data.tagline,
      tmdb_id: data.id,
      type: data.type,
    };
    return seriesProperties;
  } catch (err) {
    console.error(err);
  }
};

const getTmdbSeriesCredits = async (series_tmdb_id) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_tmdb_id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    const cast = resp.data.cast;
    const crew = resp.data.crew;
    return [cast, crew];
  } catch (err) {
    console.error(err);
  }
};

const upsertObjToDB = async (client, collection, data) => {
  try {
    console.log(`Upserting ${collection} ${data.name}`);
    const result = await client
      .db('production0')
      .collection(collection)
      .updateOne({ tmdb_id: data.tmdb_id }, { $set: data }, { upsert: true });
    return result.insertedId;
  } catch (err) {
    console.error(err);
  }
};

main().catch(console.error);
