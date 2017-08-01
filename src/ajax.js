const endpoint = 'https://api.github.com/users/mathieu-r/repos';

/* the good old XMLHttpRequest */
function oldxhr(url) {
    const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = _ => JSON.parse(xhr.responseText);
		xhr.send();
}

/* new fetch api */
function fetchUrl(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => data);
}

/* fetch with async/await */
async function fetchAsync(url) {
    const promise = await fetch(url);
    const data = await promise.json();
    return data;
}
