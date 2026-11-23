const form = document.querySelector('#lead-form');
const nameInput = document.querySelector('#lead-name');
const phoneInput = document.querySelector('#lead-phone');
const message = document.querySelector('#form-status');
const copy = document.querySelector('#copy-request');
const destination = 'info@maspel.ru';
const query = new URLSearchParams(location.search);
const attributionKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'];
let requestBody = '';

const oneLine = (value) => value.trim().replace(/\s+/g, ' ');

function setStatus(text) {
  message.hidden = false;
  message.textContent = text;
}

form.addEventListener('input', (event) => {
  event.target.setCustomValidity('');
  message.hidden = true;
  copy.hidden = true;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = oneLine(nameInput.value);
  const phone = oneLine(phoneInput.value);
  const digits = phone.replace(/\D/g, '');
  nameInput.setCustomValidity(name ? '' : 'Укажите ваше имя.');
  phoneInput.setCustomValidity(
    digits.length >= 10 && digits.length <= 15 && /^[+\d\s().-]+$/.test(phone)
      ? ''
      : 'Проверьте номер телефона. Например, +7 900 123-45-67.'
  );
  if (!form.reportValidity()) return;

  const lines = [
    'Здравствуйте! Хочу узнать условия обучения мобильной расточке и наплавке.',
    '',
    `Имя: ${name}`,
    `Телефон: ${phone}`
  ];
  const tags = attributionKeys
    .map((key) => [key, oneLine(query.get(key) || '').slice(0, 180)])
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);
  if (tags.length) lines.push('', 'Источник обращения', ...tags);
  requestBody = lines.join('\r\n');

  const subject = encodeURIComponent('Запрос об обучении МРНК');
  const body = encodeURIComponent(requestBody);
  setStatus('Отправьте подготовленное письмо. Если приложение не открылось, скопируйте запрос и отправьте его на info@maspel.ru.');
  copy.hidden = !navigator.clipboard;
  location.href = `mailto:${destination}?subject=${subject}&body=${body}`;
});

copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(requestBody);
    setStatus('Текст скопирован. Вставьте его в письмо на info@maspel.ru.');
  } catch {
    setStatus('Скопировать текст не удалось. Напишите на info@maspel.ru или позвоните по номеру 8 800 600-88-89.');
  }
});
