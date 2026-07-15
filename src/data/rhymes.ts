export interface Rhyme {
  id: string;
  title: string;
  titleHi: string;
  category: 'animals' | 'nursery' | 'numbers' | 'nature' | 'fun';
  lyrics: string;
  lyricsHi: string;
  audioUrl?: string;
  duration: number;
  thumbnail?: string;
}

export interface RhymeCategory {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
}

export const rhymeCategories: RhymeCategory[] = [
  { id: 'animals', name: 'Animals', nameHi: 'जानवर', icon: '🐾' },
  { id: 'nursery', name: 'Nursery', nameHi: 'नर्सरी', icon: '🎵' },
  { id: 'numbers', name: 'Numbers', nameHi: 'संख्या', icon: '🔢' },
  { id: 'nature', name: 'Nature', nameHi: 'प्रकृति', icon: '🌿' },
  { id: 'fun', name: 'Fun', nameHi: 'मजेदार', icon: '🎉' },
];

export const rhymes: Rhyme[] = [
  {
    id: 'baa-baa-sheep',
    title: 'Baa Baa Black Sheep',
    titleHi: 'काली भेड़',
    category: 'nursery',
    lyrics: `Baa, baa, black sheep, have you any wool?
Yes sir, yes sir, three bags full.
One for my master, one for my dame,
And one for the little boy who lives down the lane.

Baa, baa, black sheep, have you any wool?
Yes sir, yes sir, three bags full.`,
    lyricsHi: `काली भेड़, काली भेड़, क्या तुम्हारे पास ऊन है?
हाँ सर, हाँ सर, तीन बोरियाँ भरी हैं।
एक मेरे मालिक के लिए, एक मेरी दासी के लिए,
और एक उस छोटे लड़के के लिए जो गली के अंत में रहता है।

काली भेड़, काली भेड़, क्या तुम्हारे पास ऊन है?
हाँ सर, हाँ सर, तीन बोरियाँ भरी हैं।`,
    duration: 45,
  },
  {
    id: 'twinkle-star',
    title: 'Twinkle Twinkle Little Star',
    titleHi: 'चमकते तारे',
    category: 'nursery',
    lyrics: `Twinkle, twinkle, little star,
How I wonder what you are.
Up above the world so high,
Like a diamond in the sky.

Twinkle, twinkle, little star,
How I wonder what you are.`,
    lyricsHi: `चमकते हो, चमकते हो, छोटे तारे,
मैं सोचता हूँ तुम क्या हो।
दुनिया से बहुत ऊपर,
आकाश में हीरे की तरह।

चमकते हो, चमकते हो, छोटे तारे,
मैं सोचता हूँ तुम क्या हो।`,
    duration: 40,
  },
  {
    id: 'mary-lamb',
    title: 'Mary Had a Little Lamb',
    titleHi: 'मेरी की भेड़',
    category: 'animals',
    lyrics: `Mary had a little lamb,
Little lamb, little lamb.
Mary had a little lamb,
Its fleece was white as snow.

And everywhere that Mary went,
Mary went, Mary went.
Everywhere that Mary went,
The lamb was sure to go.`,
    lyricsHi: `मेरी के पास एक छोटी भेड़ थी,
छोटी भेड़, छोटी भेड़।
मेरी के पास एक छोटी भेड़ थी,
इसका ऊन बर्फ की तरह सफेद था।

और हर जगह जहाँ मेरी गई,
मेरी गई, मेरी गई।
हर जगह जहाँ मेरी गई,
भेड़ जाने वाली थ���।`,
    duration: 50,
  },
  {
    id: 'one-two-three',
    title: 'One Two Three',
    titleHi: 'एक दो तीन',
    category: 'numbers',
    lyrics: `One, two, three,
Buckle my shoe.
Four, five, six,
Pick up sticks.
Seven, eight, nine,
Ten is fine!

Let's count again,
One through ten.
Learning numbers,
One, two, three, four, five,
Six, seven, eight, nine, ten!`,
    lyricsHi: `एक, दो, तीन,
मेरा जूता बंद करो।
चार, पाँच, छः,
छड़ियाँ उठाओ।
सात, आठ, नौ,
दस बहुत अच्छा है!

फिर से गिनते हैं,
एक से दस।
संख्याएँ सीख रहे हैं,
एक, दो, तीन, चार, पाँच,
छः, सात, आठ, नौ, दस!`,
    duration: 55,
  },
  {
    id: 'old-macdonald',
    title: 'Old MacDonald Had a Farm',
    titleHi: 'पुराने मैकडोनल्ड का खेत',
    category: 'animals',
    lyrics: `Old MacDonald had a farm, E-I-E-I-O.
And on his farm he had a cow, E-I-E-I-O.
With a moo, moo here and a moo, moo there,
Here a moo, there a moo, everywhere a moo, moo.

Old MacDonald had a farm, E-I-E-I-O.
And on his farm he had a duck, E-I-E-I-O.
With a quack, quack here and a quack, quack there,
Here a quack, there a quack, everywhere a quack, quack.`,
    lyricsHi: `पुराने मैकडोनल्ड का एक खेत था, ई-आई-ई-आई-ओ।
और उसके खेत में एक गाय थी, ई-आई-ई-आई-ओ।
मुँह, मुँह यहाँ और मुँह, मुँह वहाँ,
यहाँ मुँह, वहाँ मुँह, हर जगह मुँह, मुँह।

पुराने मैकडोनल्ड का एक खेत था, ई-आई-ई-आई-ओ।
और उसके खेत में एक बतख थी, ई-आई-ई-आई-ओ।
क्वैक, क्वैक यहाँ और क्वैक, क्वैक वहाँ,
यहाँ क्वैक, वहाँ क्वैक, हर जगह क्वैक, क्वैक।`,
    duration: 60,
  },
  {
    id: 'rain-rain-go-away',
    title: 'Rain Rain Go Away',
    titleHi: 'बारिश जाओ दूर',
    category: 'nature',
    lyrics: `Rain, rain, go away,
Come again another day.
Little Johnny wants to play,
Rain, rain, go away.

Come again some other time,
When the weather is more fine.
Little Johnny wants to play,
Rain, rain, go away.`,
    lyricsHi: `बारिश, बारिश, दूर जाओ,
किसी और दिन आओ।
छोटा जॉनी खेलना चाहता है,
बारिश, बारिश, दूर जाओ।

किसी और समय आओ,
जब मौसम बेहतर हो।
छोटा जॉनी खेलना चाहता है,
बारिश, बारिश, दूर जाओ।`,
    duration: 40,
  },
  {
    id: 'hickory-dickory',
    title: 'Hickory Dickory Dock',
    titleHi: 'हिकोरी डिकोरी डॉक',
    category: 'fun',
    lyrics: `Hickory dickory dock,
The mouse ran up the clock.
The clock struck one,
The mouse ran down,
Hickory dickory dock.

Hickory dickory dock,
The mouse ran up the clock.
The clock struck two,
Away the mouse flew,
Hickory dickory dock.`,
    lyricsHi: `हिकोरी डिकोरी डॉक,
चूहा घड़ी पर दौड़ा।
घड़ी बजी एक बार,
चूहा नीचे भागा,
हिकोरी डिकोरी डॉक।

हिकोरी डिकोरी डॉक,
चूहा घड़ी पर दौड़ा।
घड़ी बजी दो बार,
चूहा उड़ गया,
हिकोरी डिकोरी डॉक।`,
    duration: 50,
  },
  {
    id: 'wheels-bus',
    title: 'Wheels on the Bus',
    titleHi: 'बस के पहिये',
    category: 'fun',
    lyrics: `The wheels on the bus go round and round,
Round and round, round and round.
The wheels on the bus go round and round,
All through the town.

The horn on the bus goes beep, beep, beep,
Beep, beep, beep, beep, beep, beep.
The horn on the bus goes beep, beep, beep,
All through the town.`,
    lyricsHi: `बस के पहिये चलते हैं गोल-गोल,
गोल-गोल, गोल-गोल।
बस के पहिये चलते हैं गोल-गोल,
पूरे शहर में।

बस की घंटी बजती है बीप, बीप, बीप,
बीप, बीप, बीप, बीप, बीप, बीप।
बस की घंटी बजती है बीप, बीप, बीप,
पूरे शहर में।`,
    duration: 55,
  },
];
