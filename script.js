// Подключаемся к Telegram
const tg = window.Telegram.WebApp;
tg.ready(); // говорим Telegram что приложение загрузилось

// Получаем имя пользователя
const user = tg.initDataUnsafe?.user;
if (user) {
  document.getElementById('greeting').textContent = 'Привет, ' + user.first_name + '!';
}

// Кнопка на экране
document.getElementById('myButton').addEventListener('click', function() {
  alert('Кнопка нажата!');
});