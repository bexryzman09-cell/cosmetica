// img — номер портрета на randomuser.me/api/portraits/women/{img}.jpg
// name: ru — русское имя, en — латиница (используется для uz и en)
// text: ru / uz / en
export const REVIEWS = [
  {
    img: 44, name: { ru: 'Анна Смирнова', en: 'Anna Smirnova' }, text: {
      ru: 'Процедура чистки лица прошла великолепно! Кожа сияет, а мастер была очень внимательна. Обязательно вернусь снова.',
      uz: "Yuz tozalash muolajasi ajoyib o'tdi! Teri nur sochyapti, usta esa juda e'tiborli edi. Albatta yana kelaman.",
      en: 'The facial cleansing was wonderful! My skin glows, and the specialist was very attentive. I will definitely come back.'
    }
  },
  {
    img: 32, name: { ru: 'Кристина Белова', en: 'Kristina Belova' }, text: {
      ru: 'Делала контурную пластику губ. Форма получилась очень естественная, именно то, что я хотела. Спасибо!',
      uz: "Lablar kontur plastikasini qildirdim. Shakl juda tabiiy chiqdi, aynan men xohlagandek. Rahmat!",
      en: 'I had lip contouring. The shape turned out very natural, exactly what I wanted. Thank you!'
    }
  },
  {
    img: 68, name: { ru: 'Наталья Петрова', en: 'Natalia Petrova' }, text: {
      ru: 'Прошла курс пилингов. Лицо как будто обновилось, ушла пигментация. Атмосфера в клинике просто чудесная.',
      uz: "Pilinglar kursidan o'tdim. Yuzim go'yo yangilandi, pigmentatsiya ketdi. Klinikadagi muhit shunchaki ajoyib.",
      en: 'I completed a course of peels. My face looks renewed and the pigmentation is gone. The atmosphere in the clinic is simply wonderful.'
    }
  },
  {
    img: 50, name: { ru: 'Ольга Кузнецова', en: 'Olga Kuznetsova' }, text: {
      ru: 'Мезотерапия кожи головы спасла мои волосы! Стали намного гуще. Очень благодарна за индивидуальный подход.',
      uz: "Bosh terisi mezoterapiyasi sochlarimni saqlab qoldi! Ancha quyuqlashdi. Individual yondashuv uchun juda minnatdorman.",
      en: 'Scalp mesotherapy saved my hair! It became much thicker. Very grateful for the individual approach.'
    }
  },
  {
    img: 22, name: { ru: 'Дарья Морозова', en: 'Daria Morozova' }, text: {
      ru: 'Удаляла сосудистые сеточки на лице. Результат с первой процедуры! Боли почти не чувствовала, всё очень быстро.',
      uz: "Yuzimdagi qon tomir to'rlarini oldirdim. Natija birinchi muolajadanoq! Og'riqni deyarli sezmadim, hammasi juda tez bo'ldi.",
      en: 'I had spider veins removed from my face. Results from the very first session! I barely felt any pain, and it was all very quick.'
    }
  },
  {
    img: 17, name: { ru: 'Ирина Волкова', en: 'Irina Volkova' }, text: {
      ru: 'Лучший массаж лица в моей жизни! Сразу ушли отеки, а контур стал более четким. Ощущения непередаваемые.',
      uz: "Hayotimdagi eng yaxshi yuz massaji! Shishlar darhol ketdi, kontur esa aniqroq bo'ldi. His-tuyg'ularni so'z bilan ifodalab bo'lmaydi.",
      en: 'The best facial massage of my life! The swelling went away right away and my contour became more defined. The feeling is indescribable.'
    }
  },
  {
    img: 45, name: { ru: 'Юлия Новикова', en: 'Yulia Novikova' }, text: {
      ru: 'Карбокситерапия — это любовь! Кожа мгновенно стала свежей и розовой. Отличная процедура перед важным событием.',
      uz: "Karboksiterapiya — bu sevgi! Teri bir zumda yangi va pushti rangga kirdi. Muhim tadbir oldidan ajoyib muolaja.",
      en: 'Carboxytherapy is love! My skin instantly became fresh and rosy. A great treatment before an important event.'
    }
  },
  {
    img: 60, name: { ru: 'Татьяна Егорова', en: 'Tatiana Egorova' }, text: {
      ru: 'Пользуюсь услугами этого косметолога уже два года. Моя кожа никогда не выглядела так хорошо. Полное доверие!',
      uz: "Bu kosmetologning xizmatlaridan ikki yildan beri foydalanaman. Terim hech qachon bunchalik yaxshi ko'rinmagan. To'liq ishonch!",
      en: "I've been using this cosmetologist's services for two years. My skin has never looked this good. Complete trust!"
    }
  },
  {
    img: 32, name: { ru: 'Марина Петрова', en: 'Marina Petrova' }, text: {
      ru: 'Лучший косметолог в городе. Индивидуальный подход и очень приятная атмосфера в кабинете.',
      uz: "Shahardagi eng yaxshi kosmetolog. Individual yondashuv va xonadagi juda yoqimli muhit.",
      en: 'The best cosmetologist in the city. An individual approach and a very pleasant atmosphere in the office.'
    }
  },
  {
    img: 11, name: { ru: 'Виктория С.', en: 'Victoria S.' }, text: {
      ru: 'Забыла о бритве после курса лазерной эпиляции. Процедура почти безболезненная, а результат — магия!',
      uz: "Lazer epilyatsiya kursidan keyin ustarani unutdim. Muolaja deyarli og'riqsiz, natija esa — sehr!",
      en: 'I forgot about the razor after a course of laser hair removal. The procedure is almost painless, and the result is magic!'
    }
  },
  {
    img: 12, name: { ru: 'Алина Кравцова', en: 'Alina Kravtsova' }, text: {
      ru: 'RF-лифтинг сотворил чудо с моим овалом лица. Кожа подтянулась, морщинки разгладились. Очень довольна!',
      uz: "RF-lifting yuz konturimga mo''jiza ko'rsatdi. Teri tortildi, ajinlar tekislandi. Juda mamnunman!".replace("''", "'"),
      en: 'RF lifting worked a miracle on my face oval. The skin tightened and the wrinkles smoothed out. Very happy!'
    }
  },
  {
    img: 13, name: { ru: 'Марина Денисова', en: 'Marina Denisova' }, text: {
      ru: 'Приходила на коррекцию носослезной борозды. Лицо сразу стало выглядеть отдохнувшим. Мастер — ювелир!',
      uz: "Ko'z osti chuqurchasini tuzatish uchun keldim. Yuzim darhol dam olgandek ko'rina boshladi. Usta — haqiqiy zargar!",
      en: 'I came in for tear trough correction. My face immediately looked well rested. The master is a true jeweler!'
    }
  },
  {
    img: 14, name: { ru: 'Екатерина Рей', en: 'Ekaterina Rey' }, text: {
      ru: 'Чистка лица Holy Land — это просто спасение для моей проблемной кожи. Всё очень чисто и аккуратно.',
      uz: "Holy Land yuz tozalash muammoli terim uchun haqiqiy najot. Hammasi juda toza va ozoda.",
      en: 'Holy Land facial cleansing is a lifesaver for my problem skin. Everything is very clean and neat.'
    }
  },
  {
    img: 15, name: { ru: 'Софья Маркова', en: 'Sofia Markova' }, text: {
      ru: 'Делала плазмолифтинг. Цвет лица выровнялся, кожа как будто светится изнутри. Потрясающий эффект!',
      uz: "Plazmolifting qildirdim. Yuz rangi tekislandi, teri go'yo ichkaridan nur sochadi. Ajoyib effekt!",
      en: 'I had plasmolifting. My complexion evened out and my skin seems to glow from within. An amazing effect!'
    }
  },
  {
    img: 16, name: { ru: 'Анна Лисицина', en: 'Anna Lisitsina' }, text: {
      ru: 'Первый раз решилась на диспорт. Никакого эффекта маски, брови двигаются, но заломов нет. Идеально!',
      uz: "Disportni birinchi marta sinab ko'rdim. Niqob effekti yo'q, qoshlar harakatlanadi, lekin ajinlar yo'q. Mukammal!",
      en: 'I tried Dysport for the first time. No mask effect, my brows move, but there are no creases. Perfect!'
    }
  },
  {
    img: 18, name: { ru: 'Вероника Г.', en: 'Veronika G.' }, text: {
      ru: 'Аппаратный массаж LPG помог быстро привести тело в форму к лету. Кожа подтянулась, ушли объемы.',
      uz: "LPG apparat massaji yozgacha tanamni tezda shaklga keltirishga yordam berdi. Teri tortildi, hajmlar ketdi.",
      en: 'LPG device massage helped me get in shape quickly for summer. The skin tightened and the volumes went away.'
    }
  },
  {
    img: 25, name: { ru: 'Лариса Борисова', en: 'Larisa Borisova' }, text: {
      ru: 'Очень грамотная консультация по домашнему уходу. Наконец-то подобрали средства, которые работают!',
      uz: "Uy parvarishi bo'yicha juda malakali maslahat. Nihoyat ishlaydigan vositalarni topdik!",
      en: 'A very competent consultation on home care. We finally found products that actually work!'
    }
  },
  {
    img: 35, name: { ru: 'Жанна Д.', en: 'Zhanna D.' }, text: {
      ru: 'Химический пилинг прошел без долгого шелушения, кожа обновилась и стала очень нежной.',
      uz: "Kimyoviy piling uzoq qatlamlanishsiz o'tdi, teri yangilandi va juda nozik bo'ldi.",
      en: 'The chemical peel went without long flaking, and my skin renewed and became very tender.'
    }
  },
  {
    img: 40, name: { ru: 'Полина Уварова', en: 'Polina Uvarova' }, text: {
      ru: 'Каждый визит сюда — это праздник для души и тела. Высочайший уровень сервиса и мастерства!',
      uz: "Bu yerga har bir tashrif — jon va tan uchun bayram. Xizmat va mahoratning eng yuqori darajasi!",
      en: 'Every visit here is a celebration for the soul and body. The highest level of service and skill!'
    }
  },
  {
    img: 21, name: { ru: 'Ксения Соколова', en: 'Ksenia Sokolova' }, text: {
      ru: 'SMAS-лифтинг превзошел все ожидания! Лицо подтянулось без всяких операций. Результат на миллион!',
      uz: "SMAS-lifting barcha kutganlarimdan oshdi! Yuz hech qanday operatsiyasiz tortildi. Millionlik natija!",
      en: 'SMAS lifting exceeded all expectations! My face is lifted without any surgery. A million-dollar result!'
    }
  },
  {
    img: 26, name: { ru: 'Марина О.', en: 'Marina O.' }, text: {
      ru: 'Лечили гиперпигментацию лазером. Наконец-то я могу ходить без плотного тонального крема. Свобода!',
      uz: "Giperpigmentatsiyani lazer bilan davoladik. Nihoyat qalin ton kremisiz yura olaman. Erkinlik!",
      en: 'We treated hyperpigmentation with a laser. At last I can go out without thick foundation. Freedom!'
    }
  },
  {
    img: 31, name: { ru: 'Валерия Тихонова', en: 'Valeria Tikhonova' }, text: {
      ru: 'Ультразвуковая чистка прошла очень комфортно. Никаких покраснений, на следующий день уже пошла на свидание!',
      uz: "Ultratovushli tozalash juda qulay o'tdi. Qizarish yo'q, ertasi kuniyoq uchrashuvga bordim!",
      en: 'The ultrasonic cleansing was very comfortable. No redness, and the next day I was already off on a date!'
    }
  },
  {
    img: 33, name: { ru: 'Инна Савельева', en: 'Inna Savelieva' }, text: {
      ru: 'Заполнили носогубные складки филлером. Сразу минус 5 лет с лица! Очень аккуратно и без синяков.',
      uz: "Burun-lab burmalarini filler bilan to'ldirdik. Yuzdan darhol 5 yosh ketdi! Juda ozoda va ko'karishsiz.",
      en: 'We filled my nasolabial folds with filler. Minus 5 years from my face right away! Very neat and no bruising.'
    }
  },
  {
    img: 41, name: { ru: 'Любовь Михайлова', en: 'Lyubov Mikhailova' }, text: {
      ru: 'Курс микротоковой терапии сотворил чудо с моими отеками. Лицо стало скульптурным. Огромное спасибо!',
      uz: "Mikrotok terapiyasi kursi shishlarimga mo'jiza ko'rsatdi. Yuzim haykaltaroshlik kabi bo'ldi. Katta rahmat!",
      en: 'A course of microcurrent therapy worked wonders on my swelling. My face became sculpted. Huge thanks!'
    }
  },
  {
    img: 42, name: { ru: 'Елизавета П.', en: 'Elizaveta P.' }, text: {
      ru: 'Делала ламинирование ресниц у косметолога. Взгляд стал открытым, а ресницы — черными и длинными.',
      uz: "Kosmetologda kipriklar laminatsiyasini qildirdim. Nigohim ochiq, kipriklarim esa qora va uzun bo'ldi.",
      en: 'I had lash lamination at the cosmetologist. My gaze became open, and my lashes black and long.'
    }
  },
  {
    img: 46, name: { ru: 'Надежда Степанова', en: 'Nadezhda Stepanova' }, text: {
      ru: "Процедура 'Фарфоровая куколка' — это нечто! Кожа сияет, тон ровный. Идеально для подготовки к свадьбе.",
      uz: "«Chinni qo'g'irchoq» muolajasi — bu nimadir! Teri nur sochadi, tusi tekis. To'yga tayyorgarlik uchun ideal.",
      en: 'The “Porcelain Doll” treatment is something else! The skin glows and the tone is even. Perfect for wedding prep.'
    }
  },
  {
    img: 47, name: { ru: 'Милана Громова', en: 'Milana Gromova' }, text: {
      ru: 'Коррекция подбородка изменила мой профиль в лучшую сторону. Теперь я обожаю фотографироваться!',
      uz: "Iyak tuzatish profilimni yaxshi tomonga o'zgartirdi. Endi rasmga tushishni yaxshi ko'raman!",
      en: 'Chin correction changed my profile for the better. Now I love being photographed!'
    }
  },
  {
    img: 48, name: { ru: 'Кристина Ю.', en: 'Kristina Yu.' }, text: {
      ru: 'Попробовала альгинатную маску после чистки. Такого увлажнения у меня не было никогда. Кожа как шелк.',
      uz: "Tozalashdan keyin alginat niqobni sinab ko'rdim. Hech qachon bunday namlanish bo'lmagan. Teri ipakdek.",
      en: "I tried an alginate mask after cleansing. I've never had such hydration. Skin like silk."
    }
  },
  {
    img: 52, name: { ru: 'Александра К.', en: 'Alexandra K.' }, text: {
      ru: 'Профессионализм высшего уровня. Здесь не навязывают лишнего, а решают конкретные проблемы кожи.',
      uz: "Eng yuqori darajadagi professionallik. Bu yerda ortiqcha narsa tiqishtirishmaydi, balki terining aniq muammolarini hal qilishadi.",
      en: "Top-level professionalism. They don't push anything extra here, they solve specific skin problems."
    }
  },
];