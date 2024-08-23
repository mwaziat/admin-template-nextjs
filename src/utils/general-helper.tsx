export const getInitials = (text: string) => {
  const words = text.split(' ');
  const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
  return initials;
}

export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')            // Ganti spasi dengan tanda strip
    .replace(/[^\w-]+/g, '')       // Hapus karakter non-word dan non-dash
    .replace(/--+/g, '-')          // Ganti beberapa strip berturut-turut dengan satu strip
    .replace(/^-+/, '')            // Hapus strip di awal teks
    .replace(/-+$/, '');           // Hapus strip di akhir teks
}

export const generateRandomCode = (length: number) => {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 10000000000); // Angka acak dengan 10 digit
  const property_code = `${timestamp}${randomNum}`.slice(0, length); // Ambil 10 digit pertama
  return property_code;
}