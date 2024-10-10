// rastgele kelime getiren API
const quoteApiURL = "https://api.quotable.io/random?minLength=150&maxLength=200";
// html elementlerini seçme
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const start = document.getElementById("start");
const stop = document.getElementById("stop");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// rastgele alıntıları alıp ekrana yazdırma 
const renderNewQuote = async () => {
    // alıntı apiden veri çek
    const response = await fetch(quoteApiURL);
    const data = await response.json();
    quote = data.content;

    // alıntıdaki karakterlerin dizisi
    let arr = quote.split("").map((value) => {
        return `<span class="quote-chars">${value}</span>`;
    });
    quoteSection.innerHTML += arr.join("");
};

// kullanıcının girdiği alıntı ile karşılaştırma mantığı
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);

    // kullanıcının girdiği karakterler dizisi
    let userInputChars = userInput.value.split("");

    // herbir alıntı karakteri üzerinde döngü
    quoteChars.forEach((char, index) => {
        // karakterleri alıntı karakteriyle karşılaştır
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        }
        else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            }
            else {
                char.classList.remove("fail");
            }
        }
        else {
            // kullanıcı yanlış bir karakter girdiyse
            if (!char.classList.contains("fail")) {
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        // tüm karakterler doğruysa
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });
        // tüm karakterler doğruysa testi bitir
        if (check) {
            displayResult();
        }
    })
})

// zamanlayıcıyı güncelle 
function updateTimer() {
    if (time == 0) {
        //süre 0 ise 
        displayResult();
    }
    else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// zamanlayıcıyı ayarla
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

//Testi sonlandır 
const displayResult = () => {
    // sonuç bölümünü görüntülee
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop").style.display = "none";
    userInput.disabled = true;

    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
}

// testi başlat
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    start.style.display = "none"
    stop.style.display = "block"
}

// sayfa yüklendiğinde 
window.onload = () => {
    userInput.value = "";
    start.style.display = "block";
    stop.style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}
