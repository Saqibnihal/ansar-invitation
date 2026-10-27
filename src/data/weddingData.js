/**
 * Centralized Wedding Data Configuration
 * Edit all wedding details from this single file.
 */

export const weddingData = {
  // Couple Information
  couple: {
    bride: {
      firstName: 'Nowfiyath',
      fullName: 'Nowfiyath Basriya',
      lastName: 'Basriya',
      initial: 'N',
      parents: 'Daughter of Mr. & Mrs. Nasurutheen',
    },
    groom: {
      firstName: 'Ansar',
      fullName: 'Ahamed Ansar',
      lastName: 'Ansar',
      initial: 'A',
      parents: 'Son of Mr. & Mrs. Abdul Rahim',
    },
  },

  // Wedding Date & Time
  date: {
    full: 'Sunday, the Third of January',
    year: 'Two Thousand and Twenty-Seven',
    numeric: '2027-01-03T11:30:00',
    display: 'January 3, 2027',
    time: '11:30 AM',
  },

  // Romantic Message
  message: {
    headline: 'Together with their families',
    invitation: 'request the honour of your presence\nat the celebration of their marriage',
    romantic:
      'Two souls, one heart — a journey blessed with grace and love. We warmly invite you to witness the beginning of our forever.',
    closing: 'With love and joy, we invite you to share in our happiness',
  },

  // Our Story & Journey
  story: {
    title: 'Our Love Story',
    subtitle: 'From a blessed beginning to our forever',
    quote: '“And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.”',
    quoteAuthor: 'Surah Ar-Rum (30:21)',
    paragraphs: [
      'Blessed by the grace of the Almighty and the heartfelt prayers of our beloved families, our journey of mutual respect and kindred affection began.',
      'Through shared values, conversations, and gentle moments, we found that true happiness lies in walking hand in hand towards a purposeful and blessed life together.',
      'Now, with immense gratitude and joyful hearts, we warmly invite you to join us at our Nikah and celebrate the auspicious start of our eternal bond.',
    ],
  },

  // Events with dress codes and icons
  events: [
    {
      name: 'Nikah (Wedding Ceremony)',
      date: 'Sunday, January 3, 2027',
      time: '11:30 AM',
      venue: 'Mohideen Masjid, Eruvadi, Tirunelveli',
      attire: 'Traditional & Festive Attire',
      description: 'The sacred Nikah ceremony solemnizing holy matrimony amidst heartfelt prayers and blessings for the newly wedded couple.',
      icon: '💍',
    },
    {
      name: 'Zuhar Prayer',
      date: 'Sunday, January 3, 2027',
      time: '1:00 PM',
      venue: 'Mohideen Masjid, Eruvadi',
      attire: 'Modest Traditional Attire',
      description: 'Congregational prayer offering gratitude and invoking divine peace and prosperity for the newly wedded couple.',
      icon: '🤲',
    },
    {
      name: 'Wedding Feast & Lunch',
      date: 'Sunday, January 3, 2027',
      time: 'After Zuhar (from 1:15 PM onwards)',
      venue: 'Baithussalam, Eruvadi, Tirunelveli',
      attire: 'Festive & Elegant',
      description: 'A grand celebratory wedding lunch following Zuhar prayer to celebrate with family, delicious traditional food, and warm wishes.',
      icon: '🍽️',
    },
  ],

  // Venue Information
  venue: {
    name: 'Mohideen Masjid & Baithussalam',
    address: 'Eruvadi',
    city: 'Tirunelveli, Tamil Nadu',
    country: 'India',
    pin: '627103',
    mapUrl: 'https://maps.google.com/?q=Mohideen+Masjid+Eruvadi+Tirunelveli',
    mapEmbed:
      'https://maps.google.com/maps?q=Mohideen+Masjid+Eruvadi+Tirunelveli&t=&z=15&ie=UTF8&iwloc=&output=embed',
    directions: 'Wedding ceremony (Nikah) at Mohideen Masjid at 11:30 AM, followed by celebratory lunch after Zuhar at Baithussalam, Eruvadi, Tirunelveli.',
  },

  // RSVP Configuration
  rsvp: {
    deadline: 'December 20, 2026',
    meals: ['Traditional Biryani Feast', 'Vegetarian Special', 'Kids Special'],
    maxGuests: 4,
  },

  // Theme Colors (for reference)
  theme: {
    burgundy: '#5C1A1B',
    burgundyLight: '#7A2E2F',
    burgundyDark: '#3D1112',
    gold: '#C9A84C',
    goldLight: '#E8D08C',
    goldDark: '#A68A3E',
    ivory: '#FDF8F0',
    ivoryDark: '#F5EDE0',
    cream: '#FAF3E8',
  },
};
